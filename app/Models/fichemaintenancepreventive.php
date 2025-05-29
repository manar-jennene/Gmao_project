<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fichemaintenancepreventive extends Model
{
    use HasFactory;

    protected $fillable = [

        'date_generation',
        'responsable_id',
        'statut_id',

    ];

    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }


    public function responsable()
    {
        return $this->belongsTo(User::class);
    }

}
