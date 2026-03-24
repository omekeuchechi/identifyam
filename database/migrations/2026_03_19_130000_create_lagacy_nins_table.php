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
        Schema::create('lagacy_nins', function (Blueprint $table) {
            $table->id();
            $table->string('nin')->unique()->nullable(); // nullable for demographic searches
            $table->string('telephoneno')->nullable();
            $table->text('image')->nullable();
            $table->string('surname')->nullable();
            $table->string('first_name')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('email')->nullable();
            $table->string('status')->default('success');
            $table->string('search_type');
            $table->json('api_response')->nullable(); // Store full API response
            $table->string('api_version')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['nin', 'search_type']);
            $table->index(['search_type', 'api_version']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lagacy_nins');
    }
};
