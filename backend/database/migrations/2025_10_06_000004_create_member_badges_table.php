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
        Schema::create('member_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('badge_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('expires_at')->nullable(); // Optional expiration
            $table->text('notes')->nullable(); // Reason for assignment
            $table->timestamps();
            
            // Indexes
            $table->unique(['member_id', 'badge_type_id'], 'unique_member_badge');
            $table->index('member_id', 'idx_member_badges_member');
            $table->index('badge_type_id', 'idx_member_badges_type');
            $table->index('expires_at', 'idx_member_badges_expires');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_badges');
    }
};
