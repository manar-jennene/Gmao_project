<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StatutController;
use App\Http\Controllers\PrioriteController;
use App\Http\Controllers\EquipementController;


use App\Http\Controllers\InterventionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
//users
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/users', [UserController::class, 'index']); // Liste des utilisateurs
//role
Route::get('/getroles', [RoleController::class, 'index']); // Afficher tous les rôles
Route::post('/addroles', [RoleController::class, 'store']); // Ajouter un rôle


Route::prefix('parametrage')->group(function () {
    Route::get('/statuts', [StatutController::class, 'index']);
    Route::post('/addstatuts', [StatutController::class, 'store']);
    Route::delete('/deletestatuts/{id}', [StatutController::class, 'destroy']);
    Route::put('/updatestatuts/{id}', [StatutController::class, 'update']);
    Route::get('/priorite', [PrioriteController::class, 'index']);
    Route::post('/addpriorite', [PrioriteController::class, 'store']);
    Route::delete('/deletepriorite/{id}', [PrioriteController::class, 'destroy']);
    Route::put('/updatepriorite/{id}', [PrioriteController::class, 'update']);



});

Route::prefix('equipement')->group(function () {
    Route::get('/getequipements', [EquipementController::class, 'index']);
    Route::post('/addequipements', [EquipementController::class, 'store']);
    Route::delete('/deleteequipeMet/{id}', [EquipementController::class, 'destroy']);
    Route::post('/updateequipement/{id}', [EquipementController::class, 'update']);
});

//Intervention
Route::prefix('intervention')->group(function () {
    Route::get('/getintervention', [InterventionController::class, 'index']);
    Route::post('/addintervention', [InterventionController::class, 'store']);
    Route::delete('/deleteint/{id}', [InterventionController::class, 'destroy']);
    Route::post('/updateinter/{id}', [InterventionController::class, 'update']);
    Route::get('/interventionbyId/{id}', [InterventionController::class, 'show']);

});
