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
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->nullable()->constrained()->onDelete('set null');
            $table->string('visitor_name')->nullable();
            $table->string('visitor_phone', 50)->nullable();
            $table->timestamp('check_in_time');
            $table->enum('check_in_method', ['qr_code', 'manual_search', 'visitor']);
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['service_id']);
            $table->index(['member_id']);
            $table->index(['check_in_time']);
            $table->index(['organization_id', 'service_id']);
            $table->index(['check_in_method']);
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
