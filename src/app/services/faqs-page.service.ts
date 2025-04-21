import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaqsPageService {
  private baseUrl = `${environment.baseurl}/admin`;

  constructor(private http: HttpClient) { }

    private getHeaders() {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
      });
    }

  getFaqPage() {
    return this.http.post(`${this.baseUrl}/getFaqPage`, {});
  }

  updateFaqPage(id: number, data: any) {
    return this.http.post(`${this.baseUrl}/updateFaqPage/${id}`, data , { headers: this.getHeaders() });
  }

  getFaqQnsAns() {
    return this.http.post(`${this.baseUrl}/getFaqQnsAns`, {});
  }

  updateQnsAns(id: number, data: { question: string; answer: string }) {
    return this.http.post(`${this.baseUrl}/updateFaqQnsAns/${id}`, data, { headers: this.getHeaders() });
  }
  

  createFaqQnsAns(data: { question: string; answer: string }) {
    return this.http.post(`${this.baseUrl}/createFaqQnsAns`, data , { headers: this.getHeaders() });
  }



}
