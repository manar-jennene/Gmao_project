<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Intervention;
use Illuminate\Support\Facades\Storage; // Importer la façade Storage
use Illuminate\Validation\Rule; // Importer Rule pour unique simplifié
use App\Models\User;

class InterventionUpdateController extends Controller
{
    public function assignResponsable(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'commentaire' => 'nullable|string'
        ]);

        $intervention = Intervention::findOrFail($id);
        $intervention->responsable = $request->input('user_id');
        $intervention->save();

        // Optionnel : enregistrer un commentaire si tu veux le stocker ailleurs (ex: table historique)

        return response()->json([
            'message' => 'Responsable assigné avec succès.',
            'intervention' => $intervention
        ]);
    }

}
