import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intervention } from 'src/app/model/Intervention';
import { InterventionService } from 'src/app/services/intervention.service';
import { ChangeStatusDialogComponent } from '../change-status-dialog/change-status-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AssignresponsableComponent } from '../assignresponsable/assignresponsable.component';
import { CommentaireserviceService } from 'src/app/services/commentaireservice.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-detail-intervention',
  templateUrl: './detail-intervention.component.html',
  styleUrls: ['./detail-intervention.component.css']
})
export class DetailInterventionComponent implements OnInit {
  intervention?: Intervention;
  commentaires: any[] = []; // ou typé avec ton interface Commentaire[]
  nouveauCommentaire = '';
// Permet de savoir à quel commentaire on veut répondre
repondreACommentaireId: number | null = null;
  showModal: boolean = false;

// Nouveau champ pour la réponse
nouvelleReponse: string = '';
  equipementEnCoursEdition: Intervention | null = null;




  constructor(
    private route: ActivatedRoute,
    private interventionService: InterventionService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private commentaireService: CommentaireserviceService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIntervention(+id); // cast vers number
    }
  }


  loadIntervention(id: number) {
    this.interventionService.getInterventionById(id).subscribe({
      next: (response: any) => {
        this.intervention = response.data; // <- important !
        this.getCommentaires();

      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’intervention :', err);
      }
    });
  }


  openChangeStatusDialog() {
    if (!this.intervention) return;

    const dialogRef = this.dialog.open(ChangeStatusDialogComponent, {
      width: '400px',
      data: {
        interventionId: this.intervention.id!,
        currentStatut: this.intervention.statut!
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.intervention!.statut = result;

        // Popup de succès
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Statut modifié avec succès',
          life: 1500
        });
      }
    });
  }
  openEditModal(equipement: Intervention): void {
    console.log("test");
    this.equipementEnCoursEdition = equipement;
    this.showModal = true; // C’est ce qui déclenche l’affichage du modal
  }

  closeModal(ajoutReussi: boolean = false): void {
    this.showModal = false;
    this.equipementEnCoursEdition = null;
    if (ajoutReussi) {
      this.loadIntervention(this.intervention!.id!);

    }
  }


  AssignResonsableDialog() {
    if (!this.intervention) return;

    const dialogRef = this.dialog.open(AssignresponsableComponent, {
      width: '400px',
      data: {
        interventionId: this.intervention.id!
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.updated) {
        this.loadIntervention(this.intervention!.id!);

        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Responsable assigné avec succès',
          life: 1500
        });
      }
    });
  }

  posterCommentaire() {
    if (this.intervention?.id) {
      this.commentaireService.addCommentaire({
        intervention_id: this.intervention.id,
        commentaire: this.nouveauCommentaire
      }).subscribe(() => {
        this.getCommentaires();
        this.nouveauCommentaire = '';
      });
    }
  }


  getCommentaires() {
    if (this.intervention?.id) {
      this.commentaireService.getCommentaires(this.intervention.id).subscribe((data) => {
        this.commentaires = data as any[];
      });
    }
  }


  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0 && this.intervention?.id) {
      this.getCommentaires(); // Charger les commentaires quand on entre dans l'onglet
    }
  }

  posterReponse(parentId: number) {
    if (this.intervention?.id && this.nouvelleReponse.trim() !== '') {
      this.commentaireService.addCommentaire({
        intervention_id: this.intervention.id,
        commentaire: this.nouvelleReponse,
        parent_id: parentId
      }).subscribe(() => {
        this.getCommentaires();
        this.nouvelleReponse = '';
        this.repondreACommentaireId = null;
      });
    }
  }

  annulerReponse() {
    this.nouvelleReponse = '';
    this.repondreACommentaireId = null;
  }



}
