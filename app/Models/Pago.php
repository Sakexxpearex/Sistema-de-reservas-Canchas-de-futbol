<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    /** Se cobran al instante mediante la pasarela simulada. */
    public const METODOS_TARJETA = ['visa', 'mastercard', 'debit'];

    /** Se cobran en el recinto o por transferencia, así que quedan por cobrar. */
    public const METODOS_PRESENCIALES = ['efectivo', 'transferencia'];

    protected $fillable = [
        'reserva_id',
        'monto',
        'metodo',
        'estado',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    public static function metodos(): array
    {
        return [...self::METODOS_TARJETA, ...self::METODOS_PRESENCIALES];
    }

    public static function esTarjeta(string $metodo): bool
    {
        return in_array($metodo, self::METODOS_TARJETA, true);
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }
}
