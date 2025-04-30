import { Component, OnInit } from '@angular/core';
import { LandingService } from '../services/landing.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-landing-page-settings',
  templateUrl: './landing-page-settings.component.html',
  styleUrls: ['./landing-page-settings.component.css']
})
export class LandingPageSettingsComponent implements OnInit {
  landingData: any = {};
  selectedFiles: { [key: string]: File } = {};
  editingField: string | null = null;
  bannerImages: any[] = [];
  bannerFile: File | null = null;


  // --- NEW PROPERTIES FOR ADDING BANNERS ---
  newBannerFile: File | null = null;
  newBannerSortOrder: number = 1; // Default sort order, adjust as needed
  isUploadingNewBanner = false; // Loading indicator for new banner upload
  uploadError: string | null = null; // To display upload errors
  uploadSuccess: string | null = null; // To display success messages
  // --- END OF NEW PROPERTIES ---


  iconsList = [
    { key: 'icon_1', label: 'Icon 1' },
    { key: 'icon_2', label: 'Icon 2' },
    { key: 'icon_3', label: 'Icon 3' },
    { key: 'icon_4', label: 'Icon 4' },
  ];

  constructor(private landingService: LandingService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchLandingData();
    this.fetchLandingBanners();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }

  fetchLandingData(): void {
    this.landingService.getLandingInfo().subscribe(
      (response: any) => {
        if (response.status && response.data && response.data.length > 0) {
          this.landingData = response.data[0];
          const baseUrl = environment.image_url;
          this.landingData.icon_1 = baseUrl + this.landingData.icon_1;
          this.landingData.icon_2 = baseUrl + this.landingData.icon_2;
          this.landingData.icon_3 = baseUrl + this.landingData.icon_3;
          this.landingData.icon_4 = baseUrl + this.landingData.icon_4;
        } else {
          console.log('No landing page data found.');
        }
      },
      error => this.showSnackbar('Error fetching landing page info: ' + error.message, 'error')
    );
  }

  fetchLandingBanners(): void {
    this.landingService.getLandingPageBanners().subscribe({
      next: (res) => {
        if (res.status && res.data) {
          const baseUrl = environment.image_url;
          this.bannerImages = res.data.map((banner: any) => ({
            ...banner,
            file_url: baseUrl + banner.file_url
          }));
        }
      },
      error: (err) => this.showSnackbar('Error fetching banners: ' + err.message, 'error')
    });
  }

  changeTableColor(event: any) {
    const selectedColor = event.target.value;
    document.documentElement.style.setProperty('--table-bg-color', selectedColor);
  }

  editField(field: string) {
    this.editingField = field;
  }

  saveField(field: string) {
    const newValue = this.landingData[field];
    const formData = new FormData();
    formData.append(field, newValue);

    if (!this.landingData.id) {
      this.showSnackbar('Landing page ID is missing!', 'error');
      return;
    }

    this.landingService.updateLandingField(field, formData, this.landingData.id).subscribe({
      next: () => {
        this.showSnackbar(`${field} updated successfully`, 'success');
        this.editingField = null;
        this.fetchLandingData();
      },
      error: () => this.showSnackbar(`Failed to update ${field}`, 'error')
    });
  }

  deleteField(field: string) {
    if (confirm(`Are you sure you want to delete ${field}?`)) {
      const formData = new FormData();
      formData.append(field, '');
      this.landingService.updateLandingField(field, formData, this.landingData.id).subscribe({
        next: () => {
          this.showSnackbar(`${field} deleted successfully`, 'success');
          this.fetchLandingData();
        },
        error: () => this.showSnackbar(`Failed to delete ${field}`, 'error')
      });
    }
  }

