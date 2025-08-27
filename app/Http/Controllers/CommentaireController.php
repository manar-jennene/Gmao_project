<?php

namespace App\Http\Controllers;

use App\Models\Commentaire; // à ajouter
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'intervention_id' => 'required|exists:interventions,id',
            'commentaire' => 'required|string',
        ]);

        $commentaire = Commentaire::create([
            'intervention_id' => $request->intervention_id,
            'user_id' => auth()->id() ?? 1, // temporaire si tu n’as pas encore auth
            'commentaire' => $request->commentaire,
            'parent_id' => $request->parent_id // nullable

        ]);

        return response()->json(['message' => 'Commentaire ajouté', 'data' => $commentaire], 201);
    }

    public function getByTicket($ticketId)
    {
        $commentaires = Commentaire::with(['user', 'enfants.user'])
            ->where('intervention_id', $ticketId)
            ->whereNull('parent_id') // uniquement les commentaires principaux
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($commentaires);
    }


    public function destroy($id)
{
    $commentaire = Commentaire::find($id);

    if (!$commentaire) {
        return response()->json(['message' => 'Commentaire introuvable'], 404);
    }

    if (auth()->check() && $commentaire->user_id !== auth()->id()) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    $commentaire->delete();

    return response()->json(['message' => 'Commentaire supprimé']);
}
public function update(Request $request, $id)
{
    $request->validate([
        'commentaire' => 'required|string'
    ]);

    $commentaire = Commentaire::find($id);

    if (!$commentaire) {
        return response()->json(['message' => 'Commentaire introuvable'], 404);
    }

    // Vérifie que c’est le bon utilisateur (si auth existe)
    if (auth()->check() && $commentaire->user_id !== auth()->id()) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    $commentaire->commentaire = $request->commentaire;
    $commentaire->save();

    return response()->json(['message' => 'Commentaire modifié', 'data' => $commentaire]);
}

}
