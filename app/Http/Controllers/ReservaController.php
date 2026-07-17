<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservaRequest;
use App\Models\Reserva;
use App\Services\CanchaService;

class ReservaController extends Controller
{
    public function __construct(private CanchaService $canchaService)
    {
    }

    public function store(StoreReservaRequest $request)
    {
        $datos = $request->validated();

        $disponible = $this->canchaService->slotDisponible(
            $datos['cancha_id'],
            $datos['fecha'],
            $datos['hora_inicio']
        );

        if (! $disponible) {
            return back()->withErrors([
                'hora_inicio' => 'Este horario ya no está disponible. Por favor elige otro.',
            ]);
        }

        $horaFin = $this->canchaService->calcularHoraFin($datos['hora_inicio']);

        $reserva = Reserva::create([
            'cancha_id' => $datos['cancha_id'],
            'cliente_nombre' => $datos['cliente_nombre'],
            'cliente_email' => $datos['cliente_email'],
            'cliente_telefono' => $datos['cliente_telefono'],
            'fecha' => $datos['fecha'],
            'hora_inicio' => $datos['hora_inicio'],
            'hora_fin' => $horaFin,
            'estado' => 'confirmada', // pago simulado se considera exitoso al instante
        ]);

        return back()->with([
            'reserva_codigo' => $reserva->codigo,
        ]);
    }
}