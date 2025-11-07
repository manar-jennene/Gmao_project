<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    // Méthode globale pour le dashboard, sans besoin d'ID
    public function getStats()
    {
        $total = Intervention::count();
        if ($total === 0) {
            return response()->json([
                'taux_utilisation' => 0,
                'taux_maintenance_preventive' => 0,
                'taux_interventions_reussies' => 0,
                'taux_disponibilite' => 0,
                'interventions_etat' => [],
                'labels' => [],
                'evolution_interventions' => []
            ]);
        }

        // Compter les interventions par statut
        $interventionsEtat = [
            'ouvert' => Intervention::where('statut_id', 1)->count(),
            'en_cours' => Intervention::where('statut_id', 2)->count(),
            'en_attente' => Intervention::where('statut_id', 3)->count(),
            'resolu' => Intervention::where('statut_id', 4)->count(),
            'valide' => Intervention::where('statut_id', 5)->count(),
            'rejete' => Intervention::where('statut_id', 6)->count(),
            'reouverte' => Intervention::where('statut_id', 7)->count(),
            'cloture' => Intervention::where('statut_id', 8)->count(),
        ];

        $taux_utilisation = round(
            ($interventionsEtat['en_cours'] + $interventionsEtat['resolu'] + $interventionsEtat['valide']) 
            / $total * 100, 2
        );
        $taux_maintenance_preventive = round(
            Intervention::where('description', 'like', '%Maintenance%')->count() / $total * 100, 2
        );
        $taux_interventions_reussies = round(
            ($interventionsEtat['resolu'] + $interventionsEtat['valide'] + $interventionsEtat['cloture']) 
            / $total * 100, 2
        );
        $taux_disponibilite = round(
            ($interventionsEtat['ouvert'] + $interventionsEtat['resolu'] + $interventionsEtat['valide'] + $interventionsEtat['cloture']) 
            / $total * 100, 2
        );

        // Labels pour évolution des interventions par jour (exemple)
        $labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        $evolution = [1, 2, 3, 5, 4, 6, 7]; // tu peux remplacer par des données réelles

       return response()->json([
    'taux_activite' => $taux_utilisation, 
    'maintenance_preventive' => $taux_maintenance_preventive,
    'interventions_reussies' => $taux_interventions_reussies,
    'disponibilite_equipements' => $taux_disponibilite, // plus clair
    'interventions_etat' => $interventionsEtat,
    'labels' => $labels,
    'evolution_interventions' => $evolution
]);

    }

    public function getUserStats()
{
    // Récupérer tous les rôles
    $roles = DB::table('roles')->get();

    $data = [];
    foreach ($roles as $role) {
        $count = User::where('role', $role->role)->count();
        $data[] = [
            'role' => $role->role,
            'count' => $count
        ];
    }

    return response()->json($data);
}
}
