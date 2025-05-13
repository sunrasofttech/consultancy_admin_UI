import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Define an interface for the schedule payload for clarity
export interface ScheduleEmailPayload {
  bookingId: number;
  email: string;
  subject: string;
  htmlContent: string;
  frequencyDays: number;
  isActive: boolean;
  imageFile: File | null; // Optional image file
}

// Interface for Update Payload (includes scheduleId)
export interface UpdateScheduleEmailPayload {
  scheduleId: number; // ID of the schedule to update
  email: string;
  subject: string;
  htmlContent: string;
  frequencyDays: number;
  isActive: boolean;
  imageFile: File | null; // Optional new image file
  // Add removeImage flag if implementing image removal
  removeImage?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.baseurl}`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    // Return headers only if token exists, otherwise handle appropriately
    // (e.g., redirect to login or throw error) depending on app logic
    if (token) {
       return new HttpHeaders({
         'Authorization': `Bearer ${token}`
         // Do NOT set Content-Type for FormData, browser handles it with boundary
       });
    } else {
       console.error("Authorization token not found.");
       // Handle missing token case - maybe throw an error or return empty headers
       // depending on whether all requests need auth. For this example, returning empty.
       return new HttpHeaders();
    }
  }

  // Fetch all bookings with filters/pagination
  getAllBookings(page: number, search: string, filter: string = '', fromDate: string = '', toDate: string = ''): Observable<any> {
    const body = {
      page: page,
      search: search,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate
    };
    // Assuming this endpoint needs auth
    return this.http.post<any>(`${this.baseUrl}/booking/getAllBooking`, body, { headers: this.getHeaders() });
  }

  // Update booking status
  updateBookingStatus(id: number, status: string): Observable<any> {
    const body = { id, status };
    // Assuming this endpoint needs auth
    return this.http.post<any>(`${this.baseUrl}/booking/updateBookingStatus`, body, {
      headers: this.getHeaders()
    });
  }

  // Fetch available slots
  getAvailableSlots(): Observable<any> { // Expecting structure like { status: boolean, data: any[] }
    // Assuming this endpoint needs auth - adjust if not
    return this.http.post<any>(`${this.baseUrl}/admin/getSlotsTime`, {}, { headers: this.getHeaders() });
  }

  // Update a single slot's status and time
  updateSlotStatus(slotId: number, isActive: boolean, time?: string): Observable<any> {
    const payload = { is_active: isActive, time };
    console.log('Updating slot status with payload:', payload);
    const url = `${this.baseUrl}/admin/updateSlotTime/${slotId}`;
    // Assuming this endpoint needs auth
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }

  // Method to CREATE a scheduled email (Handles FormData)
  scheduleBookingEmail(payload: ScheduleEmailPayload): Observable<any> {
    const formData = new FormData();

    formData.append('bookingId', String(payload.bookingId));
    formData.append('email', payload.email);
    formData.append('subject', payload.subject);
    formData.append('htmlContent', payload.htmlContent);
    formData.append('frequencyDays', String(payload.frequencyDays));
    // Ensure boolean is sent correctly (as string 'true'/'false' or number 1/0 depending on backend)
    formData.append('isActive', String(payload.isActive));

    if (payload.imageFile) {
      // Key 'imageUrl' must match backend (e.g., Multer field name)
      formData.append('imageUrl', payload.imageFile, payload.imageFile.name);
    }

    const url = `${this.baseUrl}/admin/scheduled-email-booking`;
    // Assuming this endpoint needs auth. Browser sets Content-Type for FormData.
    return this.http.post<any>(url, formData, { headers: this.getHeaders() });
  }

  // Method to UPDATE a scheduled email (Handles FormData)
  // updateScheduledBookingEmail(payload: UpdateScheduleEmailPayload): Observable<any> {
  //   const formData = new FormData();

  //   // Append fields needed for update
  //   formData.append('email', payload.email);
  //   formData.append('subject', payload.subject);
  //   formData.append('htmlContent', payload.htmlContent);
  //   formData.append('frequencyDays', String(payload.frequencyDays));
  //   formData.append('isActive', String(payload.isActive));

  //   if (payload.imageFile) {
  //     formData.append('imageUrl', payload.imageFile, payload.imageFile.name);
  //   }
  //   // Add remove flag if backend expects it
  //   // if (payload.removeImage) { formData.append('removeImage', 'true'); }

  //   const url = `${this.baseUrl}/admin/updateScheduledEmailBooking/${payload.scheduleId}`; // Include ID in URL for PUT/PATCH
  //   // Assuming this endpoint needs auth. Using PUT for update.
  //   return this.http.put<any>(url, formData, { headers: this.getHeaders() });
  // }



  // Method to UPDATE a scheduled email (Handles FormData)
  updateScheduledBookingEmail(payload: UpdateScheduleEmailPayload): Observable<any> {
    const formData = new FormData();

    formData.append('email', payload.email);
    formData.append('subject', payload.subject);
    formData.append('htmlContent', payload.htmlContent);
    formData.append('frequencyDays', String(payload.frequencyDays));
    formData.append('isActive', String(payload.isActive));

    if (payload.imageFile) {
      formData.append('imageUrl', payload.imageFile, payload.imageFile.name);
    } else if (payload.removeImage === true) {
      formData.append('removeImage', 'true');
    }

    const url = `${this.baseUrl}/admin/updateScheduledEmailBooking/${payload.scheduleId}`;
    return this.http.put<any>(url, formData, { headers: this.getHeaders() });
  }




}