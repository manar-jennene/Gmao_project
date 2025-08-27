import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Maintenancepreventive } from 'src/app/model/Maintenancepreventive';
import { AuthService } from 'src/app/services/auth.service';
import { EquipementService } from 'src/app/services/equipement.service';
import { MaintenancepreventiveService } from 'src/app/services/maintenancepreventive.service';
import { ParametrageService } from 'src/app/services/parametrage.service';

@Component({
  selector: 'app-detailmaintenancepreventive',
  templateUrl: './detailmaintenancepreventive.component.html',
  styleUrls: ['./detailmaintenancepreventive.component.css']
})
export class DetailmaintenancepreventiveComponent implements OnInit {

  plan!: Maintenancepreventive;
  prochaineOccurrence: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private maintenanceService: MaintenancepreventiveService,
      private equipementservice: EquipementService,
          private parametrageservice: ParametrageService,
          private userservice: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.maintenanceService.getById(+id).subscribe({
        next: (data) => {
          this.plan = data;

          // Calculer prochaine occurrence
          this.maintenanceService.calculateNextOccurrence({
            date_debut: this.plan.date_debut,
            frequence: this.plan.frequence,
            unite_frequence: this.plan.periodicite,
            joursrepetition: this.plan.joursrepetition
          }).subscribe({
            next: (res) => {
              this.prochaineOccurrence = res.prochaine_occurrence;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Erreur calcul prochaine occurrence', err);
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Erreur chargement maintenance', err);
          this.isLoading = false;
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/default.png'; // Une image locale par défaut
  }


}
