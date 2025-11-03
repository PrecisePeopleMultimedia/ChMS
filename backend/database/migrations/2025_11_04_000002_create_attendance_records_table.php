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
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->foreignId('member_id')->nullable()->constrained('members')->onDelete('cascade');
            
            // Family check-in support
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('set null');
            
            // Check-in details
            $table->timestamp('checked_in_at')->useCurrent();
            $table->timestamp('checked_out_at')->nullable();
            $table->enum('checkin_method', ['qr_individual', 'qr_family', 'manual_search', 'visitor_registration'])->default('manual_search');
            
            // Location and ministry assignment
            $table->string('location_assignment')->nullable(); // Specific room/section
            $table->string('ministry_assignment')->nullable(); // Children's ministry, adult service, etc.
            $table->string('seat_section')->nullable();
            
            // Family and child-specific fields
            $table->boolean('is_family_checkin')->default(false);
            $table->foreignId('parent_id')->nullable()->constrained('members')->onDelete('set null'); // For children, reference to parent
            $table->string('child_security_code', 20)->nullable(); // For secure child pickup
            $table->text('special_needs_notes')->nullable();
            
            // Visitor information (when member_id is null)
            $table->string('visitor_name')->nullable();
            $table->string('visitor_phone')->nullable();
            $table->string('visitor_email')->nullable();
            
            // Metadata
            $table->json('device_info')->nullable(); // Check-in device information
            $table->boolean('offline_sync')->default(false); // Was this synced from offline?
            $table->text('notes')->nullable();
            
            // Staff tracking
            $table->foreignId('checked_in_by')->constrained('users')->onDelete('cascade');
            
            $table->timestamps();
            
            // Prevent duplicate check-ins (same member in same service)
            $table->unique(['member_id', 'service_id'], 'unique_member_service');
            
            // Indexes
            $table->index(['organization_id', 'service_id']);
            $table->index(['member_id']);
            $table->index(['family_id']);
            $table->index('checked_in_at');
            $table->index('checkin_method');
            $table->index('location_assignment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};

