<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cancha_id')->constrained('canchas')->onDelete('cascade');
            $table->string('cliente_nombre');
            $table->string('cliente_telefono');
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada'])->default('pendiente');
            $table->string('codigo')->unique();
            $table->timestamps();

            $table->unique(['cancha_id', 'fecha', 'hora_inicio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};