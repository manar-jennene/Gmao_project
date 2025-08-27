import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Equipement } from '../model/Equipement';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {

  private apiUrl = 'http://127.0.0.1:8000/api/equipement';

  constructor(private http: HttpClient, private router: Router) {}

  // ------------------ equipement ------------------
  getEquipemennt(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(`${this.apiUrl}/getequipements`);
  }

  AddEquipement(equipement: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addequipements`, equipement);
  }

  updateequipement(id: number, equipement: FormData): Observable<any> {
    // On utilise POST avec override _method=PUT car Laravel ne supporte pas PUT avec FormData
    return this.http.post<any>(`${this.apiUrl}/updateequipement/${id}`, equipement);
  }

  deleteequipeMet(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteequipeMet/${id}`);
  }
}
