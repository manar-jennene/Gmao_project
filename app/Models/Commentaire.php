<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'commentaire',
        'user_id',
        'intervention_id',
        'parent_id'
    ];

    public function interventions()
    {
        return $this->belongsTo(Intervention::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Commentaire::class, 'parent_id');
    }

    public function enfants()
    {
        return $this->hasMany(Commentaire::class, 'parent_id');
    }
}
