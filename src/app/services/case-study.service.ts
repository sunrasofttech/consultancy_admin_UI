import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseStudyService {
  private apiUrl = `${environment.baseurl}/admin`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }


  getCaseStudies(data: any) {
    return this.http.post<any>(`${this.apiUrl}/getCaseStudies`, data);
  }

  updateCaseStudy(id: number, data: any) {
    return this.http.post<any>(`${this.apiUrl}/updateCaseStudy/${id}`, data, { headers: this.getHeaders() });
  }

  getCaseStudyImages() {
    return this.http.post<any>(`${this.apiUrl}/getCaseStudyImages`, {});
  }

  updateCaseStudyImage(id: number, formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/updateCaseStudyImage/${id}`, formData , { headers: this.getHeaders() });
  }

createCaseStudyImage(formData: FormData) {
  return this.http.post<any>(`${this.apiUrl}/createCaseStudyImage`, formData, { headers: this.getHeaders() });
}


}
