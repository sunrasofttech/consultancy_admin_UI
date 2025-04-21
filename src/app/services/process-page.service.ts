import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessPageService {
  // private baseUrl = 'http://localhost:3000/api/admin';

  private baseUrl = environment.baseurl;


  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  getAllProcessSteps(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getAllProcessSteps`, {});
  }

  updateProcessStepTitle(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/updateProcessStepTitle/${id}`, data, { headers: this.getHeaders() });
  }

  createProcessStep(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/createProcessStep`, formData, { headers: this.getHeaders() });
  }

  createProcessStepPoint(data: any) {
    return this.http.post<any>(`${this.baseUrl}/admin/createProcessStepPoint`, data, { headers: this.getHeaders() });
  }

  updateProcessStepPoint(id: number, data: { point_text: string }) {
    return this.http.post<any>(`${this.baseUrl}/admin/updateProcessStepPoint/${id}`, data, { headers: this.getHeaders() });
  }

  updateProcessStep(id: number, data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/admin/updateProcessStep/${id}`, data, { headers: this.getHeaders() });
  }






}
