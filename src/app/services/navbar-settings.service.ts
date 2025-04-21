import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavbarSettingsService {

  // private apiUrl = 'http://localhost:3000/api/admin';

  private baseUrl = environment.baseurl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  // Get Navbar settings
  getNavbarOptions(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/getNavbarOption`, {});
  }

  // Update Navbar option
  updateNavbarOption(option: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/updateNavbarOption/${option.id}`, option, { headers: this.getHeaders() });
  }

  // Delete Navbar option
  deleteNavbarOption(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/deleteNavbarOption/${id}`, {}, { headers: this.getHeaders() });
  }

  uploadBrandLogo(formData: FormData): Observable<any> {
    const navbarId = 1; // hardcoded as per your requirement
    return this.http.post<any>(`${this.baseUrl}/admin/updateNavbarOption/${navbarId}`, formData, { headers: this.getHeaders() });
  }

  updateBrandName(brand_name: string) {
    const navbarId = 3; // hardcoded as per your requirement
    return this.http.post<any>(`${this.baseUrl}/admin/updateNavbarOption/${navbarId}`, {
      brand_name
    }, { headers: this.getHeaders() });
  }



}
