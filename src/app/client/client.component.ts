import { Component, OnInit } from '@angular/core';
import { ClientService, CreateScheduleClientPayload, UpdateScheduleClientPayload } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

export interface UserPurchase {
  purchase_id: number;
  user_id: number; // Assuming this also comes from backend
  name: string;
  email: string;
  phone: string;
  price: number;
  project_name: string;
  project_description: string;
  payment_status: string;
  client_status: string;
  project_status: string;
  purchase_date: string;
  follow_up_notes: string | null;
  isEditing?: boolean;

  scheduleId: number | null;
  frequency_days: number | null;
  next_scheduled_at: string | null;
  scheduleIsActive: boolean | number | null;
  scheduleSubject: string | null;
  scheduleHtmlContent: string | null;
  scheduleImageUrl: string | null;

  emailSubject?: string;
  emailBody?: string;
  scheduleFrequency?: number;
  scheduleIsActiveForEdit?: boolean;
  previewImageUrl?: string | ArrayBuffer | null;
  selectedFile?: File | null;
  removeExistingImage?: boolean; // Flag for explicit image removal
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  userPurchases: UserPurchase[] = [];
  originalPurchases: UserPurchase[] = [];
  searchQuery: string = '';
  openedEmailEditorRowId: number | null = null; // Stores purchase_id

  isLoading: boolean = false;

  // --- PAGINATION PROPERTIES ---
  currentPage: number = 1;
  itemsPerPage: number = 10; // Default, will be updated by API response 'limit'
  totalUserPurchases: number = 0;
  totalPages: number = 0;
  // --- END PAGINATION PROPERTIES ---

