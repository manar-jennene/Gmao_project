<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\DemandeStock;


class StockController extends Controller
{
    // ==================== STOCK ====================

    public function indexStock()
    {
        $stocks = Stock::with(['categorie', 'fournisseur'])->get();
        return response()->json($stocks);
    }

    public function addStock(Request $request)
    {
        // Validation des données
        $request->validate([
            'nom' => 'required|string',
            'reference' => 'required|string|unique:stocks,reference',
            'quantite_disponible' => 'required|integer|min:0',
            'seuil_minimum' => 'required|integer|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'fournisseur_id' => 'required|exists:users,id',
        ]);
    
        try {
            // Création du stock
            $stock = Stock::create($request->all());
    
            // Retourner un message de succès
            return response()->json([
                'message' => 'Stock ajouté avec succès !',
                'stock' => $stock
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'ajout du stock.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function updateStock(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->all());
        return response()->json($stock);
    }

    public function deleteStock($id)
    {
        $stock = Stock::findOrFail($id);
        $stock->delete();
        return response()->json(['message' => 'Stock supprimé avec succès']);
    }


    // ==================== DEMANDE STOCK ====================

    public function indexDemande()
    {
        $demandes = DemandeStock::with(['piece', 'demandeur', 'statut'])->get();
        return response()->json($demandes);
    }

    // public function addDemande(Request $request)
    // {
    //     $request->validate([
    //         'piece_id' => 'required|exists:stocks,id',
    //         'quantite_demandee' => 'required|integer|min:1',
    //         'demandeur_id' => 'required|exists:users,id',
    //         'statut_id' => 'required|exists:statuts,id',
    //         'date_demande' => 'required|date',
    //     ]);

    //     $demande = DemandeStock::create($request->all());

    //     return response()->json($demande, 201);
    // }
    public function addDemande(Request $request)
    {
        $request->validate([
            'piece_id' => 'required|exists:stocks,id',
            'quantite_demandee' => 'required|integer|min:1',
            'demandeur_id' => 'required|exists:users,id',
        ]);
    
        $stock = Stock::findOrFail($request->piece_id);
    
        if ($stock->quantite_disponible < $request->quantite_demandee) {
            return response()->json([
                'message' => 'Stock insuffisant. Disponible: ' . $stock->quantite_disponible
            ], 400);
        }
    
        // Déduire la quantité
        $stock->quantite_disponible -= $request->quantite_demandee;
        $stock->save();
    
        $demande = DemandeStock::create([
            'piece_id' => $stock->id,
            'quantite_demandee' => $request->quantite_demandee,
            'demandeur_id' => $request->demandeur_id,
            'statut_id' => 1,
            'date_demande' => now(),
        ]);
    
        return response()->json($demande, 201);
    }
    
    public function updateDemande(Request $request, $id)
    {
        $demande = DemandeStock::findOrFail($id);
        $demande->update($request->all());
        return response()->json($demande);
    }

    public function deleteDemande($id)
    {
        $demande = DemandeStock::findOrFail($id);
        $demande->delete();
        return response()->json(['message' => 'Demande supprimée avec succès']);
    }

    //Valider Demande 

    public function valider($id)
{
    $demande = DemandeStock::findOrFail($id);
    $demande->valide = true;
    $demande->save();

    return response()->json(['message' => 'Demande validée avec succès', 'demande' => $demande]);
}

}


