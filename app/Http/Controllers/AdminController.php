<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function reservas(string $fecha = null)
    {
        $fecha = $fecha ? Carbon::parse($fecha) : Carbon::today();

        $reservas = Reserva::with('cancha')
            ->whereDate('fecha', $fecha)
            ->orderBy('hora_inicio')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'codigo' => $reserva->codigo,
                    'cancha' => $reserva->cancha->nombre,
                    'cliente_nombre' => $reserva->cliente_nombre,
                    'cliente_telefono' => $reserva->cliente_telefono,
                    'hora_inicio' => substr($reserva->hora_inicio, 0, 5),
                    'hora_fin' => substr($reserva->hora_fin, 0, 5),
                    'estado' => $reserva->estado,
                ];
            });

        return Inertia::render('Admin/Reservas', [
            'fecha' => $fecha->format('Y-m-d'),
            'reservas' => $reservas,
        ]);
    }
}