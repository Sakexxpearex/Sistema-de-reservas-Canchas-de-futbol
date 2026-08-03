<?php

namespace App\Services;

use App\Models\Cancha;
use App\Models\Reserva;
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

    /**
     * Una reserva pendiente (efectivo o transferencia) también ocupa el bloque:
     * solo las canceladas lo liberan.
     */
    public function slotDisponible(int $canchaId, string $fecha, string $horaInicio): bool
    {
        // Según el driver, `hora_inicio` se guarda como "20:00" o como
        // "20:00:00", así que se comparan ambas formas.
        $hora = substr($horaInicio, 0, 5);

        return ! Reserva::where('cancha_id', $canchaId)
            ->whereDate('fecha', $fecha)
            ->whereIn('hora_inicio', [$hora, $hora . ':00'])
            ->where('estado', '!=', 'cancelada')
            ->exists();
    }

    public function calcularHoraFin(string $horaInicio): string
    {
        return Carbon::parse($horaInicio)->addHour()->format('H:i');
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
                'time' => $bloque['inicio'] . ' - ' . $bloque['fin'],
                'price' => (float) $cancha->precio_hora,
                'status' => $ocupado ? 'occupied' : 'available',
            ];
        });
    }
}