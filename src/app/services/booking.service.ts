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

  // Fetch available slots from the backend
  getAvailableSlots(): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/admin/getSlotsTime`,{});
  }


  updateSlotStatus(slotId: number, isActive: boolean, time?: string): Observable<any> {
    // Prepare the request body with 'is_active' as a boolean and 'time' as a string
    const payload = { is_active: isActive, time };  // Ensure 'is_active' is sent as a boolean (flat structure)
  
    console.log('Payload being sent:', payload);  // Log the payload to ensure it's correct
  
    return this.http.post(`${this.baseUrl}/admin/updateSlotTime/${slotId}`, payload, { headers: this.getHeaders() });
  }
  






  // Save changes to multiple slots at once
  updateMultipleSlots(slots: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateMultipleSlots`, { slots });
  }




}

