<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Maintenanceprventive;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MaintenancepreventiveController extends Controller
{
    public function index()
    {
        try {
            $interventions = Maintenanceprventive::with([
                'equipement',
                'responsable',
                'priorite',
                'statut',
            ])->get();

            return response()->json($interventions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des maintenances.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getById($id)
{
    $plan = Maintenanceprventive::with([ 'equipement', 'responsable',  'priorite']) // adapte si nécessaire
                ->find($id);

    if (!$plan) {
        return response()->json(['message' => 'Plan not found'], 404);
    }

    return response()->json($plan);
}

    public function calculateNextOccurrence($dateDebut, $frequence, $uniteFrequence, $joursRepetition = null)
    {
        $startDate = Carbon::parse($dateDebut);
        $now = Carbon::now();
    
        switch ($uniteFrequence) {
            case 'jour':
                return $this->addUnitsUntilAfter($startDate, $frequence, $now, 'day');
    
            case 'mensuel':
                return $this->addUnitsUntilAfter($startDate, $frequence, $now, 'month');
    
            case 'annuelle':
                return $this->addUnitsUntilAfter($startDate, $frequence, $now, 'year');
    
            case 'hebdomadaire':
                return $this->calculateNextWeeklyOccurrence($startDate, $frequence, $joursRepetition, $now);
    
            default:
                return null;
        }
    }
    
    private function addUnitsUntilAfter(Carbon $date, int $units, Carbon $afterDate, string $unitType): Carbon
{
    $dateCopy = $date->copy();

    // Ajouter $units (ex: 2) à chaque itération
    while ($dateCopy->lessThanOrEqualTo($afterDate)) {
        switch ($unitType) {
            case 'day':
                $dateCopy->addDays($units);
                break;
            case 'month':
                $dateCopy->addMonths($units);
                break;
            case 'year':
                $dateCopy->addYears($units);
                break;
            default:
                throw new \InvalidArgumentException("Unité inconnue: $unitType");
        }
    }

    return $dateCopy;
}

public function store(Request $request)
{
    \Log::info('Requête reçue : ', $request->all()); // ✅ ICI

    try {
        $validatedData = $request->validate([
            'trigger_type' => ['required', Rule::in(['date_fixe', 'fermeture_tache', 'api_externe'])],
            'periodicite' => 'required|string',
            'frequence' => 'integer',
            'file' => '',
            'unite_frequence' => 'required|string',
            'joursrepetition' => 'nullable|string',
            'equipement_id' => 'nullable|exists:equipements,id',
            'priorite_id' => 'nullable|exists:priorites,id',
            'statut_id' => 'nullable|exists:statuts,id',
            'reference' => 'nullable|string',
            'description' => 'nullable|string',
            'responsable_id' => 'nullable|exists:users,id',
            'labels' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'occurrences_max' => '',
            'temps_estime_jours' => '',
            'temps_estime_heures' => ''
        ]);

        $maintenance = Maintenanceprventive::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance préventive créée avec succès.',
            'data' => $maintenance
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation.',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Erreur lors de la création de la maintenance préventive : ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur interne lors de l\'ajout de la maintenance préventive.'
        ], 500);
    }
}
public function getTriggerTypes()
{
    $triggers = DB::table('maintenancepreventive')
                  ->select('trigger_type')
                  ->distinct()
                  ->whereNotNull('trigger_type')
                  ->pluck('trigger_type');

    return response()->json($triggers);
}



public function getPeriodicite()
{
    $periodicite = DB::table('maintenancepreventive')
                  ->select('periodicite')
                  ->distinct()
                  ->pluck('periodicite');

    return response()->json($periodicite);
}

    

    public function update(Request $request, $id)
    {
        try {
            $maintenance = Maintenanceprventive::findOrFail($id);

            $validatedData = $request->validate([
                'trigger_type' => ['required', Rule::in(['date_fixe', 'fermeture_tache', 'api_externe'])],
            'periodicite' => 'required|string',
            'frequence' => 'integer',
            'file' => '',
            'unite_frequence' => 'required|string',
            'joursrepetition' => 'nullable|string',
            'equipement_id' => 'nullable|exists:equipements,id',
            'priorite_id' => 'nullable|exists:priorites,id',
            'statut_id' => 'nullable|exists:statuts,id',
            'reference' => 'nullable|string',
            'description' => 'nullable|string',
            'responsable_id' => 'nullable|exists:users,id',
            'labels' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'occurrences_max' => '',
            'temps_estime_jours' => '',
            'temps_estime_heures' => ''
            ]);

            $maintenance->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Maintenance préventive mise à jour avec succès.',
                'data' => $maintenance
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour de la maintenance préventive : ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne lors de la mise à jour.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $intervention = Maintenanceprventive::findOrFail($id);
            $intervention->delete();

            return response()->json([
                'success' => true,
                'message' => 'Maintenance préventive supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.'
            ], 500);
        }
    }
    public function getNextOccurrence(Request $request)
{
    $request->validate([
        'date_debut' => 'required|date',
        'frequence' => 'required|integer',
        'unite_frequence' => 'required|string',
        'joursrepetition' => 'nullable|string'
    ]);

    $joursRepetition = $request->joursrepetition 
        ? json_decode($request->joursrepetition, true)
        : null;

    $next = $this->calculateNextOccurrence(
        $request->date_debut,
        $request->frequence,
        $request->unite_frequence,
        $joursRepetition
    );

    return response()->json([
        'success' => true,
        'prochaine_occurrence' => $next ? $next->toDateString() : null
    ]);
}


private function calculateNextWeeklyOccurrence($startDate, $frequence, $joursRepetition, $now)
{
    // Convertir les jours en format Carbon (lundi = 1, dimanche = 7)
    $joursMapping = [
        'LUN' => Carbon::MONDAY,
        'MAR' => Carbon::TUESDAY,
        'MER' => Carbon::WEDNESDAY,
        'JEU' => Carbon::THURSDAY,
        'VEN' => Carbon::FRIDAY,
        'SAM' => Carbon::SATURDAY,
        'DIM' => Carbon::SUNDAY,
    ];

    // On va chercher la première occurrence possible après "now"
    $date = $startDate->copy();

    while ($date->lessThanOrEqualTo($now)) {
        $date->addWeek(); // avancer d’une semaine jusqu’à passer "now"
    }

    foreach ($joursRepetition as $jour) {
        if (isset($joursMapping[$jour])) {
            $candidate = $date->copy()->next($joursMapping[$jour]);
            if ($candidate->greaterThan($now)) {
                return $candidate;
            }
        }
    }

    // Si aucun jour ne correspond, ajouter x semaines
    return $date->addWeeks($frequence);
}


}  