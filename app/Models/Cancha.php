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


    
    public function generarBloques(Carbon $fecha): array
    {
        $horaApertura = 9;   // 09:00
        $horaCierre = 23;    // 23:00
        $duracionBloqueHoras = 1;

        $bloques = [];

        $cursor = $fecha->copy()->setTime($horaApertura, 0);
        $limite = $fecha->copy()->setTime($horaCierre, 0);

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
