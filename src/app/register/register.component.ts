import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  roles: any[] = [];
  
  // Variables pour les popups
  showSuccessPopup = false;
  showErrorPopup = false;
  countdown = 3; // Compte à rebours pour la redirection

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      matricule: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      role: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (response: any) => {
        // Handle both array and object responses
        if (Array.isArray(response)) {
          this.roles = response;
        } else if (response && typeof response === 'object') {
          // Convert object to array if needed
          this.roles = Object.keys(response).map(key => response[key]);
        } else {
          console.error('Unexpected roles format:', response);
          this.roles = [];
        }
      },
      error: (err) => {
        console.error('Error loading roles', err);
      }
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Form is invalid', this.registerForm.errors);
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const formData = {
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      matricule: this.registerForm.value.matricule,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      password_confirmation: this.registerForm.value.confirmPassword,
      mobile: this.registerForm.value.mobile,
      role: this.registerForm.value.role
    };

    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.showSuccessPopup = true;
        
        // Démarrer le compte à rebours pour la redirection
        const timer = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(timer);
            this.router.navigate(['/login']);
          }
        }, 1000);
      },
      error: (err) => {
        console.error('Erreur d\'inscription', err);
        this.errorMessage = err.error.message || 'Une erreur est survenue lors de l\'inscription';
        
        // Afficher les erreurs spécifiques si elles existent
        if (err.error.errors) {
          if (err.error.errors.password) {
            this.errorMessage = err.error.errors.password[0];
          } else if (err.error.errors.role) {
            this.errorMessage = err.error.errors.role[0];
          }
        }
        
        this.showErrorPopup = true;
        this.isSubmitting = false;
      }
    });
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }
}