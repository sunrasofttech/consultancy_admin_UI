

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';


// Define an interface for better type safety (optional but recommended)
interface DashboardData {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingPayments: number;
  paymentBreakdown: { payment_status: string; count: number }[];
  clientStatusBreakdown: { client_status: string; count: number }[];
  projectStatusBreakdown: { project_status: string; count: number }[];
  planPopularity: { title: string; purchase_count: number }[];
  latestPurchases: LatestPurchase[]; // Use interface below
}

interface LatestPurchase {
  name: string;
  email: string;
  price: string; // Keep as string if API sends it this way, or parse to number
  purchase_date: string; // Use string for date from API
  project_status: string;
  payment_status: string;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


   // --- Properties for the NEW data ---
   isLoading: boolean = true; // To show a loading indicator
   dashboardData: DashboardData | null = null; // Holds all dashboard data
   errorMessage: string | null = null; // To display errors

  totalBookings: number = 0;
  totalPendingBookings: number = 0;
  totalCompletedBookings: number = 0;
  totalCanceledBookings: number = 0;
  todayTotalBookings: number = 0;
  todayClients: number =0;
  totalClients: number =0;

  



  constructor(private dashboardService: DashboardService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchBookingCount();

  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // Assuming your service has a method like getDashboardMetrics()
    // that returns an Observable matching the new data structure
    this.dashboardService.getDashboardMetrics().subscribe({ // <--- CHANGE THIS METHOD NAME
      next: (response) => {
        if (response.status && response.data) {
          this.dashboardData = response.data;
           // You might want to parse numeric strings here if needed
           // e.g., this.dashboardData.totalRevenue = parseFloat(response.data.totalRevenue) || 0;
           // e.g., this.dashboardData.latestPurchases.forEach(p => p.price = parseFloat(p.price) || 0);
        } else {
          this.errorMessage = response.message || 'Failed to load dashboard data.';

        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.errorMessage = 'An error occurred while fetching dashboard data.';
        this.showSnackbar(this.errorMessage);
        this.isLoading = false;
      }
    });
  }


  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }


  // Method to call the service and fetch the booking count
  fetchBookingCount(): void {
    this.dashboardService.getAllCountBooking().subscribe({
      next: (response) => {
        if (response.status) {
          this.totalBookings = response.data.totalBookings;
          this.totalPendingBookings = response.data.totalPendingBookings;
          this.totalCompletedBookings = response.data.totalCompletedBookings;
          this.totalCanceledBookings = response.data.totalCanceledBookings;
          this.todayTotalBookings = response.data.todayTotalBookings;
        } else {
          this.showSnackbar('Failed to load booking stats.');
        }
      },
      error: (error) => {
        console.error('Error fetching booking count:', error);
        this.showSnackbar('Error fetching booking statistics.');
      }
    });
  }

   // Helper to maybe get specific counts from breakdowns if needed elsewhere
   getCountFromBreakdown(breakdown: { count: number; [key: string]: any }[] | undefined, statusKey: string, statusValue: string): number {
    if (!breakdown) return 0;
    const item = breakdown.find(b => b[statusKey] === statusValue);
    return item ? item.count : 0;
}



}
