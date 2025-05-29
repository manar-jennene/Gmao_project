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
        Schema::create('equipements', function (Blueprint $table) {


 $table->id();
        $table->string('nom');
        $table->text('description')->nullable();
        $table->string('reference')->unique();
        $table->string('marque')->nullable();
        $table->date('date_mise_en_service')->nullable();
        $table->string('image')->nullable(); // Stocke le chemin de l'image
        $table->unsignedBigInteger('statut_id'); // clé étrangère

        $table->foreign('statut_id')->references('id')->on('statuts')->onDelete('cascade');            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('equipements');
    }
};
