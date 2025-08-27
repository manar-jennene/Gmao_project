import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Statut } from 'src/app/model/Statut';
import { ParametrageService } from './../../../../services/parametrage.service';

@Component({
  selector: 'app-ajout-statut',
  templateUrl: './ajout-statut.component.html',
})
export class AjoutStatutComponent implements OnInit {
  statutForm: FormGroup;

  @Input() statutToEdit?: Statut; // <-- Ajout pour l'édition
  @Output() onClose = new EventEmitter<boolean>();

  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private parametrageService: ParametrageService
  ) {
    this.statutForm = this.fb.group({
      libelle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.statutToEdit) {
      this.isEditMode = true;
      this.statutForm.patchValue({
        libelle: this.statutToEdit.libelle,
      });
    }
  }

  onSubmit() {
    if (this.statutForm.valid) {
      const statutData: Statut = this.statutForm.value;

      if (this.isEditMode && this.statutToEdit?.id) {
        // MODE ÉDITION
        this.parametrageService.updateStatut(this.statutToEdit.id, statutData).subscribe({
          next: () => {
            alert('Statut modifié avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de la modification", err);
            alert("Erreur lors de la modification du statut");
          },
        });
      } else {
        // MODE AJOUT
        this.parametrageService.AddStatut(statutData).subscribe({
          next: () => {
            alert('Statut ajouté avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout", err);
            alert("Erreur lors de l'ajout du statut");
          },
        });
      }
    }
  }

  close() {
    this.onClose.emit(false);
  }
}
