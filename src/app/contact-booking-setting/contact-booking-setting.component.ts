import { Component, OnInit } from '@angular/core';
import { ContactBookingService } from '../services/contact-booking.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-contact-booking-setting',
  templateUrl: './contact-booking-setting.component.html',
  styleUrls: ['./contact-booking-setting.component.css']
})
export class ContactBookingSettingComponent implements OnInit {
  contactData: any;
  imageUrl = environment.image_url;
  editingField: 'heading' | 'subheading' | 'button_text' | null = null;

  editable = {
    heading: '',
    subheading: '',
    button_text: ''
  };

  selectedImage: File | null = null;

  constructor(private contactBookingService: ContactBookingService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getContactData();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  getContactData() {
    this.contactBookingService.getContactPage().subscribe({
      next: (res) => {
        if (res.status) this.contactData = res.data;
      },
      error: (err) => console.error('Error fetching contact page:', err)
    });
  }

  editField(field: 'heading' | 'subheading' | 'button_text') {
    this.editingField = field;
    this.editable[field] = this.contactData[field];
  }

  cancelEdit() {
    this.editingField = null;
  }

  saveField(field: 'heading' | 'subheading' | 'button_text') {
    const updateData: any = { [field]: this.editable[field] };

    this.contactBookingService.updateContactPage(this.contactData.id, updateData).subscribe({
      next: () => {
        this.contactData[field] = this.editable[field];
        this.editingField = null;
        this.showSnackbar(`updated successfully!`);
      },
      error: (err) => {
        console.error(`Error updating ${field}:`, err);
        this.showSnackbar(`Failed to update.`);
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // getFullImageUrl(imagePath: string): string {
  //   return `${this.imageUrl}/${imagePath}`;
  // }
  

  uploadImage() {
    if (!this.selectedImage) {
      this.showSnackbar('Please select an image before uploading.');
      return;
    }

    const updateData = { image: this.selectedImage };
    this.contactBookingService.updateContactPage(this.contactData.id, updateData).subscribe({
      next: () => {
        this.getContactData();
        this.selectedImage = null;
        this.showSnackbar('Image uploaded successfully!');
      },
      error: (err) => {
        console.error('Image update failed:', err);
        this.showSnackbar('Failed to upload image.');
      }
    });
  }
}
