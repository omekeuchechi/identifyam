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
        Schema::create('nin_slip2s', function (Blueprint $table) {
            $table->id();
            $table->string('nin');
            $table->string('phone')->nullable();
            $table->string('surname')->nullable();
            $table->string('first_name')->nullable();
            $table->string('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('image')->nullable();
            $table->string('last_name')->nullable();
            $table->string('religion')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('email')->nullable();
            $table->string('trackingId')->nullable();
            $table->string('country')->nullable();
            $table->string('all_validation_passed')->nullable();
            $table->string('signature')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('marital_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nin_slip2s');
    }
};
