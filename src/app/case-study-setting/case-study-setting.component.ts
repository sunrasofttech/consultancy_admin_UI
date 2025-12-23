import { Component, OnInit } from '@angular/core';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-case-study-setting',
  templateUrl: './case-study-setting.component.html',
  styleUrls: ['./case-study-setting.component.css']
})
export class CaseStudySettingComponent implements OnInit {
  caseStudies: any[] = [];
  caseStudyImages: any[] = [];
  editingCaseStudy: any = null;
  editableTitle: string = '';
  baseUrl = environment.image_url;

  selectedImages: { [id: number]: File } = {};

  // Add these variables to your class
  isModalOpen: boolean = false;
  newCaseStudy = {
    title: '',
    subTitle: '',
    paragraph: ''
  };
  selectedNewFile: File | null = null;

  constructor(private caseStudyService: CaseStudyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchCaseStudies();
    this.fetchCaseStudyImages();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  fetchCaseStudies() {
    const payload = { title: 'Case Studies' };
    this.caseStudyService.getCaseStudies(payload).subscribe({
      next: (res) => {
        if (res.status) {
          this.caseStudies = res.data;
        }
      },
      error: (err) => console.error('Error fetching case studies:', err)
    });
  }

  fetchCaseStudyImages() {
    this.caseStudyService.getCaseStudyImages().subscribe({
      next: (res) => {
        if (res.status) {
          this.caseStudyImages = res.data;
        }
      },
      error: (err) => console.error('Error fetching case study images:', err)
    });
  }

  editCaseStudy(caseStudy: any) {
    this.editingCaseStudy = caseStudy;
    this.editableTitle = caseStudy.title;
  }

  saveEdit(caseStudy: any) {
    const data = { title: this.editableTitle };
    this.caseStudyService.updateCaseStudy(caseStudy.id, data).subscribe({
      next: (res) => {
        if (res.status) {
          caseStudy.title = this.editableTitle;
          this.editingCaseStudy = null;
          this.editableTitle = '';
          this.showSnackbar('Case study title updated successfully!');
        }
      },
      error: (err) => {
        console.error('Error updating case study:', err);
        this.showSnackbar('Failed to update case study title');
      }
    });
  }


  onFileSelected(event: any, id: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImages[id] = file;
    }
  }

  // updateImage(id: number) {
  //   const file = this.selectedImages[id];
  //   if (!file) {
  //     this.showSnackbar('No image selected to upload.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('image', file);

  //   this.caseStudyService.updateCaseStudyImage(id, formData).subscribe({
  //     next: (res) => {
  //       if (res.status) {
  //         this.fetchCaseStudyImages(); // Refresh list after update
  //         this.showSnackbar('Image updated successfully!');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error updating image:', err);
  //       this.showSnackbar('Something went wrong while updating image.');
  //     }
  //   });
  // }



  updateImage(id: number) {
    const file = this.selectedImages[id];
    const imageData = this.caseStudyImages.find(img => img.id === id);
    if (!imageData) return;

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('title', imageData.title || '');
    formData.append('subTitle', imageData.subTitle || '');
    formData.append('paragraph', imageData.paragraph || '');

    this.caseStudyService.updateCaseStudyImage(id, formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.fetchCaseStudyImages(); // Refresh
          this.showSnackbar('Case study image updated successfully!');
        }
      },
      error: (err) => {
        console.error('Error updating case study image:', err);
        this.showSnackbar('Something went wrong while updating the image.');
      }
    });
  }

  // Add these methods
openCreateModal() {
  this.isModalOpen = true;
  this.newCaseStudy = { title: '', subTitle: '', paragraph: '' };
  this.selectedNewFile = null;
}

closeModal() {
  this.isModalOpen = false;
}

onNewFileSelected(event: any) {
  this.selectedNewFile = event.target.files[0];
}

createCaseStudy() {
  if (!this.selectedNewFile) {
    this.showSnackbar('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('image', this.selectedNewFile);
  formData.append('title', this.newCaseStudy.title);
  formData.append('subTitle', this.newCaseStudy.subTitle);
  formData.append('paragraph', this.newCaseStudy.paragraph);

  this.caseStudyService.createCaseStudyImage(formData).subscribe({
    next: (res) => {
      if (res.status) {
        this.showSnackbar('Case study created successfully!');
        this.fetchCaseStudyImages(); // Refresh list
        this.closeModal();
      }
    },
    error: (err) => {
      console.error('Error creating case study:', err);
      this.showSnackbar('Failed to create case study');
    }
  });
}


}

