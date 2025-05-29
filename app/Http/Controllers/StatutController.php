<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Statut;
use Illuminate\Validation\Rule; // Importez Rule pour la validation unique

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
    public function update(Request $request, $id)
    {
        try {
            // 1. Trouver le statut existant ou échouer (génère 404 si non trouvé)
            $statut = Statut::findOrFail($id);

            // 2. Valider les données entrantes
            $validatedData = $request->validate([
                'libelle' => [
                    'required',
                    'string',
                     // Vérifier l'unicité, mais ignorer l'enregistrement actuel ($id)
                    Rule::unique('statuts', 'libelle')->ignore($id),
                ]
                // Ajoutez d'autres règles de validation si nécessaire
            ]);

            // 3. Mettre à jour les propriétés du modèle
            $statut->libelle = $validatedData['libelle'];

            // 4. Sauvegarder les modifications dans la base de données
            $statut->save();

            // 5. Retourner une réponse (souvent l'objet mis à jour)
            return response()->json($statut, 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Statut non trouvé pour la mise à jour'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation échouée', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Autres erreurs potentielles (ex: erreur base de données lors du save)
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
