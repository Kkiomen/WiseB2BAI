<?php

use App\Core\Assistant\Enum\AssistantType;
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
        Schema::create('assistants', function (Blueprint $table) {
            $table->id();
            $table->string('img_url')->nullable();
            $table->string('name');
            $table->text('short_name')->nullable();
            $table->text('prompt')->nullable();
            $table->integer('sort')->default(1);
            $table->enum('type', AssistantType::toArray())->default(AssistantType::BASIC->value);
            $table->boolean('public')->default(true);
            $table->text('memory_collection')->nullable();
            $table->text('start_message')->nullable();
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
        Schema::dropIfExists('assistants');
    }
};
