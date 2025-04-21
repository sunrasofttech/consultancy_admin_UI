import { Component, OnInit } from '@angular/core';
import { AboutPageService } from '../services/about-page.service';
// import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-about-page-setting',
  templateUrl: './about-page-setting.component.html',
  styleUrls: ['./about-page-setting.component.css']
})
export class AboutPageSettingComponent implements OnInit {
  aboutData: any;
  baseUrl: string = environment.image_url; 
  editingField: string | null = null;
  editableValue: any;
  selectedImage: File | null = null;

  constructor(
    private aboutService: AboutPageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAboutData();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  loadAboutData() {
    this.aboutService.getAboutPage().subscribe(res => {
      if (res.status) {
        this.aboutData = res.data;
      }
    });
  }

  editField(field: string, currentValue: any) {
    this.editingField = field;
    this.editableValue = currentValue;
  }

  saveEdit(field: string) {
    const formData = new FormData();
    formData.append(field, this.editableValue);

    this.aboutService.updateAboutPage(this.aboutData.id, formData).subscribe(
      res => {
        if (res.status) {
          this.aboutData[field] = this.editableValue;
          this.showSnackbar('Updated successfully');
          this.editingField = null;
        } else {
          this.showSnackbar('Failed to update');
        }
      },
      err => this.showSnackbar('Something went wrong')
    );
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }

  updateImage() {
    if (!this.selectedImage) return;

    const formData = new FormData();
    formData.append('image', this.selectedImage);

    this.aboutService.updateAboutPage(this.aboutData.id, formData).subscribe(
      res => {
        if (res.status) {
          this.showSnackbar('Image updated!');
          this.loadAboutData();
          this.selectedImage = null;
        } else {
          this.showSnackbar('Image update failed!');
        }
      },
      err => this.showSnackbar('Something went wrong')
    );
  }
}
