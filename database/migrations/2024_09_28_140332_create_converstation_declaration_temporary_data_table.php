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
        Schema::create('conversation_declaration_temporary_data', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('conversation_id')->unsigned();
            $table->boolean('explain_situation')->default(false);
            $table->text('required_fields')->nullable();
            $table->text('fields')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversation_declaration_temporary_data');
    }
};
