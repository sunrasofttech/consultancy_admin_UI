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

  isSlotManagementPopupOpen: boolean = false;  // Controls the visibility of the popup
  availableSlots: any[] = [];  // Use a simple array here

  editedSlotIndex: number | null = null;

  constructor(private bookingService: BookingService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchBookings();
    this.loadAvailableSlots();
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


  //  Slot logic


  // Open the popup for slot management
  openSlotManagementPopup(): void {
    console.log("click openSlotManagementPopup")
    this.isSlotManagementPopupOpen = true;
  }

  // Close the slot management popup
  closeSlotManagementPopup(): void {
    console.log("click closeSlotManagementPopup")
    this.loadAvailableSlots();
    this.isSlotManagementPopupOpen = false;
  }

  // Load available slots from the backend service
  loadAvailableSlots(): void {
    this.bookingService.getAvailableSlots().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.availableSlots = res.data;
        }
      },
      (error) => {
        console.error('Error loading available slots', error);
      }
    );
  }







  editSlot(index: number): void {
    this.editedSlotIndex = index;
  }

  saveSingleSlot(slot: any): void {
    // Call your API to update this specific slot
    this.updateSlotStatus(slot);

    // Optionally show success message here
    // this.snackbar.open('Slot saved!', 'Close', { duration: 2000 });
   
    this.editedSlotIndex = null;
  }

  updateSlotStatus(slot: any): void {
    // Extract the necessary values from the slot
    const { id, time, is_active } = slot;
  
    // Prepare the data for the service call
    let updateData: any = { time };
  
    // Add is_active to the request body only if it's provided, and make sure it's a boolean
    if (is_active !== undefined) {
      updateData.is_active = is_active === '1';  // Convert '1' to true, '0' to false
    }
  
  
    // Call the backend service to update the slot
    this.bookingService.updateSlotStatus(id, updateData.is_active, updateData.time).subscribe({
      next: (res) => {
        console.log('Slot status updated successfully:', res);
        this.loadAvailableSlots();
      },
      error: (err) => {
        console.error('Failed to update slot status:', err);
      }
    });
  

  }
  
  
  





  saveSlotChanges(): void {
    for (const slot of this.availableSlots) {
      this.updateSlotStatus(slot);
    }
    this.loadAvailableSlots();
    // Optionally show global success
    // this.snackbar.open('All changes saved!', 'Close', { duration: 2000 });

    this.editedSlotIndex = null;
  }




}
