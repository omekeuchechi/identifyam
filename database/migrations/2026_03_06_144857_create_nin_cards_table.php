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
        Schema::create('nin_cards', function (Blueprint $table) {
            $table->id();
            $table->string("phone")->nullable();
            $table->string("photo")->nullable();
            $table->string("signature")->nullable();
            $table->string("religion")->nullable();
            $table->string("title")->nullable();
            $table->string("surname")->nullable();
            $table->string("firstname")->nullable();
            $table->string("gender")->nullable();
            $table->string("birthdate")->nullable();
            $table->string("email")->nullable();
            $table->string("trackingId")->nullable();
            $table->string("marital_status")->nullable();
            $table->boolean("status")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nin_cards');
    }
};
