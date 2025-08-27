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
        Schema::create('commentaires', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('intervention_id');
             $table->unsignedBigInteger('user_id'); // celui qui a posté le commentaire
             $table->unsignedBigInteger('parent_id')->nullable(); // réponse à un autre commentaire

             $table->text('commentaire');


             $table->foreign('intervention_id')->references('id')->on('interventions')->onDelete('cascade');
             $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
              $table->foreign('parent_id')->references('id')->on('commentaires')->onDelete('cascade');

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
        Schema::dropIfExists('commentaires');
    }
};
