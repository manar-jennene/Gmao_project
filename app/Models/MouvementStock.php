<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'stock_id',       // Référence du produit (clé étrangère vers table stock)
        'type',           // 'entrée' ou 'sortie'
        'quantite',       // Quantité ajoutée ou retirée
        'date_mouvement', // Date du mouvement
        'user_id',        // Qui a effectué le mouvement (optionnel)
        'commentaire'     // Une note sur le mouvement (optionnel)
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id');
    }
}
