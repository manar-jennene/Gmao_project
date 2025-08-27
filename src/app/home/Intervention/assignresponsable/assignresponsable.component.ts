import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateinterventionService } from 'src/app/services/updateintervention.service';

@Component({
  selector: 'app-assignresponsable',
  templateUrl: './assignresponsable.component.html',
  styleUrls: ['./assignresponsable.component.css']
})
export class AssignresponsableComponent implements OnInit {
  responsableForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private updateService: UpdateinterventionService,
    private userService: AuthService,
    public dialogRef: MatDialogRef<AssignresponsableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { interventionId: number }
  ) {
    this.responsableForm = this.fb.group({
      responsable: [null, Validators.required],
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAlluseer().subscribe({
      next: (res: User[]) => this.users = res,
      error: () => console.error('Erreur lors du chargement des utilisateurs')
    });
  }


  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.responsableForm.invalid) return;

    const responsableId = this.responsableForm.value.responsable;
    const commentaire = this.responsableForm.value.commentaire;

    this.updateService.assignResponsable(this.data.interventionId, responsableId, commentaire).subscribe({
      next: () => {
        const newResponsable = this.users.find(u => u.id === responsableId);
        this.dialogRef.close({ updated: true, newResponsable });
      },
      error: () => console.error("Erreur lors de l'assignation")
    });
  }
}
