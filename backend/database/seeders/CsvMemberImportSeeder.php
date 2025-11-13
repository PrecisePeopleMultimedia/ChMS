<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Member;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CsvMemberImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Log::info('Starting CsvMemberImportSeeder', [
            'timestamp' => now()->toISOString(),
        ]);

        // Step 1: Create or get super admin user
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@churchafrica.com'],
            [
                'name' => 'Super Admin',
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@churchafrica.com',
                'password' => Hash::make('admin123456'),
                'role' => 'admin', // Using 'admin' role (super_admin may not exist in schema)
                'email_verified_at' => now(),
            ]
        );

        Log::info('Super admin user created/updated', [
            'user_id' => $superAdmin->id,
            'email' => $superAdmin->email,
        ]);

        // Step 2: Create or get organization for super admin
        $organization = Organization::firstOrCreate(
            ['email' => 'admin@churchafrica.com'],
            [
                'name' => 'ChurchAfrica',
                'phone' => '+234-800-000-0000',
                'address' => 'Lagos, Nigeria',
                'timezone' => 'Africa/Lagos',
                'country' => 'Nigeria',
            ]
        );

        // Link super admin to organization if not already linked
        if (!$superAdmin->organization_id) {
            $superAdmin->organization_id = $organization->id;
            $superAdmin->save();
        }

        Log::info('Organization created/retrieved', [
            'organization_id' => $organization->id,
            'name' => $organization->name,
        ]);

        // Step 3: Read and import CSV file
        $csvPath = base_path('../members_import_template-filled.csv');
        
        if (!file_exists($csvPath)) {
            Log::error('CSV file not found', ['path' => $csvPath]);
            $this->command->error("CSV file not found at: {$csvPath}");
            return;
        }

        $this->command->info("Reading CSV file from: {$csvPath}");

        // Read CSV file
        $handle = fopen($csvPath, 'r');
        if (!$handle) {
            Log::error('Failed to open CSV file', ['path' => $csvPath]);
            $this->command->error("Failed to open CSV file");
            return;
        }

        // Read header row
        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            Log::error('CSV file is empty or invalid');
            $this->command->error("CSV file is empty or invalid");
            return;
        }

        // Normalize headers (trim and lowercase)
        $headers = array_map(function($header) {
            return trim(strtolower($header));
        }, $headers);

        $this->command->info("CSV Headers: " . implode(', ', $headers));

        $imported = 0;
        $skipped = 0;
        $errors = [];

        // Read data rows
        $rowNumber = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            
            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }

            try {
                // Map CSV row to associative array
                $memberData = [];
                foreach ($headers as $index => $header) {
                    $memberData[$header] = isset($row[$index]) ? trim($row[$index]) : null;
                }

                // Skip if missing required fields
                if (empty($memberData['first_name']) || empty($memberData['last_name'])) {
                    $errors[] = "Row {$rowNumber}: Missing first_name or last_name";
                    $skipped++;
                    continue;
                }

                // Check for duplicate email
                if (!empty($memberData['email'])) {
                    $existingMember = Member::where('organization_id', $organization->id)
                        ->where('email', $memberData['email'])
                        ->first();

                    if ($existingMember) {
                        $errors[] = "Row {$rowNumber}: Email {$memberData['email']} already exists";
                        $skipped++;
                        continue;
                    }
                }

                // Parse date fields
                $dateOfBirth = null;
                if (!empty($memberData['date_of_birth'])) {
                    try {
                        $dateOfBirth = \Carbon\Carbon::parse($memberData['date_of_birth'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        // Invalid date format, skip
                    }
                }

                $joinedDate = now();
                if (!empty($memberData['joined_date'])) {
                    try {
                        $joinedDate = \Carbon\Carbon::parse($memberData['joined_date'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        // Invalid date format, use now
                    }
                }

                // Create member
                $member = Member::create([
                    'organization_id' => $organization->id,
                    'first_name' => $memberData['first_name'],
                    'last_name' => $memberData['last_name'],
                    'email' => $memberData['email'] ?? null,
                    'phone' => $memberData['phone'] ?? null,
                    'date_of_birth' => $dateOfBirth,
                    'gender' => $memberData['gender'] ?? null,
                    'marital_status' => $memberData['marital_status'] ?? null,
                    'address' => $memberData['address'] ?? null,
                    'city' => $memberData['city'] ?? null,
                    'state' => $memberData['state'] ?? null,
                    'postal_code' => $memberData['postal_code'] ?? null,
                    'country' => $memberData['country'] ?? 'Nigeria',
                    'member_type' => $memberData['member_type'] ?? 'member',
                    'membership_status' => $memberData['membership_status'] ?? 'active',
                    'membership_number' => $memberData['membership_number'] ?? 'MEM-' . strtoupper(Str::random(8)),
                    'joined_date' => $joinedDate,
                    'notes' => $memberData['notes'] ?? null,
                ]);

                $imported++;
                $this->command->info("Imported: {$member->first_name} {$member->last_name}");

            } catch (\Exception $e) {
                $errors[] = "Row {$rowNumber}: " . $e->getMessage();
                $skipped++;
                Log::error('Failed to import member row', [
                    'row_number' => $rowNumber,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        fclose($handle);

        // Summary
        $this->command->info("\n=== Import Summary ===");
        $this->command->info("Imported: {$imported} members");
        $this->command->info("Skipped: {$skipped} rows");
        
        if (!empty($errors)) {
            $this->command->warn("Errors:");
            foreach ($errors as $error) {
                $this->command->warn("  - {$error}");
            }
        }

        Log::info('CsvMemberImportSeeder completed', [
            'imported' => $imported,
            'skipped' => $skipped,
            'errors_count' => count($errors),
        ]);
    }
}

