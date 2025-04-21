import { Component, OnInit } from '@angular/core';
import { NavbarSettingsService } from '../services/navbar-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';


interface NavbarOption {
  id: number;
  name?: string | null;
  type?: string | null;
  url?: string | null;
  is_visible?: boolean | null;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-navbar-settings',
  templateUrl: './navbar-settings.component.html',
  styleUrls: ['./navbar-settings.component.css']
})
export class NavbarSettingsComponent implements OnInit {
  navbarOptions: NavbarOption[] = [];
  brandLogo: string = 'default-logo.png';
  brandName: string = 'Default Brand';
  editingRow: number | null = null;
  editedItem: Partial<NavbarOption> = {}; // Store edited data
  selectedFile: File | null = null; // Store selected logo file

  baseUrl = environment.image_url


  constructor(private navbarSettingsService: NavbarSettingsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadNavbarSettings();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }

  loadNavbarSettings(): void {
    this.navbarSettingsService.getNavbarOptions().subscribe(response => {
      if (response.status) {
        this.navbarOptions = response.navbarOptions.filter((nav: NavbarOption) => !!nav.name);
        if (response.brandDetails) {
          this.brandLogo = response.brandDetails.brandLogo 
            ? this.baseUrl + response.brandDetails.brandLogo 
            : 'default-logo.png';
          this.brandName = response.brandDetails.brandName || 'Default Brand';
        }
      }
    }, error => {
      console.error('Error fetching navbar settings:', error);
      this.showSnackbar('Failed to load navbar settings', 'error');
    });
  }

  editRow(id: number): void {
    this.editingRow = id;
    const item = this.navbarOptions.find(nav => nav.id === id);
    if (item) {
      this.editedItem = { ...item }; // Clone current data
    }
  }

  saveRow(id: number): void { 
    const index = this.navbarOptions.findIndex(nav => nav.id === id);
    if (index !== -1) {
      const updatedItem = this.navbarOptions[index];
      this.navbarSettingsService.updateNavbarOption(updatedItem).subscribe(response => {
        if (response.status) {
          this.editingRow = null;
          this.showSnackbar('Navbar option updated successfully');
        }else {
          this.showSnackbar('Failed to update navbar option', 'error');
        }
      });
    }
  }
  

  cancelEdit(): void {
    this.editingRow = null;
    this.editedItem = {}; // Reset edited data
  }

  deleteRow(id: number): void {
    this.navbarSettingsService.deleteNavbarOption(id).subscribe(response => {
      if (response.status) {
        this.navbarOptions = this.navbarOptions.filter(nav => nav.id !== id);
      }
    });
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload brand logo
  uploadBrandLogo(navbarId?: number): void {
    if (!this.selectedFile) {
      this.showSnackbar('Please select a file first!', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('brand_logo', this.selectedFile);
  
    if (!navbarId) {
      this.showSnackbar('Navbar ID is required for uploading logo.', 'error');
      return;
    }
  
    this.navbarSettingsService.uploadBrandLogo(formData).subscribe(response => {
      if (response.status) {
        this.brandLogo = this.baseUrl + response.brandLogo;
        this.selectedFile = null; // Reset file selection
        this.loadNavbarSettings()
        this.showSnackbar('Brand logo uploaded successfully');
      }else {
        this.showSnackbar('Failed to upload brand logo', 'error');
      }
    }, error => {
      console.error('Error uploading logo:', error);
      this.showSnackbar('Error uploading brand logo', 'error');
    });
  }

  updateBrandName(): void {
    this.navbarSettingsService.updateBrandName(this.brandName).subscribe(
      (response) => {
        if (response.status) {
          this.showSnackbar('Brand name updated successfully');
          this.loadNavbarSettings(); // Refresh to reflect changes
        }else {
          this.showSnackbar('Failed to update brand name', 'error');
        }
      },
      (error) => {
        console.error('Error updating brand name:', error);
        this.showSnackbar('Error updating brand name', 'error');
      }
    );
  }
  
}
