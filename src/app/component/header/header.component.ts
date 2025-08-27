import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: any = {};

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.user = this.authService.getUser();
    console.log('Utilisateur connecté:', this.user); // Vérifie si les données sont bien récupérées
  }


  onLogout() {
    this.authService.logout();
  }

}
