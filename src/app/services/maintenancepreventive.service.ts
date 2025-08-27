import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Maintenancepreventive } from '../model/Maintenancepreventive';

@Injectable({
  providedIn: 'root'
})


export class MaintenancepreventiveService {

  private apiUrl = 'http://127.0.0.1:8000/api/maintenance';

  constructor(private http: HttpClient, private router: Router) {}


  getAllInterventions(): Observable<Maintenancepreventive[]> {
    return this.http.get<Maintenancepreventive[]>(`${this.apiUrl}/get`);
  }

  getAlltriigertype(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/triggertypes`);
  }

  getPeriodicite(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getPeriodicite`);
  }


  addIntervention(data: any) {
    return this.http.post(`${this.apiUrl}/addmaintenance`, data);
  }


  updateIntervention(id: number, maintenance: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/${id}`, maintenance);
  }

  deleteIntervention(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
  calculateNextOccurrence(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculateNextOccurrence`, data);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/plan-maintenance/${id}`);
  }


}
