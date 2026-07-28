<?php

// Only the rules used by the auth forms are translated here; every other key
// falls back to the framework's English strings via APP_FALLBACK_LOCALE.
return [
    'required' => 'El campo :attribute es obligatorio.',
    'email' => 'El campo :attribute debe ser una dirección de correo válida.',
    'string' => 'El campo :attribute debe ser texto.',
    'min' => [
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
    ],
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'unique' => 'El :attribute ya está registrado.',

    'attributes' => [
        'email' => 'correo electrónico',
        'password' => 'contraseña',
        'name' => 'nombre',
    ],
];
