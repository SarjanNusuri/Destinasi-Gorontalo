<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\DestinationDetailController;
use App\Http\Controllers\HotelDetailController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\BudayaController;
use App\Http\Controllers\Admin\Dashboard;

// Public
Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('/destination/{id}', [DestinationDetailController::class, 'show'])->name('destination.show');
Route::get('/hotel/{id}', [HotelDetailController::class, 'show'])->name('hotel.show');
Route::get('/map', [MapController::class, 'index'])->name('map');

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

// Admin
Route::prefix('admin')->group(function () {
    Route::get('/', Dashboard::class)->name('admin.dashboard');

    Route::get('/destinations', [DestinationController::class, 'index'])->name('admin.destinations.index');
    Route::get('/destinations/create', [DestinationController::class, 'create'])->name('admin.destinations.create');
    Route::post('/destinations', [DestinationController::class, 'store'])->name('admin.destinations.store');
    Route::get('/destinations/{id}/edit', [DestinationController::class, 'edit'])->name('admin.destinations.edit');
    Route::put('/destinations/{id}', [DestinationController::class, 'update'])->name('admin.destinations.update');
    Route::delete('/destinations/{id}', [DestinationController::class, 'destroy'])->name('admin.destinations.destroy');

    Route::get('/hotels', [HotelController::class, 'index'])->name('admin.hotels.index');
    Route::get('/hotels/create', [HotelController::class, 'create'])->name('admin.hotels.create');
    Route::post('/hotels', [HotelController::class, 'store'])->name('admin.hotels.store');
    Route::get('/hotels/{id}/edit', [HotelController::class, 'edit'])->name('admin.hotels.edit');
    Route::put('/hotels/{id}', [HotelController::class, 'update'])->name('admin.hotels.update');
    Route::delete('/hotels/{id}', [HotelController::class, 'destroy'])->name('admin.hotels.destroy');

    Route::get('/budaya', [BudayaController::class, 'index'])->name('admin.budaya.index');
    Route::get('/budaya/create', [BudayaController::class, 'create'])->name('admin.budaya.create');
    Route::post('/budaya', [BudayaController::class, 'store'])->name('admin.budaya.store');
    Route::get('/budaya/{id}/edit', [BudayaController::class, 'edit'])->name('admin.budaya.edit');
    Route::put('/budaya/{id}', [BudayaController::class, 'update'])->name('admin.budaya.update');
    Route::delete('/budaya/{id}', [BudayaController::class, 'destroy'])->name('admin.budaya.destroy');
});
