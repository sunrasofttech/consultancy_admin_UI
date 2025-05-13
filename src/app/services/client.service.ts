import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Payload for CREATING a new scheduled email for a client
export interface CreateScheduleClientPayload {
  clientId: number; // This MUST map to the `client_id` in your `scheduled_email_clients` table
  email: string;
  subject: string;
  htmlContent: string;
  frequencyDays: number;
  isActive: boolean;
  imageFile: File | null; // Optional new image file
}

// Payload for UPDATING an existing scheduled email for a client
export interface UpdateScheduleClientPayload {
  scheduleId: number; // The ID of the `scheduled_email_clients` record
  clientId: number;   // The `client_id` associated with this schedule (ensure consistency with create)
  email: string;
  subject: string;
  htmlContent: string;
  frequencyDays: number;
  isActive: boolean;
  imageFile: File | null;     // Optional new image file to replace the existing one
  removeImage?: boolean;      // Flag to indicate if the existing image should be removed
}


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.baseurl}`; // Ensure this is defined in your environment files

  private getHeaders(isFormData: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type for FormData; the browser does this automatically with the correct boundary.
    // For JSON, we set it explicitly.
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  // MODIFIED: Fetch all user purchases with pagination and search parameters
  getAllUserPurchases(page: number = 1, search: string = ''): Observable<any> {
    const body: any = {
      page: page,
      search: search
    };
   
    return this.http.post<any>(`${this.baseUrl}/userPurchase/getAllUserPurchase`, body, {
      headers: this.getHeaders() 
    });
  }

  // Update general details of a user purchase (like status, notes)
  updateUserPurchaseByAdmin(purchaseId: number, body: any): Observable<any> {
    // `purchaseId` here is `userPurchases.purchase_id`
    return this.http.post<any>(
      `${this.baseUrl}/userPurchase/updateUserPurchaseByAdmin/${purchaseId}`,
      body,
      { headers: this.getHeaders() } // Assuming body is JSON
    );
  }

  // (Optional) Send a one-off custom email - if still needed separately from scheduling
  sendCustomEmail(emailPayload: { identifierId: number; email: string; subject: string; htmlContent: string }): Observable<any> {
    // Ensure `identifierId` maps correctly to what the backend expects for a client/purchase for one-off emails
    return this.http.post<any>(`${this.baseUrl}/admin/sendBookingRemmainderMail`, emailPayload, { // Verify endpoint is correct for clients
      headers: this.getHeaders() // Assuming JSON payload
    });
  }

  // --- Client Email Scheduling Methods ---

  // CREATE a new scheduled email for a client
  createScheduledClientEmail(payload: CreateScheduleClientPayload): Observable<any> {
    const formData = new FormData();

    formData.append('clientId', String(payload.clientId)); // This is crucial, map to backend's client identifier
    formData.append('email', payload.email);
    formData.append('subject', payload.subject);
    formData.append('htmlContent', payload.htmlContent);
    formData.append('frequencyDays', String(payload.frequencyDays));
    formData.append('isActive', String(payload.isActive)); // Send as 'true' or 'false' string

    if (payload.imageFile) {
      // The key 'imageUrl' must match the field name expected by Multer on your backend
      formData.append('imageUrl', payload.imageFile, payload.imageFile.name);
    }

    const url = `${this.baseUrl}/admin/scheduled-email-client`;
    return this.http.post<any>(url, formData, { headers: this.getHeaders(true) }); // isFormData = true
  }

  // UPDATE an existing scheduled email for a client
  updateScheduledClientEmail(payload: UpdateScheduleClientPayload): Observable<any> {
    const formData = new FormData();

    // The backend PUT /admin/updateScheduledEmailClient/:scheduleId uses scheduleId in the URL.
    // Check if your backend also requires clientId in the FormData body for this update route.
    // If not, you can omit appending it here. For consistency with create, let's assume it might be useful for validation.
    formData.append('clientId', String(payload.clientId)); // Optional, depending on backend needs for PUT

    formData.append('email', payload.email);
    formData.append('subject', payload.subject);
    formData.append('htmlContent', payload.htmlContent);
    formData.append('frequencyDays', String(payload.frequencyDays));
    formData.append('isActive', String(payload.isActive));

    if (payload.imageFile) { // If a new image is being uploaded
      formData.append('imageUrl', payload.imageFile, payload.imageFile.name);
    } else if (payload.removeImage === true) { // If explicitly told to remove the existing image AND no new one is uploaded
      formData.append('removeImage', 'true'); // Send a flag for the backend to handle deletion
    }
    // If no imageFile and removeImage is false/undefined, the backend should keep the existing image.

    const url = `${this.baseUrl}/admin/updateScheduledEmailClient/${payload.scheduleId}`;
    return this.http.put<any>(url, formData, { headers: this.getHeaders(true) }); // isFormData = true
  }

  // (Optional) DELETE a scheduled email for a client
  // deleteScheduledClientEmail(scheduleId: number): Observable<any> {
  //   const url = `${this.baseUrl}/admin/deleteScheduledEmailClient/${scheduleId}`; // Define this route on backend
  //   return this.http.delete<any>(url, { headers: this.getHeaders() });
  // }
}