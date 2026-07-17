<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cancha_id' => ['required', 'integer', 'exists:canchas,id'],
            'fecha' => ['required', 'date'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'cliente_nombre' => ['required', 'string', 'max:255'],
            'cliente_email' => ['required', 'email'],
            'cliente_telefono' => ['required', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'cancha_id.exists' => 'La cancha seleccionada no existe.',
            'hora_inicio.date_format' => 'El horario debe tener formato HH:MM.',
        ];
    }
}