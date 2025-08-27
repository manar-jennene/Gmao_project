import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Intervention } from 'src/app/model/Intervention';
import { Priorite } from 'src/app/model/Priorite';
import { Statut } from 'src/app/model/Statut';
import { User } from 'src/app/model/User';
import { InterventionService } from './../../../services/intervention.service';
import { ParametrageService } from 'src/app/services/parametrage.service';
import { EquipementService } from 'src/app/services/equipement.service';
import { Equipement } from 'src/app/model/Equipement';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-add-intervention',
  templateUrl: './add-intervention.component.html',
  styleUrls: ['./add-intervention.component.css']
})
export class AddInterventionComponent {
  interventionForm: FormGroup;
  selectedImage: File | null = null;

  statuts: Statut[] = [];
  priorites: Priorite[] = [];
  users: User[] = [];
  equipements: Equipement[] = [];

  @Input() interventionToEdit?: Intervention;
  @Output() onClose = new EventEmitter<boolean>();

  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private interventionService: InterventionService,
    private parametrageService: ParametrageService,
    private equipementService: EquipementService,
    private userservice: AuthService
  ) {
    this.interventionForm = this.fb.group({
      reference: ['', Validators.required],
      description: [''],
      responsable: [''],
      rapporteur: [''],
      telephone: [''],
      email: [''],
      date_creation: [''],
      date_fin: [''],
      resume: [''],
      site: [''],
      statut_id: [null],  // Ne sera plus auto défini
      priorite_id: [null],
      equipement_id: [null],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.loadStatuts();
    this.loadPriorites();
    this.loadUsers();
    this.loadEquipements();

    if (this.interventionToEdit) {
      // Mode édition
      this.isEditMode = true;
      this.interventionForm.patchValue(this.interventionToEdit);
    } else {
      // Mode ajout → définir automatiquement le rapporteur
      const currentUser = this.userservice.getUser(); // Assure-toi que cette méthode existe
      if (currentUser && currentUser.id) {
        this.interventionForm.patchValue({ rapporteur: currentUser.id });
      }


    }
  }

  loadStatuts() {
    this.parametrageService.getStatut().subscribe({
      next: (data) => {
        this.statuts = data;

        if (!this.isEditMode) {
          const openStatut = this.statuts.find(s =>
            s.libelle?.trim().toLowerCase() === 'ouvert'
          );
          if (openStatut) {
            this.interventionForm.patchValue({ statut_id: openStatut.id });
          }
        }
      },
      error: (err) => console.error('Erreur chargement statuts', err)
    });
  }

  loadPriorites() {
    this.parametrageService.getPriorite().subscribe({
      next: (data) => this.priorites = data,
      error: (err) => console.error('Erreur chargement priorités', err)
    });
  }

  loadUsers() {
    this.userservice.getAlluseer().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  loadEquipements() {
    this.equipementService.getEquipemennt().subscribe({
      next: (data) => this.equipements = data,
      error: (err) => console.error('Erreur chargement équipements', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.interventionForm.valid) {
      const formData = new FormData();

      Object.entries(this.interventionForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }

      if (this.isEditMode && this.interventionToEdit?.id) {
        this.interventionService.updateIntervention(this.interventionToEdit.id, formData).subscribe({
          next: () => {
            alert('Intervention modifiée avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur modification", err);
            alert("Erreur lors de la modification");
          },
        });
      } else {
        this.interventionService.addIntervention(formData).subscribe({
          next: () => {
            alert('Intervention ajoutée avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur ajout", err);
            alert("Erreur lors de l’ajout de l’intervention");
          },
        });
      }
    }
  }

  close() {
    this.onClose.emit(false);
  }
}
