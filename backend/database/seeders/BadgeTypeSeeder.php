<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BadgeType;
use App\Models\Organization;

class BadgeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all organizations
        $organizations = Organization::all();

        foreach ($organizations as $organization) {
            BadgeType::createDefaultBadges($organization->id);
        }
    }
}
