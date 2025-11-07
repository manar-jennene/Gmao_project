<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\DemandeStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\MouvementStock;  // ✅ ajoute ceci

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
            'statut_id' => 3,
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
    $demande->statut_id = 5; // 5 = Validé
    $demande->save();

    return response()->json([
        'message' => 'Demande validée avec succès',
        'demande' => $demande
    ]);
}


public function rejeterDemande($id)
{
    $demande = DemandeStock::find($id);

    if (!$demande) {
        return response()->json(['message' => 'Demande introuvable'], 404);
    }

    // Mettre à jour le statut à 6 (Rejeté)
    $demande->statut_id = 6;
    $demande->save();

    return response()->json([
        'message' => 'Demande rejetée avec succès',
        'demande' => $demande
    ]);
}


public function getHistoriqueSorties($stockId)
{
    $data = \DB::table('mouvement_stocks')
        ->selectRaw('date_mouvement, SUM(quantite) as total_sortie')
        ->where('stock_id', $stockId)
        ->where('type', 'sortie')
        ->groupBy('date_mouvement')
        ->orderBy('date_mouvement', 'asc')
        ->get();

    return response()->json($data);
}


//forecast → Prévisions sur 30 jours
// alerts → Messages d’alerte si le stock risque de tomber en dessous du seuil.

public function forecast($stockId)
{
    try {
        // 1️⃣ Récupérer les mouvements de stock
        $data = \DB::table('mouvement_stocks')
            ->select('stock_id', 'quantite as y', 'date_mouvement as ds')
            ->where('stock_id', $stockId)
            ->where('type', 'sortie')
            ->orderBy('ds')
            ->get();

        if ($data->count() < 2) {
            Log::warning("Stock $stockId - pas assez de données");
            return response()->json([]);
        }

        $dataArray = $data->map(function ($row) {
            return [
                'ds' => $row->ds,
                'y' => (float) $row->y,
                'stock_id' => $row->stock_id,
            ];
        })->toArray();

        Log::info("Stock $stockId - données pour Python : " . json_encode($dataArray));

        // 2️⃣ Fichier temporaire JSON
        $tempFile = tempnam(sys_get_temp_dir(), 'for');
        file_put_contents($tempFile . '.json', json_encode($dataArray));
        $jsonFile = $tempFile . '.json';

        Log::info("Stock $stockId - fichier temporaire : $jsonFile");

        // 3️⃣ Commande Python
        $python = 'C:\\Users\\manar\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
        $script = base_path("python_scripts\\predict_stock.py");
        $command = "\"$python\" \"$script\" \"$jsonFile\" 2>&1";

        // 4️⃣ Exécuter le script
        $output = shell_exec($command);
        Log::info("Stock $stockId - sortie Python brute : $output");

        // 5️⃣ Filtrer uniquement la ligne JSON (dernière ligne)
        $lines = explode("\n", trim($output));
        $jsonLine = end($lines); // prend la dernière ligne

        $result = json_decode($jsonLine, true);

        if (json_last_error() !== JSON_ERROR_NONE || !$result) {
            Log::error("Stock $stockId - erreur JSON. Raw output: $output");
            return response()->json([]);
        }

        return response()->json($result);

    } catch (\Exception $e) {
        Log::error("Erreur forecast stock $stockId : " . $e->getMessage());
        return response()->json([]);
    }
}


public function forecastAll()
{
    try {
        // 1️⃣ Récupérer tous les mouvements groupés par stock
        $stocks = \DB::table('mouvement_stocks')
            ->select('stock_id', 'quantite as y', 'date_mouvement as ds')
            ->where('type', 'sortie')
            ->orderBy('stock_id')
            ->orderBy('ds')
            ->get()
            ->groupBy('stock_id'); // regroupe les mouvements par stock_id

        $allForecasts = [];

        foreach ($stocks as $stockId => $data) {
            if ($data->count() < 2) {
                Log::warning("Stock $stockId - pas assez de données");
                continue; // passe au stock suivant
            }

            $dataArray = $data->map(function ($row) {
                return [
                    'ds' => $row->ds,
                    'y' => (float) $row->y,
                    'stock_id' => $row->stock_id,
                ];
            })->toArray();

            Log::info("Stock $stockId - données pour Python : " . json_encode($dataArray));

            // 2️⃣ Fichier temporaire JSON
            $tempFile = tempnam(sys_get_temp_dir(), 'for');
            file_put_contents($tempFile . '.json', json_encode($dataArray));
            $jsonFile = $tempFile . '.json';

            // 3️⃣ Commande Python
            $python = 'C:\\Users\\manar\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
            $script = base_path("python_scripts\\predict_stock.py");
            $command = "\"$python\" \"$script\" \"$jsonFile\" 2>&1";

            // 4️⃣ Exécuter le script
            $output = shell_exec($command);
            Log::info("Stock $stockId - sortie Python brute : $output");

            // 5️⃣ Filtrer la dernière ligne JSON
            $lines = explode("\n", trim($output));
            $jsonLine = end($lines);

            $result = json_decode($jsonLine, true);

            if (json_last_error() === JSON_ERROR_NONE && $result) {
                $allForecasts[$stockId] = $result;
            } else {
                Log::error("Stock $stockId - erreur JSON. Raw output: $output");
            }
        }

        return response()->json($allForecasts);

    } catch (\Exception $e) {
        Log::error("Erreur forecastAll : " . $e->getMessage());
        return response()->json([]);
    }
}


}


