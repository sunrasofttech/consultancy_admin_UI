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
    return this.http.post(`${this.baseUrl}/admin/updateSubscriptionPlan/${id}`, body, { headers: this.getHeaders() });
  }

  // Get pricing popup content with features
  getPricePopupContent(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getPricePopupContant`, {}, { headers: this.getHeaders() });
  }

  // SupSubSettingsService (add the following method)

  updatePricePopupContent(id: number, field: string, value: any): Observable<any> {
    const body = { [field]: value }; // Dynamically set the field to be updated
    return this.http.post(`${this.baseUrl}/admin/updatePricePopupContant/${id}`, body, { headers: this.getHeaders() });
  }

  updatePricePopupFeature(id: number, field: string, value: any): Observable<any> {
    const body = { [field]: value };  // Dynamically set the field to be updated
    return this.http.post(`${this.baseUrl}/admin/updatePricePopupFeature/${id}`, body, { headers: this.getHeaders() });
  }

  // --- NEW METHOD ---
  createPricePopupFeature(planId: number, featureName: string): Observable<any> {
    const body = {
      price_popup_content_id: planId,
      feature_name: featureName
    };
    return this.http.post(`${this.baseUrl}/admin/createPricePopupFeature`, body, { headers: this.getHeaders() });
  }

  // --- NEW DELETE METHOD ---
  
  deletePricePopupFeature(featureId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/deletePricePopupFeature/${featureId}`, {}, { headers: this.getHeaders() });
  }

  
}
