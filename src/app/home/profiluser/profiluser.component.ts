import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { User } from "../../model/User";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profiluser',
  templateUrl: './profiluser.component.html',
  styleUrls: ['./profiluser.component.css']
})
export class ProfiluserComponent implements OnInit {
  user!: User;
  profileForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log('Utilisateur connecté:', this.user);

    this.profileForm = this.fb.group({
      nom: [this.user.nom || ''],
      prenom: [this.user.prenom || ''],
      matricule: [this.user.matricule || ''],
      email: [this.user.email || ''],
      role: [this.user.role || ''],
      mobile: [this.user.mobile || '']
    });
  }

 onFileSelected(event: any) {
  if (event.target.files && event.target.files[0]) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewImage = e.target?.result!;
    reader.readAsDataURL(this.selectedFile!); // ✅ ici on force TypeScript à accepter
  }
}


  onUpdateImage() {
  if (this.selectedFile) {  // ✅ Vérifie qu’un fichier est bien sélectionné
    const formData = new FormData();
    formData.append('image', this.selectedFile);  // ✅ Ici selectedFile est forcément un File, pas null

    this.authService.updateUserImage(this.user.id!, formData).subscribe({
      next: (res: any) => {
        this.user.image = res.user.image;
        this.previewImage = null;
        this.selectedFile = null;

        Swal.fire({
          icon: 'success',
          title: 'Image mise à jour avec succès 🎉',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour de l’image',
          text: err.message
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Aucun fichier sélectionné',
      text: 'Veuillez choisir une image avant de mettre à jour.',
      timer: 2000
    });
  }
}


  onSubmit() {
    if (this.profileForm.valid) {
      const data = this.profileForm.value;
      this.authService.updateProfile(this.user.id!, data).subscribe({
        next: (res: any) => {
          this.user = res.user;
          localStorage.setItem('user', JSON.stringify(this.user)); // 🔄 met à jour le localStorage

          Swal.fire({
            icon: 'success',
            title: 'Profil mis à jour 🎉',
            text: 'Vos informations ont été enregistrées avec succès.',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la mise à jour',
            text: err.message
          });
        }
      });
    }
  }
}
