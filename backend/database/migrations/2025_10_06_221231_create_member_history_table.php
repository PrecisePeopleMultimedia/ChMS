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
        Schema::create('member_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('changed_by_user_id')->constrained('users');
            $table->enum('change_type', ['created', 'updated', 'deleted', 'restored']);
            $table->json('field_changes')->nullable(); // Store what fields changed
            $table->json('old_values')->nullable();    // Store previous values
            $table->json('new_values')->nullable();    // Store new values
            $table->timestamp('created_at');

            // Indexes
            $table->index(['member_id', 'created_at'], 'idx_member_history');
            $table->index('changed_by_user_id', 'idx_history_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_history');
    }
};
