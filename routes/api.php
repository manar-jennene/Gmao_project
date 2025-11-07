<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StatutController;
use App\Http\Controllers\PrioriteController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\InterventionUpdateController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\InterventionController;
use App\Http\Controllers\MaintenancepreventiveController;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\StockController;




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
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
//users
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/users', [UserController::class, 'index']); // Liste des utilisateurs
Route::post('/users/{id}/update-profile', [UserController::class, 'updateProfile']);

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
    //categorie
    Route::get('/categorie', [StatutController::class, 'getcategorie']);
    Route::post('/addcategorie', [StatutController::class, 'addCategorie']);
    Route::delete('/deletecategorie/{id}', [StatutController::class, 'destroyCategorie']);
    Route::put('/updatecategorie/{id}', [StatutController::class, 'updateCategorie']);




});

Route::prefix('equipement')->group(function () {
    Route::get('/getequipements', [EquipementController::class, 'index']);
    Route::post('/addequipements', [EquipementController::class, 'store']);
    Route::delete('/deleteequipeMet/{id}', [EquipementController::class, 'destroy']);
    Route::post('/updateequipement/{id}', [EquipementController::class, 'update']);
});
//Stock

Route::prefix('stock')->group(function () {
     // ==================== STOCK ====================
     Route::get('/getstock', [StockController::class, 'indexStock']);          // Liste tous les stocks
     Route::post('/add', [StockController::class, 'addStock']);        // Ajouter un stock
     Route::put('/update/{id}', [StockController::class, 'updateStock']); // Mettre à jour un stock
     Route::delete('/delete/{id}', [StockController::class, 'deleteStock']);
     Route::get('/{id}/historique', [StockController::class,'getHistoriqueSorties']);
     Route::get('/{stockId}/forecast', [StockController::class, 'forecast']);
     Route::get('/forecastAll', [StockController::class, 'forecastAll']);




     // Supprimer un stock

     // ==================== DEMANDE STOCK ====================
     Route::get('/demande', [StockController::class, 'indexDemande']);       // Liste toutes les demandes
     Route::post('/demande/add', [StockController::class, 'addDemande']);    // Ajouter une demande
     Route::put('/demande/update/{id}', [StockController::class, 'updateDemande']); // Mettre à jour une demande
     Route::delete('/demande/delete/{id}', [StockController::class, 'deleteDemande']); // Supprimer une demande
     Route::put('/demande/validedemande/{id}', [StockController::class, 'valider']);
     // Mettre à jour une demande
     Route::put('/demande/rejeter/{id}', [StockController::class, 'rejeterDemande']);



});

//Intervention
Route::prefix('intervention')->group(function () {
    Route::get('/getintervention', [InterventionController::class, 'index']);
    Route::post('/addintervention', [InterventionController::class, 'store']);
    Route::delete('/deleteint/{id}', [InterventionController::class, 'destroy']);
    Route::post('/updateinter/{id}', [InterventionController::class, 'update']);
    Route::get('/interventionbyId/{id}', [InterventionController::class, 'show']);

});


//UpdateIntervention
Route::prefix('updateintervention')->group(function () {
    Route::post('/intervention/{id}/assign', [InterventionUpdateController::class, 'assignResponsable']);

});



Route::prefix('commentaire')->group(function () {
    Route::post('/addcommentaires', [CommentaireController::class, 'store']);
    Route::get('/getcommentaires/{ticketId}', [CommentaireController::class, 'getByTicket']);
    Route::put('/update/{id}', [CommentaireController::class, 'update']);
    Route::delete('/delete/{id}', [CommentaireController::class, 'destroy']);
});


Route::prefix('maintenance')->group(function () {
    Route::post('/addmaintenance', [MaintenancepreventiveController::class, 'store']);
    Route::get('/get', [MaintenancepreventiveController::class, 'index']);
    Route::put('/update/{id}', [MaintenancepreventiveController::class, 'update']);
    Route::delete('/delete/{id}', [MaintenancepreventiveController::class, 'destroy']);
    Route::post('/calculateNextOccurrence', [MaintenancepreventiveController::class, 'getNextOccurrence']);
    Route::get('/plan-maintenance/{id}', [MaintenancepreventiveController::class, 'getById']);
    Route::get('/triggertypes', [MaintenancepreventiveController::class, 'getTriggerTypes']);
    Route::get('/getPeriodicite', [MaintenancepreventiveController::class, 'getPeriodicite']);
    Route::get('/dashboard', [DashboardController::class, 'getStats']);
    Route::get('/statuser', [DashboardController::class, 'getUserStats']);



});

