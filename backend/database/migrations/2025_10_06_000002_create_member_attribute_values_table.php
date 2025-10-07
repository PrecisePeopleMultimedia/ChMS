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
        Schema::create('member_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('attribute_id')->constrained('member_attributes')->onDelete('cascade');
            $table->text('value')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->unique(['member_id', 'attribute_id'], 'unique_member_attribute');
            $table->index('member_id', 'idx_attribute_values_member');
            $table->index('attribute_id', 'idx_attribute_values_attribute');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_attribute_values');
    }
};
