import { Component } from '@angular/core';
import { Priorite } from 'src/app/model/Priorite';
import { ParametrageService } from 'src/app/services/parametrage.service';

@Component({
  selector: 'app-affichepriorite',
  templateUrl: './affichepriorite.component.html',
  styleUrls: ['./affichepriorite.component.css']
})
export class AfficheprioriteComponent {
  showModal: boolean = false;
  prioriteASupprimerId: number | null = null;
  prioriteEnCoursEdition: Priorite | null = null;
  selectedPriorite?: Priorite;
  showDetailModal: boolean = false;

  priorites: Priorite[] = [];
  filteredPriorites: Priorite[] = [];
  searchTerm: string = '';

  constructor(private parametrageService: ParametrageService) {}

  ngOnInit(): void {
    this.loadPriorites();
  }

  loadPriorites(): void {
    this.parametrageService.getPriorite().subscribe(
      (data) => {
        this.priorites = data;
        this.filteredPriorites = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des priorités :', error);
      }
    );
  }

  filterPriorite(value: string): void {
    const term = value.toLowerCase();
    this.filteredPriorites = this.priorites.filter(
      (priorite) => priorite.libelle?.toLowerCase().includes(term)
    );
    this.searchTerm = value;
  }

  openModal(): void {
    this.prioriteEnCoursEdition = null;
    this.showModal = true;
  }

  closeModal(ajoutReussi: boolean = false): void {
    this.showModal = false;
    this.prioriteEnCoursEdition = null;
    if (ajoutReussi) {
      this.loadPriorites();
    }
  }

  openEditModal(priorite: Priorite): void {
    this.prioriteEnCoursEdition = priorite;
    this.showModal = true;
  }

  confirmDelete(id?: number): void {
    if (id !== undefined) {
      this.prioriteASupprimerId = id;
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
    this.prioriteASupprimerId = null;
  }

  deletePriorite(): void {
    if (this.prioriteASupprimerId !== null) {
      this.parametrageService.deletePriorite(this.prioriteASupprimerId).subscribe(
        () => {
          this.loadPriorites();
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
        }
      );
    }
  }

  voirDetail(priorite: Priorite): void {
    this.selectedPriorite = priorite;
    this.showDetailModal = true;
  }

  fermerDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPriorite = undefined;
  }
}
