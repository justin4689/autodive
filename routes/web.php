<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

// Public car listings
Route::resource('cars', CarController::class)->only(['index', 'show']);

// Authenticated listing management
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('cars', CarController::class)->only(['create', 'store', 'edit', 'update', 'destroy']);

    Route::delete('cars/{car}/images/{image}', [CarController::class, 'destroyImage'])
        ->name('cars.images.destroy');
});

require __DIR__.'/settings.php';
