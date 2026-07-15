<?php

namespace App\Http\Controllers;

use App\Services\CanchaService;
use Carbon\Carbon;
use Inertia\Inertia;

class CanchaController extends Controller
{
    public function __construct(private CanchaService $canchaService)
    {
    }

    public function index(string $fecha = null)
    {
        $fecha = $fecha ? Carbon::parse($fecha) : Carbon::today();

        return Inertia::render('HomePage', [
            'fecha' => $fecha->format('Y-m-d'),
            'courts' => $this->canchaService->obtenerCanchasConDisponibilidad($fecha),
        ]);
    }
}