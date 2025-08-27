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
        Schema::create('maintenancepreventive', function (Blueprint $table) {
          $table->id();
          $table->string('periodicite'); // hebdomadaire, mensuel...
          $table->integer('frequence'); // chaque X semaines/mois/ans
            $table->string('joursrepetition')->nullable(); // ex: ["LUN", "MER"]
            $table->unsignedBigInteger('equipement_id')->nullable();
            $table->text('description')->nullable();
        $table->unsignedBigInteger('responsable_id')->nullable();
        $table->unsignedBigInteger('priorite_id')->nullable();
        $table->unsignedBigInteger('statut_id')->nullable();
        $table->string('reference')->nullable();
        $table->string('file')->nullable();
        $table->string('labels')->nullable();
        $table->date('date_debut');
        $table->date('date_fin')->nullable();
        $table->integer('occurrences_max')->nullable();
        $table->integer('temps_estime_jours')->nullable();
        $table->integer('temps_estime_heures')->nullable();
        $table->enum('trigger_type', ['date_fixe', 'fermeture_tache', 'api_externe'])->default('date_fixe');

    //relation
        $table->foreign('equipement_id')->references('id')->on('equipements')->onDelete('cascade');
        $table->foreign('responsable_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('priorite_id')->references('id')->on('priorites')->onDelete('cascade');
        $table->foreign('statut_id')->references('id')->on('statuts')->onDelete('cascade');


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
        Schema::dropIfExists('maintenancepreventive');
    }
};
