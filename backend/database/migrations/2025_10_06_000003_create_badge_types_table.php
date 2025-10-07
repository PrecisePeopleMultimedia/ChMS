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
        Schema::create('badge_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#007bff'); // Hex color code
            $table->string('icon', 50)->default('badge'); // Icon name/class
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->unique(['organization_id', 'name'], 'unique_org_badge_name');
            $table->index('is_active', 'idx_badges_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badge_types');
    }
};
