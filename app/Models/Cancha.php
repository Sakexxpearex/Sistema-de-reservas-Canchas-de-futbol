<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cancha extends Model
{
    protected $fillable = [
        'nombre',
        'tipo',
        'precio_hora',
        'hora_apertura',
        'hora_cierre',
        'activa',
    ];

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    
}
