import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Statut } from 'src/app/model/Statut';
import { ParametrageService } from 'src/app/services/parametrage.service';
import { MessageService } from 'primeng/api'; // ← Import PrimeNG MessageService

@Component({
  selector: 'app-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styleUrls: ['./change-status-dialog.component.css']
})
export class ChangeStatusDialogComponent implements OnInit {
  statutForm: FormGroup;
  allStatuts: Statut[] = [];
  filteredStatuts: Statut[] = [];

  workflowTransitions: { [key: string]: string[] } = {
    'ouvert': ['en cours', 'en attente', 'rejete'],
    'en cours': ['en attente', 'resolu', 'rejete'],
    'en attente': ['en cours', 'rejete'],
    'resolu': ['valide', 'reouverte'],
    'valide': ['cloture', 'reouverte'],
    'rejete': ['reouverte'],
    'cloture': ['reouverte'],
    'reouverte': ['en cours', 'en attente']
  };

  constructor(
    private fb: FormBuilder,
    private interventionService: ParametrageService,
    private messageService: MessageService, // ← Injection du service
  public dialogRef: MatDialogRef<ChangeStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { interventionId: number, currentStatut: Statut }
  ) {
    this.statutForm = this.fb.group({
      statut: [data.currentStatut || null, Validators.required],
      commentaire: ['']
    });
  }

  ngOnInit() {
    this.interventionService.getStatut().subscribe({
      next: (statuts) => {
        this.allStatuts = statuts;

        const currentLabel = this.data.currentStatut?.libelle
          ? this.data.currentStatut.libelle.toLowerCase()
          : '';

        const libellesAutorisés = this.workflowTransitions[currentLabel] || [];

        this.filteredStatuts = this.allStatuts.filter(s =>
          s.libelle && libellesAutorisés.includes(s.libelle.toLowerCase())
        );

        if (this.data.currentStatut && !this.filteredStatuts.find(s => s.id === this.data.currentStatut.id)) {
          this.filteredStatuts.unshift(this.data.currentStatut);
        }
      },
      error: (err) => console.error('Erreur lors de la récupération des statuts', err)
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.statutForm.valid) {
      const updatedStatut: Statut = this.statutForm.value.statut;
      this.interventionService.updateStatut(this.data.interventionId, updatedStatut).subscribe({
        next: res => this.dialogRef.close(res),
        error: err => console.error('Erreur lors de la mise à jour du statut', err)
      });
    }
  }
}
