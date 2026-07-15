<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cancha extends Model
{
    protected $fillable = [
        'nombre',
        'tipo',
        'location',
        'surface',
        'capacity',
        'lighting',
        'covered',
        'premium',
        'parking',
        'precio_hora',
        'hora_apertura',
        'hora_cierre',
        'activa',
    ];

    protected $casts = [
        'lighting' => 'boolean',
        'covered' => 'boolean',
        'premium' => 'boolean',
        'parking' => 'boolean',
        'activa' => 'boolean',
    ];

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function generarBloques(Carbon $fecha): array
    {
        $duracionBloqueHoras = 1;

        [$horaAperturaH, $horaAperturaM] = explode(':', $this->hora_apertura);
        [$horaCierreH, $horaCierreM] = explode(':', $this->hora_cierre);

        $bloques = [];

        $cursor = $fecha->copy()->setTime((int) $horaAperturaH, (int) $horaAperturaM);
        $limite = $fecha->copy()->setTime((int) $horaCierreH, (int) $horaCierreM);

        while ($cursor->lt($limite)) {
            $finBloque = $cursor->copy()->addHours($duracionBloqueHoras);

            $bloques[] = [
                'inicio' => $cursor->format('H:i'),
                'fin' => $finBloque->format('H:i'),
            ];

            $cursor = $finBloque;
        }

        return $bloques;
    }
}