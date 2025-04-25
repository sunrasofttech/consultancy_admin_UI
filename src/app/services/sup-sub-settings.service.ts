import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupSubSettingsService {


   private baseUrl = environment.baseurl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
      });
    }
    

  // Get the subscription amount
  getSubscriptionAmount(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getSubscriptionAmount`, {});
  }

  // Update subscription plan
  updateSubscriptionPlan(id: number, amount: number): Observable<any> {
    const body = { amount: amount };
    return this.http.post(`${this.baseUrl}/admin/updateSubscriptionPlan/${id}`, body , { headers: this.getHeaders() });
  }
}
