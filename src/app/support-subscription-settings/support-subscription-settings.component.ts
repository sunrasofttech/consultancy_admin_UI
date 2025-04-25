import { Component, OnInit } from '@angular/core';
import { SupSubSettingsService } from '../services/sup-sub-settings.service';

@Component({
  selector: 'app-support-subscription-settings',
  templateUrl: './support-subscription-settings.component.html',
  styleUrls: ['./support-subscription-settings.component.css']
})
export class SupportSubscriptionSettingsComponent implements OnInit {
  subscriptionPlans: any[] = [];  // Holds the subscription plan data
  editableValue: number | string = '';  // Holds the value for editing
  editingField: string | null = null;  // Tracks which field is being edited

  constructor(private supSubService: SupSubSettingsService) { }

  ngOnInit(): void {
    this.loadSubscriptionPlans();  // Load subscription plans on component init
  }

  // Load subscription plans
  loadSubscriptionPlans(): void {
    this.supSubService.getSubscriptionAmount().subscribe(
      (response) => {
        if (response.status) {
          this.subscriptionPlans = response.data;  // Assuming response.data contains the subscription data
        } else {
          console.error('Failed to fetch subscription plans');
        }
      },
      (error) => {
        console.error('Error fetching subscription plans:', error);
      }
    );
  }

  // Select a plan to edit
  editField(field: string, planId: any, currentValue: any): void {
    this.editingField = field + planId;
    this.editableValue = currentValue;  // Pre-fill the input with current value
  }

  // Save the edited subscription plan
  saveEdit(field: string, planId: any): void {
    // Ensure editableValue is a number before sending it to the API
    const valueToSave = typeof this.editableValue === 'string' ? parseFloat(this.editableValue) : this.editableValue;

    // Check if the value is a valid number
    if (!isNaN(valueToSave)) {
      this.supSubService.updateSubscriptionPlan(planId, valueToSave).subscribe(
        (response) => {
          if (response.status) {
            this.loadSubscriptionPlans();  // Refresh the list after updating
            this.cancelEdit();  // Clear edit state
            alert('Subscription plan updated successfully');
          } else {
            alert('Failed to update subscription plan');
          }
        },
        (error) => {
          console.error('Error updating subscription plan:', error);
          alert('Error updating subscription plan');
        }
      );
    } else {
      alert('Please enter a valid number');
    }
  }


  // Cancel the edit action
  cancelEdit(): void {
    this.editingField = null;
    this.editableValue = '';  
  }
}
