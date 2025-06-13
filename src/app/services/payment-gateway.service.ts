import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Define an interface for type safety
export interface PaymentGateway {
  id?: number;
  gateway_name: string;
  is_active: boolean;
  config: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {

  private apiUrl = `${environment.baseurl}/payment`;

  
  constructor(private http: HttpClient) { }

  /**
   * Fetches all configured payment gateways from the backend.
   */
  getAllGateways(): Observable<{ status: boolean, gateways: PaymentGateway[] }> {
    return this.http.get<{ status: boolean, gateways: PaymentGateway[] }>(`${this.apiUrl}/all-gateways`);
  }

  /**
   * Saves a new payment gateway.
   * @param gatewayData The data for the new gateway.
   */
  addGateway(gatewayData: { gateway_name: string, config: any }): Observable<any> {
    const payload = { ...gatewayData, is_active: false };
    return this.http.post(`${this.apiUrl}/save-gateway`, payload);
  }

  /**
   * Partially updates an existing payment gateway using PATCH.
   * @param id The ID of the gateway to update.
   * @param gatewayData A partial object of the data to update.
   */
  patchGateway(id: number, gatewayData: Partial<PaymentGateway>): Observable<any> {
    // Note: We use Partial<PaymentGateway> to indicate that not all fields are required.
    return this.http.patch(`${this.apiUrl}/updateGateways/${id}`, gatewayData);
  }

  /**
   * Activates a specific payment gateway by its ID.
   * @param gatewayId The ID of the gateway to activate.
   */
  activateGateway(gatewayId: number): Observable<any> {
    // This dedicated endpoint is still useful for a simple "Activate" button click.
    // The new patchGateway method can also handle this, but this is more explicit.
    return this.http.post(`${this.apiUrl}/activate-gateway/${gatewayId}`, {});
  }

  /**
   * Deletes a payment gateway by its ID.
   * @param gatewayId The ID of the gateway to delete.
   */
  deleteGateway(gatewayId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-gateway/${gatewayId}`);
  }
}