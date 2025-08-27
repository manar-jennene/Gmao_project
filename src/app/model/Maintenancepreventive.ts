import { Statut } from "./Statut";

export class Maintenancepreventive {
  id?: number;
  periodicite!: string; // ex : 'hebdomadaire', 'mensuel'
  frequence!: number; // nombre entier, ex : chaque 2 semaines
  joursrepetition?: string; // JSON stringifié d’un tableau ["LUN", "MER"]
  equipement_id?: number;
  description?: string;
  responsable_id?: number;
  labels?: string;
  date_debut!: string; // ISO string ou format 'YYYY-MM-DD'
  date_fin?: string;
  occurrences_max?: number;
  temps_estime_jours?: number;
  temps_estime_heures?: number;
  priorite_id?: number;
  trigger_type?:string ;
  statut?: Statut;

  // ✅ Ajoute ceci :
  equipement?: {
    id: number;
    nom: string;
    image: string;
  };

  priorite?: {
    id: number;
    libelle: string;
  };

  responsable?: {
    nom:string ;
  }
}

