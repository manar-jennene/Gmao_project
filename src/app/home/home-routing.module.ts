import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfficheaquipementComponent } from './Equipement/afficheaquipement/afficheaquipement.component';
import { AffichestatutComponent } from './Parametrage/Statut/affichestatut/affichestatut.component';
import { AfficheprioriteComponent } from './Parametrage/Priorite/affichepriorite/affichepriorite.component';
import { AfficheInterventionComponent } from './Intervention/affiche-intervention/affiche-intervention.component';
import { DetailInterventionComponent } from './Intervention/detail-intervention/detail-intervention.component';
import { AddmaintenanceComponent } from '../MaintenancePreventive/addmaintenance/addmaintenance.component';
import { AffichemaintenancepreventiveComponent } from '../MaintenancePreventive/affichemaintenancepreventive/affichemaintenancepreventive.component';
import { DetailmaintenancepreventiveComponent } from '../MaintenancePreventive/detailmaintenancepreventive/detailmaintenancepreventive.component';
import {CalendrierComponent} from "../Planning/calendrier/calendrier.component";
import { AfficheStockComponent } from './GestionStock/affiche-stock/affiche-stock.component';
import { AddstockComponent } from './GestionStock/addstock/addstock.component';
import { ListeStockComponent } from './liste-stock/liste-stock.component';
import { DemandestockComponent } from './liste-stock/demandestock/demandestock.component';

const routes: Routes = [

  { path: 'equipement', component: AfficheaquipementComponent },
  { path: 'Statut', component: AffichestatutComponent },
  { path: 'priorite', component: AfficheprioriteComponent },
  { path: 'intervention', component: AfficheInterventionComponent },
  { path: 'detail-intervention/:id', component: DetailInterventionComponent },
  { path: 'maintenance', component: AddmaintenanceComponent },
  { path: 'affichemaintenance', component: AffichemaintenancepreventiveComponent },
  { path: 'detail-preventive/:id', component: DetailmaintenancepreventiveComponent },
  { path: 'Calendrier', component: CalendrierComponent },
  { path: 'stock', component: AfficheStockComponent },
  { path: 'listestock', component: ListeStockComponent },
  { path: 'demandestock', component: DemandestockComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
