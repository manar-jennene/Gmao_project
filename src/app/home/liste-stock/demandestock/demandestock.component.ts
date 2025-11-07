import { Component } from '@angular/core';
import {DemandeStock} from "../../../model/Demandestock";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StockserviceService} from "../../../services/stockservice.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-demandestock',
  templateUrl: './demandestock.component.html',
  styleUrls: ['./demandestock.component.css']
})
export class DemandestockComponent {
  demandeForm!: FormGroup;
  demandes: DemandeStock[] = [];
  pieces: any[] = []; // viendra de la table stock

  constructor(
    private fb: FormBuilder,
    private stockService: StockserviceService
  ) {}

  ngOnInit(): void {
    // init formulaire
    this.demandeForm = this.fb.group({
      piece_id: ['', Validators.required],
      quantite_demandee: ['', [Validators.required, Validators.min(1)]]
    });

    this.loadPieces();
    this.loadDemandes();
  }

  // Charger les pièces depuis la table stock
  loadPieces() {
    this.stockService.getStocks().subscribe({
      next: (data) => (this.pieces = data),
      error: (err) => console.error('Erreur chargement stock', err)
    });
  }

  // Charger les demandes existantes
  loadDemandes() {
    this.stockService.getDemandes().subscribe({
      next: (data) => (this.demandes = data),
      error: (err) => console.error('Erreur chargement demandes', err)
    });
  }

  // Ajouter une demande
  // Ajouter une demande
  onSubmit() {
    if (this.demandeForm.valid) {
      const pieceId = Number(this.demandeForm.value.piece_id);
      const quantiteDemandee = Number(this.demandeForm.value.quantite_demandee);

      const piece = this.pieces.find(p => p.id === pieceId);

      if (!piece) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: '⚠️ Pièce introuvable !'
        });
        return;
      }

      if (quantiteDemandee > piece.quantite_disponible) {
        Swal.fire({
          icon: 'warning',
          title: 'Stock insuffisant',
          text: `Il ne reste que ${piece.quantite_disponible} en stock !`,
          confirmButtonText: 'OK'
        });
        return;
      }

      const now = new Date();
      const formattedDate = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      const newDemande: DemandeStock = {
        ...this.demandeForm.value,
        piece_id: pieceId,
        quantite_demandee: quantiteDemandee,
        date_demande: formattedDate,
        statut_id: 3,
        demandeur_id: 1
      };

      this.stockService.addDemande(newDemande).subscribe({
        next: (demande) => {
          this.demandes.push(demande);

          // ⚡ Mise à jour locale du stock
          piece.quantite_disponible -= quantiteDemandee;

          // 🎉 Popup succès
          Swal.fire({
            icon: 'success',
            title: 'Demande ajoutée',
            text: 'Votre demande de stock a été enregistrée avec succès !'
          });

          this.demandeForm.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible d’ajouter la demande.'
          });
          console.error('Erreur ajout demande', err);
        }
      });
    }
  }
  isRejete(d: DemandeStock): boolean {
    return d.statut_id === 6; // 6 = rejeté
  }
  // Dans demandestock.component.ts

  rejeterDemande(demande: DemandeStock) {
    Swal.fire({
      title: '⚠️ Confirmer le rejet',
      text: `Voulez-vous vraiment rejeter la demande pour ${this.getPieceNom(demande.piece_id)} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, rejeter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!demande.id) {
          console.error("Impossible de rejeter : id manquant !");
          return;
        }
        this.stockService.rejeterDemande(demande.id).subscribe({
          next: (res) => {
            demande.statut_id = 6; // 6 = Rejeté
            Swal.fire({
              icon: 'success',
              title: 'Demande rejetée',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de rejeter la demande.'
            });
            console.error('Erreur rejet demande', err);
          }
        });
      }
    });
  }

  voirDetails(d: DemandeStock) {
    Swal.fire({
      title: `Détails de la demande`,
      html: `
      <b>Pièce :</b> ${this.getPieceNom(d.piece_id)}<br>
      <b>Quantité :</b> ${d.quantite_demandee}<br>
      <b>Date :</b> ${d.date_demande}<br>
      <b>Statut :</b> ${this.getStatutLabel(d.statut_id)}
    `,
      icon: 'info'
    });
  }

  validerDemande(demande: DemandeStock) {
    if (!demande.id) {
      console.error("Impossible de valider : id manquant !");
      return;
    }

    this.stockService.validerDemande(demande.id).subscribe({
      next: (res: any) => {
        // ⚡ Mise à jour locale du statut
        demande.statut_id = 5; // 5 = Validé
        demande.valide = true;

        Swal.fire({
          icon: 'success',
          title: 'Demande validée ✅',
          text: 'Le statut a été mis à jour avec succès.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur validation', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur ❌',
          text: 'Impossible de valider la demande.',
        });
      }
    });
  }


  getPieceNom(id?: number): string {
    if (!id) return 'Inconnu';
    const piece = this.pieces.find(p => p.id === id);
    return piece ? piece.nom : 'Inconnu';
  }


  getStatutLabel(statutId?: number): string {
    switch(statutId) {
      case 1: return 'Ouvert';
      case 2: return 'En cours';
      case 3: return 'En attente';
      case 4: return 'Résolu';
      case 5: return 'Validé';
      case 6: return 'Rejeté';
      case 7: return 'Clôturé';
      case 9: return 'Réouverte';
      default: return '';
    }



  }

// Dans demandestock.component.ts
  getBadgeClass(statutId?: number): string {
    switch(statutId) {
      case 1: return 'badge bg-primary';       // Ouvert
      case 2: return 'badge bg-warning text-dark'; // En cours
      case 3: return 'badge bg-secondary';    // En attente
      case 4: return 'badge bg-success';      // Résolu
      case 5: return 'badge bg-success';      // Validé
      case 6: return 'badge bg-danger';       // Rejeté
      case 7: return 'badge bg-dark';         // Clôturé
      case 9: return 'badge bg-info';         // Réouverte
      default: return 'badge bg-light text-dark';
    }
  }


}
