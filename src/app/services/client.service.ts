import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.baseurl}`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }


  //Get all user purchases
  getAllUserPurchases() {
    return this.http.post(`${this.baseUrl}/userPurchase/getAllUserPurchase`, {
      headers: this.getHeaders()
    });
  }

  updateUserPurchaseByAdmin(id: number, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/userPurchase/updateUserPurchaseByAdmin/${id}`, body);
  }
  

}
