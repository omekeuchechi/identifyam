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
        Schema::create('exam_card_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('card_type_id');
            $table->string('card_name');
            $table->integer('quantity');
            $table->decimal('amount', 10, 2);
            $table->string('reference')->unique();
            $table->decimal('old_balance', 10, 2);
            $table->decimal('new_balance', 10, 2);
            $table->string('status');
            $table->string('message')->nullable();
            $table->json('cards')->nullable(); // Store purchased cards as JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_card_purchases');
    }
};
