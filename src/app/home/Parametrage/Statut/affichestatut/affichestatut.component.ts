import { Component, OnInit } from '@angular/core';
import { Statut } from 'src/app/model/Statut';
import { ParametrageService } from 'src/app/services/parametrage.service';

@Component({
  selector: 'app-affichestatut',
  templateUrl: './affichestatut.component.html',
  styleUrls: ['./affichestatut.component.css'],
})
export class AffichestatutComponent implements OnInit {
  showModal: boolean = false;
  statutASupprimerId: number | null = null;
  statutEnCoursEdition: Statut | null = null;
  selectedStatut?: Statut;
  showDetailModal: boolean = false;

  statuts: Statut[] = [];
  filteredStatuts: Statut[] = [];
  searchTerm: string = '';

  constructor(private parametrageService: ParametrageService) {}

  ngOnInit(): void {
    this.loadStatuts();
  }

  loadStatuts(): void {
    this.parametrageService.getStatut().subscribe(
      (data) => {
        this.statuts = data;
        this.filteredStatuts = data; // initialise aussi la liste filtrée
      },
      (error) => {
        console.error('Erreur lors du chargement des statuts :', error);
      }
    );
  }

  filterStatuts(value: string): void {
    const term = value.toLowerCase();
    this.filteredStatuts = this.statuts.filter(
      (statut) => statut.libelle?.toLowerCase().includes(term)
    );
    this.searchTerm = value;
  }
  

  openModal(): void {
    this.statutEnCoursEdition = null;
    this.showModal = true;
  }

  closeModal(ajoutReussi: boolean = false): void {
    this.showModal = false;
    if (ajoutReussi) {
      this.loadStatuts();
    }
  }

  closeModaledit(ajoutReussi: boolean = false): void {
    this.showModal = false;
    this.statutEnCoursEdition = null;
    if (ajoutReussi) {
      this.loadStatuts();
    }
  }

  openEditModal(statut: Statut): void {
    this.statutEnCoursEdition = statut;
    this.showModal = true;
  }

  confirmDelete(id?: number): void {
    if (id !== undefined) {
      this.statutASupprimerId = id;
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
    this.statutASupprimerId = null;
  }

  deleteStatut(): void {
    if (this.statutASupprimerId !== null) {
      this.parametrageService.deleteStatut(this.statutASupprimerId).subscribe(
        () => {
          this.loadStatuts();
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
        }
      );
    }
  }

  voirDetail(statut: Statut): void {
    this.selectedStatut = statut;
    this.showDetailModal = true;
  }

  fermerDetailModal(): void {
    this.showDetailModal = false;
    this.selectedStatut = undefined;
  }
}
