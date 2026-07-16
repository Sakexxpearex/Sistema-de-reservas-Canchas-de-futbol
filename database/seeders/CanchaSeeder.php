<?php

namespace Database\Seeders;

use App\Models\Cancha;
use Illuminate\Database\Seeder;

class CanchaSeeder extends Seeder
{
    public function run(): void
    {
        $c1 = Cancha::create([
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

        $c2 = Cancha::create([
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

        // Simulacion para pruebas de disponibilidad de canchas
        $hoy = \Carbon\Carbon::today()->format('Y-m-d');
        $manana = \Carbon\Carbon::tomorrow()->format('Y-m-d');

        \App\Models\Reserva::insert([
            [
                'cancha_id' => $c1->id,
                'cliente_nombre' => 'Juan Pérez',
                'cliente_telefono' => '+56912345678',
                'fecha' => $hoy,
                'hora_inicio' => '10:00:00',
                'hora_fin' => '11:00:00',
                'estado' => 'confirmada',
                'codigo' => 'POT-1001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cancha_id' => $c1->id,
                'cliente_nombre' => 'Pedro Gómez',
                'cliente_telefono' => '+56912345678',
                'fecha' => $hoy,
                'hora_inicio' => '18:00:00',
                'hora_fin' => '19:00:00',
                'estado' => 'confirmada',
                'codigo' => 'POT-1002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cancha_id' => $c2->id,
                'cliente_nombre' => 'María López',
                'cliente_telefono' => '+56912345678',
                'fecha' => $hoy,
                'hora_inicio' => '14:00:00',
                'hora_fin' => '15:00:00',
                'estado' => 'confirmada',
                'codigo' => 'POT-1003',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cancha_id' => $c2->id,
                'cliente_nombre' => 'Carlos Ruiz',
                'cliente_telefono' => '+56912345678',
                'fecha' => $manana,
                'hora_inicio' => '19:00:00',
                'hora_fin' => '20:00:00',
                'estado' => 'confirmada',
                'codigo' => 'POT-1004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cancha_id' => $c1->id,
                'cliente_nombre' => 'Ana Soto',
                'cliente_telefono' => '+56912345678',
                'fecha' => $manana,
                'hora_inicio' => '20:00:00',
                'hora_fin' => '21:00:00',
                'estado' => 'confirmada',
                'codigo' => 'POT-1005',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}