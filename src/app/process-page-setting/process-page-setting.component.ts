

import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProcessPageService } from 'src/app/services/process-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-process-page-setting',
  templateUrl: './process-page-setting.component.html',
  styleUrls: ['./process-page-setting.component.css']
})
export class ProcessPageSettingComponent implements OnInit {
  processSteps: any[] = [];
  editingStep: any = null;
  editableTitle: string = '';
  baseUrl = environment.image_url;
  newStepTitle: string = '';
  selectedIcon: File | null = null;
  newPoints: { [key: number]: string } = {};
  stepIcons: { [key: number]: File | null } = {}; // For icon updates

  editingPoint: any = null;
  editablePointText: string = '';

  constructor(private processPageService: ProcessPageService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchProcessSteps();
  }

  showSnackbar(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }

  onIconSelected(event: any) {
    this.selectedIcon = event.target.files[0];
  }

  onStepIconSelected(stepId: number, event: any) {
    const file = event.target.files[0];
    this.stepIcons[stepId] = file;
  }

  createProcessStep() {
    if (!this.newStepTitle || !this.selectedIcon) return;

    const formData = new FormData();
    formData.append('title', this.newStepTitle);
    formData.append('icon', this.selectedIcon);

    this.processPageService.createProcessStep(formData).subscribe({
      next: (res) => {
        if (res.status) {
          this.processSteps.push(res.data);
          this.newStepTitle = '';
          this.selectedIcon = null;
          this.showSnackbar('Process step created successfully!');
        }
      },
      error: (err) => {
        console.error('Error creating process step:', err);
        this.showSnackbar('Failed to create process step', 'error');
      }
    });
  }

  fetchProcessSteps() {
    this.processPageService.getAllProcessSteps().subscribe({
      next: (res) => {
        if (res.status) {
          this.processSteps = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching process steps:', err);
        this.showSnackbar('Failed to load process steps', 'error');
      }
    });
  }

  getFullIconUrl(iconPath: string): string {
    return `${this.baseUrl}${iconPath}`;
  }

  editTitle(step: any) {
    this.editingStep = step;
    this.editableTitle = step.title;
  }

  saveTitleEdit(step: any) {
    const formData = new FormData();
    formData.append('title', this.editableTitle);
    const icon = this.stepIcons[step.id];
    if (icon) {
      formData.append('icon', icon);
    }

    this.processPageService.updateProcessStep(step.id, formData).subscribe({
      next: (res) => {
        if (res.status) {
          step.title = res.data.title;
          step.icon_url = res.data.icon_url;
          this.editingStep = null;
          this.stepIcons[step.id] = null;
          this.showSnackbar('Step updated successfully!');
        }
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.showSnackbar('Failed to update step', 'error');
      }
    });
  }

  updateStepIcon(step: any) {
    const icon = this.stepIcons[step.id];
    if (!icon) return;

    const formData = new FormData();
    formData.append('title', step.title); // send current title
    formData.append('icon', icon);

    this.processPageService.updateProcessStep(step.id, formData).subscribe({
      next: (res) => {
        if (res.status) {
          step.icon_url = res.data.icon_url;
          this.stepIcons[step.id] = null;
          this.showSnackbar('updated successfully!');
        }
      },
      error: (err) => {
        console.error('Error updating :', err);
        this.showSnackbar('Failed to update ', 'error');
      }
    });
  }

  addPoint(stepId: number) {
    const pointText = this.newPoints[stepId];
    if (!pointText) return;

    const data = {
      step_id: stepId,
      point_text: pointText
    };

    this.processPageService.createProcessStepPoint(data).subscribe({
      next: (res) => {
        if (res.status) {
          const step = this.processSteps.find(s => s.id === stepId);
          if (step) {
            step.points.push(res.data);
          }
          this.newPoints[stepId] = '';
          this.showSnackbar('Point added successfully!');
        }
      },
      error: (err) => {
        console.error('Error adding point:', err);
        this.showSnackbar('Failed to add point', 'error');
      }
    });
  }

  editPoint(point: any) {
    this.editingPoint = point;
    this.editablePointText = point.point_text;
  }

  cancelPointEdit() {
    this.editingPoint = null;
    this.editablePointText = '';
  }

  savePointEdit(point: any) {
    const updatedText = this.editablePointText.trim();
    if (!updatedText) return;

    const data = { point_text: updatedText };

    this.processPageService.updateProcessStepPoint(point.id, data).subscribe({
      next: (res) => {
        if (res.status) {
          point.point_text = updatedText;
          this.cancelPointEdit();
          this.showSnackbar('Point updated successfully!');
        }
      },
      error: (err) => {
        console.error('Error updating point:', err);
        this.showSnackbar('Failed to update point', 'error');
      }
    });
  }
}


