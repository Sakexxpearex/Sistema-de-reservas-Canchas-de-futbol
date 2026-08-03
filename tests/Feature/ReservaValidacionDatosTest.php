<?php

namespace Tests\Feature;

use App\Models\Cancha;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ReservaValidacionDatosTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

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

    private function datos(Cancha $cancha, array $sobrescribir = []): array
    {
        return [
            'cancha_id' => $cancha->id,
            'fecha' => now()->addDay()->format('Y-m-d'),
            'hora_inicio' => '20:00',
            'cliente_nombre' => 'Bastián Pérez',
            'cliente_email' => 'cliente@example.com',
            'cliente_telefono' => '+56 9 1111 2222',
            'metodo_pago' => 'visa',
            ...$sobrescribir,
        ];
    }

    /** @return list<array{string}> */
    public static function nombresInvalidos(): array
    {
        return [
            'con números' => ['Carlos 123'],
            'con símbolos' => ['Carlos <script>'],
            'con guion bajo' => ['carlos_garcia'],
            'demasiado corto' => ['Ca'],
            'vacío' => [''],
            'solo espacios' => ['   '],
            'demasiado largo' => [str_repeat('a', 61)],
        ];
    }

    /** @return list<array{string}> */
    public static function telefonosInvalidos(): array
    {
        return [
            'con letras' => ['+56 9 abcd 5678'],
            'muy corto' => ['+56 9 1234 567'],
            'muy largo' => ['+56 9 1234 56789'],
            'sin prefijo' => ['912345678'],
            'fijo' => ['+56 2 1234 5678'],
            'vacío' => [''],
            'texto libre' => ['llámame'],
        ];
    }

    #[DataProvider('nombresInvalidos')]
    public function test_rechaza_nombres_invalidos(string $nombre): void
    {
        $cancha = $this->cancha();

        $this->post('/reservas', $this->datos($cancha, ['cliente_nombre' => $nombre]))
            ->assertSessionHasErrors('cliente_nombre');

        $this->assertDatabaseCount('reservas', 0);
    }

    #[DataProvider('telefonosInvalidos')]
    public function test_rechaza_telefonos_invalidos(string $telefono): void
    {
        $cancha = $this->cancha();

        $this->post('/reservas', $this->datos($cancha, ['cliente_telefono' => $telefono]))
            ->assertSessionHasErrors('cliente_telefono');

        $this->assertDatabaseCount('reservas', 0);
    }

    public function test_rechaza_correos_invalidos_o_demasiado_largos(): void
    {
        $cancha = $this->cancha();

        $this->post('/reservas', $this->datos($cancha, ['cliente_email' => 'no-es-un-correo']))
            ->assertSessionHasErrors('cliente_email');

        $largo = str_repeat('a', 95).'@example.com';
        $this->post('/reservas', $this->datos($cancha, ['cliente_email' => $largo]))
            ->assertSessionHasErrors('cliente_email');

        $this->assertDatabaseCount('reservas', 0);
    }

    public function test_acepta_nombres_con_tildes_apostrofes_y_guiones(): void
    {
        $cancha = $this->cancha();

        $this->post('/reservas', $this->datos($cancha, ['cliente_nombre' => "Ana-María O'Higgins Ñuñez"]))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('reservas', ['cliente_nombre' => "Ana-María O'Higgins Ñuñez"]);
    }

    /** El formulario envía con espacios, pero un cliente antiguo podría no ponerlos. */
    public function test_acepta_el_telefono_con_y_sin_espacios(): void
    {
        foreach (['+56 9 1111 2222', '+56911112222'] as $indice => $telefono) {
            $cancha = $this->cancha();

            $this->post('/reservas', $this->datos($cancha, [
                'cliente_telefono' => $telefono,
                'hora_inicio' => sprintf('%02d:00', 18 + $indice),
            ]))->assertSessionHasNoErrors();

            $this->assertDatabaseHas('reservas', ['cliente_telefono' => $telefono]);
        }
    }
}
