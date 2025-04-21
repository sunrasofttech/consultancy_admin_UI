import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  bookings: any[] = [];
  totalBookings: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  searchQuery: string = '';
  perPage: number = 10;

  filter: string = '';
  fromDate: string = '';
  toDate: string = '';

  isLoading: boolean = false;


  constructor(private bookingService: BookingService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchBookings();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',  // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top',   // 'top' | 'bottom'
      panelClass: ['custom-snackbar']
    });
  }

  // Fetch bookings with pagination and search
  fetchBookings(): void {
    this.bookingService.getAllBookings(this.currentPage, this.searchQuery, this.filter, this.fromDate, this.toDate)
      .subscribe((response) => {
        if (response.status) {
          this.bookings = response.bookings;
          this.totalBookings = response.pagination.totalCount;
          this.totalPages = response.pagination.totalPages;
          this.perPage = response.pagination.perPage;
        }
      }, error => {
        console.error('Error fetching bookings:', error);
      });
  }

  // Change page
  changePage(page: number): void {
    this.currentPage = page;
    this.fetchBookings();
  }

  // Handle search input
  searchBookings(): void {
    this.currentPage = 1;  // Reset to page 1 when searching
    this.fetchBookings();
  }

  applyFilter(selectedFilter: string): void {
    this.filter = selectedFilter;
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.fetchBookings();
  }

  applyDateRange(): void {
    this.filter = '';
    this.currentPage = 1;
    this.fetchBookings();
  }

   // Reset all filters and show all bookings
   resetFilters(): void {
    this.filter = '';
    this.searchQuery = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;  // Reset to first page
    this.fetchBookings();  // Fetch all bookings again
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  onStatusChange(booking: any): void {
    // const confirmed = confirm(`Are you sure you want to update the status to "${booking.status}"?`);
    // if (!confirmed) return;
  
    this.isLoading = true;

    this.bookingService.updateBookingStatus(booking.id, booking.status).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.status) {
          this.showSnackbar('Booking status updated successfully.');
          this.fetchBookings(); // Refresh list
        } else {
          this.showSnackbar(res.message || 'Failed to update status.');
        }
      },
      (err) => {
        this.isLoading = false;
        console.error('Error updating status:', err);
        this.showSnackbar('Error updating status.');
      }
    );
  }
  
}
