<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user with the credentials used in the frontend
        User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create additional test users
        User::updateOrCreate(
            ['email' => 'admin@churchafrica.com'],
            [
                'name' => 'Church Admin',
                'first_name' => 'Church',
                'last_name' => 'Admin',
                'email' => 'admin@churchafrica.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@churchafrica.com'],
            [
                'name' => 'Church Staff',
                'first_name' => 'Church',
                'last_name' => 'Staff',
                'email' => 'staff@churchafrica.com',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'member@churchafrica.com'],
            [
                'name' => 'Church Member',
                'first_name' => 'Church',
                'last_name' => 'Member',
                'email' => 'member@churchafrica.com',
                'password' => Hash::make('member123'),
                'role' => 'member',
                'email_verified_at' => now(),
            ]
        );
    }
}
