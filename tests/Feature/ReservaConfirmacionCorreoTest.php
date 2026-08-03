<?php

namespace Tests\Feature;

use App\Mail\ReservaConfirmada;
use App\Models\Cancha;
use App\Models\Reserva;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReservaConfirmacionCorreoTest extends TestCase
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

    private function datosReserva(Cancha $cancha): array
    {
        return [
            'cancha_id' => $cancha->id,
            'fecha' => now()->addDay()->format('Y-m-d'),
            'hora_inicio' => '20:00',
            'cliente_nombre' => 'Bastián Pérez',
            'cliente_email' => 'cliente@example.com',
            'cliente_telefono' => '+56911112222',
            'metodo_pago' => 'visa',
        ];
    }

    public function test_se_envia_el_correo_de_confirmacion_al_cliente(): void
    {
        Mail::fake();
        $cancha = $this->cancha();

        $response = $this->post('/reservas', $this->datosReserva($cancha));

        $response->assertSessionHas('reserva_codigo');
        $response->assertSessionHas('reserva_correo_enviado', true);

        $reserva = Reserva::firstOrFail();

        Mail::assertQueued(ReservaConfirmada::class, function (ReservaConfirmada $mail) use ($reserva) {
            return $mail->hasTo('cliente@example.com')
                && $mail->reserva->codigo === $reserva->codigo;
        });
    }

    public function test_el_correo_contiene_los_datos_de_la_reserva(): void
    {
        $cancha = $this->cancha();
        $this->post('/reservas', $this->datosReserva($cancha));

        $reserva = Reserva::with('cancha')->firstOrFail();
        $html = (new ReservaConfirmada($reserva))->render();

        $this->assertStringContainsString($reserva->codigo, $html);
        $this->assertStringContainsString('Cancha Norte', $html);
        $this->assertStringContainsString('Sede Centro', $html);
        $this->assertStringContainsString('20:00 - 21:00', $html);
        $this->assertStringContainsString('Bastián Pérez', $html);
        $this->assertStringContainsString('cliente@example.com', $html);
        $this->assertStringContainsString('+56911112222', $html);
        $this->assertStringContainsString('25.000', $html);
    }

    public function test_la_reserva_se_guarda_aunque_falle_el_envio_del_correo(): void
    {
        $cancha = $this->cancha();

        Mail::shouldReceive('to')->once()->andThrow(new \RuntimeException('SMTP caído'));

        $response = $this->post('/reservas', $this->datosReserva($cancha));

        $response->assertSessionHas('reserva_correo_enviado', false);
        $this->assertDatabaseHas('reservas', ['cliente_email' => 'cliente@example.com']);
    }
}
