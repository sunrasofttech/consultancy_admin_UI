import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LandingService } from '../services/landing.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page-settings',
  templateUrl: './landing-page-settings.component.html',
  styleUrls: ['./landing-page-settings.component.css']
})
export class LandingPageSettingsComponent implements OnInit {
  landingData: any = {};
  selectedFiles: { [key: string]: File | null } = {}; // Allow null for clearing selection
  editingField: string | null = null;
  bannerImages: any[] = [];

  @ViewChild('newBannerFileInput') newBannerFileInput!: ElementRef<HTMLInputElement>;

  bannerInputMode: 'file' | 'youtube' = 'file';
  newBannerFile: File | null = null;
  newBannerYoutubeUrl: string = '';
  newBannerSortOrder: number = 1;
  newBannerLangType: 'en' | 'hi' = 'en';

  isUploadingNewBanner = false;
  // Removed uploadError and uploadSuccess as snackbar is used
  // uploadError: string | null = null;
  // uploadSuccess: string | null = null;

  iconsList = [
    { key: 'icon_1', label: 'Icon 1' },
    { key: 'icon_2', label: 'Icon 2' },
    { key: 'icon_3', label: 'Icon 3' },
    { key: 'icon_4', label: 'Icon 4' },
  ];

  constructor(
    private landingService: LandingService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchLandingData();
    this.fetchLandingBanners();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }

  fetchLandingData(): void {
    this.landingService.getLandingInfo().subscribe(
      (response: any) => {
        if (response.status && response.data && response.data.length > 0) {
          this.landingData = response.data[0];
          const baseUrl = environment.image_url;
          // Ensure properties exist before prepending baseUrl
          if (this.landingData.icon_1) this.landingData.icon_1 = baseUrl + this.landingData.icon_1;
          if (this.landingData.icon_2) this.landingData.icon_2 = baseUrl + this.landingData.icon_2;
          if (this.landingData.icon_3) this.landingData.icon_3 = baseUrl + this.landingData.icon_3;
          if (this.landingData.icon_4) this.landingData.icon_4 = baseUrl + this.landingData.icon_4;
        } else {
          console.log('No landing page data found.');
          this.landingData = { heading: '', subheading: '' }; // Default empty state
        }
      },
      (error) => this.showSnackbar('Error fetching landing page info: ' + (error.error?.message || error.message), 'error')
    );
  }

  fetchLandingBanners(): void {
  this.landingService.getLandingPageBanners().subscribe({
    next: (res) => {
      if (res.status && res.data) {
        const baseUrl = environment.image_url;
        this.bannerImages = res.data.map((banner: any) => ({
          ...banner,
          file_url: banner.file_url ? baseUrl + banner.file_url : null,
          safeYoutubeUrl: banner.youtube_url ? this.getSafeYoutubeEmbedUrl(banner.youtube_url) : null,
          editingYoutubeUrl: banner.youtube_url || '',
          showUpdateSection: false // Initialize to hidden
        }));
      } else {
        this.bannerImages = [];
      }
    },
    error: (err) => {
      this.showSnackbar('Error fetching banners: ' + (err.error?.message || err.message), 'error');
      this.bannerImages = [];
    },
  });
}

  getSafeYoutubeEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    let videoId = '';
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) videoId = match[1];
    if (videoId) return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    if (url.includes('/embed/')) return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Already an embed link
    console.warn('Could not extract video ID for embedding:', url);
    return null;
  }

  changeTableColor(event: any): void {
    document.documentElement.style.setProperty('--table-bg-color', event.target.value);
  }

  editField(field: string): void { this.editingField = field; }

  saveField(field: string): void {
    const formData = new FormData();
    formData.append(field, this.landingData[field]);
    if (!this.landingData.id) {
      this.showSnackbar('Landing page ID is missing!', 'error');
      return;
    }
    this.landingService.updateLandingField(field, formData, this.landingData.id).subscribe({
      next: () => {
        this.showSnackbar(`${field} updated successfully`, 'success');
        this.editingField = null;
      },
      error: (err) => {
        this.showSnackbar(`Failed to update ${field}: ` + (err.error?.message || err.message), 'error');
        this.fetchLandingData(); // Revert on error
      }
    });
  }

  deleteField(field: string): void {
    if (confirm(`Are you sure you want to delete ${field}?`)) {
      const formData = new FormData();
      formData.append(field, ''); // Send empty to signify deletion
      this.landingService.updateLandingField(field, formData, this.landingData.id).subscribe({
        next: () => {
          this.showSnackbar(`${field} deleted successfully`, 'success');
          this.fetchLandingData();
        },
        error: (err) => this.showSnackbar(`Failed to delete ${field}: ` + (err.error?.message || err.message), 'error')
      });
    }
  }

  onFileSelected(event: any, field: string): void { // For Icons
    const file = event.target.files?.[0];
    if (file) this.selectedFiles[field] = file;
    else delete this.selectedFiles[field];
  }

  uploadIcon(field: string): void {
    const file = this.selectedFiles[field];
    if (!file) {
      this.showSnackbar('Please select an icon file!', 'error');
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
        delete this.selectedFiles[field];
        this.fetchLandingData();
      },
      error: (err) => this.showSnackbar(`Failed to upload ${field}: ` + (err.error?.message || err.message), 'error')
    });
  }

  // --- ADD NEW BANNER ---
  onNewBannerFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        this.showSnackbar('Please select a valid video file.', 'error');
        this.newBannerFile = null;
        if (this.newBannerFileInput) this.newBannerFileInput.nativeElement.value = '';
        return;
      }
      this.newBannerFile = file;
    } else {
      this.newBannerFile = null;
    }
  }

  uploadNewBanner(): void {
    this.isUploadingNewBanner = true;
    const formData = new FormData();
    formData.append('sort_order', this.newBannerSortOrder.toString());
    formData.append('lang_type', this.newBannerLangType);

    if (this.bannerInputMode === 'file') {
      if (!this.newBannerFile) {
        this.showSnackbar('Please select a video file to upload.', 'error');
        this.isUploadingNewBanner = false;
        return;
      }
      formData.append('banner', this.newBannerFile, this.newBannerFile.name);
    } else if (this.bannerInputMode === 'youtube') {
      const trimmedUrl = this.newBannerYoutubeUrl.trim();
      if (!trimmedUrl) {
        this.showSnackbar('Please enter a YouTube URL.', 'error');
        this.isUploadingNewBanner = false;
        return;
      }
      if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(trimmedUrl)) {
        this.showSnackbar('Please enter a valid YouTube URL.', 'error');
        this.isUploadingNewBanner = false;
        return;
      }
      formData.append('youtube_url', trimmedUrl);
    } else {
      this.showSnackbar('Invalid banner input mode.', 'error');
      this.isUploadingNewBanner = false;
      return;
    }

    this.landingService.createBanner(formData).subscribe({
      next: (response) => {
        this.showSnackbar('New banner created successfully!', 'success');
        this.isUploadingNewBanner = false;
        this.resetNewBannerForm();
        this.fetchLandingBanners();
      },
      error: (err) => {
        this.showSnackbar(`Failed to create banner: ${err.error?.message || 'Server error'}`, 'error');
        this.isUploadingNewBanner = false;
      }
    });
  }

  resetNewBannerForm(): void {
    this.newBannerFile = null;
    this.newBannerYoutubeUrl = '';
    // this.newBannerSortOrder = 1; // Optionally reset
    // this.newBannerLangType = 'en'; // Optionally reset
    if (this.newBannerFileInput) this.newBannerFileInput.nativeElement.value = '';
    // this.bannerInputMode = 'file'; // Optionally reset
  }

  // --- EXISTING BANNER MANAGEMENT ---
  onBannerFileSelected(event: any, bannerId: number): void { // For existing banner updates
    const file = event.target.files?.[0];
    const fileKey = bannerId.toString();
    if (file) {
      if (!file.type.startsWith('video/')) {
        this.showSnackbar('Please select a valid video file.', 'error');
        (event.target as HTMLInputElement).value = ''; // Clear the input
        this.selectedFiles[fileKey] = null;
        return;
      }
      this.selectedFiles[fileKey] = file;
    } else {
      this.selectedFiles[fileKey] = null;
    }
  }

  updateBannerFile(banner: any): void {
    const bannerId = banner.id;
    const fileToUpload = this.selectedFiles[bannerId.toString()];
    if (!fileToUpload) {
      this.showSnackbar('Please select a new video file to update!', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('banner', fileToUpload);
    formData.append('lang_type', banner.lang_type);
    formData.append('sort_order', banner.sort_order.toString());

    this.landingService.updateBanner(bannerId, formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.showSnackbar("Banner video updated successfully!", 'success');
          this.fetchLandingBanners();
          this.selectedFiles[bannerId.toString()] = null;
          const fileInput = document.getElementById(`updateBannerFile-${bannerId}`) as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          this.showSnackbar(res.message || "Failed to update banner video.", 'error');
        }
      },
      error: (err) => this.showSnackbar("Failed to update banner video: " + (err.error?.message || err.message), 'error')
    });
  }

  updateBannerUrl(banner: any): void {
    const bannerId = banner.id;
    const trimmedUrl = banner.editingYoutubeUrl ? banner.editingYoutubeUrl.trim() : '';
    if (trimmedUrl && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(trimmedUrl)) {
      this.showSnackbar('Please enter a valid YouTube URL or leave empty to clear.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('youtube_url', trimmedUrl); // Send empty string if user cleared it
    formData.append('lang_type', banner.lang_type);
    formData.append('sort_order', banner.sort_order.toString());

    this.landingService.updateBanner(bannerId, formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.showSnackbar(trimmedUrl ? "Banner URL updated successfully!" : "Banner YouTube URL cleared!", 'success');
          this.fetchLandingBanners();
        } else {
          this.showSnackbar(res.message || "Failed to update banner URL.", 'error');
        }
      },
      error: (err) => this.showSnackbar("Failed to update banner URL: " + (err.error?.message || err.message), 'error')
    });
  }

  saveBannerDetails(banner: any): void {
    const bannerId = banner.id;
    const formData = new FormData();
    formData.append('sort_order', banner.sort_order.toString());
    formData.append('lang_type', banner.lang_type);

    // If it's currently a YouTube banner, resend youtube_url to prevent backend from clearing it
    // if it's not explicitly part of this metadata-only update.
    // The backend should be robust enough to only update provided fields.
    if (banner.youtube_url && !banner.file_url) {
        formData.append('youtube_url', banner.youtube_url);
    }
    // If it's a file banner, we don't send the file. Backend must not clear file_url.

    this.landingService.updateBanner(bannerId, formData).subscribe({ // Using generic updateBanner
      next: (response: any) => {
        if (response?.status) {
          this.showSnackbar('Banner details updated successfully!', 'success');
          this.fetchLandingBanners();
        } else {
          this.showSnackbar(response?.message || 'Failed to update banner details.', 'error');
        }
      },
      error: (err) => this.showSnackbar('Error updating banner details: ' + (err.error?.message || err.message), 'error')
    });
  }

  deleteBanner(bannerId: number): void {
    if (confirm("Are you sure you want to delete this banner?")) {
      this.landingService.deleteBanner(bannerId).subscribe({
        next: () => {
          this.showSnackbar("Banner deleted successfully!", 'success');
          this.fetchLandingBanners();
        },
        error: (err) => this.showSnackbar("Error deleting banner: " + (err.error?.message || err.message), 'error')
      });
    }
  }

  toggleBannerStatus(bannerId: number, currentStatus: string): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    this.landingService.updateBannerStatus(bannerId, { status: newStatus }).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.showSnackbar(`Banner ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
          this.fetchLandingBanners();
        } else {
          this.showSnackbar(res?.message || 'Failed to update banner status.', 'error');
        }
      },
      error: (err) => this.showSnackbar('Error updating banner status: ' + (err.error?.message || err.message), 'error')
    });
  }
}