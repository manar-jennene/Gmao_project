<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenanceprventive extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipement_id',
        'titre',
        'frequence',
        'prochaine_date',
        'statut_id',

    ];

    // Relation avec le modèle Statut
    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }


    public function equipement()
    {
        return $this->belongsTo(Equipement::class);
    }


}
