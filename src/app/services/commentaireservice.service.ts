import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommentaireserviceService {
   private apiUrl = 'http://127.0.0.1:8000/api/commentaire';
  
    constructor(private http: HttpClient, private router: Router) {}
  
    addCommentaire(data: { intervention_id: number, commentaire: string, parent_id?: number }) {
      return this.http.post(`${this.apiUrl}/addcommentaires`, data);
    }
    

    getCommentaires(ticketId: number) {
      return this.http.get(`${this.apiUrl}/getcommentaires/${ticketId}`);
    }
    
    updateCommentaire(id: number, data: { commentaire: string }) {
      return this.http.put(`${this.apiUrl}/update/${id}`, data);
    }
    
    deleteCommentaire(id: number) {
      return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
    

}
