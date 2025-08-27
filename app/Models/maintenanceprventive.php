<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenanceprventive extends Model
{
    use HasFactory;

    protected $table = 'maintenancepreventive';

    protected $fillable = [
        'periodicite',
        'frequence',
        'joursrepetition',
        'equipement_id',
        'description',
        'responsable_id',
        'labels',
        'date_debut',
        'date_fin',
        'occurrences_max',
        'temps_estime_jours',
        'temps_estime_heures',
        'priorite_id',
        'trigger_type',
        'statut_id',
        'file',
        'reference'
    ];



    // protected $casts = [
    //     'joursrepetition' => 'array', // pour manipuler ["LUN", "MER"] en array PHP
    //     'date_debut' => 'date',
    //     'date_fin' => 'date',
    // ];

    // Relation avec le modèle Statut
    public function responsable()
    {
        return $this->belongsTo(User::class);
    }


    public function equipement()
    {
        return $this->belongsTo(Equipement::class);
    }

    public function priorite()
    {
        return $this->belongsTo(Priorite::class);
    }

    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }

    public function histories()
    {
        return $this->hasMany(Historique::class)->with('user');
    }

}
