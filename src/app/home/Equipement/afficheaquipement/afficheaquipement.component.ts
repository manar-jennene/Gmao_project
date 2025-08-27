import { Component } from '@angular/core';
import { EquipementService } from 'src/app/services/equipement.service';
import { Equipement } from './../../../model/Equipement';

@Component({
  selector: 'app-afficheaquipement',
  templateUrl: './afficheaquipement.component.html',
  styleUrls: ['./afficheaquipement.component.css']
})
export class AfficheaquipementComponent {
showModal: boolean = false;
  EquipementSupprimerId: number | null = null;
  equipementEnCoursEdition: Equipement | null = null;
  selectedEquipement?: Equipement;
  showDetailModal: boolean = false;

  equipements: Equipement[] = [];
  filteredEquipements: Equipement[] = [];
  searchTerm: string = '';

  constructor(private equipementservice: EquipementService) {}
   ngOnInit(): void {
      this.loadEquipements();
    }

    loadEquipements(): void {
      this.equipementservice.getEquipemennt().subscribe(
        (data) => {
          this.equipements = data;
          this.filteredEquipements = data;
          console.log(this.equipements);

        },
        (error) => {
          console.error('Erreur lors du chargement des priorités :', error);
        }
      );
    }

    filterEquipement(value: string): void {
      const term = value.toLowerCase();
      this.filteredEquipements = this.equipements.filter(
        (Equipement) => Equipement.nom?.toLowerCase().includes(term)
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
      if (!statut) return 'badge-secondary'; // Par défaut
      switch (statut.toLowerCase()) {
        case 'open':
          return 'badge-success'; // vert
        case 'en  cours':
          return 'badge-warning'; // jaune
        case 'fermé':
        case 'closed':
          return 'badge-danger'; // rouge
        default:
          return 'badge-secondary'; // gris
      }
    }

    openEditModal(equipement: Equipement): void {
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

    deleteEquipement(): void {
      if (this.EquipementSupprimerId !== null) {
        this.equipementservice.deleteequipeMet(this.EquipementSupprimerId).subscribe(
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

    voirDetail(equipement: Equipement): void {
      this.selectedEquipement = equipement;
      this.showDetailModal = true;
    }

    fermerDetailModal(): void {
      this.showDetailModal = false;
      this.selectedEquipement = undefined;
    }
  }



