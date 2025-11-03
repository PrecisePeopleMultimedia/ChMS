<?php

namespace App\Services;

use App\Models\FamilyRelationship;
use App\Models\HouseholdMember;
use App\Models\Member;
use App\Models\Family;
use App\Models\Household;
use Illuminate\Support\Collection;

class RelationshipAnalysisService
{
    /**
     * Detect complex relationships for a member
     */
    public function analyzeComplexRelationships(int $memberId, int $organizationId): array
    {
        $member = Member::where('id', $memberId)
            ->where('organization_id', $organizationId)
            ->first();

        if (!$member) {
            return [];
        }

        $analysis = [
            'conflicts' => $this->detectRelationshipConflicts($memberId, $organizationId),
            'cross_family_relationships' => $this->findCrossFamilyRelationships($memberId, $organizationId),
            'custody_relationships' => $this->findCustodyRelationships($memberId, $organizationId),
            'household_overlaps' => $this->findHouseholdOverlaps($memberId, $organizationId),
            'suggestions' => $this->generateRelationshipSuggestions($memberId, $organizationId),
        ];

        return $analysis;
    }

    /**
     * Detect relationship conflicts
     */
    protected function detectRelationshipConflicts(int $memberId, int $organizationId): array
    {
        $conflicts = [];

        // Find duplicate relationships
        $relationships = FamilyRelationship::where('organization_id', $organizationId)
            ->where(function ($query) use ($memberId) {
                $query->where('person1_id', $memberId)
                      ->orWhere('person2_id', $memberId);
            })
            ->with(['person1', 'person2', 'relationshipType'])
            ->get();

        // Group by the other person
        $relationshipsByPerson = $relationships->groupBy(function ($relationship) use ($memberId) {
            return $relationship->person1_id === $memberId 
                ? $relationship->person2_id 
                : $relationship->person1_id;
        });

        foreach ($relationshipsByPerson as $otherPersonId => $personRelationships) {
            if ($personRelationships->count() > 1) {
                $otherPerson = $personRelationships->first()->person1_id === $memberId 
                    ? $personRelationships->first()->person2 
                    : $personRelationships->first()->person1;

                $conflicts[] = [
                    'id' => 'duplicate_' . $memberId . '_' . $otherPersonId,
                    'type' => 'duplicate_relationship',
                    'description' => "Multiple relationships with {$otherPerson->first_name} {$otherPerson->last_name}",
                    'details' => $personRelationships->pluck('relationshipType.name')->join(', '),
                    'relationships' => $personRelationships->toArray(),
                ];
            }
        }

        // Check for logical conflicts (e.g., someone being both parent and sibling)
        $conflictingTypes = [
            ['parent', 'sibling'],
            ['parent', 'child'],
            ['spouse', 'parent'],
            ['spouse', 'child'],
        ];

        foreach ($relationshipsByPerson as $otherPersonId => $personRelationships) {
            $types = $personRelationships->pluck('relationshipType.slug')->toArray();
            
            foreach ($conflictingTypes as $conflictPair) {
                if (array_intersect($types, $conflictPair) === $conflictPair) {
                    $otherPerson = $personRelationships->first()->person1_id === $memberId 
                        ? $personRelationships->first()->person2 
                        : $personRelationships->first()->person1;

                    $conflicts[] = [
                        'id' => 'logical_' . $memberId . '_' . $otherPersonId,
                        'type' => 'logical_conflict',
                        'description' => "Conflicting relationship types with {$otherPerson->first_name} {$otherPerson->last_name}",
                        'details' => "Cannot be both " . implode(' and ', $conflictPair),
                        'relationships' => $personRelationships->toArray(),
                    ];
                }
            }
        }

        return $conflicts;
    }

    /**
     * Find cross-family relationships
     */
    protected function findCrossFamilyRelationships(int $memberId, int $organizationId): array
    {
        $relationships = FamilyRelationship::where('organization_id', $organizationId)
            ->where(function ($query) use ($memberId) {
                $query->where('person1_id', $memberId)
                      ->orWhere('person2_id', $memberId);
            })
            ->with(['person1.family', 'person2.family', 'relationshipType', 'family'])
            ->get();

        $crossFamilyRelationships = [];

        foreach ($relationships as $relationship) {
            $person1Family = $relationship->person1->family;
            $person2Family = $relationship->person2->family;

            // Check if the relationship spans different families
            if ($person1Family && $person2Family && $person1Family->id !== $person2Family->id) {
                $crossFamilyRelationships[] = [
                    'id' => $relationship->id,
                    'person1_name' => "{$relationship->person1->first_name} {$relationship->person1->last_name}",
                    'person2_name' => "{$relationship->person2->first_name} {$relationship->person2->last_name}",
                    'relationship_type' => $relationship->relationshipType->name,
                    'family1' => $person1Family->family_name,
                    'family2' => $person2Family->family_name,
                    'status' => $relationship->status,
                ];
            }
        }

        return $crossFamilyRelationships;
    }

    /**
     * Find custody relationships
     */
    protected function findCustodyRelationships(int $memberId, int $organizationId): array
    {
        return FamilyRelationship::where('organization_id', $organizationId)
            ->where(function ($query) use ($memberId) {
                $query->where('person1_id', $memberId)
                      ->orWhere('person2_id', $memberId);
            })
            ->whereNotNull('custody_type')
            ->with(['person1', 'person2', 'relationshipType'])
            ->get()
            ->toArray();
    }

