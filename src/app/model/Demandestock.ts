
export class DemandeStock {
  id?: number;
  piece_id?: number;
  quantite_demandee?: BigInt;
  demandeur_id?: number;
  statut_id?: number;
  date_demande?: Date;
  //date_reception?: Date;
  valide?:boolean;// string si tu reçois juste le chemin de l’image
  stock?: {
    nom: string;
  };
}

