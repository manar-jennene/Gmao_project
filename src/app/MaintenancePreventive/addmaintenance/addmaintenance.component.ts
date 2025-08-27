import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenancepreventiveService } from 'src/app/services/maintenancepreventive.service';
import { EquipementService } from '../../services/equipement.service';
import { ParametrageService } from '../../services/parametrage.service';
import { AuthService } from 'src/app/services/auth.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-addmaintenance',
  templateUrl: './addmaintenance.component.html',
  styleUrls: ['./addmaintenance.component.css']
})
export class AddmaintenanceComponent implements OnInit {
  calendarOptions!: CalendarOptions; // ← Ajoute le "!" ici
  maintenanceForm: FormGroup;
  currentStep = 1;
  

  selectedDates: EventInput[] = [];
  selectedUnit: string = 'jour'; // valeur par défaut
  triggerTypes = [
    { label: 'Date fixe', value: 'date_fixe' },
    { label: 'Achèvement tâche', value: 'fermeture_tache' },
    { label: 'Déclencheur API', value: 'api_externe' }
  ];
  equipements: any[] = [];
  techniciens: any[] = [];
  priorites: any[] = [];

  daysOfWeek = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  selectedDays: string[] = [];
  selectedPeriod: string = ''; // pour savoir quand afficher les jours
  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenancepreventiveService,
    private equipementservice: EquipementService,
    private parametrageservice: ParametrageService,
    private userservice: AuthService
  ) {
    this.maintenanceForm = this.fb.group({
      equipmentOnly: [true],
      equipement_id: [null, Validators.required],
      trigger_type: ['date_fixe', Validators.required],
      description: ['', Validators.required],
      type: ['Préventive', Validators.required],
      periodicite: [null, Validators.required],
      frequence: [null],
      unite_frequence: ['jour', Validators.required],

      date_debut: [null, Validators.required],
      date_fin: [null],
      priorite: [null, Validators.required],
      technicien_id: [null],
      occurrences_max: [null],
      temps_estime_jours: [null],
      temps_estime_heures: [null],
      joursrepetition: ['[]']
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      editable: true,
      selectMirror: true,
      weekends: true,
      height: 350, // 👈 Réduit la taille
      events: this.selectedDates,
      select: this.handleDateSelect
    };
    
    
  }
  handleDateClick(arg: any) {
    alert('Date cliquée : ' + arg.dateStr);
  }

  handleSelect(info: any) {
    alert('Sélection du ' + info.startStr + ' au ' + info.endStr);
  }
  loadDropdownData(): void {
    this.equipementservice.getEquipemennt().subscribe(data => this.equipements = data);
    this.userservice.getAlluseer().subscribe(data => this.techniciens = data);
    this.parametrageservice.getPriorite().subscribe(data => this.priorites = data);
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.maintenanceForm.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.maintenanceForm.patchValue({
        joursrepetition: JSON.stringify(this.selectedDays)
      });
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  selectUnit(unit: string): void {
    this.selectedUnit = unit;
    this.maintenanceForm.patchValue({ periodicite: unit });
  }
  
  onDayChange(event: any): void {
    const day = event.target.value;
    if (event.target.checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  handleDateSelect = (selectInfo: DateSelectArg) => {
    const dateStr = selectInfo.startStr;
    if (!this.selectedDates.find(e => e.start === dateStr)) {
      this.selectedDates.push({
        title: 'Intervention',
        start: dateStr,
        allDay: true
      });
    }
  };

  submit(): void {
    const raw = this.maintenanceForm.value;

    const dataToSend = {
      trigger_type: raw.trigger_type,
      periodicite: raw.periodicite,
      frequence: raw.frequence,
      unite_frequence: raw.unite_frequence,
      joursrepetition: raw.joursrepetition,
      equipement_id: raw.equipement_id,
      priorite_id: raw.priorite, // ✅ ICI
      responsable_id: raw.technicien_id,
      description: raw.description,
      labels: raw.type,
      date_debut: raw.date_debut,
      date_fin: raw.date_fin,
      occurrences_max: raw.occurrences_max,
      temps_estime_jours: raw.temps_estime_jours,
      temps_estime_heures: raw.temps_estime_heures
    };
    
    this.maintenanceService.addIntervention(dataToSend).subscribe({
      next: () => alert('Maintenance créée avec succès'),
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création');
      }
    });
    

  }

  onPeriodChange(event: any) {
    this.selectedPeriod = event.target.value;
  }
  
  onDayChange1(event: any) {
    const day = event.target.value;
    if (event.target.checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  
    // Mise à jour du champ dans le bon formulaire
    this.maintenanceForm.patchValue({
      joursrepetition: JSON.stringify(this.selectedDays)
    });
  }
  onSelectPeriod(period: string) {
    this.selectedPeriod = period;
    this.maintenanceForm.patchValue({
      periodicite: period,           // correspond au champ Laravel
      unite_frequence: period        // <-- AJOUT obligatoire pour le back
    });
  
    // Si on change la période, on vide les jours si ce n’est pas hebdo
    if (period !== 'hebdomadaire') {
      this.selectedDays = [];
      this.maintenanceForm.patchValue({ joursrepetition: '[]' });
    }
  }
  
  toggleDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index === -1) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays.splice(index, 1);
    }
  
    this.maintenanceForm.patchValue({
      joursrepetition: JSON.stringify(this.selectedDays)
    });
  }
  






  
  setTriggerType(type: string): void {
    this.maintenanceForm.patchValue({ trigger_type: type });
  }
  
}
