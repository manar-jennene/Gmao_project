import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient ,private router: Router) {}

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.user) { // Vérifie si l'utilisateur est bien retourné par l'API
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }


  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getroles`);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}'); // Stocke l'utilisateur après connexion
  }

  logout() {
    localStorage.removeItem('user'); // Supprime l'utilisateur
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

   getAlluseer(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    getUserId(): number | null {
      const user = this.getUser(); // Méthode qui lit le localStorage/sessionStorage
      return user?.id ?? null;
    }

  updateUserImage(id: number, formData: FormData) {
    return this.http.post(`http://localhost:8000/api/users/${id}/update-profile`, formData);
  }

  updateProfile(id: number, userData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/users/${id}/update-profile`, userData);
}


}
