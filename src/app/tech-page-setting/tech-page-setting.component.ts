import { Component, OnInit } from '@angular/core';
import { TechPageService } from 'src/app/services/tech-page.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-tech-page-setting',
  templateUrl: './tech-page-setting.component.html',
  styleUrls: ['./tech-page-setting.component.css']
})
export class TechPageSettingComponent implements OnInit {
  techList: any[] = [];
  newTechName: string = '';
  selectedImage: File | null = null;

  editingTechId: number | null = null;
  editableTechName: string = '';
  techImageMap: { [id: number]: File } = {};

  mainText: string = '';
  mainImage: File | null = null;
  fetchedMainTechData: any = null;

  editableMainText: string = '';
  editingMainSection: boolean = false;
  mainImageToUpdate: File | null = null;
  previewMainImage: string | null = null;

  mainImageInputMap: { [id: number]: HTMLInputElement } = {};

  imageUrl = environment.image_url;

  constructor(private techService: TechPageService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getTechList();
    this.getTechMainData();
  }


  showSnackbar(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }



  // -------------------- FETCHING DATA --------------------
  getTechList() {
    this.techService.getTechList().subscribe((res: any) => {
      if (res.status) this.techList = Array.isArray(res.data) ? res.data : [res.data];
    });
  }

  getTechMainData() {
    this.techService.getTechMainPage().subscribe((res: any) => {
      if (res.status) this.fetchedMainTechData = res.data;
    });
  }

  getFullImageUrl(url: string) {
    return this.imageUrl + url;
  }

  // -------------------- CREATE TECH --------------------
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  createTech() {
    if (!this.newTechName || !this.selectedImage) {
      this.showSnackbar('Please provide both tech name and image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('tech_name', this.newTechName);
    formData.append('image', this.selectedImage);

    this.techService.createTech(formData).subscribe(() => {
      this.newTechName = '';
      this.selectedImage = null;
      this.getTechList();
      this.showSnackbar('Technology created successfully');
    });
  }

  // -------------------- EDIT TECH NAME --------------------
  editTech(tech: any) {
    this.editingTechId = tech.id;
    this.editableTechName = tech.tech_name;
  }

  saveTechEdit(tech: any) {
    this.techService.updateTech(tech.id, { tech_name: this.editableTechName }).subscribe(() => {
      this.editingTechId = null;
      this.getTechList();
      this.showSnackbar('Tech name updated successfully');
    });
  }

  cancelEdit() {
    this.editingTechId = null;
  }

  // -------------------- UPDATE TECH ICON --------------------
  onTechImageSelected(id: number, event: any) {
    this.techImageMap[id] = event.target.files[0];
  }

  updateTechImage(tech: any) {
    const file = this.techImageMap[tech.id];
    if (!file) {
      this.showSnackbar('Please select an image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.techService.updateTech(tech.id, formData).subscribe(() => {
      delete this.techImageMap[tech.id];
      this.getTechList();
      this.showSnackbar('Tech image updated successfully');
    });
  }

  // -------------------- CREATE MAIN SECTION --------------------
  onMainImageSelected(event: any) {
    this.mainImage = event.target.files[0];
  }

  createMainTechSection() {
    if (!this.mainText || !this.mainImage) return;

    const formData = new FormData();
    formData.append('main_text', this.mainText);
    formData.append('image', this.mainImage);

    this.techService.createTechMainPage(formData).subscribe(() => {
      this.mainText = '';
      this.mainImage = null;
      this.getTechMainData();
      this.showSnackbar('Main section created successfully');
    });
  }

  // -------------------- MAIN TEXT EDITING --------------------
  editMainSection() {
    this.editingMainSection = true;
    this.editableMainText = this.fetchedMainTechData.main_text;
  }

  cancelMainEdit() {
    this.editingMainSection = false;
    this.editableMainText = '';
  }

  updateMainTextOnly() {
    if (!this.editableMainText) return;
  
    const formData = new FormData();
    formData.append('main_text', this.editableMainText);
  
    this.techService.updateTechMainPage(this.fetchedMainTechData.id, formData).subscribe(() => {
      this.editingMainSection = false;
      this.getTechMainData();
      this.showSnackbar('Main text updated successfully');
    });
  }
  

  // -------------------- MAIN IMAGE UPDATE ONLY --------------------
  // onUpdateMainImageSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.mainImageToUpdate = file;

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.previewMainImage = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // updateMainImageOnly() {
  //   if (!this.mainImageToUpdate) return;

  //   const formData = new FormData();
  //   formData.append("image", this.mainImageToUpdate);

  //   this.techService.updateTechMainPage(this.fetchedMainTechData.id, formData).subscribe(() => {
  //     this.mainImageToUpdate = null;
  //     this.previewMainImage = null;
  //     this.getTechMainData();
  //   });
  // }


  onUpdateMainImageSelected(event: any, id: number) {
    const file = event.target.files[0];
    if (file) {
      this.mainImageToUpdate = file;
  
      // Save reference to reset later
      this.mainImageInputMap[id] = event.target;
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewMainImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  updateMainImageOnly() {
    if (!this.mainImageToUpdate) return;
  
    const formData = new FormData();
    formData.append("image", this.mainImageToUpdate);
  
    this.techService.updateTechMainPage(this.fetchedMainTechData.id, formData).subscribe(() => {
      this.mainImageToUpdate = null;
      this.previewMainImage = null;
  
      // ✅ Reset file input just like techImageMap
      const input = this.mainImageInputMap[this.fetchedMainTechData.id];
      if (input) {
        input.value = '';
        delete this.mainImageInputMap[this.fetchedMainTechData.id];
      }
  
      this.getTechMainData();
      this.showSnackbar('Main image updated successfully')
    });
  }


}
