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
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            
            // Household Information
            $table->string('name'); // Household name (e.g., "Smith Household")
            $table->text('description')->nullable();
            
            // Address Information (physical residence)
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            
            // Household Head
            $table->foreignId('head_of_household_id')->nullable()->constrained('members')->onDelete('set null');
            
            // Contact Information
            $table->string('home_phone')->nullable();
            $table->string('email')->nullable();
            
            // Household Type
            $table->enum('household_type', ['primary', 'secondary', 'temporary'])->default('primary');
            
            // Additional Information
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['organization_id', 'is_active']);
            $table->index(['organization_id', 'name']);
            $table->index('head_of_household_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};

