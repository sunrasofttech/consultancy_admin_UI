import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeaturePageService {

  // private baseUrl = 'http://localhost:3000/api/admin'; // Adjust base URL if needed

  private baseUrl = environment.baseurl;


  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  // Fetch Feature Page content
  getFeaturePageContent(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getFeaturePage`, {});
  }

  // feature-page.service.ts
  updateFeaturePage(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/updateFeaturePage/${id}`, formData, { headers: this.getHeaders() });
  }

}
