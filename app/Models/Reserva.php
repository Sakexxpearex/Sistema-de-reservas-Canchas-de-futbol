<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
    'cancha_id',
    'cliente_nombre',
    'cliente_email',        
    'cliente_telefono',
    'fecha',
    'hora_inicio',
    'hora_fin',
    'estado',
    'codigo',
];
//hola
    protected $casts = [
        'fecha' => 'date',
        'hora_inicio' => 'string',
        'hora_fin' => 'string',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $reserva): void {
            if (! empty($reserva->codigo)) {
                return;
            }

            do {
                $codigo = 'POT-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            } while (self::where('codigo', $codigo)->exists());

            $reserva->codigo = $codigo;
        });
    }

    public function cancha(): BelongsTo
    {
        return $this->belongsTo(Cancha::class);
    }

    public function pago(): HasOne
    {
        return $this->hasOne(Pago::class);
    }
}