  onFileSelected(event: any, field: string) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFiles[field] = file;
    }
  }

  uploadIcon(field: string) {
    const file = this.selectedFiles[field];
    if (!file) {
      this.showSnackbar('Please select a file!', 'error');
      return;
    }

    if (!this.landingData.id) {
      this.showSnackbar('Landing page ID is missing!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append(field, file);

    this.landingService.updateLandingField(field, formData, this.landingData.id).subscribe({
      next: () => {
        this.showSnackbar(`${field} updated successfully`, 'success');
        this.fetchLandingData();
      },
      error: err => {
        console.error(`Failed to upload ${field}:`, err);
        this.showSnackbar(`Failed to upload ${field}`, 'error');
      }
    });
  }

  //  This method is MISSING in your original code — handles banner file selection
  onBannerFileSelected(event: any, bannerId: number) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFiles[bannerId] = file;
    }
  }

  //  This method is MISSING in your original code — uploads updated banner
  updateBanner(bannerId: number) {
    const file = this.selectedFiles[bannerId];
    if (!file) {
      this.showSnackbar('Please select a banner file!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('banner', file);

    this.landingService.updateBanner(bannerId, formData).subscribe({
      next: () => {
        this.showSnackbar("Banner updated successfully!", 'success');
        this.fetchLandingBanners();
      },
      error: err => {
        console.error("Failed to update banner", err);
        this.showSnackbar("Failed to update banner", 'error');
      }
    });
  }

  onBannerSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.bannerFile = file;
    }
  }

  uploadBanner() {
    if (!this.bannerFile) {
      this.showSnackbar("Please select a banner image first!", 'error');
      return;
    }

    const formData = new FormData();
    formData.append('banner', this.bannerFile);

    this.landingService.uploadBanner(formData).subscribe({
      next: () => {
        this.showSnackbar("Banner uploaded successfully!", 'success');
        this.bannerFile = null;
        this.fetchLandingBanners();
      },
      error: (err) => {
        console.error("Banner upload failed", err);
        this.showSnackbar("Failed to upload banner", 'error');
      }
    });
  }

  deleteBanner(bannerId: number) {
    if (confirm("Are you sure you want to delete this banner?")) {
      this.landingService.deleteBanner(bannerId).subscribe({
        next: () => {
          this.showSnackbar("Banner deleted successfully!", 'success');
          this.fetchLandingBanners();
        },
        error: (err) => {
          console.error("Failed to delete banner", err);
          this.showSnackbar("Error deleting banner", 'error');
        }
      });
    }
  }


  // --- NEW METHODS FOR ADDING BANNERS ---

  onNewBannerFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.newBannerFile = fileList[0];
      this.uploadError = null; // Clear previous error
      this.uploadSuccess = null; // Clear previous success message
      console.log('New banner file selected:', this.newBannerFile.name);
    } else {
      this.newBannerFile = null;
    }
  }

  uploadNewBanner(): void {
    if (!this.newBannerFile) {
      this.uploadError = 'Please select a banner file (image or video) first.';
      return;
    }

    this.isUploadingNewBanner = true; // Show loading state
    this.uploadError = null;
    this.uploadSuccess = null;

    const formData = new FormData();
    formData.append('banner', this.newBannerFile, this.newBannerFile.name);

    // Determine type based on MIME type
    const fileType = this.newBannerFile.type;
    let bannerType: 'image' | 'video' | null = null;
    if (fileType.startsWith('image/')) {
      bannerType = 'image';
    } else if (fileType.startsWith('video/')) {
      bannerType = 'video';
    } else {
      this.uploadError = 'Invalid file type. Please select an image or video.';
      this.isUploadingNewBanner = false;
      return; // Stop upload if type is invalid
    }

    formData.append('type', bannerType);
    formData.append('sort_order', this.newBannerSortOrder.toString()); // Use the component property

    // Call the service method to create the banner
    this.landingService.createBanner(formData).subscribe({
      next: (response) => {
        this.uploadSuccess = 'New banner uploaded successfully!';
        this.isUploadingNewBanner = false;
        this.newBannerFile = null; // Clear the selected file
        // Optionally reset the file input visually if needed (requires ViewChild)
        // if (this.newBannerInput) this.newBannerInput.nativeElement.value = '';

        this.fetchLandingData(); // Refresh the banner list to show the new one
        this.fetchLandingBanners();
      },
      error: (err) => {
        console.error('Error uploading new banner:', err);
        this.uploadError = `Failed to upload banner: ${err.error?.message || 'Server error'}`;
        this.isUploadingNewBanner = false;
      }
    });
  }

  // --- END OF NEW METHODS ---


  updateSortOrder(bannerId: number, newSortOrder: number): void {
    const formData = new FormData();
    formData.append('sort_order', newSortOrder.toString());

    this.landingService.updateBannerSortOrder(bannerId, formData).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.showSnackbar('Sort order updated successfully!');
          this.fetchLandingBanners(); // Refresh the list if needed
        } else {
          this.showSnackbar(response?.message || 'Failed to update sort order.');
        }
      },
      error: (err) => {
        console.error('Sort order update error:', err);
        this.showSnackbar('Error updating sort order.');
      }
    });
  }


  toggleBannerStatus(bannerId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
    this.landingService.updateBannerStatus(bannerId, {
      status: newStatus
    }).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.showSnackbar(`Banner ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
          this.fetchLandingBanners();
        } else {
          this.showSnackbar(res?.message || 'Failed to update banner status.');
        }
      },
      error: (err) => {
        console.error('Status toggle error:', err);
        this.showSnackbar('Error updating banner status.');
      }
    });
  }
  




}
