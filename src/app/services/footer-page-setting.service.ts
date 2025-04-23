import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FooterPageSettingService {

  private baseUrl = environment.baseurl;


  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }



  // Fetch Feature Page content
  getFooterContent(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getFooterContent`, {});
  }


  updateFooterContent(id: number, footerContent: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/updateFooterContent/${id}`, footerContent, { headers: this.getHeaders() });
  }

  // Create a new footer social icon
  createFooterSocialIcon(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/createFooterSocailIcon`, formData, {
      headers: this.getHeaders()
    });
  }

  getFooterSocialIcons(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/getFooterSocailIcon`, {});
  }

  updateFooterSocialIcon(id: number, data: FormData) {
    return this.http.post(`${this.baseUrl}/admin/updateFooterSocialIcon/${id}`, data, { headers: this.getHeaders() });
  }
  

}
