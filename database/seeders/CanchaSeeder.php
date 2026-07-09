<?php

namespace Database\Seeders;

use App\Models\Cancha;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CanchaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cancha::create([
            'nombre' => 'Cancha 1',
            'tipo' => '5v5',
            'precio_hora' => 15000,
            'hora_apertura' => '15:00',
            'hora_cierre' => '23:00',
        ]);

        Cancha::create([
            'nombre' => 'Cancha 2',
            'tipo' => '5v5',
            'precio_hora' => 15000,
            'hora_apertura' => '15:00',
            'hora_cierre' => '23:00',
        ]);
    }
}
