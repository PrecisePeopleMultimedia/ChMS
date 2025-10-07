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
        Schema::create('families', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->foreignId('head_id')->constrained('users')->onDelete('cascade');
            $table->text('address')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['organization_id']);
            $table->index(['head_id']);
        });

        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['head', 'spouse', 'child', 'other'])->default('other');
            $table->timestamps();

            // Indexes for performance
            $table->index(['family_id']);
            $table->index(['user_id']);
            $table->unique(['family_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
        Schema::dropIfExists('families');
    }
};
