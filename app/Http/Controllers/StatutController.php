<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Statut;
use Illuminate\Validation\Rule; // Importez Rule pour la validation unique
use App\Models\Intervention;
use App\Models\Categorie;


class StatutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $status = Statut::all();
            return response()->json($status, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statuts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getcategorie()
    {
        try {
            $categorie = Categorie::all();
            return response()->json($categorie, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des categorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'libelle' => 'required|string'
            ]);

            // Création du statut
            $status = Statut::create([
                'libelle' => $request->libelle  // Utilise 'libelle' au lieu de 'role'
            ]);

            return response()->json(['message' => 'Statut ajouté avec succès', 'libelle' => $status->libelle], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'ajout du statut', 'message' => $e->getMessage()], 500);
        }
    }

    public function addCategorie(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);
    
            // Création de la catégorie
            $categorie = Categorie::create([
                'nom' => $request->nom,
                'description' => $request->description
            ]);
    
            return response()->json([
                'message' => 'Catégorie ajoutée avec succès',
                'categorie' => $categorie
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'ajout de la catégorie',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function updateCategorie(Request $request, $id)
{
    try {
        // Validation
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        // Recherche de la catégorie
        $categorie = Categorie::findOrFail($id);

        // Mise à jour
        $categorie->update([
            'nom' => $request->nom,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès',
            'categorie' => $categorie
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erreur lors de la mise à jour de la catégorie',
            'message' => $e->getMessage()
        ], 500);
    }
}
public function destroyCategorie($id)
{
    try {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erreur lors de la suppression de la catégorie',
            'message' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $interventionId)
    {
        try {
            $intervention = Intervention::findOrFail($interventionId);

            $validatedData = $request->validate([
                'id' => 'required|exists:statuts,id',
                // 'libelle' => 'required|string', // si besoin
            ]);

            $intervention->statut_id = $validatedData['id'];
            $intervention->save();

            return response()->json($intervention->statut, 200); // retourne le nouveau statut
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Intervention non trouvée'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation échouée', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour du statut', 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            // 1. Trouver le statut existant ou échouer (génère 404 si non trouvé)
            $statut = Statut::findOrFail($id);

            // 2. Supprimer l'enregistrement
            $statut->delete();



            // Option 2: Un message de succès (peut être utile pour le front-end)
            return response()->json(['message' => 'Statut supprimé avec succès'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Statut non trouvé pour la suppression'], 404);
        } catch (\Exception $e) {
            // Gérer les erreurs potentielles (ex: contraintes de clé étrangère)
            // Vous pourriez vouloir vérifier spécifiquement les erreurs de contrainte FK
             if (str_contains($e->getMessage(), 'Integrity constraint violation')) {
                 return response()->json(['error' => 'Impossible de supprimer ce statut car il est utilisé ailleurs.'], 409); // 409 Conflict
             }
            return response()->json(['error' => 'Erreur lors de la suppression du statut', 'message' => $e->getMessage()], 500);
        }
    }

}
