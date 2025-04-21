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

  iconsList = [
    { key: 'icon_1', label: 'Icon 1' },
    { key: 'icon_2', label: 'Icon 2' },
    { key: 'icon_3', label: 'Icon 3' },
    { key: 'icon_4', label: 'Icon 4' },
  ];

  constructor(private landingService: LandingService, private snackBar: MatSnackBar) {}

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
}
