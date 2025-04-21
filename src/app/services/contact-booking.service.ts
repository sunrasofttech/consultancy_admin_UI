import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactBookingService {

  private baseUrl = environment.baseurl;

  constructor(private http: HttpClient) { }

   private getHeaders() {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
      });
    }

  getContactPage() {
    return this.http.post<any>(`${this.baseUrl}/admin/getContactPage`, {});
  }

  updateContactPage(id: number, data: any) {
    const formData = new FormData();

    if (data.heading !== undefined) formData.append('heading', data.heading);
    if (data.subheading !== undefined) formData.append('subheading', data.subheading);
    if (data.button_text !== undefined) formData.append('button_text', data.button_text);
    if (data.image) formData.append('image', data.image);

    return this.http.patch<any>(`${this.baseUrl}/admin/updateContactPage/${id}`, formData , { headers: this.getHeaders() });
  }
}