    /**
     * Find household overlaps
     */
    protected function findHouseholdOverlaps(int $memberId, int $organizationId): array
    {
        // Get all members with multiple household memberships
        $membersWithMultipleHouseholds = HouseholdMember::where('organization_id', $organizationId)
            ->where('residency_status', '!=', 'former')
            ->with(['member', 'household'])
            ->get()
            ->groupBy('member_id')
            ->filter(function ($memberships) {
                return $memberships->count() > 1;
            });

        $overlaps = [];

        foreach ($membersWithMultipleHouseholds as $memberIdKey => $memberships) {
            $member = $memberships->first()->member;
            $households = $memberships->map(function ($membership) {
                return [
                    'id' => $membership->household->id,
                    'name' => $membership->household->name,
                    'type' => $membership->household->household_type,
                    'role' => $membership->role,
                    'residency_status' => $membership->residency_status,
                ];
            });

            $overlaps[] = [
                'member_id' => $memberIdKey,
                'member_name' => "{$member->first_name} {$member->last_name}",
                'households' => $households->toArray(),
            ];
        }

        return $overlaps;
    }

    /**
     * Generate relationship suggestions
     */
    protected function generateRelationshipSuggestions(int $memberId, int $organizationId): array
    {
        $suggestions = [];

        // Suggest relationships based on family membership
        $member = Member::with('family.members')->find($memberId);
        
        if ($member && $member->family) {
            $familyMembers = $member->family->members->where('id', '!=', $memberId);
            $existingRelationships = FamilyRelationship::where('organization_id', $organizationId)
                ->where(function ($query) use ($memberId) {
                    $query->where('person1_id', $memberId)
                          ->orWhere('person2_id', $memberId);
                })
                ->get();

            $relatedMemberIds = $existingRelationships->map(function ($rel) use ($memberId) {
                return $rel->person1_id === $memberId ? $rel->person2_id : $rel->person1_id;
            })->toArray();

            foreach ($familyMembers as $familyMember) {
                if (!in_array($familyMember->id, $relatedMemberIds)) {
                    $suggestions[] = [
                        'id' => 'family_' . $memberId . '_' . $familyMember->id,
                        'type' => 'missing_family_relationship',
                        'description' => "Add relationship with {$familyMember->first_name} {$familyMember->last_name}",
                        'reason' => "Both members belong to {$member->family->family_name}",
                        'suggested_person1_id' => $memberId,
                        'suggested_person2_id' => $familyMember->id,
                    ];
                }
            }
        }

        // Suggest household relationships
        $householdMemberships = HouseholdMember::where('member_id', $memberId)
            ->where('organization_id', $organizationId)
            ->where('residency_status', '!=', 'former')
            ->with('household.householdMemberships.member')
            ->get();

        foreach ($householdMemberships as $membership) {
            $householdMembers = $membership->household->householdMemberships
                ->where('member_id', '!=', $memberId)
                ->where('residency_status', '!=', 'former');

            foreach ($householdMembers as $householdMember) {
                $existingRelationship = FamilyRelationship::where('organization_id', $organizationId)
                    ->where(function ($query) use ($memberId, $householdMember) {
                        $query->where('person1_id', $memberId)
                              ->where('person2_id', $householdMember->member_id);
                    })
                    ->orWhere(function ($query) use ($memberId, $householdMember) {
                        $query->where('person1_id', $householdMember->member_id)
                              ->where('person2_id', $memberId);
                    })
                    ->exists();

                if (!$existingRelationship) {
                    $suggestions[] = [
                        'id' => 'household_' . $memberId . '_' . $householdMember->member_id,
                        'type' => 'missing_household_relationship',
                        'description' => "Add relationship with {$householdMember->member->first_name} {$householdMember->member->last_name}",
                        'reason' => "Both members live in {$membership->household->name}",
                        'suggested_person1_id' => $memberId,
                        'suggested_person2_id' => $householdMember->member_id,
                    ];
                }
            }
        }

        return $suggestions;
    }

    /**
     * Get relationship statistics for a member
     */
    public function getRelationshipStatistics(int $memberId, int $organizationId): array
    {
        $relationships = FamilyRelationship::where('organization_id', $organizationId)
            ->where(function ($query) use ($memberId) {
                $query->where('person1_id', $memberId)
                      ->orWhere('person2_id', $memberId);
            })
            ->with('relationshipType')
            ->get();

        $householdMemberships = HouseholdMember::where('member_id', $memberId)
            ->where('organization_id', $organizationId)
            ->where('residency_status', '!=', 'former')
            ->count();

        return [
            'total_relationships' => $relationships->count(),
            'active_relationships' => $relationships->where('status', 'active')->count(),
            'custody_relationships' => $relationships->whereNotNull('custody_type')->count(),
            'primary_relationships' => $relationships->where('is_primary', true)->count(),
            'household_memberships' => $householdMemberships,
            'relationship_types' => $relationships->groupBy('relationshipType.category')
                ->map(function ($group) {
                    return $group->count();
                })
                ->toArray(),
        ];
    }
}
