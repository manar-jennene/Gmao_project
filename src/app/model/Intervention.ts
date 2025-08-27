import { Equipement } from "./Equipement";
import { Priorite } from "./Priorite";
import { Statut } from "./Statut";
import { User } from "./User";

export class Intervention {
  id?: number;
  reference?: string;
  description?: string;
  file?: File | string; // string si c’est juste l’URL du fichier
  date_creation?: string; // format ISO 'YYYY-MM-DD'
  date_fin?: string;
  responsable?: User | any; // number (id) ou User selon besoin
  rapporteur?: User | any; // number (id) ou User selon besoin
  telephone?: string;
  email?: string;
  statut?: Statut; // objet de type Statut
  priorite?: Priorite;
  equipement?: Equipement;
  created_at?:Date;
  update_at?:Date;
  fichier?: string; // ✅ Cette ligne est nécessaire
  resume?:string ;
  site?:string ;


}
