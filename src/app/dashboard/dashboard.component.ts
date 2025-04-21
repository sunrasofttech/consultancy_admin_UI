

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalBookings: number = 0;
  totalPendingBookings: number = 0;
  totalCompletedBookings: number = 0;
  totalCanceledBookings: number = 0;
  todayTotalBookings: number = 0;


  constructor(private dashboardService: DashboardService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchBookingCount();

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


}
