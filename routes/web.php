<?php


use App\Http\Controllers\ReservaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CanchaController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/booking', function () {
    return Inertia::render('BookingPage');
});


//Canchas
Route::get('/', [CanchaController::class, 'index'])->name('canchas.index');
Route::get('/canchas/{fecha?}', [CanchaController::class, 'index'])->name('canchas.fecha');

//Reservas
Route::post('/reservas', [ReservaController::class, 'store'])->name('reservas.store');

//Admin
Route::middleware('auth')->group(function () {
    Route::get('/admin/reservas', [AdminController::class, 'reservas'])->name('admin.reservas');
});

// Este proyecto no usa el panel genérico de Breeze: el destino tras autenticarse
// es el panel de reservas. Se conserva el nombre 'dashboard' porque el middleware
// 'guest' y los controladores de Breeze lo resuelven por nombre.
Route::get('/dashboard', function () {
    return redirect()->route('admin.reservas');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
