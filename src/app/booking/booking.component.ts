import { Component, OnInit } from '@angular/core';
import { BookingService, UpdateScheduleEmailPayload, ScheduleEmailPayload } from '../services/booking.service'; // Ensure correct path
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment'; // Ensure correct path

export interface Booking {
  id: number; // This is assumed to be the unique identifier for the booking row
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  message: string;
  createdAt: string; // Assuming these come from backend
  updatedAt: string; // Assuming these come from backend
  isDeleted?: boolean; // Optional, if backend provides it
  scheduleId: number | null;
  frequency_days: number | null;
  next_scheduled_at: string | null;
  scheduleIsActive: boolean | number | null; // Backend might send 0/1
  scheduleSubject: string | null;
  scheduleHtmlContent: string | null;
  scheduleImageUrl: string | null; // FULL URL from backend after processing

  // Editor/Preview specific temporary fields
  emailSubject?: string;
  emailBody?: string;
  scheduleFrequency?: number;
  scheduleIsActiveForEdit?: boolean; // For the editor's active checkbox (always boolean)
  previewImageUrl?: string | ArrayBuffer | null; // For NEW image preview
  selectedFile?: File | null; // For the NEW selected file object
  removeExistingImage?: boolean; // Flag for explicit image removal
}


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookings: Booking[] = [];
  totalBookings: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  searchQuery: string = '';
  perPage: number = 10; // Default, can be updated from API if pagination info includes it

  filter: string = '';
  fromDate: string = '';
  toDate: string = '';

  isLoading: boolean = false;

  isSlotManagementPopupOpen: boolean = false;
  availableSlots: any[] = []; // Consider defining an interface for Slot
  editedSlotIndex: number | null = null;

  openedEmailEditorRowId: number | null = null; // Stores booking.id

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchBookings();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'] // Make sure this CSS class is defined
    });
  }

  formatTime(time: string): string {
    if (!time || !time.includes(':')) return time; // Basic validation
    try {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date(); // Use a temporary date object for formatting
        date.setHours(hours, minutes); // Set hours and minutes on it
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
        console.error("Error formatting time:", time, e);
        return time; // Return original time on error
    }
  }

  fetchBookings(): void {
    // this.isLoading = true;
    const previouslyOpenedEditorId = this.openedEmailEditorRowId;
    const preservedEditorStates = new Map<number, Partial<Booking>>();

    // Preserve editor state if an editor was open before refetching
    if (previouslyOpenedEditorId !== null) {
        const openBooking = this.bookings.find(b => b.id === previouslyOpenedEditorId);
        if (openBooking) {
            preservedEditorStates.set(openBooking.id, {
                emailSubject: openBooking.emailSubject,
                emailBody: openBooking.emailBody,
                scheduleFrequency: openBooking.scheduleFrequency,
                scheduleIsActiveForEdit: openBooking.scheduleIsActiveForEdit,
                previewImageUrl: openBooking.previewImageUrl,
                selectedFile: openBooking.selectedFile,
                removeExistingImage: openBooking.removeExistingImage,
            });
        }
    }

    this.bookingService.getAllBookings(this.currentPage, this.searchQuery, this.filter, this.fromDate, this.toDate)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && response.status === true && response.bookings) {
            this.bookings = response.bookings.map((bData: any): Booking => {
              const preservedState = preservedEditorStates.get(bData.id); // Use booking's unique ID
              const backendRelativeImageUrl = bData.scheduleImageUrl;
              let fullImageUrl = null;
              if (backendRelativeImageUrl && backendRelativeImageUrl.startsWith('/')) {
                  fullImageUrl = `${environment.image_url}${backendRelativeImageUrl}`;
              } else {
                  fullImageUrl = backendRelativeImageUrl; // Might be null or already a full URL
              }

              return {
                ...bData, // Spread all properties from backend booking object
                scheduleImageUrl: fullImageUrl, // Use the processed full image URL
                // Initialize or restore editor fields from preserved state or backend data
                emailSubject: preservedState?.emailSubject || bData.scheduleSubject || '',
                emailBody: preservedState?.emailBody || (bData.scheduleHtmlContent ? bData.scheduleHtmlContent.replace(/<br\s*\/?>/gi, '\n') : ''),
                scheduleFrequency: preservedState?.scheduleFrequency ?? bData.frequency_days ?? 7, // Default to 7
                scheduleIsActiveForEdit: preservedState?.scheduleIsActiveForEdit ?? (bData.scheduleIsActive !== null ? (bData.scheduleIsActive === 1 || bData.scheduleIsActive === true) : true), // Default to true
                previewImageUrl: preservedState?.previewImageUrl || null,
                selectedFile: preservedState?.selectedFile || null,
                removeExistingImage: preservedState?.removeExistingImage || false, // Initialize/restore
              };
            });

            if (response.pagination) {
                this.totalBookings = response.pagination.totalCount;
                this.totalPages = response.pagination.totalPages;
                this.perPage = response.pagination.perPage || 10; // Use API perPage or default
            } else { // Fallback if pagination object is missing or malformed
                this.totalBookings = this.bookings.length;
                this.totalPages = this.bookings.length > 0 ? Math.ceil(this.bookings.length / this.perPage) : 1;
                // this.perPage remains its current value or default
            }


             if (previouslyOpenedEditorId) {
               const bookingToReopen = this.bookings.find(b => b.id === previouslyOpenedEditorId);
               this.openedEmailEditorRowId = bookingToReopen ? previouslyOpenedEditorId : null;
             }

          } else {
             this.showSnackbar(response.message || 'Failed to fetch bookings or no bookings found.');
             this.bookings = []; // Reset to empty array
             this.totalBookings = 0;
             this.totalPages = 0;
             this.openedEmailEditorRowId = null; // Close any open editor
          }
        }, error: (err) => {
            this.isLoading = false;
            this.handleApiError(err, 'fetch');
            this.bookings = [];
            this.totalBookings = 0;
            this.totalPages = 0;
            this.openedEmailEditorRowId = null;
        }
     });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && !this.isLoading) {
        this.currentPage = page;
        this.fetchBookings();
    }
  }

  searchBookings(): void {
    this.currentPage = 1; // Reset to first page for new search
    this.openedEmailEditorRowId = null; // Close any open editor
    this.fetchBookings();
  }

  applyFilter(selectedFilter: string): void {
    if (this.filter === selectedFilter && selectedFilter !== '') {
      // Optional: if clicking the same active filter, either do nothing or toggle it off
      // this.filter = ''; // Uncomment to toggle off
      // return;
    }
    this.filter = selectedFilter;
    this.fromDate = ''; // Reset date range when applying quick filters
    this.toDate = '';
    this.currentPage = 1;
    this.openedEmailEditorRowId = null; // Close any open editor
    this.fetchBookings();
  }

  applyDateRange(): void {
    if (!this.fromDate || !this.toDate) {
      this.showSnackbar('Please select both From and To dates.');
      return;
    }
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.showSnackbar('From date cannot be after To date.');
      return;
    }
    this.filter = ''; // Clear quick filter type when applying date range
    this.currentPage = 1;
    this.openedEmailEditorRowId = null; // Close any open editor
    this.fetchBookings();
  }

  resetFilters(): void {
    this.filter = '';
    this.searchQuery = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.openedEmailEditorRowId = null; // Close any open editor
    this.fetchBookings();
  }

  onStatusChange(booking: Booking): void {
    this.isLoading = true;
    const originalBookingIndex = this.bookings.findIndex(b => b.id === booking.id);
    const originalStatus = originalBookingIndex > -1 ? this.bookings[originalBookingIndex].status : booking.status; // Fallback

    this.bookingService.updateBookingStatus(booking.id, booking.status).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          this.showSnackbar('Booking status updated successfully.');
        } else {
          this.showSnackbar(res.message || 'Failed to update status.');
           if (originalBookingIndex > -1) this.bookings[originalBookingIndex].status = originalStatus; // Revert on failure
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, 'status');
        if (originalBookingIndex > -1) this.bookings[originalBookingIndex].status = originalStatus; // Revert on error
      }
    });
  }

  openSlotManagementPopup(): void {
    this.isSlotManagementPopupOpen = true;
    this.loadAvailableSlots();
  }

  closeSlotManagementPopup(): void {
    this.isSlotManagementPopupOpen = false;
    this.editedSlotIndex = null; // Reset editing state when closing popup
  }

  loadAvailableSlots(): void {
    this.isLoading = true; // Can use a separate loader for popup if desired
    this.bookingService.getAvailableSlots().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.availableSlots = res.data.map((slot: any) => ({
             ...slot,
             is_active: Number(slot.is_active) // Ensure is_active is a number for ngValue
          }));
        } else {
           this.availableSlots = [];
           console.warn('No slot data received or format incorrect in loadAvailableSlots.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, 'slot');
      }
   });
  }

  editSlot(index: number): void {
    this.editedSlotIndex = index;
  }

  saveSingleSlot(slot: any): void {
    this.updateSlotStatus(slot); // This calls API and reloads slots
    this.editedSlotIndex = null; // Exit edit mode for this slot
  }

  updateSlotStatus(slot: any): void {
    const { id, time } = slot;
    const isActiveBoolean = slot.is_active === 1 || slot.is_active === '1' || slot.is_active === true;
    this.isLoading = true;
    this.bookingService.updateSlotStatus(id, isActiveBoolean, time).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
            this.showSnackbar('Slot updated successfully.');
        } else {
             this.showSnackbar(res.message || 'Failed to update slot status.');
        }
        this.loadAvailableSlots(); // Reload slots to reflect DB state
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, 'slot');
        this.loadAvailableSlots(); // Reload on error too
      }
    });
  }

  toggleEmailEditor(bookingId: number | null): void {
    const currentTargetBookingId = bookingId;

    // Prevent opening a new editor if another operation is loading, but allow closing the current one.
    if (this.isLoading && (bookingId !== null && this.openedEmailEditorRowId !== currentTargetBookingId)) {
      return;
    }
    const previousEditorId = this.openedEmailEditorRowId;

    // If a different editor was open, reset its temporary fields (like file selection)
    if (previousEditorId !== null && previousEditorId !== currentTargetBookingId) {
      const previousBooking = this.bookings.find(b => b.id === previousEditorId);
      if (previousBooking) {
        this.resetEditorTemporaryFields(previousBooking);
      }
    }

    // If clicking the button of an already open editor, or clicking "Cancel" (bookingId is null)
    if (this.openedEmailEditorRowId === currentTargetBookingId || currentTargetBookingId === null) {
      this.openedEmailEditorRowId = null; // Close it
      if (bookingId !== null) { // If closing a specific editor via its button
          const booking = this.bookings.find(b => b.id === bookingId);
          if (booking) this.resetEditorTemporaryFields(booking);
      }
    } else { // Opening a new editor (bookingId is not null and different from current open one)
      this.openedEmailEditorRowId = currentTargetBookingId;
      const booking = this.bookings.find(b => b.id === currentTargetBookingId); // bookingId is currentTargetBookingId
      if (booking) {
        this.resetEditorTemporaryFields(booking); // Clear any stale temp fields first
        this.populateEditorFields(booking);
      } else {
        // This case should ideally not happen if bookingId comes from a valid booking in the list
        console.error('Could not find booking with ID:', currentTargetBookingId, 'to open editor.');
        this.openedEmailEditorRowId = null; // Safety: don't leave a dangling ID
      }
    }
  }

  private resetEditorTemporaryFields(booking: Booking): void {
    booking.selectedFile = null;
    booking.previewImageUrl = null;
    booking.removeExistingImage = false; // Crucial to reset this
    // Note: We do not reset emailSubject/Body here by default.
    // populateEditorFields will handle their initialization if they are empty,
    // allowing user's in-session (unsaved) text edits to persist if they toggle the same editor.
  }

  private populateEditorFields(booking: Booking): void {
     if (booking.scheduleId) { // Existing schedule
       // Only populate if editor fields are empty (or still undefined), to allow user edits to persist during session
       if (booking.emailSubject === undefined || booking.emailSubject === '') booking.emailSubject = booking.scheduleSubject || `Follow-up for booking on ${new Date(booking.date).toLocaleDateString()}`;
       if (booking.emailBody === undefined || booking.emailBody === '') booking.emailBody = booking.scheduleHtmlContent ? booking.scheduleHtmlContent.replace(/<br\s*\/?>/gi, '\n') : `This is a follow-up regarding your booking.`;
       booking.scheduleFrequency = booking.scheduleFrequency ?? booking.frequency_days ?? 7;
       booking.scheduleIsActiveForEdit = booking.scheduleIsActiveForEdit ?? (booking.scheduleIsActive === 1 || booking.scheduleIsActive === true);
     } else { // New schedule
       if (booking.emailSubject === undefined || booking.emailSubject === '') {
         const bookingDateFormatted = booking.date ? new Date(booking.date).toLocaleDateString() : 'your scheduled date';
         booking.emailSubject = `Regarding your booking on ${bookingDateFormatted}`;
       }
       if (booking.emailBody === undefined || booking.emailBody === '') {
         const bookingDateFormatted = booking.date ? new Date(booking.date).toLocaleDateString() : 'your scheduled date';
         const bookingTimeFormatted = booking.time ? this.formatTime(booking.time) : 'the scheduled time';
         booking.emailBody = `Hello ${booking.name || 'Customer'},\n\nThis is a reminder for your booking scheduled for ${bookingDateFormatted} at ${bookingTimeFormatted}.\n\nPlease let us know if you need to reschedule.\n\nBest regards,\n[Your Company Name]`; // Replace placeholder
       }
       booking.scheduleFrequency = booking.scheduleFrequency ?? 7; // Default frequency
       booking.scheduleIsActiveForEdit = booking.scheduleIsActiveForEdit ?? true; // Default to active for new
     }
     booking.removeExistingImage = false; // Always reset this when (re)opening editor panel for a booking
  }


  onFileSelected(event: Event, booking: Booking): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
        if (!file.type.startsWith('image/')) {
            this.showSnackbar('Please select a valid image file (PNG, JPG, GIF).');
            this.clearFileInput(booking, element); // Pass element to reset it
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showSnackbar('Image size should not exceed 5MB.');
            this.clearFileInput(booking, element); // Pass element to reset it
            return;
        }
        booking.selectedFile = file;
        booking.removeExistingImage = false; // If a new file is selected, we are not "just removing" an old one
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            booking.previewImageUrl = e.target?.result ?? null;
        };
        reader.onerror = (error) => { // Consistent error parameter name
            console.error("FileReader error: ", error);
            this.clearFileInput(booking, null); // Element might not be relevant here if reader fails
            this.showSnackbar("Could not read file for preview.");
        };
        reader.readAsDataURL(file);
    }
    // If no file selected (user cancelled dialog), do nothing to preserve existing selection/preview if any
  }

  private clearFileInput(booking: Booking, fileInput: HTMLInputElement | null): void {
    booking.selectedFile = null;
    booking.previewImageUrl = null;
    // booking.removeExistingImage = false; // Don't reset removeExistingImage here. It's set by removeImage() or onFileSelected()
    if (fileInput) {
      fileInput.value = ''; // Reset the <input type="file"> element value
    }
  }

  removeImage(booking: Booking, fileInput: HTMLInputElement): void {
    this.clearFileInput(booking, fileInput); // Clears selectedFile and previewImageUrl
    if (booking.scheduleImageUrl) { // If there was an image from the backend
      booking.removeExistingImage = true; // Set the flag to indicate removal on save
      this.showSnackbar('Existing image will be removed upon saving the schedule.');
    } else {
      booking.removeExistingImage = false; // No backend image to remove, ensure flag is false
      this.showSnackbar('Image selection cleared.');
    }
  }

  scheduleEmailForUser(booking: Booking, fileInput: HTMLInputElement | null): void {
    const subject = booking.emailSubject?.trim();
    const body = booking.emailBody?.trim();
    const frequency = booking.scheduleFrequency;
    const isActive = booking.scheduleIsActiveForEdit;

    if (!subject) { this.showSnackbar('Email subject is required.'); return; }
    if (!body) { this.showSnackbar('Email message is required.'); return; }
    if (frequency === undefined || frequency === null || Number(frequency) < 1) {
        this.showSnackbar('Valid frequency (in days, minimum 1) is required.'); return;
    }
    if (isActive === undefined || isActive === null) {
        this.showSnackbar('Schedule status (Active/Inactive) is required.'); return;
    }

    this.isLoading = true;
    const imageFile = booking.selectedFile || null; // Use the newly selected file, if any

    if (booking.scheduleId) { // UPDATE existing schedule
      const updatePayload: UpdateScheduleEmailPayload = {
        scheduleId: booking.scheduleId,
        email: booking.email,
        subject: subject,
        htmlContent: body.replace(/\n/g, '<br>'), // Convert newlines for HTML email
        frequencyDays: Number(frequency),
        isActive: Boolean(isActive), // Ensure boolean
        imageFile: imageFile,
        removeImage: booking.removeExistingImage || false, // Pass the flag
      };
      this.bookingService.updateScheduledBookingEmail(updatePayload).subscribe({
        next: (response) => this.handleApiResponse(response, booking, fileInput, true),
        error: (err) => this.handleApiError(err, 'update')
      });

    } else { // CREATE new schedule
      const createPayload: ScheduleEmailPayload = {
        bookingId: booking.id, // Use the booking's main unique ID
        email: booking.email,
        subject: subject,
        htmlContent: body.replace(/\n/g, '<br>'),
        frequencyDays: Number(frequency),
        isActive: Boolean(isActive), // Ensure boolean
        imageFile: imageFile
        // No removeImage flag for create operations
      };
      this.bookingService.scheduleBookingEmail(createPayload).subscribe({
         next: (response) => this.handleApiResponse(response, booking, fileInput, false),
         error: (err) => this.handleApiError(err, 'create')
      });
    }
  }

  private handleApiResponse(response: any, booking: Booking, fileInput: HTMLInputElement | null, isUpdate: boolean): void {
      this.isLoading = false;
      const actionVerb = isUpdate ? 'updated' : 'created';
      if (response && response.status === true) {
        this.showSnackbar(`Email schedule ${actionVerb} successfully!`);

        if(fileInput) this.clearFileInput(booking, fileInput); // Clear temporary file info after successful submission
        booking.removeExistingImage = false; // Reset this flag on the booking object

        // Close the editor for this specific booking
        if (this.openedEmailEditorRowId === booking.id) {
            this.openedEmailEditorRowId = null;
        }
        this.fetchBookings(); // Refresh the list to show updated data (including new scheduleId, next_scheduled_at etc.)
      } else {
        this.showSnackbar(response.message || `Failed to ${actionVerb} email schedule. Please try again.`);
        // Do not close editor on failure, allow user to correct potential issues
      }
  }

  private handleApiError(err: any, actionContext: 'create' | 'update' | 'fetch' | 'status' | 'slot'): void {
     this.isLoading = false;
     console.error(`API Error during ${actionContext}:`, err);
     const backendMessage = err?.error?.message || err?.error?.error || err?.message; // Try to get specific error message from backend
     const defaultMessage = `An error occurred during ${actionContext}. Please check console or try again.`;
     this.showSnackbar(backendMessage || defaultMessage);
  }

  onImageError(event: Event) {
    console.warn('Image failed to load:', (event.target as HTMLImageElement).src);
     (event.target as HTMLImageElement).style.display = 'none'; // Hide broken image element to prevent ugly UI
  }

  // Optional: If you implement a delete schedule button and service method
  // deleteSchedule(scheduleId: number): void {
  //   if (!scheduleId) return; // Basic guard
  //   if (!confirm('Are you sure you want to delete this email schedule? This action cannot be undone.')) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.bookingService.deleteScheduledBookingEmail(scheduleId).subscribe({ // You would need to create this method in BookingService
  //     next: (response) => {
  //       this.isLoading = false;
  //       if (response && response.status) {
  //         this.showSnackbar('Schedule deleted successfully.');
  //         this.fetchBookings(); // Refresh the list
  //         if (this.openedEmailEditorRowId && this.bookings.find(b => b.id === this.openedEmailEditorRowId && b.scheduleId === null)) {
  //             this.openedEmailEditorRowId = null; // Close editor if it was for the deleted schedule
  //         }
  //       } else {
  //         this.showSnackbar(response?.message || 'Failed to delete schedule.');
  //       }
  //     },
  //     error: (err) => this.handleApiError(err, 'delete schedule') // You'd add 'delete schedule' to the actionContext type
  //   });
  // }
}