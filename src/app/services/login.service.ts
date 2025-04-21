import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private apiUrl = 'http://localhost:3000/api/admin/adminLogin'; 
  private apiUrl = `${environment.baseurl}/admin/adminLogin`;  // Use base URL from environment

  constructor(private http: HttpClient) { }

  adminLogin(credentials: { emailOrPhone: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
