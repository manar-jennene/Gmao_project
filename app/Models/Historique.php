<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historiques';

    protected $fillable = [
        'attribut',
        'previus',
        'next',
        'user_id',
        'intervention_id',
        'maintenancepreventive_id',
    ];

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

    public function maintenancePreventive()
    {
        return $this->belongsTo(Maintenancepreventive::class, 'maintenancepreventive_id');
    }

}
