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
        Schema::create('member_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('key', 100);
            $table->string('name', 255);
            $table->enum('field_type', [
                'text', 
                'textarea', 
                'number', 
                'date', 
                'boolean', 
                'select', 
                'email', 
                'phone'
            ]);
            $table->string('category', 100)->default('Personal');
            $table->json('field_options')->nullable(); // For select fields: {"options": ["Option 1", "Option 2"]}
            $table->boolean('is_required')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->unique(['organization_id', 'key'], 'unique_org_key');
            $table->index('category', 'idx_attributes_category');
            $table->index('display_order', 'idx_attributes_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_attributes');
    }
};
