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
        Schema::create('member_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('content');
            $table->string('note_type')->default('Personal Note'); // Personal Note, Follow-up, Prayer Request, etc.
            $table->enum('privacy_level', ['public', 'private', 'extreme'])->default('public');
            $table->boolean('is_alert')->default(false); // Alert flag for important notes
            $table->boolean('is_pinned')->default(false); // Pin to top of member profile
            $table->timestamp('alert_expires_at')->nullable(); // When alert should stop showing
            $table->timestamps();

            // Indexes for performance
            $table->index(['member_id']);
            $table->index(['author_id']);
            $table->index(['is_alert']);
            $table->index(['is_pinned']);
            $table->index(['privacy_level']);
            $table->index(['note_type']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_notes');
    }
};
