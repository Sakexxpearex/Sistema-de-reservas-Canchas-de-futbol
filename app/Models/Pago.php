<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    protected $fillable = [
        'reserva_id',
        'monto',
        'metodo_pago',
        'estado_pago',
        'fecha_pago',
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }
}
