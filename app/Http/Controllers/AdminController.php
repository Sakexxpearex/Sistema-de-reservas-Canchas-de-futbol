<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    private const ESTADO_A_STATUS = [
        'pendiente' => 'pending',
        'confirmada' => 'confirmed',
        'cancelada' => 'cancelled',
    ];

    public function reservas(Request $request)
    {
        // Si no se envía una fecha explícitamente, forzamos siempre la fecha de hoy
        if (!$request->has('dateFilter')) {
            $request->merge(['dateFilter' => Carbon::today()->format('Y-m-d')]);
        }

        $query = Reserva::with('cancha');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('cliente_nombre', 'like', "%{$search}%")
                  ->orWhere('cliente_email', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%")
                  ->orWhereHas('cancha', function($q) use ($search) {
                      $q->where('nombre', 'like', "%{$search}%");
                  });
            });
        }

        if ($date = $request->input('dateFilter')) {
            $query->whereDate('fecha', Carbon::parse($date));
        }

        if ($court = $request->input('courtFilter')) {
            if ($court !== 'Todas') {
                $query->whereHas('cancha', function($q) use ($court) {
                    $q->where('nombre', $court);
                });
            }
        }

        if ($status = $request->input('statusFilter')) {
            if ($status !== 'all') {
                $estado = array_search($status, self::ESTADO_A_STATUS);
                if ($estado !== false) {
                    $query->where('estado', $estado);
                }
            }
        }

        $reservas = $query->orderByDesc('fecha')
            ->orderBy('hora_inicio')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($reserva) {
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

        $stats = [
            'todayCount' => Reserva::whereDate('fecha', Carbon::today())->count(),
            'pendingCount' => Reserva::where('estado', 'pendiente')->count(),
            'confirmedCount' => Reserva::where('estado', 'confirmada')->count(),
            'confirmedRevenue' => (float) Reserva::where('estado', 'confirmada')
                                    ->join('canchas', 'reservas.cancha_id', '=', 'canchas.id')
                                    ->sum('canchas.precio_hora'),
        ];

        return Inertia::render('AdminPage', [
            'reservas' => $reservas,
            'serverStats' => $stats,
            'filters' => $request->only(['search', 'dateFilter', 'courtFilter', 'statusFilter']),
        ]);
    }
}