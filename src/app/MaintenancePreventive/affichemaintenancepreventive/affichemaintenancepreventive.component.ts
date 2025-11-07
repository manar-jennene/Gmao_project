import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EquipementService } from 'src/app/services/equipement.service';
import { MaintenancepreventiveService } from 'src/app/services/maintenancepreventive.service';
import { ParametrageService } from 'src/app/services/parametrage.service';
import {Maintenancepreventive} from "../../model/Maintenancepreventive";
import Swal from 'sweetalert2';
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-affichemaintenancepreventive',
  templateUrl: './affichemaintenancepreventive.component.html',
  styleUrls: ['./affichemaintenancepreventive.component.css']
})
export class AffichemaintenancepreventiveComponent {

  maintenancePlans: any[] = [];
  showFilters: boolean = false;
  triggerTypes: string[] = [];
  periodicite: string[] = [];
  allMaintenancePlans: any[] = [];

// Liste affichée (peut être filtrée)
  maintenancePlan: Maintenancepreventive[] = [];
  equipements: any[] = [];
  responsables: any[] = [];
  priorites: any[] = [];
  filterValues = {
    trigger_type: '',
    responsable: '',
    equipement: '',
    priorite: '',
    periodicite: ''
  };
  filter = {
    costCenter: ''
  };

  costCenters = [
    { id: 1, nom: 'Production' },
    { id: 2, nom: 'Maintenance' },
    { id: 3, nom: 'Qualité' }
  ];
  constructor(
    private MaintenancepreventiveService: MaintenancepreventiveService,
    private equipementservice: EquipementService,
    private parametrageservice: ParametrageService,
    private userservice: AuthService,
    private router: Router,
    private messageService: MessageService

  )
  {}
  ngOnInit(): void {
    this.getTriggerTypes();
    this.loadDropdownData();
    this.getPeriodicite();

    this.MaintenancepreventiveService.getAllInterventions().subscribe({
      next: (maintenances) => {
        this.maintenancePlans = maintenances;
        this.allMaintenancePlans = [...maintenances]; // ✅ Sauvegarde copie originale

        this.maintenancePlans.forEach((plan: any, index: number) => {
          const payload = {
            date_debut: plan.date_debut,
            frequence: plan.frequence,
            unite_frequence: plan.periodicite,
            joursrepetition: plan.joursrepetition
          };

          this.MaintenancepreventiveService.calculateNextOccurrence(payload).subscribe({
            next: (res) => {
              this.maintenancePlans[index].prochaine_occurrence = res.prochaine_occurrence;
              this.allMaintenancePlans[index].prochaine_occurrence = res.prochaine_occurrence; // ✅ garde aussi à jour
            },
            error: (err) => {
              console.error('Erreur lors du calcul de l’occurrence pour', plan, err);
              this.maintenancePlans[index].prochaine_occurrence = null;
              this.allMaintenancePlans[index].prochaine_occurrence = null;
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur récupération maintenances', err);
      }
    });
  }

  viewPlan(plan: any) {
    this.router.navigate(['home/detail-preventive', plan.id]);
  }

  onImageError(event: any) {
      event.target.src = 'assets/images/default.png'; // Une image locale par défaut
    }

  createNewPlan() {
    // redirection vers le formulaire d’ajout
  }



  deletePlan(plan: any) {
    // supprimer le plan
  }

  duplicatePlan(plan: any) {
    // cloner les données pour un nouveau plan
  }

  downloadPlan(plan: any) {
    // export PDF ou CSV
  }
  saveFilters() {
    // Action fictive pour tester le bouton
    console.log('Filtres enregistrés (test)');
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  loadDropdownData() {
    this.equipementservice.getEquipemennt().subscribe((res: any[]) => {
      this.equipements = res;
    });

    this.userservice.getAlluseer().subscribe((res: any[]) => {
      this.responsables = res;
    });

    this.parametrageservice.getPriorite().subscribe((res: any[]) => {
      this.priorites = res;
    });
  }

  applyFilters() {
    this.maintenancePlans = this.allMaintenancePlans.filter(plan => {
      return (
        (this.filterValues.trigger_type === '' || plan.trigger_type === this.filterValues.trigger_type) &&
        (this.filterValues.responsable === '' || plan.responsable.id == this.filterValues.responsable) &&
        (this.filterValues.equipement === '' || plan.equipement.id == this.filterValues.equipement) &&
        (this.filterValues.priorite === '' || plan.priorite.id == this.filterValues.priorite) &&
        (this.filterValues.periodicite === '' || plan.periodicite === this.filterValues.periodicite)
      );
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Filtres appliqués avec succès',
      life: 1500, // durée en ms
    });

    console.log('Filtres appliqués :', this.filterValues);
  }
  resetFilters() {
    // Réinitialiser l'objet filterValues à des valeurs vides
    this.filterValues = {
      trigger_type: '',
      responsable: '',
      equipement: '',
      priorite: '',
      periodicite: ''
    };
  }
  getPeriodicite() {
    this.MaintenancepreventiveService.getPeriodicite().subscribe({
      next: (res) => {
        this.periodicite = res;
      },
      error: (err) => {
        console.error("Erreur de chargement des periodicte :", err);
      }
    });
  }
goToAddMaintenance() {
  this.router.navigate(['/home/maintenance']);
}
  getTriggerTypes() {
    this.MaintenancepreventiveService.getAlltriigertype().subscribe({
      next: (res) => {
        this.triggerTypes = res;
      },
      error: (err) => {
        console.error("Erreur de chargement des déclencheurs :", err);
      }
    });
  }}


