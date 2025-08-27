<?php

namespace App\Http\Controllers;
use App\Models\Historique;
use Illuminate\Http\Request;
use App\Models\Intervention;
use Illuminate\Support\Facades\Storage; // Importer la façade Storage
use Illuminate\Validation\Rule; // Importer Rule pour unique simplifié
class InterventionController extends Controller
{
    public function index()
    {
        try {
            $interventions = Intervention::with([
                'statut',
                'priorite',
                'equipement',
                'rapporteur',
                'responsable'
            ])->get();

            return response()->json($interventions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des interventions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'description' => 'nullable|string',
                'reference' => 'required|string|unique:interventions',
                'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'date_creation' => 'nullable|date',
                'date_fin' => 'nullable|date|after_or_equal:date_creation',
                'responsable' => 'nullable|exists:users,id',
                // 'rapporteur' retiré
                'telephone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'resume' => 'required',
                'site' => 'required',
                'statut_id' => 'nullable|exists:statuts,id',
                'priorite_id' => 'nullable|exists:priorites,id',
                'equipement_id' => 'nullable|exists:equipements,id'
            ]);

            // Affecter automatiquement le rapporteur connecté
            $validatedData['rapporteur'] = auth()->id();

            // Si un fichier est envoyé
            if ($request->hasFile('file')) {
                $validatedData['file'] = $request->file('file')->store('interventions', 'public');
            }

            $intervention = Intervention::create($validatedData);

            $intervention->load(['statut', 'priorite', 'equipement', 'rapporteur', 'responsable']);

            return response()->json([
                'success' => true,
                'message' => 'Intervention créée avec succès.',
                'data' => $intervention
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de l\'intervention: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne lors de l\'ajout de l\'intervention.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Vérifier que l'utilisateur est connecté
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié.'
                ], 401);
            }
    
            $intervention = Intervention::findOrFail($id);
            $oldValues = $intervention->toArray(); // anciennes valeurs
    
            $validatedData = $request->validate([
                'description' => 'nullable|string',
                'reference' => 'nullable|string|unique:interventions,reference,' . $id,
                'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'date_creation' => 'nullable|date',
                'date_fin' => 'nullable|date|after_or_equal:date_creation',
                'responsable' => 'nullable|exists:users,id',
                'telephone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'resume' => 'required',
                'site' => 'required',
                'statut_id' => 'nullable|exists:statuts,id',
                'priorite_id' => 'nullable|exists:priorites,id',
                'equipement_id' => 'nullable|exists:equipements,id'
            ]);
    
            // Gestion du fichier
            if ($request->hasFile('file')) {
                if ($intervention->file) {
                    Storage::disk('public')->delete($intervention->file);
                }
                $validatedData['file'] = $request->file('file')->store('interventions', 'public');
            }
    
            // Comparer anciennes et nouvelles valeurs
            foreach ($validatedData as $field => $newValue) {
                $oldValue = $oldValues[$field] ?? null;
    
                // Si le champ est un fichier UploadedFile, on le transforme en string (nom du fichier)
                if ($newValue instanceof \Illuminate\Http\UploadedFile) {
                    $newValue = $validatedData['file'] ?? null;
                }
    
                // Enregistrer seulement si changement
                if ($oldValue != $newValue) {
                    Historique::create([
                        'attribut' => $field,
                        'previus' => is_null($oldValue) ? null : (string)$oldValue,
                        'next' => is_null($newValue) ? null : (string)$newValue,
                        'user_id' => auth()->id() ?? 1, // <--- ici
                        'intervention_id' => $intervention->id,
                        'maintenancepreventive_id' => null
                    ]);
                }
            }
    
            // Mise à jour réelle
            $intervention->update($validatedData);
            $intervention->load(['statut', 'priorite', 'equipement', 'rapporteur', 'responsable']);
    
            return response()->json([
                'success' => true,
                'message' => 'Intervention mise à jour avec succès.',
                'data' => $intervention
            ]);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Pour debug : afficher l'erreur exacte
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $intervention = Intervention::findOrFail($id);

            // Supprimer le fichier s’il existe
            if ($intervention->file) {
                Storage::disk('public')->delete($intervention->file);
            }

            $intervention->delete();

            return response()->json([
                'success' => true,
                'message' => 'Intervention supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $intervention = Intervention::with([
                'statut',
                'priorite',
                'equipement',
                'rapporteur',
                'responsable'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $intervention
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Intervention non trouvée.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération de l\'intervention: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne.'
            ], 500);
        }
    }


}
