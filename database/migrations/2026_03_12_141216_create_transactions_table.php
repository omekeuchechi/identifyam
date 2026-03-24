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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reference')->unique();
            $table->string('type'); // 'funding', 'transfer', 'withdrawal'
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('NGN');
            $table->string('status')->default('pending'); // 'pending', 'successful', 'failed'
            $table->string('gateway')->nullable(); // 'paystack', 'bank_transfer'
            $table->json('gateway_response')->nullable();
            $table->string('description')->nullable();
            $table->string('recipient_name')->nullable(); // for transfers
            $table->string('recipient_account')->nullable(); // for transfers
            $table->string('recipient_bank')->nullable(); // for transfers
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
