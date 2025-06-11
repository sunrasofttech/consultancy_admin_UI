import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechPageService {
  // baseUrl = 'http://localhost:3000/api/admin';
  private baseUrl = `${environment.baseurl}/admin`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  getTechList() {
    return this.http.post(`${this.baseUrl}/getTech`, {});
  }

  createTech(data: FormData) {
    return this.http.post(`${this.baseUrl}/createTech`, data, { headers: this.getHeaders() });
  }

  updateTech(id: number, data: any) {
    return this.http.post(`${this.baseUrl}/updateTech/${id}`, data, { headers: this.getHeaders() });
  }

  createTechMainPage(data: FormData) {
    return this.http.post(`${this.baseUrl}/createTechMainPage`, data, { headers: this.getHeaders() });
  }

  getTechMainPage() {
    return this.http.post(`${this.baseUrl}/getTechMainPage`, {});
  }

  updateTechMainPage(id: number, data: FormData) {
    return this.http.post(`${this.baseUrl}/updateTechMainPage/${id}`, data, { headers: this.getHeaders() });
  }

  // +++ ADD THIS NEW METHOD +++
  deleteTech(id: number) {
    return this.http.post(`${this.baseUrl}/deleteTech/${id}`, {}, { headers: this.getHeaders() });
  }


}
