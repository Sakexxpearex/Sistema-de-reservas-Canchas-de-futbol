<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * `enum` se traduce a un varchar con un CHECK, y ni Postgres ni SQLite
     * permiten reescribir ese CHECK con ->change(). Recrear la columna es la
     * única vía portable; la tabla nunca se ha usado, así que no hay datos que
     * migrar.
     */
    public function up(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropColumn('metodo');
        });

        Schema::table('pagos', function (Blueprint $table) {
            $table->enum('metodo', ['visa', 'mastercard', 'debit', 'efectivo', 'transferencia'])
                  ->after('monto');
        });
    }

    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropColumn('metodo');
        });

        Schema::table('pagos', function (Blueprint $table) {
            $table->enum('metodo', ['visa', 'mastercard', 'debit'])->after('monto');
        });
    }
};
