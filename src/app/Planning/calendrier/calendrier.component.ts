import { Component, OnInit } from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import { InterventionService } from 'src/app/services/intervention.service';
import { MaintenancepreventiveService } from 'src/app/services/maintenancepreventive.service';
import { Intervention } from 'src/app/model/Intervention';
import { Maintenancepreventive } from 'src/app/model/Maintenancepreventive';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
  selectedEvent: any;
  eventDuration: string = '';
  selectedStatuts: string[] = [];
  allInterventions: any[] = [];


  allMaintenances: any[] = [];
  filteredEvents: any[] = [];
  statutList: string[] = ['ouvert', 'en cours', 'en attente', 'resolu', 'valide', 'rejete', 'cloture'];

  filters = {
    type: 'all', // 'all' | 'intervention' | 'maintenance'
    statuts: [...this.statutList]
  };

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour'
    },
    events: [],
    eventClick: (info: any) => this.onEventClick(info),
    eventContent: (arg: any) => {
      const statutColor = arg.event.extendedProps.statutColor || '#2196F3';
      const resume = arg.event.extendedProps.resume || '';
      const dot = `<span style="display:inline-block;width:10px;height:10px;background-color:${statutColor};border-radius:50%;margin-right:5px;"></span>`;
      return { html: `${dot} <strong>${arg.event.title}</strong><br><small>${resume}</small>` };
    },
  };

  constructor(
    private interventionService: InterventionService,
    private maintenanceService: MaintenancepreventiveService
  ) {}

  ngOnInit(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (interventions: Intervention[]) => {
        this.allInterventions = interventions.map(interv => {
          const color = this.getColorByStatut(interv.statut?.libelle);
          return {
            title: interv.reference || 'Intervention',
            start: interv.date_creation,
            end: interv.date_fin || interv.date_creation,
            backgroundColor: color,
            statutColor: color,
            statut: interv.statut?.libelle?.toLowerCase(),
            resume: interv.resume || '',
            date_creation: interv.date_creation,  // <-- ajouté
            date_fin: interv.date_fin
          };
        });

        this.maintenanceService.getAllInterventions().subscribe({
          next: (preventives: Maintenancepreventive[]) => {
            this.allMaintenances = preventives.map(mp => {
              const color = this.getColorByStatut(mp.statut?.libelle);
              return {
                title: mp.equipement?.nom || 'Maintenance préventive',
                start: mp.date_debut,
                end: mp.date_fin || mp.date_debut,
                backgroundColor: color,
                statutColor: color,
                statut: mp.statut?.libelle?.toLowerCase(),
                resume: mp.description || '',
                date_creation: mp.date_debut,  // <-- ajouté
                date_fin: mp.date_fin
              };
            });

            this.applyFilters();
          },
          error: err => console.error('Erreur chargement maintenances', err)
        });
      },
      error: err => console.error('Erreur chargement interventions', err)
    });
  }

  getColorByStatut(statutLibelle?: string): string {
    const colors: Record<string, string> = {
      'ouvert': '#6ab3da',        // Planifiée
      'en cours': '#8e44ad',      // En cours
      'en attente': '#f39c12',    // En attente
      'resolu': '#1abc9c',        // Résolue
      'valide': '#27ae60',        // Validée
      'rejete': '#e74c3c',        // Rejetée
      'cloture': '#95a5a6',       // Clôturée
      'reouverte': '#3498db'      // Réouverte (bleu vif par ex.)
    };
    const key = statutLibelle?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
    return colors[key] || '#2196F3';
  }

  toggleStatut(statut: string) {
    const index = this.selectedStatuts.indexOf(statut);

    if (index === -1) {
      // Ajouter le statut sélectionné
      this.selectedStatuts.push(statut);
    } else {
      // Retirer le statut
      this.selectedStatuts.splice(index, 1);
    }

    // Met à jour le filtre principal utilisé par applyFilters
    this.filters.statuts = [...this.selectedStatuts];

    this.applyFilters();
  }

  resetFilters() {
    this.filters = {
      type: 'all',
      statuts: [...this.statutList]
    };
    //this.selectedStatuts = [...this.statutList]; // reset boutons gris
    this.applyFilters();
  }


  applyFilters() {
    let events: any[] = [];

    if (this.filters.type === 'all' || this.filters.type === 'intervention') {
      events.push(...this.allInterventions.filter(ev => this.filters.statuts.includes(ev.statut)));
    }
    if (this.filters.type === 'all' || this.filters.type === 'maintenance') {
      events.push(...this.allMaintenances.filter(ev => this.filters.statuts.includes(ev.statut)));
    }

    this.calendarOptions = {
      ...this.calendarOptions,
      events
    };
  }

  onEventClick(info: any) {
    this.selectedEvent = { title: info.event.title, ...info.event.extendedProps };
    const start = new Date(info.event.start);
    const end = new Date(info.event.end || start);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    this.eventDuration = diff > 0 ? `${diff} heures` : '—';

    const modal = new bootstrap.Modal(document.getElementById('eventModal')!);
    modal.show();
  }
}
