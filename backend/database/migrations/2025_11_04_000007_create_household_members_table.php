<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('household_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('household_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            
            // Relationship to Household
            $table->foreignId('relationship_type_id')->nullable()->constrained('relationship_types')->onDelete('set null');
            
            // Household Role
            $table->enum('role', ['head', 'resident', 'temporary', 'guardian', 'other'])->default('resident');
            
            // Residency Information
            $table->date('residency_start_date')->nullable();
            $table->date('residency_end_date')->nullable();
            $table->enum('residency_status', ['permanent', 'temporary', 'former'])->default('permanent');
            
            // Custody Information (for children/guardianship)
            $table->enum('custody_type', ['full', 'joint', 'partial', 'none'])->nullable();
            $table->text('custody_notes')->nullable();
            $table->foreignId('guardian_id')->nullable()->constrained('members')->onDelete('set null');
            
            // Additional Information
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Prevent duplicate household memberships
            $table->unique(['household_id', 'member_id'], 'unique_household_member');
            
            // Indexes
            $table->index(['organization_id', 'household_id']);
            $table->index(['member_id', 'residency_status']);
            $table->index(['household_id', 'residency_status']);
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_members');
    }
};

