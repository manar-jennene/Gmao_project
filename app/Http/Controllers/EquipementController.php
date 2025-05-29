<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipement;
use Illuminate\Support\Facades\Storage; // Importer la façade Storage
use Illuminate\Validation\Rule; // Importer Rule pour unique simplifié
class EquipementController extends Controller
{
    public function index()
{
    try {
        $equipements = Equipement::with('statut')->get();
        return response()->json($equipements, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération des équipements.',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function store(Request $request)
{
    //dd($request->hasFile('image')); // <-- AJOUTEZ CECI

    try {
        // Valider TOUTES les données attendues, y compris l'image
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255', // Ajoutez des max lengths si pertinent
            'reference' => 'required|string|max:255|unique:equipements',
            'description' => 'nullable|string',
            'marque' => 'nullable|string|max:255',
            'date_mise_en_service' => 'nullable|date',
            'statut_id' => 'required|exists:statuts,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048' // Gardez nullable si l'image est optionnelle
        ]);

        // Gérer l'upload de l'image SI elle est présente
        if ($request->hasFile('image')) {
            // Stocke le fichier et met à jour la clé 'image' dans $validatedData
            // avec le chemin du fichier stocké.
            $validatedData['image'] = $request->file('image')->store('equipements', 'public');
        } else {
             // Si l'image est nullable et qu'aucune n'a été envoyée,
             // assurez-vous que 'image' n'est pas défini ou est null.
             // Normalement, si 'image' n'est pas dans la requête et est nullable,
             // elle ne sera pas dans $validatedData après validation,
             // mais on peut être explicite :
             // unset($validatedData['image']); // Ou $validatedData['image'] = null;
        }

        // Créer l'équipement avec les données validées (y compris le chemin de l'image si elle existe)
        $equipement = Equipement::create($validatedData);

        // Charger la relation statut pour la réponse si nécessaire
        $equipement->load('statut');

        // Retourner une réponse de succès
        return response()->json([
            'success' => true,
            'message' => 'Équipement ajouté avec succès.', // Message plus clair
            'data' => $equipement
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Gérer spécifiquement les erreurs de validation
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation.',
            'errors' => $e->errors() // Retourne les erreurs de validation détaillées
        ], 422); // Code HTTP 422 pour erreur de validation

    } catch (\Exception $e) {
        // Gérer les autres erreurs
        \Log::error('Erreur lors de la création de l\'équipement: ' . $e->getMessage()); // Log l'erreur pour le débogage serveur
        return response()->json([
            'success' => false,
            'message' => 'Une erreur interne est survenue lors de l\'ajout de l\'équipement.',
            // 'error_details' => $e->getMessage() // Évitez d'exposer les détails de l'erreur en production
        ], 500);
    }
}


public function update(Request $request, $id)
{
    try {
        // 1. Trouver l'équipement existant ou échouer
        $equipement = Equipement::findOrFail($id);

        // 2. Valider les données PRÉSENTES dans la requête
        //    On utilise 'sometimes' pour que les règles ne s'appliquent
        //    que si le champ est effectivement envoyé dans la requête.
        $validatedData = $request->validate([
            'nom' => 'sometimes|required|string|max:255', // Requis SEULEMENT SI 'nom' est envoyé
            'reference' => [
                'sometimes', // Appliquer les règles suivantes SEULEMENT SI 'reference' est envoyé
                'required',
                'string',
                'max:255',
                Rule::unique('equipements')->ignore($equipement->id), // Vérifie l'unicité sauf pour cet équipement lui-même
            ],
            'description' => 'sometimes|nullable|string', // Nullable et validé seulement si présent
            'marque' => 'sometimes|nullable|string|max:255',
            'date_mise_en_service' => 'sometimes|nullable|date',
            'statut_id' => 'sometimes|required|exists:statuts,id', // Requis SEULEMENT SI 'statut_id' est envoyé
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048' // Validé seulement si présent
        ]);

        // 3. Gérer la mise à jour de l'image SI une nouvelle image est envoyée
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe et n'est pas nulle
            if ($equipement->image && Storage::disk('public')->exists($equipement->image)) {
                Storage::disk('public')->delete($equipement->image);
            }
            // Stocker la nouvelle image et ajouter son chemin aux données validées
            $validatedData['image'] = $request->file('image')->store('equipements', 'public');

        } // Si aucune nouvelle image n'est envoyée, $validatedData ne contiendra pas la clé 'image'
          // et l'ancienne image (si elle existe) ne sera pas écrasée lors de l'update.

        // 4. Mettre à jour l'équipement UNIQUEMENT avec les champs validés
        //    qui étaient présents dans la requête.
       // dd($validatedData);

        $equipement->update($validatedData);

        // 5. Recharger les relations si nécessaire pour la réponse
        $equipement->load('statut');

        // 6. Retourner la réponse de succès avec les données mises à jour
        return response()->json([
            'success' => true,
            'message' => 'Équipement mis à jour avec succès.', // Message plus clair
            'data' => $equipement
        ], 200); // Code HTTP 200 OK pour une mise à jour réussie

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Gérer spécifiquement les erreurs de validation
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation.',
            'errors' => $e->errors()
        ], 422); // Code HTTP 422 pour erreur de validation

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Gérer le cas où l'équipement n'est pas trouvé
        return response()->json([
            'success' => false,
            'message' => 'Équipement non trouvé.'
        ], 404); // Code HTTP 404 Not Found

    } catch (\Exception $e) {
        // Gérer les autres erreurs serveur
        \Log::error('Erreur lors de la mise à jour de l\'équipement (ID: ' . $id . '): ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Une erreur interne est survenue lors de la mise à jour de l\'équipement.'
        ], 500); // Code HTTP 500 Internal Server Error
    }
}
public function destroy($id)
{
    try {
        $equipement = Equipement::findOrFail($id);

        // Supprimer l'image si elle existe
        if ($equipement->image && \Storage::disk('public')->exists($equipement->image)) {
            \Storage::disk('public')->delete($equipement->image);
        }

        $equipement->delete();

        return response()->json(['success' => true, 'message' => 'Équipement supprimé avec succès'], 200);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()], 500);
    }
}



}