  constructor(private clientService: ClientService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUserPurchases();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  loadUserPurchases(): void {
    // this.isLoading = true;
    const previouslyOpenedEditorId = this.openedEmailEditorRowId;
    const preservedEditorStates = new Map<number, Partial<UserPurchase>>();

    if (previouslyOpenedEditorId !== null) {
        const openPurchase = this.userPurchases.find(p => p.purchase_id === previouslyOpenedEditorId);
        if (openPurchase) {
            preservedEditorStates.set(openPurchase.purchase_id, {
                emailSubject: openPurchase.emailSubject,
                emailBody: openPurchase.emailBody,
                scheduleFrequency: openPurchase.scheduleFrequency,
                scheduleIsActiveForEdit: openPurchase.scheduleIsActiveForEdit,
                previewImageUrl: openPurchase.previewImageUrl,
                selectedFile: openPurchase.selectedFile,
                removeExistingImage: openPurchase.removeExistingImage, // Preserve this
                isEditing: openPurchase.isEditing
            });
        }
    }

    // Pass currentPage and searchQuery to the service.
    // The service method getAllUserPurchases was updated to accept these.
    this.clientService.getAllUserPurchases(this.currentPage, this.searchQuery).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.status === true && res.data) {
          this.userPurchases = res.data.map((purchaseData: any): UserPurchase => {
            const preservedState = preservedEditorStates.get(purchaseData.purchase_id);
            const backendRelativeImageUrl = purchaseData.scheduleImageUrl;
            let fullImageUrl = null;
            if (backendRelativeImageUrl && backendRelativeImageUrl.startsWith('/')) {
                fullImageUrl = `${environment.image_url}${backendRelativeImageUrl}`;
            } else {
                fullImageUrl = backendRelativeImageUrl;
            }
            return {
              purchase_id: purchaseData.purchase_id,
              user_id: purchaseData.user_id,
              name: purchaseData.name,
              email: purchaseData.email,
              phone: purchaseData.phone,
              price: parseFloat(purchaseData.price),
              project_name: purchaseData.project_name,
              project_description: purchaseData.project_description,
              payment_status: purchaseData.payment_status,
              client_status: purchaseData.client_status,
              project_status: purchaseData.project_status,
              purchase_date: purchaseData.purchase_date,
              follow_up_notes: purchaseData.follow_up_notes,
              scheduleId: purchaseData.scheduleId,
              frequency_days: purchaseData.frequency_days,
              next_scheduled_at: purchaseData.next_scheduled_at,
              scheduleIsActive: purchaseData.scheduleIsActive,
              scheduleSubject: purchaseData.scheduleSubject,
              scheduleHtmlContent: purchaseData.scheduleHtmlContent,
              scheduleImageUrl: fullImageUrl,
              emailSubject: preservedState?.emailSubject || purchaseData.scheduleSubject || '',
              emailBody: preservedState?.emailBody || (purchaseData.scheduleHtmlContent ? purchaseData.scheduleHtmlContent.replace(/<br\s*\/?>/gi, '\n') : ''),
              scheduleFrequency: preservedState?.scheduleFrequency ?? purchaseData.frequency_days ?? 7,
              scheduleIsActiveForEdit: preservedState?.scheduleIsActiveForEdit ?? (purchaseData.scheduleIsActive !== null ? (purchaseData.scheduleIsActive === 1 || purchaseData.scheduleIsActive === true) : true),
              previewImageUrl: preservedState?.previewImageUrl || null,
              selectedFile: preservedState?.selectedFile || null,
              removeExistingImage: preservedState?.removeExistingImage || false,
              isEditing: preservedState?.isEditing || false,
            };
          });

          // --- UPDATE PAGINATION PROPERTIES FROM API RESPONSE ---
          // The API response for clients has pagination data at the top level
          // AND also nested within a "pagination" object. We'll use the nested one for consistency if present.
          if (res.pagination) {
            this.totalUserPurchases = res.pagination.total || 0;
            this.itemsPerPage = res.pagination.limit || 10;
            this.currentPage = res.pagination.page || 1;
            this.totalPages = this.totalUserPurchases > 0 ? Math.ceil(this.totalUserPurchases / this.itemsPerPage) : 0;
          } else { // Fallback if nested pagination object is missing
            this.totalUserPurchases = res.total || 0;
            this.itemsPerPage = res.limit || 10;
            this.currentPage = res.page || 1;
            this.totalPages = this.totalUserPurchases > 0 ? Math.ceil(this.totalUserPurchases / this.itemsPerPage) : 0;
          }
          // --- END PAGINATION UPDATE ---

          // Logic for originalPurchases if doing client-side search (might be removed if search is fully backend)
          // this.originalPurchases = JSON.parse(JSON.stringify(this.userPurchases.map(p => ({...p, selectedFile: null, previewImageUrl: null, removeExistingImage: false }))));

        } else {
          this.userPurchases = [];
          this.totalUserPurchases = 0;
          this.totalPages = 0;
          this.currentPage = 1; // Reset current page
          this.showSnackbar(res?.message || 'No purchase data found.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, 'load purchases');
        this.userPurchases = [];
        this.totalUserPurchases = 0;
        this.totalPages = 0;
        this.currentPage = 1; // Reset current page
      }
    });
  }

   changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.currentPage = page;
      this.loadUserPurchases();
    }
  }

  // searchPurchases(): void {
  //   this.openedEmailEditorRowId = null;
  //   const query = this.searchQuery.toLowerCase().trim();
  //   if (query === '') {
  //     this.userPurchases = JSON.parse(JSON.stringify(this.originalPurchases));
  //   } else {
  //     this.userPurchases = this.originalPurchases.filter(purchase =>
  //       Object.values(purchase).some(value =>
  //         String(value).toLowerCase().includes(query)
  //       )
  //     );
  //   }
  // }

  searchPurchases(): void {
    this.currentPage = 1; // Reset to first page for new search query
    this.openedEmailEditorRowId = null; // Close any open editor
    this.loadUserPurchases(); // Call loadUserPurchases to fetch with new searchQuery from backend
  }

  updateStatus(purchase: UserPurchase, field: keyof UserPurchase, value: string | boolean) {
    if (purchase[field] === value) return;
    const originalValue = purchase[field];
    const payload: any = { [field]: value };
    (purchase as any)[field] = value;

    this.isLoading = true;
    this.clientService.updateUserPurchaseByAdmin(purchase.purchase_id, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.status) {
          this.showSnackbar('Status updated successfully');
          const originalIndex = this.originalPurchases.findIndex(p => p.purchase_id === purchase.purchase_id);
          if (originalIndex > -1) (this.originalPurchases[originalIndex] as any)[field] = value;
        } else {
           this.showSnackbar(res?.message || 'Failed to update status.');
           (purchase as any)[field] = originalValue;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, `update ${String(field)}`);
        (purchase as any)[field] = originalValue;
      }
    });
  }

  toggleEditMode(purchase: UserPurchase) {
    if (purchase.isEditing && !this.isLoading) {
      this.updateFollowUpNotes(purchase);
    } else if (!this.isLoading) {
       purchase.isEditing = !purchase.isEditing;
    }
  }

  updateFollowUpNotes(purchase: UserPurchase) {
    const payload = { follow_up_notes: purchase.follow_up_notes || '' };
    this.isLoading = true;
    this.clientService.updateUserPurchaseByAdmin(purchase.purchase_id, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.status) {
          this.showSnackbar('Follow-up note updated successfully');
          const originalIndex = this.originalPurchases.findIndex(p => p.purchase_id === purchase.purchase_id);
          if (originalIndex > -1) this.originalPurchases[originalIndex].follow_up_notes = payload.follow_up_notes;
          purchase.isEditing = false;
        } else {
          this.showSnackbar(res?.message || 'Failed to update follow-up note.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleApiError(err, 'update follow-up notes');
      }
    });
  }

  toggleEmailEditor(purchase: UserPurchase | null): void {
    const currentTargetPurchaseId = purchase ? purchase.purchase_id : null;

    if (this.isLoading && (purchase !== null && this.openedEmailEditorRowId !== currentTargetPurchaseId)) {
      return;
    }
    const previousEditorId = this.openedEmailEditorRowId;

    if (previousEditorId !== null && previousEditorId !== currentTargetPurchaseId) {
      const previousPurchase = this.userPurchases.find(p => p.purchase_id === previousEditorId);
      if (previousPurchase) {
        this.resetEditorTemporaryFields(previousPurchase);
      }
    }

    if (this.openedEmailEditorRowId === currentTargetPurchaseId || currentTargetPurchaseId === null) {
      this.openedEmailEditorRowId = null;
      if (purchase) {
        this.resetEditorTemporaryFields(purchase);
      }
    } else { // Opening a new editor (currentTargetPurchaseId is not null)
      this.openedEmailEditorRowId = currentTargetPurchaseId;
      if (purchase) { // Should always be true if currentTargetPurchaseId is not null
        this.resetEditorTemporaryFields(purchase);
        this.populateEditorFields(purchase);
      }
    }
  }

  private resetEditorTemporaryFields(purchase: UserPurchase): void {
    purchase.selectedFile = null;
    purchase.previewImageUrl = null;
    purchase.removeExistingImage = false; // Always reset this
  }

  private populateEditorFields(purchase: UserPurchase): void {
     if (purchase.scheduleId) {
        if (purchase.emailSubject === undefined || purchase.emailSubject === '') purchase.emailSubject = purchase.scheduleSubject || `Follow-up: ${purchase.project_name || 'Your Purchase'}`;
        if (purchase.emailBody === undefined || purchase.emailBody === '') purchase.emailBody = purchase.scheduleHtmlContent ? purchase.scheduleHtmlContent.replace(/<br\s*\/?>/gi, '\n') : `This is a follow-up regarding your purchase of "${purchase.project_name || 'our service'}".`;
        purchase.scheduleFrequency = purchase.scheduleFrequency ?? purchase.frequency_days ?? 7; // Default to 7 if not set
        purchase.scheduleIsActiveForEdit = purchase.scheduleIsActiveForEdit ?? (purchase.scheduleIsActive !== null ? (purchase.scheduleIsActive === 1 || purchase.scheduleIsActive === true) : true);
     } else {
        if (purchase.emailSubject === undefined || purchase.emailSubject === '') purchase.emailSubject = `Regarding your purchase: ${purchase.project_name || 'Service'}`;
        if (purchase.emailBody === undefined || purchase.emailBody === '') {
            const purchaseDateFormatted = purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString() : 'your recent purchase';
            purchase.emailBody = `Hello ${purchase.name || 'Client'},\n\nThis email concerns your purchase of "${purchase.project_name || 'our service'}" made around ${purchaseDateFormatted}.\n\nWe hope you are enjoying it! Please let us know if you have any questions or need assistance.\n\nBest regards,\nSunra Softech Pvt Ltd`; // Replace placeholder
        }
        purchase.scheduleFrequency = purchase.scheduleFrequency ?? 7; // Default to 7
        purchase.scheduleIsActiveForEdit = purchase.scheduleIsActiveForEdit ?? true; // Default to active
     }
     purchase.removeExistingImage = false; // Always reset this flag when opening/populating
  }

  onFileSelected(event: Event, purchase: UserPurchase): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
        if (!file.type.startsWith('image/')) {
            this.showSnackbar('Please select a valid image file (PNG, JPG, GIF).');
            this.clearFileInput(purchase, element);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.showSnackbar('Image size should not exceed 5MB.');
            this.clearFileInput(purchase, element);
            return;
        }
        purchase.selectedFile = file;
        purchase.removeExistingImage = false; // New file selected, so not "just removing"
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            purchase.previewImageUrl = e.target?.result ?? null;
        };
        reader.onerror = () => {
            this.showSnackbar("Could not read file for preview.");
            this.clearFileInput(purchase, null);
        };
        reader.readAsDataURL(file);
    }
  }

  private clearFileInput(purchase: UserPurchase, fileInput: HTMLInputElement | null): void {
    purchase.selectedFile = null;
    purchase.previewImageUrl = null;
    // Do not modify purchase.removeExistingImage here. That's handled by removeImage() or onFileSelected().
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeImage(purchase: UserPurchase, fileInput: HTMLInputElement): void {
    this.clearFileInput(purchase, fileInput); // Clears selection and preview
    if (purchase.scheduleImageUrl) { // If there was an image from backend
      purchase.removeExistingImage = true; // Mark for removal on save
      this.showSnackbar('Existing image will be removed when schedule is saved.');
    } else {
      purchase.removeExistingImage = false; // No backend image, so just clear selection
      this.showSnackbar('Image selection cleared.');
    }
  }

  scheduleEmailForClient(purchase: UserPurchase, fileInput: HTMLInputElement | null): void {
    const subject = purchase.emailSubject?.trim();
    const body = purchase.emailBody?.trim();
    const frequency = purchase.scheduleFrequency;
    const isActive = purchase.scheduleIsActiveForEdit;

    if (!subject) { this.showSnackbar('Email subject is required.'); return; }
    if (!body) { this.showSnackbar('Email message is required.'); return; }
    if (frequency === undefined || frequency === null || Number(frequency) < 1) {
        this.showSnackbar('Valid frequency (in days, minimum 1) is required.'); return;
    }
    if (isActive === undefined || isActive === null) {
        this.showSnackbar('Schedule status (Active/Inactive) is required.'); return;
    }

    this.isLoading = true;
    const imageFile = purchase.selectedFile || null;

    // CRITICAL: Determine the correct ID for 'clientId' in the payload.
    // This depends on what `scheduled_email_clients.client_id` refers to in your DB.
    // Option 1: It refers to the user -> use `purchase.user_id`
    // Option 2: It refers to the purchase itself -> use `purchase.purchase_id`
    // I'll assume Option 2 for now as it's more specific to the purchase context for scheduling an email about *that* purchase.
    // **VERIFY THIS AGAINST YOUR DATABASE SCHEMA!**
    const clientIdForSchedule = purchase.purchase_id; // <<<< ***** VERIFY THIS *****

    if (purchase.scheduleId) { // UPDATE
      const updatePayload: UpdateScheduleClientPayload = {
        scheduleId: purchase.scheduleId,
        clientId: clientIdForSchedule,
        email: purchase.email,
        subject: subject,
        htmlContent: body.replace(/\n/g, '<br>'),
        frequencyDays: Number(frequency),
        isActive: Boolean(isActive),
        imageFile: imageFile,
        removeImage: purchase.removeExistingImage || false, // Pass the flag
      };
      this.clientService.updateScheduledClientEmail(updatePayload).subscribe({
        next: (response) => this.handleScheduleApiResponse(response, purchase, fileInput, true),
        error: (err) => this.handleApiError(err, 'update schedule')
      });
    } else { // CREATE
      const createPayload: CreateScheduleClientPayload = {
        clientId: clientIdForSchedule,
        email: purchase.email,
        subject: subject,
        htmlContent: body.replace(/\n/g, '<br>'),
        frequencyDays: Number(frequency),
        isActive: Boolean(isActive),
        imageFile: imageFile
      };
      this.clientService.createScheduledClientEmail(createPayload).subscribe({
         next: (response) => this.handleScheduleApiResponse(response, purchase, fileInput, false),
         error: (err) => this.handleApiError(err, 'create schedule')
      });
    }
  }

  private handleScheduleApiResponse(response: any, purchase: UserPurchase, fileInput: HTMLInputElement | null, isUpdate: boolean): void {
      this.isLoading = false;
      const actionVerb = isUpdate ? 'updated' : 'created';
      if (response && response.status === true) {
        this.showSnackbar(`Email schedule ${actionVerb} successfully!`);

        if (fileInput) this.clearFileInput(purchase, fileInput);
        purchase.removeExistingImage = false; // Reset flag

        if (this.openedEmailEditorRowId === purchase.purchase_id) {
            this.openedEmailEditorRowId = null; // Close editor for this purchase
        }
        this.loadUserPurchases(); // Refresh list
      } else {
        this.showSnackbar(response?.message || `Failed to ${actionVerb} email schedule. Please try again.`);
      }
  }

  private handleApiError(err: any, actionContext: string): void {
     this.isLoading = false;
     console.error(`API Error during ${actionContext}:`, err);
     const backendMessage = err?.error?.message || err?.error?.error || err?.message;
     const defaultMessage = `An error occurred during ${actionContext}. Please check console or try again.`;
     this.showSnackbar(backendMessage || defaultMessage);
  }

  onImageError(event: Event) {
    console.warn('Image failed to load:', (event.target as HTMLImageElement).src);
     (event.target as HTMLImageElement).style.display = 'none';
  }

  // Optional: deleteClientSchedule method (if you add a delete button)
  // ...


}