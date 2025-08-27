<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'piece_id',
        'quantite_demandee',
        'demandeur_id',
        'statut_id', // clé étrangère vers table statut
        'date_demande',
        'date_reception',
        'valide',
    ];

    // Relation avec la pièce demandée
    public function piece()
    {
        return $this->belongsTo(Stock::class, 'piece_id');
    }

    // Relation avec l'utilisateur qui a fait la demande
    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    // Relation avec le statut
    public function statut()
    {
        return $this->belongsTo(Statut::class, 'statut_id');
    }
}
