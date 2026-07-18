<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminController extends Controller
{
    private const ESTADO_A_STATUS = [
        'pendiente' => 'pending',
        'confirmada' => 'confirmed',
        'cancelada' => 'cancelled',
    ];

    public function reservas(string $fecha = null)
    {
        $reservas = Reserva::with('cancha')
            ->when($fecha, fn ($query) => $query->whereDate('fecha', Carbon::parse($fecha)))
            ->orderByDesc('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->codigo,
                    'court' => $reserva->cancha->nombre,
                    'date' => $reserva->fecha->format('Y-m-d'),
                    'time' => substr($reserva->hora_inicio, 0, 5) . ' - ' . substr($reserva->hora_fin, 0, 5),
                    'customer' => $reserva->cliente_nombre,
                    'email' => $reserva->cliente_email,
                    'phone' => $reserva->cliente_telefono,
                    'price' => (float) $reserva->cancha->precio_hora,
                    'status' => self::ESTADO_A_STATUS[$reserva->estado] ?? 'pending',
                ];
            });

        return Inertia::render('AdminPage', [
            'reservas' => $reservas,
        ]);
    }
}