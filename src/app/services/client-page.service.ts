import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientPageService {

  // private baseUrl = 'http://localhost:3000/api/admin';

  private baseUrl = `${environment.baseurl}/admin`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }


  getClientPageContent(): Observable<any> {
    return this.http.post(`${this.baseUrl}/getClientPageContent`, {});
  }

  updateClientPageContent(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateClientPageContent/${id}`, data , { headers: this.getHeaders() });
  }

  addClientLogo(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addClientLogo`, formData , { headers: this.getHeaders() });
  }

  getClientLogos(): Observable<any> {
    return this.http.post(`${this.baseUrl}/getClientLogos`, {});
  }

  deleteClientLogo(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteClientLogo/${id}`, {});
  }

  updateClientLogo(id: number, logo: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', logo);
    return this.http.post(`${this.baseUrl}/updateClientLogo/${id}`, formData , { headers: this.getHeaders() });
  }

}
