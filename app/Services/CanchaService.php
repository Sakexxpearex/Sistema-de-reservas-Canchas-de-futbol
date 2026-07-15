<?php

namespace App\Services;

use App\Models\Cancha;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CanchaService
{
    public function obtenerCanchasConDisponibilidad(Carbon $fecha): Collection
    {
        return Cancha::where('activa', true)
            ->with(['reservas' => function ($query) use ($fecha) {
                $query->whereDate('fecha', $fecha)
                      ->where('estado', '!=', 'cancelada');
            }])
            ->get()
            ->map(fn ($cancha) => $this->formatearCancha($cancha, $fecha));
    }

    private function formatearCancha(Cancha $cancha, Carbon $fecha): array
    {
        $bloques = $cancha->generarBloques($fecha);

        return [
            'id' => (string) $cancha->id,
            'name' => $cancha->nombre,
            'location' => $cancha->location,
            'surface' => $cancha->surface,
            'capacity' => $cancha->capacity,
            'lighting' => (bool) $cancha->lighting,
            'covered' => (bool) $cancha->covered,
            'premium' => (bool) $cancha->premium,
            'parking' => (bool) $cancha->parking,
            'type' => $cancha->tipo,
            'slots' => $this->calcularSlots($cancha, $bloques),
        ];
    }

    private function calcularSlots(Cancha $cancha, array $bloques): Collection
    {
        return collect($bloques)->map(function ($bloque) use ($cancha) {
            $ocupado = $cancha->reservas->contains(function ($reserva) use ($bloque) {
                return substr($reserva->hora_inicio, 0, 5) === $bloque['inicio']
                    && substr($reserva->hora_fin, 0, 5) === $bloque['fin'];
            });

            return [
                'id' => $cancha->id . '-' . $bloque['inicio'],
                'time' => $bloque['inicio'],
                'price' => (float) $cancha->precio_hora,
                'status' => $ocupado ? 'occupied' : 'available',
            ];
        });
    }
}