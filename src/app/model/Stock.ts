
export class Stock {
  id?: number;
  nom?: string;
  description?: string;
  reference?: string;
  quantite_disponible?: BigInteger;
  date_ajout?: Date;
  seuil_minimum?: BigInteger;
  fournisseur_id?: string; // string si tu reçois juste le chemin de l’image
  created_at?:Date;
}
