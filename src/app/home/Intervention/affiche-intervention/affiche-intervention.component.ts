import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Intervention } from 'src/app/model/Intervention';
import { InterventionService } from 'src/app/services/intervention.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-affiche-intervention',
  templateUrl: './affiche-intervention.component.html',
  styleUrls: ['./affiche-intervention.component.css']
})
export class AfficheInterventionComponent {
showModal: boolean = false;
  p: number = 1; // page courante
  itemsPerPage: number = 5; // nombre d'items par page

  EquipementSupprimerId: number | null = null;
  equipementEnCoursEdition: Intervention | null = null;
  selectedEquipement?: Intervention;
  showDetailModal: boolean = false;

  shouldAutoHide: boolean = false;

  interventions: Intervention[] = [];
  filteredEquipements: Intervention[] = [];
  searchTerm: string = '';

  constructor(private interventionservice: InterventionService,private router: Router,private dialog: MatDialog) {}
   ngOnInit(): void {
      this.loadEquipements();
    }

    loadEquipements(): void {
      this.interventionservice.getAllInterventions().subscribe(
        (data) => {
          this.interventions = data;
          this.filteredEquipements = data;
          console.log(this.interventions);

        },
        (error) => {
          console.error('Erreur lors du chargement des priorités :', error);
        }
      );
    }

    filterIntervention(value: string): void {
      const term = value.toLowerCase();
      this.filteredEquipements = this.interventions.filter(
        (Equipement) => Equipement.reference?.toLowerCase().includes(term)
      );
      this.searchTerm = value;
    }
    onImageError(event: any) {
      event.target.src = 'assets/images/default.png'; // Une image locale par défaut
    }

    openModal(): void {
      this.equipementEnCoursEdition = null;
      this.showModal = true;
    }

    closeModal(ajoutReussi: boolean = false): void {
      this.showModal = false;
      this.equipementEnCoursEdition = null;
      if (ajoutReussi) {
        this.loadEquipements();
      }
    }
  getStatutClass(statut: string | undefined): string {
    if (!statut) return 'badge-secondary'; // gris par défaut

    switch (statut.toLowerCase()) {
      case 'ouvert':
        return 'badge-primary'; // bleu clair
      case 'en cours':
        return 'badge-warning'; // jaune
      case 'en attente':
        return 'badge-info'; // bleu plus foncé
      case 'resolu':
        return 'badge-success'; // vert
      case 'valide':
        return 'badge-success'; // vert foncé, tu peux aussi créer une classe spéciale si tu veux
      case 'rejete':
        return 'badge-danger'; // rouge
      case 'cloture':
        return 'badge-secondary'; // gris
      case 'reouverte':
        return 'badge-info'; // tu peux adapter
      default:
        return 'badge-secondary'; // gris par défaut
    }
  }

  getPrioriteClass(priorite: string | undefined): string {
    if (!priorite) return 'badge-secondary'; // gris par défaut

    switch (priorite.toLowerCase()) {
      case 'en urgence':
        return 'badge-danger';       // Rouge vif
      case 'préventive':
      case 'preventive':
        return 'badge-info';         // Bleu clair
      case 'priorite moyenne':
      case 'priorité moyenne':
        return 'badge-warning';      // Jaune
      case 'priorité haute':
      case 'priorite haute':
        return 'badge-primary';      // Bleu foncé
      default:
        return 'badge-secondary';    // Gris neutre
    }
  }



  openEditModal(equipement: Intervention): void {
      this.equipementEnCoursEdition = equipement;
      this.showModal = true;
    }

    confirmDelete(id?: number): void {
      if (id !== undefined) {
        this.EquipementSupprimerId = id;
        const modal = document.getElementById('deleteModal');
        if (modal) {
          (modal as any).style.display = 'block';
        }
      }
    }

    closeDeleteModal(): void {
      const modal = document.getElementById('deleteModal');
      if (modal) {
        (modal as any).style.display = 'none';
      }
      this.EquipementSupprimerId = null;
    }

    deleteIntervention(): void {
      if (this.EquipementSupprimerId !== null) {
        this.interventionservice.deleteIntervention(this.EquipementSupprimerId).subscribe(
          () => {
            this.loadEquipements();
            this.closeDeleteModal();
          },
          (error) => {
            console.error('Erreur lors de la suppression :', error);
          }
        );
      }
    }

    voirDetail(equipement: Intervention): void {
      this.selectedEquipement = equipement;
      this.showDetailModal = true;
    }

    fermerDetailModal(): void {
      this.showDetailModal = false;
      this.selectedEquipement = undefined;
    }



    goToDetail(id: number | undefined): void {
      if (!id) return;
      this.router.navigate(['/home/detail-intervention', id]);
    }

  }




