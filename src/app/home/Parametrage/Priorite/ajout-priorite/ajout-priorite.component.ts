import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Priorite } from 'src/app/model/Priorite';
import { ParametrageService } from 'src/app/services/parametrage.service';

@Component({
  selector: 'app-ajout-priorite',
  templateUrl: './ajout-priorite.component.html',
  styleUrls: ['./ajout-priorite.component.css']
})
export class AjoutPrioriteComponent {

  prioriteForm: FormGroup;

  @Input() prioriteToEdit?: Priorite;
  @Output() onClose = new EventEmitter<boolean>();

  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private parametrageService: ParametrageService
  ) {
    this.prioriteForm = this.fb.group({
      libelle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.prioriteToEdit) {
      this.isEditMode = true;
      this.prioriteForm.patchValue({
        libelle: this.prioriteToEdit.libelle,
      });
    }
  }

  onSubmit() {
    if (this.prioriteForm.valid) {
      const prioriteData: Priorite = this.prioriteForm.value;

      if (this.isEditMode && this.prioriteToEdit?.id) {
        // MODE ÉDITION
        this.parametrageService.updatePriorite(this.prioriteToEdit.id, prioriteData).subscribe({
          next: () => {
            alert('Priorité modifiée avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de la modification", err);
            alert("Erreur lors de la modification de la priorité");
          },
        });
      } else {
        // MODE AJOUT
        this.parametrageService.AddPriorite(prioriteData).subscribe({
          next: () => {
            alert('Priorité ajoutée avec succès');
            this.onClose.emit(true);
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout", err);
            alert("Erreur lors de l'ajout de la priorité");
          },
        });
      }
    }
  }

  close() {
    this.onClose.emit(false);
  }
}
