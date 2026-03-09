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
        Schema::create('nin_search3_demographics', function (Blueprint $table) {
            $table->id();
            $table->string('nin');
            $table->string("phone")->nullable();
            $table->string("photo")->nullable();
            $table->string("signature")->nullable();
            $table->string("religion")->nullable();
            $table->string("title")->nullable();
            $table->string('surname');
            $table->string('first_name');
            $table->string('birth_date');
            $table->string('gender');
            $table->string('batchid')->nullable();
            $table->string('birthcountry')->nullable();
            $table->string('birthlga')->nullable();
            $table->string('birthstate')->nullable();
            $table->string('cardstatus')->nullable();
            $table->string('centralID')->nullable();
            $table->string('educationallevel')->nullable();
            $table->string('emplymentstatus')->nullable();
            $table->string('middlename')->nullable();
            $table->string('heigth')->nullable();
            $table->string('maritalstatus')->nullable();
            $table->string('nok_address1')->nullable();
            $table->string('nok_firstname')->nullable();
            $table->string('nok_lga')->nullable();
            $table->string('nok_state')->nullable();
            $table->string('nok_surname')->nullable();
            $table->string('nok_town')->nullable();
            $table->string('nspokenlang')->nullable();
            $table->string('ospokenlang')->nullable();
            $table->string('pfirstname')->nullable();
            $table->string('pmiddlename')->nullable();
            $table->string('psurname')->nullable();
            $table->string('residence_AdressLine1')->nullable();
            $table->string('residence_Town')->nullable();
            $table->string('residence_lga')->nullable();
            $table->string('residence_state')->nullable();
            $table->string('residencestatus')->nullable();
            $table->string('trackingId')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nin_search3_demographics');
    }
};
