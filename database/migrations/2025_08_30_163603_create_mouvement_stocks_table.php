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
        Schema::create('mouvement_stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stock_id');
            $table->enum('type', ['entrée', 'sortie']);
            $table->integer('quantite');
            $table->date('date_mouvement');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('commentaire')->nullable();
            $table->timestamps();
    
            $table->foreign('stock_id')->references('id')->on('stocks')->onDelete('cascade');
        });
    }
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mouvement_stocks');
    }
};
