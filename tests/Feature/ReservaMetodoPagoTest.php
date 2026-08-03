<?php

namespace Tests\Feature;

use App\Mail\ReservaConfirmada;
use App\Mail\ReservaPendientePago;
use App\Models\Cancha;
use App\Models\Reserva;
use App\Services\CanchaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReservaMetodoPagoTest extends TestCase
{
    use RefreshDatabase;

    private function cancha(): Cancha
    {
        return Cancha::create([
            'nombre' => 'Cancha Norte',
            'tipo' => 'futbol-7',
            'location' => 'Sede Centro',
            'surface' => 'Sintética',
            'capacity' => '14 jugadores',
            'lighting' => true,
            'covered' => false,
            'premium' => false,
            'parking' => true,
            'precio_hora' => 25000,
            'hora_apertura' => '08:00',
            'hora_cierre' => '23:00',
            'activa' => true,
        ]);
    }

    private function datosReserva(Cancha $cancha, string $metodoPago): array
    {
        return [
            'cancha_id' => $cancha->id,
            'fecha' => now()->addDay()->format('Y-m-d'),
            'hora_inicio' => '20:00',
            'cliente_nombre' => 'Bastián Pérez',
            'cliente_email' => 'cliente@example.com',
            'cliente_telefono' => '+56911112222',
            'metodo_pago' => $metodoPago,
        ];
    }

    /** @return list<array{string}> */
    public static function metodosTarjeta(): array
    {
        return [['visa'], ['mastercard'], ['debit']];
    }

    /** @return list<array{string}> */
    public static function metodosPresenciales(): array
    {
        return [['efectivo'], ['transferencia']];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('metodosTarjeta')]
    public function test_pagar_con_tarjeta_deja_la_reserva_confirmada(string $metodo): void
    {
        Mail::fake();
        $cancha = $this->cancha();

        $response = $this->post('/reservas', $this->datosReserva($cancha, $metodo));

        $response->assertSessionHas('reserva_estado', 'confirmada');
        $this->assertDatabaseHas('reservas', ['estado' => 'confirmada']);
        $this->assertDatabaseHas('pagos', [
            'reserva_id' => Reserva::firstOrFail()->id,
            'metodo' => $metodo,
            'estado' => 'pagado',
            'monto' => '25000.00',
        ]);

        Mail::assertQueued(ReservaConfirmada::class);
        Mail::assertNotQueued(ReservaPendientePago::class);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('metodosPresenciales')]
    public function test_efectivo_y_transferencia_dejan_la_reserva_pendiente(string $metodo): void
    {
        Mail::fake();
        $cancha = $this->cancha();

        $response = $this->post('/reservas', $this->datosReserva($cancha, $metodo));

        $response->assertSessionHas('reserva_estado', 'pendiente');
        $response->assertSessionHas('reserva_metodo_pago', $metodo);
        $this->assertDatabaseHas('reservas', ['estado' => 'pendiente']);
        $this->assertDatabaseHas('pagos', [
            'reserva_id' => Reserva::firstOrFail()->id,
            'metodo' => $metodo,
            'estado' => 'pendiente',
            'monto' => '25000.00',
        ]);

        Mail::assertQueued(ReservaPendientePago::class, fn (ReservaPendientePago $mail) => $mail->metodo === $metodo);
        Mail::assertNotQueued(ReservaConfirmada::class);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('metodosPresenciales')]
    public function test_una_reserva_pendiente_ocupa_el_horario(string $metodo): void
    {
        Mail::fake();
        $cancha = $this->cancha();
        $datos = $this->datosReserva($cancha, $metodo);

        $this->post('/reservas', $datos);

        $this->assertFalse(
            app(CanchaService::class)->slotDisponible($cancha->id, $datos['fecha'], '20:00')
        );

        $slots = app(CanchaService::class)
            ->obtenerCanchasConDisponibilidad(now()->addDay())
            ->firstOrFail()['slots'];

        $this->assertSame('occupied', $slots->firstWhere('time', '20:00 - 21:00')['status']);

        // Y el horario ya no se puede volver a tomar.
        $this->post('/reservas', $datos)->assertSessionHasErrors('hora_inicio');
        $this->assertSame(1, Reserva::count());
    }

    public function test_el_metodo_de_pago_es_obligatorio_y_debe_ser_valido(): void
    {
        $cancha = $this->cancha();

        $this->post('/reservas', array_diff_key($this->datosReserva($cancha, 'visa'), ['metodo_pago' => null]))
            ->assertSessionHasErrors('metodo_pago');

        $this->post('/reservas', $this->datosReserva($cancha, 'bitcoin'))
            ->assertSessionHasErrors('metodo_pago');

        $this->assertDatabaseCount('reservas', 0);
    }

    public function test_el_correo_pendiente_indica_el_total_por_pagar(): void
    {
        Mail::fake();
        $cancha = $this->cancha();

        $this->post('/reservas', $this->datosReserva($cancha, 'transferencia'));

        $reserva = Reserva::with('cancha')->firstOrFail();
        $html = (new ReservaPendientePago($reserva, 'transferencia'))->render();

        $this->assertStringContainsString('Reserva pendiente de pago', $html);
        $this->assertStringContainsString('Total a pagar', $html);
        $this->assertStringContainsString('Transferencia bancaria', $html);
        $this->assertStringContainsString($reserva->codigo, $html);
        $this->assertStringContainsString('25.000', $html);
        $this->assertStringNotContainsString('Total pagado', $html);
    }
}
