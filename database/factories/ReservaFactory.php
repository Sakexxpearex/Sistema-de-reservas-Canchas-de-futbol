<?php

namespace Database\Factories;

use App\Models\Reserva;
use App\Models\Cancha;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservaFactory extends Factory
{
    protected $model = Reserva::class;

    public function definition(): array
    {
        $horaInicio = $this->faker->numberBetween(9, 22);
        return [
            'cancha_id' => $this->faker->numberBetween(1, 2),
            'cliente_nombre' => $this->faker->name(),
            'cliente_email' => $this->faker->safeEmail(),
            'cliente_telefono' => $this->faker->phoneNumber(),
            'fecha' => $this->faker->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'hora_inicio' => sprintf('%02d:00', $horaInicio),
            'hora_fin' => sprintf('%02d:00', $horaInicio + 1),
            'estado' => $this->faker->randomElement(['pendiente', 'confirmada', 'cancelada']),
            'codigo' => 'POT-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT),
        ];
    }
}
