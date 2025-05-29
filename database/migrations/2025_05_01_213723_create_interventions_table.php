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
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();

            $table->text('description')->nullable();
            $table->string('reference')->unique();
            $table->string('file')->nullable();
            $table->date('date_creation')->nullable();
            $table->date('date_fin')->nullable(); // attention à la syntaxe (éviter les tirets dans les colonnes)

            // Clés étrangères vers la table users
            $table->unsignedBigInteger('responsable')->nullable();
            $table->unsignedBigInteger('rapporteur')->nullable();

            $table->string('telephone');
            $table->string('email');

            // Clés étrangères vers les tables statut, priorité, équipement
            $table->unsignedBigInteger('statut_id')->nullable();
            $table->unsignedBigInteger('priorite_id')->nullable();
            $table->unsignedBigInteger('equipement_id')->nullable();

            $table->timestamps();

            // Contraintes de clé étrangère
            $table->foreign('responsable')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('rapporteur')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('statut_id')->references('id')->on('statuts')->onDelete('cascade');
            $table->foreign('priorite_id')->references('id')->on('priorites')->onDelete('cascade');
            $table->foreign('equipement_id')->references('id')->on('equipements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
