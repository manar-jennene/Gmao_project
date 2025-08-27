import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockserviceService {

  private apiUrl = 'http://127.0.0.1:8000/api/stock';

  constructor(private http: HttpClient) {}

  // ==================== STOCK ====================
  getStocks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getstock`);
  }

  addStock(stock: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, stock);
  }

  updateStock(id: number, stock: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, stock);
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // ==================== DEMANDE STOCK ====================
  getDemandes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/demande`);
  }

  addDemande(demande: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/demande/add`, demande);
  }

  updateDemande(id: number, demande: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/demande/update/${id}`, demande);
  }

  deleteDemande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/demande/delete/${id}`);
  }


  validerDemande(id: number) {
    return this.http.put<any>(`${this.apiUrl}/demande/validedemande/${id}`, {});
  }


}
