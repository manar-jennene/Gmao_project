import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MaintenancepreventiveService } from 'src/app/services/maintenancepreventive.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: any = {};
  indicateurs: any[] = [];
userStats: any[] = [];

  constructor(private maintenanceService: MaintenancepreventiveService) {}

  ngOnInit(): void {
    this.loadStats();
      this.loadUserStats();

  }

  loadStats(): void {
    this.maintenanceService.getstat().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateIndicateurs();
        this.renderCharts();
      },
      error: (err) => console.error('Erreur lors du chargement des stats :', err)
    });
  }
  loadUserStats(): void {
  this.maintenanceService.getUserStats().subscribe({
    next: (data) => this.userStats = data,
    error: (err) => console.error(err)
  });
}

  updateIndicateurs(): void {
this.indicateurs = [
  { id: 'activiteChart', label: 'Taux d’activité des interventions', value: this.stats.taux_activite, color: '#1b00ff' },
  // { id: 'maintenanceChart', label: 'Maintenance préventive', value: this.stats.maintenance_preventive, color: '#ff5722' },
  { id: 'successChart', label: 'Interventions réussies', value: this.stats.interventions_reussies, color: '#66bb6a' },
  { id: 'disponibiliteChart', label: 'Disponibilité des équipements', value: this.stats.disponibilite_equipements, color: '#ffc107' }
];


    setTimeout(() => {
      this.indicateurs.forEach((ind) => {
        new Chart(ind.id, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [ind.value, 100 - ind.value],
              backgroundColor: [ind.color, '#e0e0e0']
            }]
          },
          options: { cutout: '70%', plugins: { legend: { display: false } } }
        });
      });
    }, 100);
  }

  renderCharts(): void {
    // Graphique évolution des interventions
    new Chart('interventionsChart', {
      type: 'line',
      data: {
        labels: this.stats.labels,
        datasets: [{
          label: 'Évolution des interventions',
          data: this.stats.evolution_interventions,
          borderColor: '#00bcd4',
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // État des interventions selon tes 8 statuts
    new Chart('etatInterventionsChart', {
      type: 'doughnut',
      data: {
        labels: ['Ouvert', 'En cours', 'En attente', 'Résolu', 'Validé', 'Rejeté', 'Réouverte', 'Clôturé'],
        datasets: [{
          data: [
            this.stats.interventions_etat?.ouvert || 0,
            this.stats.interventions_etat?.en_cours || 0,
            this.stats.interventions_etat?.en_attente || 0,
            this.stats.interventions_etat?.resolu || 0,
            this.stats.interventions_etat?.valide || 0,
            this.stats.interventions_etat?.rejete || 0,
            this.stats.interventions_etat?.reouverte || 0,
            this.stats.interventions_etat?.cloture || 0
          ],
          backgroundColor: [
            '#1b00ff', '#42a5f5', '#ff9800', '#4caf50', '#9c27b0', '#f44336', '#795548', '#00bcd4'
          ]
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }


  getColor(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin': return '#00bcd4';
    case 'technicien': return '#66bb6a';
    case 'simple utilisateur': return '#ff9800';
    default: return '#ccc';
  }
}

}
