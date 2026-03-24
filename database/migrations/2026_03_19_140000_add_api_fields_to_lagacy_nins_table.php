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
        Schema::table('lagacy_nins', function (Blueprint $table) {
            // Add api_response column if it doesn't exist
            if (!Schema::hasColumn('lagacy_nins', 'api_response')) {
                $table->json('api_response')->nullable()->after('search_type');
            }
            
            // Add api_version column if it doesn't exist
            if (!Schema::hasColumn('lagacy_nins', 'api_version')) {
                $table->string('api_version')->nullable()->after('api_response');
            }
            
            // Make nin nullable for demographic searches
            $table->string('nin')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lagacy_nins', function (Blueprint $table) {
            if (Schema::hasColumn('lagacy_nins', 'api_response')) {
                $table->dropColumn('api_response');
            }
            
            if (Schema::hasColumn('lagacy_nins', 'api_version')) {
                $table->dropColumn('api_version');
            }
        });
    }
};
