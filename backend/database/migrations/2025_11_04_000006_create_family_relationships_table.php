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
        Schema::create('family_relationships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('family_id')->constrained()->onDelete('cascade');
            
            // Relationship Participants
            $table->foreignId('person1_id')->constrained('members')->onDelete('cascade'); // First person
            $table->foreignId('person2_id')->constrained('members')->onDelete('cascade'); // Second person
            
            // Relationship Type
            $table->foreignId('relationship_type_id')->constrained('relationship_types')->onDelete('restrict');
            
            // Relationship Details
            $table->json('relationship_details')->nullable(); // Additional details like custody info, anniversary date
            
            // Relationship Status
            $table->boolean('is_primary')->default(false); // Primary relationship (e.g., head of household)
            $table->date('start_date')->nullable(); // When relationship started (marriage, adoption, etc.)
            $table->date('end_date')->nullable(); // When relationship ended (divorce, death, etc.)
            $table->enum('status', ['active', 'ended', 'pending'])->default('active');
            
            // Custody Information (for legal relationships)
            $table->enum('custody_type', ['full', 'joint', 'partial', 'none'])->nullable();
            $table->text('custody_notes')->nullable();
            $table->date('custody_start_date')->nullable();
            $table->date('custody_end_date')->nullable();
            
            // Additional Information
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Prevent duplicate relationships
            $table->unique(['person1_id', 'person2_id', 'relationship_type_id'], 'unique_relationship');
            
            // Indexes
            $table->index(['organization_id', 'family_id']);
            $table->index(['person1_id', 'status']);
            $table->index(['person2_id', 'status']);
            $table->index(['relationship_type_id', 'status']);
            $table->index('is_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_relationships');
    }
};

