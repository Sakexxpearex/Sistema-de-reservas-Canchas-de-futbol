<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservaRequest;
use App\Mail\ReservaConfirmada;
use App\Mail\ReservaPendientePago;
use App\Models\Cancha;
use App\Models\Pago;
use App\Models\Reserva;
use App\Services\CanchaService;
use Illuminate\Support\Facades\DB;
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

        $cancha = Cancha::findOrFail($datos['cancha_id']);
        $horaFin = $this->canchaService->calcularHoraFin($datos['hora_inicio']);

        // Con tarjeta la pasarela simulada cobra al instante; en efectivo o
        // transferencia el cobro ocurre fuera del sistema, así que la reserva
        // queda pendiente. En ambos casos el horario se ocupa: la disponibilidad
        // solo libera los bloques de reservas canceladas.
        $pagada = Pago::esTarjeta($datos['metodo_pago']);

        $reserva = DB::transaction(function () use ($datos, $cancha, $horaFin, $pagada) {
            $reserva = Reserva::create([
                'cancha_id' => $cancha->id,
                'cliente_nombre' => $datos['cliente_nombre'],
                'cliente_email' => $datos['cliente_email'],
                'cliente_telefono' => $datos['cliente_telefono'],
                'fecha' => $datos['fecha'],
                'hora_inicio' => $datos['hora_inicio'],
                'hora_fin' => $horaFin,
                'estado' => $pagada ? 'confirmada' : 'pendiente',
            ]);

            Pago::create([
                'reserva_id' => $reserva->id,
                'monto' => $cancha->precio_hora,
                'metodo' => $datos['metodo_pago'],
                'estado' => $pagada ? 'pagado' : 'pendiente',
            ]);

            return $reserva;
        });

        $correoEnviado = $this->enviarCorreo($reserva, $datos['metodo_pago'], $pagada);

        return back()->with([
            'reserva_codigo' => $reserva->codigo,
            'reserva_correo_enviado' => $correoEnviado,
            'reserva_estado' => $reserva->estado,
            'reserva_metodo_pago' => $datos['metodo_pago'],
        ]);
    }

    /**
     * La reserva ya está guardada, así que un fallo de SMTP no debe romper la
     * respuesta: se registra y el usuario igual ve su código.
     */
    private function enviarCorreo(Reserva $reserva, string $metodo, bool $pagada): bool
    {
        try {
            $reserva->load('cancha');

            Mail::to($reserva->cliente_email)->queue(
                $pagada
                    ? new ReservaConfirmada($reserva)
                    : new ReservaPendientePago($reserva, $metodo)
            );

            return true;
        } catch (Throwable $e) {
            Log::error('No se pudo enviar el correo de la reserva.', [
                'reserva' => $reserva->codigo,
                'email' => $reserva->cliente_email,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
