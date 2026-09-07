<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\BudayaController;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::get('/destination/{id}', function ($id) {
    return inertia('DestinationDetail', ['destinationId' => $id]);
})->name('destination.show');

Route::get('/map', function () {
    return inertia('Map');
})->name('map');

Route::get('/about', function () {
    return inertia('Admin/Index');
});

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

// Admin
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return inertia('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/destinations', [DestinationController::class, 'index'])->name('admin.destinations.index');
    Route::get('/destinations/create', [DestinationController::class, 'create'])->name('admin.destinations.create');
    Route::get('/destinations/{id}/edit', [DestinationController::class, 'edit'])->name('admin.destinations.edit');

    Route::get('/budaya', [BudayaController::class, 'index'])->name('admin.budaya.index');
    Route::get('/budaya/create', [BudayaController::class, 'create'])->name('admin.budaya.create');
    Route::get('/budaya/{id}/edit', [BudayaController::class, 'edit'])->name('admin.budaya.edit');
});
