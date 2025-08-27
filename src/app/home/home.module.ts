import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AjoutequipementComponent } from './Equipement/ajoutequipement/ajoutequipement.component';
import { SidebarComponent } from '../component/sidebar/sidebar.component';
import { HeaderComponent } from '../component/header/header.component';
import { AffichestatutComponent } from './Parametrage/Statut/affichestatut/affichestatut.component';
import { TableModule } from 'primeng/table';      // For p-table, p-tableHeaderCheckbox, p-tableCheckbox
import { TagModule } from 'primeng/tag';           // For p-tag
import { CheckboxModule } from 'primeng/checkbox'; // For p-tableCheckbox
import { DropdownModule } from 'primeng/dropdown'; // For p-dropdown
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AjoutStatutComponent } from './Parametrage/Statut/ajout-statut/ajout-statut.component';     // Import MessageService
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailstatutComponent } from './Parametrage/Statut/detailstatut/detailstatut.component';
import { AfficheprioriteComponent } from './Parametrage/Priorite/affichepriorite/affichepriorite.component';
import { AjoutPrioriteComponent } from './Parametrage/Priorite/ajout-priorite/ajout-priorite.component';
import { DetailprioriteComponent } from './Parametrage/Priorite/detailpriorite/detailpriorite.component';
import { AfficheaquipementComponent } from './Equipement/afficheaquipement/afficheaquipement.component';
import { AfficheInterventionComponent } from './Intervention/affiche-intervention/affiche-intervention.component';
import { AddInterventionComponent } from './Intervention/add-intervention/add-intervention.component';
import { DetailInterventionComponent } from './Intervention/detail-intervention/detail-intervention.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { ChangeStatusDialogComponent } from './Intervention/change-status-dialog/change-status-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddmaintenanceComponent } from '../MaintenancePreventive/addmaintenance/addmaintenance.component';
import { AffichemaintenancepreventiveComponent } from '../MaintenancePreventive/affichemaintenancepreventive/affichemaintenancepreventive.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DetailmaintenancepreventiveComponent } from '../MaintenancePreventive/detailmaintenancepreventive/detailmaintenancepreventive.component';
import {CalendrierComponent} from "../Planning/calendrier/calendrier.component";
import { AfficheStockComponent } from './GestionStock/affiche-stock/affiche-stock.component';
import { AddstockComponent } from './GestionStock/addstock/addstock.component';
import { ListeStockComponent } from './liste-stock/liste-stock.component';
import { DemandestockComponent } from './liste-stock/demandestock/demandestock.component';
@NgModule({
  declarations: [
    AfficheaquipementComponent,
  AjoutequipementComponent,
    SidebarComponent,
    HeaderComponent,
    AffichestatutComponent,
    AjoutStatutComponent,
    DetailstatutComponent,
    AfficheprioriteComponent,
    AjoutPrioriteComponent,
    DetailprioriteComponent,
    AfficheInterventionComponent,
    AddInterventionComponent,
    DetailInterventionComponent,
    ChangeStatusDialogComponent,
    AddmaintenanceComponent,
    AffichemaintenancepreventiveComponent,
    DetailmaintenancepreventiveComponent,
    CalendrierComponent,
    AfficheStockComponent,
    AddstockComponent,
    ListeStockComponent,
    DemandestockComponent,


  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    TableModule,        // Add Table module
    TagModule,          // Add Tag module
    CheckboxModule,     // Add Checkbox module
    DropdownModule,     // Add Dropdown module
    ToastModule,        // Add Toast module
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    FullCalendarModule,
// ✅ Nécessaire ici

  ],
  providers: [MessageService], // Add MessageService here
})
export class HomeModule { }
