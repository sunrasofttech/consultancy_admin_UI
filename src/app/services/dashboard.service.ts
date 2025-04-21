import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.baseurl;


  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  // Method to fetch booking count from the API
  getAllCountBooking(): Observable<any> {
    const url = `${this.baseUrl}/booking/getAllCountBooking`;
    return this.http.post<any>(url, {}, { headers: this.getHeaders() });
  }


}
