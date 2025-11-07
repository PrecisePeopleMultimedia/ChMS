<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test organization
        $organization = Organization::factory()->create([
            'name' => 'Test Church Africa',
            'email' => 'info@testchurch.chms',
            'phone' => '+234-123-456-7890',
            'address' => '123 Test Street, Lagos, Nigeria',
            'timezone' => 'Africa/Lagos',
            'description' => 'Test church for development and testing',
            'website' => 'https://testchurch.chms',
        ]);

        // Update existing test user or create new one
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'organization_id' => $organization->id,
                'role' => 'admin', // Give admin role to ensure full access
            ]
        );

        $this->command->info('Test user created/updated with ID: ' . $user->id);
        $this->command->info('Test organization created with ID: ' . $organization->id);
    }
}
