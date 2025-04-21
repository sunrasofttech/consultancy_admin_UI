import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutPageService {
  // private baseUrl = 'http://localhost:3000/api/admin';

   private baseUrl = `${environment.baseurl}/admin`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
      });
    }

  getAboutPage(): Observable<any> {
    return this.http.post(`${this.baseUrl}/getAboutPage`, {});
  }

  updateAboutPage(id: number, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateAboutPage/${id}`, data, { headers: this.getHeaders() } );
  }
}
