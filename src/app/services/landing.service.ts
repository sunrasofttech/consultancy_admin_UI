import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LandingService {

  // private baseUrl = 'http://localhost:3000/app/admin'; // Replace with your actual API base URL
  private baseUrl = environment.baseurl;


  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }

  // Get landing page info
  getLandingInfo(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getLandingPageInfo`, {});
  }

  updateLandingField(field: string, formData: FormData, landingPageId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/updateLandingPageInfo/${landingPageId}`, formData, { headers: this.getHeaders() });
  }

  getLandingPageBanners(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getLandingPageBannersForAdmin`, {});
  }


  uploadBanner(formData: FormData) {
    return this.http.post<any>('${this.baseUrl}/admin/landing/banner', formData, { headers: this.getHeaders() });
  }

  deleteBanner(id: number) {
    return this.http.post<any>(`${this.baseUrl}/admin/deleteLandingPageBanner/${id}`, {}, { headers: this.getHeaders() });
  }

  updateBanner(bannerId: number, formData: FormData) {
    return this.http.post<any>(`${this.baseUrl}/admin/updateLandingPageBanners/${bannerId}`, formData, { headers: this.getHeaders() });
  }



  // --- NEW SERVICE METHOD ---
  createBanner(formData: FormData): Observable<any> {
    // const headers = this.getAuthHeaders(); // Use headers if API is protected
    // IMPORTANT: When sending FormData, DO NOT manually set the Content-Type header.
    // HttpClient handles it correctly, including the boundary.
    // return this.http.post(`${this.apiUrl}/createLandingPageBanner`, formData, { headers });
    return this.http.post(`${this.baseUrl}/admin/createLandingPageBanner`, formData, { headers: this.getHeaders() }); // Adjust endpoint if needed
  }
  // --- END OF NEW SERVICE METHOD ---


  updateBannerSortOrder(bannerId: number, formData: FormData) {
    return this.http.post<any>(`${this.baseUrl}/admin/updateLandingPageBanners/${bannerId}`, formData, { headers: this.getHeaders() });
  }

  updateBannerStatus(bannerId: number, data: { status: string }) {
    return this.http.post<any>(
      `${this.baseUrl}/admin/update-banner-status/${bannerId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

}
