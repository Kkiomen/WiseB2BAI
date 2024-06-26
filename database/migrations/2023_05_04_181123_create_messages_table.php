<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('conversation_id');
            $table->text('user_message')->nullable();
            $table->string('sender_class')->nullable();
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->text('prompt')->nullable();
            $table->text('system')->nullable();
            $table->text('result')->nullable();
            $table->json('steps')->nullable();
            $table->json('queries')->nullable();
            $table->json('table')->nullable();
            $table->text('links')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
};
