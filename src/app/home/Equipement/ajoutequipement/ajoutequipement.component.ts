import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Equipement } from 'src/app/model/Equipement';
import { Statut } from 'src/app/model/Statut';
import { EquipementService } from 'src/app/services/equipement.service';
import { ParametrageService } from '../../../services/parametrage.service';

@Component({
  selector: 'app-ajoutequipement',
  templateUrl: './ajoutequipement.component.html',
  styleUrls: ['./ajoutequipement.component.css']
})
export class AjoutequipementComponent implements OnInit {
  equipementForm: FormGroup;
  selectedImage: File | null = null;
  statuts: Statut[] = [];

  @Input() equipementToEdit?: Equipement;
  @Output() onClose = new EventEmitter<boolean>();

  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private equipementService: EquipementService,
    private ParametrageService: ParametrageService
  ) {
    this.equipementForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      reference: ['', Validators.required],
      marque: [''],
      date_mise_en_service: [''],
      statut_id: [null, Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadStatuts();

    if (this.equipementToEdit) {
      this.isEditMode = true;
      this.equipementForm.patchValue({
        nom: this.equipementToEdit.nom,
        description: this.equipementToEdit.description,
        reference: this.equipementToEdit.reference,
        marque: this.equipementToEdit.marque,
        date_mise_en_service: this.equipementToEdit.date_mise_en_service,
        statut_id: this.equipementToEdit.statut?.id
      });
    }
  }

  loadStatuts() {
    this.ParametrageService.getStatut().subscribe({
      next: (data) => this.statuts = data,
      error: (err) => console.error('Erreur chargement statuts', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.equipementForm.valid) {
      const formData = new FormData();
      Object.entries(this.equipementForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));  // <- Cast en string
        }
      });


      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      if (this.isEditMode && this.equipementToEdit?.id) {
        this.equipementService.updateequipement(this.equipementToEdit.id, formData).subscribe({
          next: () => {
            alert('Équipement modifié avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de la modification", err);
            alert("Erreur lors de la modification de l’équipement");
          },
        });
      } else {
        this.equipementService.AddEquipement(formData).subscribe({
          next: () => {
            alert('Équipement ajouté avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout", err);
            alert("Erreur lors de l’ajout de l’équipement");
          },
        });
      }
    }
  }

  close() {
    this.onClose.emit(false);
  }
}
