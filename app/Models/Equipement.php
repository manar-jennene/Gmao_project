<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'reference',
        'marque',
        'date_mise_en_service',
        'image', // chemin de l'image
        'statut_id' // clé étrangère vers table statut
    ];

    // Relation avec le modèle Statut
    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }
}
