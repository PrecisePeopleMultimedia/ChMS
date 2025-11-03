<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds critical indexes for performance optimization
     * to support 100k+ users with optimal query performance.
     */
    public function up(): void
    {
        // Members table indexes (most queried table)
        Schema::table('members', function (Blueprint $table) {
            // Organization filtering (used in almost all member queries)
            if (!$this->indexExists('members', 'idx_members_organization_id')) {
                $table->index('organization_id', 'idx_members_organization_id');
            }
            
            // Email lookup (login, search, duplicate detection)
            if (!$this->indexExists('members', 'idx_members_email')) {
                $table->index('email', 'idx_members_email');
            }
            
            // Active members filter (common query pattern)
            if (!$this->indexExists('members', 'idx_members_active')) {
                $table->index('is_active', 'idx_members_active');
            }
            
            // Composite index for common query pattern: org + active + created_at
            if (!$this->indexExists('members', 'idx_members_org_active_created')) {
                $table->index(['organization_id', 'is_active', 'created_at'], 'idx_members_org_active_created');
            }
            
            // Phone number lookup (for contact, search)
            if (!$this->indexExists('members', 'idx_members_phone')) {
                $table->index('phone', 'idx_members_phone');
            }
        });

        // Attendance table indexes (grows fastest, most queries) - Only if table exists
        if (Schema::hasTable('attendance')) {
            Schema::table('attendance', function (Blueprint $table) {
                // Member + Service lookup (most common query)
                if (!$this->indexExists('attendance', 'idx_attendance_member_service')) {
                    $table->index(['member_id', 'service_id'], 'idx_attendance_member_service');
                }

                // Date-based queries (reports, trends)
                if (!$this->indexExists('attendance', 'idx_attendance_checked_in_at')) {
                    $table->index('checked_in_at', 'idx_attendance_checked_in_at');
                }

                // Organization filtering with date (attendance reports)
                if (!$this->indexExists('attendance', 'idx_attendance_org_date')) {
                    $table->index(['organization_id', 'checked_in_at'], 'idx_attendance_org_date');
                }

                // Service + Date queries (service-specific reports)
                if (!$this->indexExists('attendance', 'idx_attendance_service_date')) {
                    $table->index(['service_id', 'checked_in_at'], 'idx_attendance_service_date');
                }

                // Family check-ins lookup
                if (!$this->indexExists('attendance', 'idx_attendance_family')) {
                    $table->index('family_id', 'idx_attendance_family');
                }
            });
        }

        // Families table indexes
        Schema::table('families', function (Blueprint $table) {
            // Organization filtering
            if (!$this->indexExists('families', 'idx_families_organization')) {
                $table->index('organization_id', 'idx_families_organization');
            }
            
            // Active families filter
            if (!$this->indexExists('families', 'idx_families_active')) {
                $table->index('is_active', 'idx_families_active');
            }
            
            // Family name search
            if (!$this->indexExists('families', 'idx_families_name')) {
                $table->index('family_name', 'idx_families_name');
            }
            
            // Composite: org + active + name (common search pattern)
            if (!$this->indexExists('families', 'idx_families_org_active_name')) {
                $table->index(['organization_id', 'is_active', 'family_name'], 'idx_families_org_active_name');
            }
        });

        // Member notes table indexes
        Schema::table('member_notes', function (Blueprint $table) {
            // Member notes lookup
            if (!$this->indexExists('member_notes', 'idx_notes_member')) {
                $table->index('member_id', 'idx_notes_member');
            }
            
            // Date-based note queries (recent notes, timeline)
            if (!$this->indexExists('member_notes', 'idx_notes_created_at')) {
                $table->index('created_at', 'idx_notes_created_at');
            }
            
            // Member + Date composite (member timeline)
            if (!$this->indexExists('member_notes', 'idx_notes_member_date')) {
                $table->index(['member_id', 'created_at'], 'idx_notes_member_date');
            }
        });

        // Member badges table indexes
        Schema::table('member_badges', function (Blueprint $table) {
            // Member badges lookup
            if (!$this->indexExists('member_badges', 'idx_badges_member')) {
                $table->index('member_id', 'idx_badges_member');
            }
            
            // Badge type lookup
            if (!$this->indexExists('member_badges', 'idx_badges_badge_type')) {
                $table->index('badge_type_id', 'idx_badges_badge_type');
            }
            
            // Composite: member + badge type (check if member has badge)
            if (!$this->indexExists('member_badges', 'idx_badges_member_type')) {
                $table->index(['member_id', 'badge_type_id'], 'idx_badges_member_type');
            }
        });

        // Service schedules table indexes
        Schema::table('service_schedules', function (Blueprint $table) {
            // Organization filtering (already has index from creation)
            // Skip organization_id as it already has an index

            // Day of week filtering (for weekly service queries)
            if (!$this->indexExists('service_schedules', 'idx_services_day_active')) {
                $table->index(['day_of_week', 'is_active'], 'idx_services_day_active');
            }

            // Time-based queries (for scheduling conflicts)
            if (!$this->indexExists('service_schedules', 'idx_services_time')) {
                $table->index(['start_time', 'end_time'], 'idx_services_time');
            }
        });

        // Member attributes table indexes - Already exist in table creation migration
        // Skipping member_attribute_values as it already has proper indexes:
        // - unique_member_attribute: ['member_id', 'attribute_id']
        // - idx_attribute_values_member: 'member_id'
        // - idx_attribute_values_attribute: 'attribute_id'
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes in reverse order
        Schema::table('member_attribute_values', function (Blueprint $table) {
            $table->dropIndex('idx_attr_attribute');
            $table->dropIndex('idx_attr_member');
        });

        Schema::table('service_schedules', function (Blueprint $table) {
            $table->dropIndex('idx_services_type');
            $table->dropIndex('idx_services_date');
            $table->dropIndex('idx_services_organization');
        });

        Schema::table('member_badges', function (Blueprint $table) {
            $table->dropIndex('idx_badges_member_type');
            $table->dropIndex('idx_badges_badge_type');
            $table->dropIndex('idx_badges_member');
        });

        Schema::table('member_notes', function (Blueprint $table) {
            $table->dropIndex('idx_notes_member_date');
            $table->dropIndex('idx_notes_created_at');
            $table->dropIndex('idx_notes_member');
        });

        Schema::table('families', function (Blueprint $table) {
            $table->dropIndex('idx_families_org_active_name');
            $table->dropIndex('idx_families_name');
            $table->dropIndex('idx_families_active');
            $table->dropIndex('idx_families_organization');
        });

        Schema::table('attendance', function (Blueprint $table) {
            $table->dropIndex('idx_attendance_family');
            $table->dropIndex('idx_attendance_service_date');
            $table->dropIndex('idx_attendance_org_date');
            $table->dropIndex('idx_attendance_checked_in_at');
            $table->dropIndex('idx_attendance_member_service');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex('idx_members_phone');
            $table->dropIndex('idx_members_org_active_created');
            $table->dropIndex('idx_members_active');
            $table->dropIndex('idx_members_email');
            $table->dropIndex('idx_members_organization_id');
        });
    }

    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $index): bool
    {
        $connection = Schema::getConnection();
        $database = $connection->getDatabaseName();
        
        $result = $connection->select(
            "SELECT COUNT(*) as count 
             FROM pg_indexes 
             WHERE tablename = ? AND indexname = ?",
            [$table, $index]
        );
        
        return $result[0]->count > 0;
    }
};

