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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            
            // Service Information
            $table->string('name');
            $table->enum('service_type', ['sunday_morning', 'sunday_evening', 'midweek', 'special_event'])->default('sunday_morning');
            $table->date('scheduled_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            
            // Location and Capacity
            $table->string('location')->nullable();
            $table->string('location_assignment')->nullable(); // Specific room/section
            $table->integer('capacity')->default(0);
            
            // Service Configuration
            $table->json('ministry_assignments')->nullable(); // Age-based ministry assignments
            $table->json('special_requirements')->nullable(); // Special needs, security requirements
            $table->boolean('allow_family_checkin')->default(true);
            $table->boolean('require_location_assignment')->default(false);
            $table->boolean('enable_child_security')->default(true);
            
            // Status
            $table->enum('status', ['scheduled', 'active', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['organization_id', 'scheduled_date']);
            $table->index(['organization_id', 'service_type']);
            $table->index(['organization_id', 'status']);
            $table->index('scheduled_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

