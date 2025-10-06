<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('family_id')->nullable()->constrained()->onDelete('set null');
            $table->string('first_name', 100)->index();
            $table->string('last_name', 100)->index();
            $table->string('email')->nullable()->unique();
            $table->string('phone', 50)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->text('address')->nullable();
            $table->enum('member_type', ['adult', 'child', 'youth', 'visitor'])->default('adult');
            $table->date('join_date')->default(now());
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Duplicate detection hash
            $table->string('duplicate_check_hash', 64)->nullable()->index();

            // Search indexes
            $table->index(['first_name', 'last_name'], 'idx_member_name');
            $table->index('email', 'idx_member_email');
            $table->index('phone', 'idx_member_phone');
            $table->index('organization_id', 'idx_member_organization');
            $table->index('family_id', 'idx_member_family');

            // Full-text search index (will be added separately for MySQL compatibility)
        });

        // Add full-text index for MySQL only (SQLite doesn't support FULLTEXT)
        if (Schema::hasTable('members') && config('database.default') === 'mysql') {
            DB::statement('ALTER TABLE members ADD FULLTEXT ft_member_search (first_name, last_name, email, phone)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
