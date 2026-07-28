<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservaRequest;
use App\Mail\ReservaConfirmada;
use App\Models\Reserva;
use App\Services\CanchaService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

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

        $correoEnviado = $this->enviarConfirmacion($reserva);

        return back()->with([
            'reserva_codigo' => $reserva->codigo,
            'reserva_correo_enviado' => $correoEnviado,
        ]);
    }

    /**
     * La reserva ya está pagada y guardada, así que un fallo de SMTP no debe
     * romper la respuesta: se registra y el usuario igual ve su código.
     */
    private function enviarConfirmacion(Reserva $reserva): bool
    {
        try {
            Mail::to($reserva->cliente_email)->send(
                new ReservaConfirmada($reserva->load('cancha'))
            );

            return true;
        } catch (Throwable $e) {
            Log::error('No se pudo enviar el correo de confirmación de la reserva.', [
                'reserva' => $reserva->codigo,
                'email' => $reserva->cliente_email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}