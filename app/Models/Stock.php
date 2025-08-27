<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'reference',
        'description',
        'quantite_disponible',
        'seuil_minimum',
        'categorie_id',
        'fournisseur_id',
        'date_ajout'
    ];

    // Relation avec la catégorie
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    // Relation avec le fournisseur (table users)
    public function fournisseur()
    {
        return $this->belongsTo(User::class, 'fournisseur_id');
    }

    // Relation avec les demandes de stock
    public function demandes()
    {
        return $this->hasMany(DemandeStock::class, 'piece_id');
    }
}
