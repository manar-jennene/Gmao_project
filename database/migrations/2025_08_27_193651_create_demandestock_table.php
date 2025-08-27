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
        Schema::create('demande_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('piece_id')->constrained('stocks')->onDelete('cascade');
            $table->integer('quantite_demandee');
            $table->foreignId('demandeur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('statut_id')->constrained('statuts')->onDelete('cascade'); // en attente / approuvée / livrée
            $table->date('date_demande');
            $table->date('date_reception')->nullable();
            $table->boolean('valide')->default(0);
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
        Schema::dropIfExists('demande_stocks');
    }
};
