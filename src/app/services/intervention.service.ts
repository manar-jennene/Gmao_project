import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Intervention } from '../model/Intervention';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private apiUrl = 'http://127.0.0.1:8000/api/intervention';

  constructor(private http: HttpClient, private router: Router) {}

  // ------------------ Intervention ------------------

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getintervention`);
  }

  addIntervention(intervention: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addintervention`, intervention);
  }

  updateIntervention(id: number, intervention: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateinter/${id}`, intervention);
  }

  deleteIntervention(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteint/${id}`);
  }

  getInterventionById(id: number): Observable<{ success: boolean, data: Intervention }> {
    return this.http.get<{ success: boolean, data: Intervention }>(`${this.apiUrl}/interventionbyId/${id}`);
  }
  
  

}
