import { Component, OnInit } from '@angular/core';
import { ClientPageService } from 'src/app/services/client-page.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-client-page-setting',
  templateUrl: './client-page-setting.component.html',
  styleUrls: ['./client-page-setting.component.css']
})
export class ClientPageSettingComponent implements OnInit {

  clientData: any = null;
  editingField: { id: number; field: string } | null = null;
  editableValue: string = '';

  logoList: any[] = [];
  selectedLogo: File | null = null;
  baseUrl = environment.image_url; // This will come from your environment.ts

  pendingLogoUpdateId: number | null = null;
  selectedUpdateLogo: File | null = null;


  constructor(private clientPageService: ClientPageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchClientPageContent();
    this.fetchClientLogos();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  getFullLogoUrl(relativePath: string): string {
    return `${this.baseUrl}${relativePath}`;
  }

  fetchClientPageContent() {
    this.clientPageService.getClientPageContent().subscribe({
      next: (res) => {
        if (res.status) {
          this.clientData = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching client page content:', err);
        this.showSnackbar('Failed to load client page content.');
      }
    });
  }

  editClientContent(item: any, field: string) {
    this.editingField = { id: item.id, field };
    this.editableValue = item[field];
  }



  saveEdit(item: any, field: string) {
    const updatedData = {
      [field]: this.editableValue
    };

    this.clientPageService.updateClientPageContent(item.id, updatedData).subscribe({
      next: (res) => {
        if (res.status) {
          item[field] = this.editableValue;
          this.editingField = null;
          this.showSnackbar('Client content updated successfully!');
        } else {
          this.showSnackbar('Failed to update content.');
        }
      },
      error: (err) => {
        console.error('Error updating client page content:', err);
        this.showSnackbar('Something went wrong while updating content.');
      }
    });
  }

  fetchClientLogos() {
    this.clientPageService.getClientLogos().subscribe({
      next: (res) => {
        if (res.status) {
          this.logoList = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching logos:', err);
        this.showSnackbar('Failed to fetch logos.');
      }
    });
  }

  onLogoSelected(event: any) {
    this.selectedLogo = event.target.files[0];
  }

  uploadClientLogo() {
    if (!this.selectedLogo) {
      this.showSnackbar('Please select a logo before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', this.selectedLogo);

    this.clientPageService.addClientLogo(formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.logoList.unshift(res.data);
          this.selectedLogo = null;
          this.showSnackbar('Logo uploaded successfully!');
        } else {
          this.showSnackbar('Failed to upload logo.');
        }
      },
      error: (err) => {
        console.error('Error uploading logo:', err);
        this.showSnackbar('Error occurred during logo upload.');
      }
    });
  }

  onLogoFileSelected(event: any, logoId: number) {
    const file = event.target.files[0];
    if (file) {
      this.pendingLogoUpdateId = logoId;
      this.selectedUpdateLogo = file;
    }
  }

  updateClientLogo(id: number) {
    if (!this.selectedUpdateLogo) {
      this.showSnackbar('No image selected for update.');
      return;
    }

    this.clientPageService.updateClientLogo(id, this.selectedUpdateLogo).subscribe({
      next: (res) => {
        if (res.status) {
          // Optionally, refresh the logo list or update the logo in-place
          this.fetchClientLogos();
          this.pendingLogoUpdateId = null;
          this.selectedUpdateLogo = null;
          this.showSnackbar('Logo updated successfully!');
        } else {
          this.showSnackbar('Failed to update logo.');
        }
      },
      error: (err) => {
        console.error('Error updating client logo:', err);
        this.showSnackbar('Something went wrong during logo update.');
      }
    });
  }


  onDeleteLogo(logoId: number) {
    // TODO: implement delete logic
    console.log('Delete logo ID:', logoId);
  }


}
