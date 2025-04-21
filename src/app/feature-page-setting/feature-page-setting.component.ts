import { Component, OnInit } from '@angular/core';
import { FeaturePageService } from 'src/app/services/feature-page.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-feature-page-setting',
  templateUrl: './feature-page-setting.component.html',
  styleUrls: ['./feature-page-setting.component.css']
})
export class FeaturePageSettingComponent implements OnInit {
  featureData: any[] = [];
  baseUrl = environment.image_url;
  editingField: { id: number, field: string } | null = null;
  editableValue: string = '';

  constructor(
    private featureService: FeaturePageService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchFeatures();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  fetchFeatures() {
    this.featureService.getFeaturePageContent().subscribe(
      res => {
        if (res.status && res.data) {
          this.featureData = res.data;
        }else {
          this.showSnackbar('Failed to load feature data');
        }
      },
      err => {
        console.error('Error fetching feature page data', err);
        this.showSnackbar('Error loading feature data');
      }
    );
  }

  editFeature(feature: any, field: string) {
    this.editingField = { id: feature.id, field };
    this.editableValue = feature[field]; // prefill value
  }

  saveEdit(feature: any, field: string) {
    const formData = new FormData();
    formData.append(field, this.editableValue);

    this.featureService.updateFeaturePage(feature.id, formData).subscribe(
      (res: any) => {
        if (res.status) {
          this.fetchFeatures(); // refresh UI after update
          this.editingField = null;
          this.editableValue = '';
          this.showSnackbar(`updated successfully!`);
        }
      },
      err => {
        console.error('Update failed:', err);
        this.showSnackbar(`Error updating`);
      }
    );
  }

  updateIcon(feature: any, event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('icon', file);

      this.featureService.updateFeaturePage(feature.id, formData).subscribe(
        (res: any) => {
          if (res.status) {
            this.fetchFeatures();
            this.showSnackbar('Icon updated successfully!');
          }else {
            this.showSnackbar('Failed to update icon');
          }
        },
        err => {
          console.error('Icon update failed:', err);
          this.showSnackbar('Error updating icon');
        }
      );
    }
  }

}
