<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('canchas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo');
            $table->string('location')->nullable();
            $table->string('surface')->nullable();
            $table->string('capacity')->nullable();
            $table->boolean('lighting')->default(false);
            $table->boolean('covered')->default(false);
            $table->boolean('premium')->default(false);
            $table->boolean('parking')->default(false);
            $table->decimal('precio_hora', 10, 2);
            $table->time('hora_apertura');
            $table->time('hora_cierre');
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('canchas');
    }
};