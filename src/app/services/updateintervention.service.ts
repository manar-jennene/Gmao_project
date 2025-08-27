import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UpdateinterventionService {

  private apiUrl = 'http://127.0.0.1:8000/api/updateintervention';

  constructor(private http: HttpClient, private router: Router) {}

  assignResponsable(interventionId: number, userId: number, commentaire: string = '') {
    const url = `${this.apiUrl}/intervention/${interventionId}/assign`;

    const payload = {
      user_id: userId,
      commentaire: commentaire
    };

    return this.http.post(url, payload);
  }




}
