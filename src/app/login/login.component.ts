import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LOGINComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value; // Récupération des données du formulaire

      this.authService.login(formData.email, formData.password).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
        this.router.navigate(['/dashboard']);
        // Rediriger vers la page d'accueil ou tableau de bord
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          alert('Échec de la connexion. Vérifiez vos identifiants.');
        }
      });
    }
  }

 

  onLogout() {
    this.authService.logout();
  }

}
