import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.baseurl}`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Correctly formatted Bearer token
    });
  }



  // Adjusting the method to properly format query parameters
  getAllBookings(page: number, search: string, filter: string = '', fromDate: string = '', toDate: string = '') {
    const body = {
      page: page,
      search: search,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate
    };

    // Call the backend API with query parameters in the POST body
    return this.http.post<any>(`${this.baseUrl}/booking/getAllBooking`, body, { headers: this.getHeaders() });
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    const body = { id, status };
    return this.http.post<any>(`${this.baseUrl}/booking/updateBookingStatus`, body, {
      headers: this.getHeaders()
    });
  }
  





}

