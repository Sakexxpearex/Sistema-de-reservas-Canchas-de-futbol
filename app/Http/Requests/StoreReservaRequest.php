<?php

namespace App\Http\Requests;

use App\Models\Pago;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservaRequest extends FormRequest
{
    /** Letras (con tildes), espacios y los signos que sí aparecen en nombres reales. */
    private const NOMBRE_REGEX = '/^[\p{L}\s\'’-]+$/u';

    /** Móvil chileno: +56 9 XXXX XXXX, con o sin espacios. */
    private const TELEFONO_REGEX = '/^\+56\s?9\s?\d{4}\s?\d{4}$/';

    public function authorize(): bool
    {
        return true;
    }

    /**
     * El formulario ya filtra lo que se puede escribir, pero eso es solo comodidad:
     * las reglas de verdad son estas, porque el POST se puede armar a mano.
     */
    public function rules(): array
    {
        return [
            'cancha_id' => ['required', 'integer', 'exists:canchas,id'],
            'fecha' => ['required', 'date'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'cliente_nombre' => ['required', 'string', 'min:3', 'max:60', 'regex:'.self::NOMBRE_REGEX],
            'cliente_email' => ['required', 'email', 'max:100'],
            'cliente_telefono' => ['required', 'string', 'regex:'.self::TELEFONO_REGEX],
            'metodo_pago' => ['required', Rule::in(Pago::metodos())],
        ];
    }

    public function messages(): array
    {
        return [
            'cancha_id.exists' => 'La cancha seleccionada no existe.',
            'hora_inicio.date_format' => 'El horario debe tener formato HH:MM.',
            'cliente_nombre.min' => 'El nombre debe tener al menos 3 letras.',
            'cliente_nombre.max' => 'El nombre no puede superar los 60 caracteres.',
            'cliente_nombre.regex' => 'El nombre solo puede contener letras.',
            'cliente_email.email' => 'Ingresa un correo válido.',
            'cliente_email.max' => 'El correo no puede superar los 100 caracteres.',
            'cliente_telefono.regex' => 'El teléfono debe ser un móvil chileno: +56 9 XXXX XXXX.',
            'metodo_pago.in' => 'El método de pago seleccionado no es válido.',
        ];
    }
}