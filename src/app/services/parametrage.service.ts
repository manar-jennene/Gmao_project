import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Statut } from '../model/Statut';
import { Priorite } from '../model/Priorite';
import { Categorie } from '../model/Categorie';

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {

  private apiUrl = 'http://127.0.0.1:8000/api/parametrage';

  constructor(private http: HttpClient, private router: Router) {}

  // ------------------ STATUT ------------------
  getStatut(): Observable<Statut[]> {
    return this.http.get<Statut[]>(`${this.apiUrl}/statuts`);
  }

  AddStatut(statut: Statut): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addstatuts`, statut);
  }

  updateStatut(interventionId: number, statut: Statut): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatestatuts/${interventionId}`, statut);
  }

  deleteStatut(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deletestatuts/${id}`);
  }

  // ------------------ PRIORITÉ ------------------
  getPriorite(): Observable<Priorite[]> {
    return this.http.get<Priorite[]>(`${this.apiUrl}/priorite`);
  }

  AddPriorite(priorite: Priorite): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addpriorite`, priorite);
  }

  updatePriorite(id: number, priorite: Priorite): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatepriorite/${id}`, priorite);
  }

  deletePriorite(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deletepriorite/${id}`);
  }


  getCategorie(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categorie`);
  }
}
