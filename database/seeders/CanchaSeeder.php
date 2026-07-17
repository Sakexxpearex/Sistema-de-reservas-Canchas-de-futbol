<?php

namespace Database\Seeders;

use App\Models\Cancha;
use Illuminate\Database\Seeder;

class CanchaSeeder extends Seeder
{
    public function run(): void
    {
        Cancha::create([
            'nombre' => 'Cancha 1',
            'tipo' => 'futbolito',
            'location' => 'Coronel Centro',
            'surface' => 'Pasto sintético',
            'capacity' => '5 vs 5',
            'lighting' => true,
            'covered' => false,
            'premium' => false,
            'parking' => true,
            'precio_hora' => 15000,
            'hora_apertura' => '09:00',
            'hora_cierre' => '23:59',
            'activa' => true,
        ]);

        Cancha::create([
            'nombre' => 'Cancha 2',
            'tipo' => 'futbolito',
            'location' => 'Coronel Centro',
            'surface' => 'Pasto sintético',
            'capacity' => '7 vs 7',
            'lighting' => true,
            'covered' => true,
            'premium' => true,
            'parking' => true,
            'precio_hora' => 20000,
            'hora_apertura' => '09:00',
            'hora_cierre' => '23:59',
            'activa' => true,
        ]);
    }
}
