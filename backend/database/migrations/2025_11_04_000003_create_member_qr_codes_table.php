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
        Schema::create('member_qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            
            // QR Code Data
            $table->string('qr_code_data', 500)->unique(); // Encrypted QR code data
            $table->string('qr_code_type')->default('individual'); // 'individual' or 'family'
            
            // Family QR code support
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('cascade');
            
            // Expiration and validation
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Service-specific QR codes (optional)
            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            
            // Security
            $table->string('verification_token', 100)->nullable();
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('qr_code_data');
            $table->index(['member_id', 'is_active']);
            $table->index(['family_id', 'is_active']);
            $table->index(['organization_id', 'is_active']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_qr_codes');
    }
};

