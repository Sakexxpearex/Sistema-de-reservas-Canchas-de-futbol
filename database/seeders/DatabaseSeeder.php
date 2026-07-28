<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // email_verified_at is outside the model's #[Fillable] list, so forceFill it.
        User::firstOrNew(['email' => 'admin@futcanchas.com'])
            ->forceFill([
                'name' => 'Administrador',
                'password' => 'admin123',
                'email_verified_at' => now(),
            ])
            ->save();

        $this->call(CanchaSeeder::class);
        $this->call(ReservaSeeder::class);
    }
}
