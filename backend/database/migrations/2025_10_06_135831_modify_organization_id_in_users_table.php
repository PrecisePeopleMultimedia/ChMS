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
        Schema::table('users', function (Blueprint $table) {
            // Drop the existing string column
            $table->dropColumn('organization_id');
        });

        Schema::table('users', function (Blueprint $table) {
            // Add proper foreign key column
            $table->foreignId('organization_id')->nullable()->constrained()->onDelete('cascade');
            $table->index('organization_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
        });

        Schema::table('users', function (Blueprint $table) {
            // Restore the original string column
            $table->string('organization_id')->nullable()->after('role');
        });
    }
};
