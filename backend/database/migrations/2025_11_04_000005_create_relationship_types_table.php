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
        Schema::create('relationship_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->onDelete('cascade');
            
            // Relationship Type Information
            $table->string('name'); // e.g., "Parent", "Child", "Spouse"
            $table->string('slug')->unique(); // e.g., "parent", "child", "spouse"
            $table->text('description')->nullable();
            
            // Relationship Category
            $table->enum('category', ['family', 'household', 'legal', 'custom'])->default('family');
            
            // Usage Flags
            $table->boolean('is_family')->default(true); // Can be used for family relationships
            $table->boolean('is_household')->default(false); // Can be used for household relationships
            $table->boolean('is_legal')->default(false); // Legal relationship (custody, guardianship)
            
            // Display and Ordering
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            
            // Reciprocal Relationship (e.g., "Child" is reciprocal of "Parent")
            $table->foreignId('reciprocal_type_id')->nullable()->constrained('relationship_types')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['organization_id', 'is_active']);
            $table->index(['category', 'is_active']);
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relationship_types');
    }
};

