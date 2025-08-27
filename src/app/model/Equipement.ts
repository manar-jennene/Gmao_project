import { Statut } from "./Statut";

export class Equipement {
  id?: number;
  nom?: string;
  description?: string;
  reference?: string;
  marque?: string;
  date_mise_en_service?: Date;
  image?: string; // string si tu reçois juste le chemin de l’image
  statut?: Statut; // objet de type Statut
}
