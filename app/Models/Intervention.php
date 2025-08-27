<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'description',
        'file',
        'date_creation',
        'date_fin',
        'responsable',
        'rapporteur',
        'telephone',
        'email',
        'statut_id',
        'priorite_id' ,
        'equipement_id',
        // clé étrangère vers table statut,
        'resume',
        'site'

    ];

    // Relation avec le modèle Statut
    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }

    public function priorite()
    {
        return $this->belongsTo(Priorite::class);
    }

    public function equipement()
    {
        return $this->belongsTo(Equipement::class);
    }
    public function rapporteur()
{
    return $this->belongsTo(User::class, 'rapporteur');
}

public function responsable()
{
    return $this->belongsTo(User::class, 'responsable');
}

public function commentaires()
{
    return $this->hasMany(Commentaire::class);
}

public function histories()
{
    return $this->hasMany(Historique::class)->with('user');
}

}
