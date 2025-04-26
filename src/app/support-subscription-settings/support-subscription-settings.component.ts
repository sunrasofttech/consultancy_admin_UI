import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SupSubSettingsService } from '../services/sup-sub-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-support-subscription-settings',
  templateUrl: './support-subscription-settings.component.html',
  styleUrls: ['./support-subscription-settings.component.css']
})
export class SupportSubscriptionSettingsComponent implements OnInit {
  subscriptionPlans: any[] = [];  // Holds the subscription plan data
  editableValue: number | string = '';  // Holds the value for editing
  editingField: string | null = null;  // Tracks which field is being edited

  pricingPopupContent: any[] = [];

  // --- State for Adding Features ---
  addingFeatureToPlanId: number | null = null; // ID of the plan we're adding a feature to
  newFeatureName: string = ''; // Bound to the input field for the new feature
  isAddingFeature: boolean = false; // Loading state for add operation
  // ---------------------------------

  deletingFeatureId: number | null = null; // Track which feature is being 


  constructor(private supSubService: SupSubSettingsService, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef ) { }

  ngOnInit(): void {
    this.loadSubscriptionPlans();  // Load subscription plans on component init
    this.loadPricingPopupContent();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  // Load subscription plans
  loadSubscriptionPlans(): void {
    this.supSubService.getSubscriptionAmount().subscribe(
      (response) => {
        if (response.status) {
          this.subscriptionPlans = response.data;  // Assuming response.data contains the subscription data
        } else {
          console.error('Failed to fetch subscription plans');
          this.showSnackbar('Failed to fetch subscription plans', 3000);
        }
      },
      (error) => {
        console.error('Error fetching subscription plans:', error);
        this.showSnackbar('Error fetching subscription plans', 3000);
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
            this.showSnackbar('Subscription plan updated successfully', 3000);
          } else {
            this.showSnackbar('Failed to update subscription plan', 3000);
          }
        },
        (error) => {
          console.error('Error updating subscription plan:', error);
          this.showSnackbar('Error updating subscription plan', 3000);
        }
      );
    } else {
      this.showSnackbar('Please enter a valid number', 3000);
    }
  }


  // Cancel the edit action
  cancelEdit(): void {
    this.editingField = null;
    this.editableValue = '';
  }

  


 loadPricingPopupContent(): void {
    this.supSubService.getPricePopupContent().subscribe({ // Use object literal
      next: (response) => {
        if (response.status) {
          this.pricingPopupContent = response.data; // Assign the new data
        } else {
          this.pricingPopupContent = []; // Clear on failure
          this.showSnackbar('Failed to fetch pricing popup content', 3000);
        }
        // **** CRITICAL STEP ****
        this.cdr.detectChanges(); // <<< Tell Angular the data has changed and the view needs update
        // **** END CRITICAL STEP ****
      },
      error: (error) => {
        console.error('Error fetching pricing popup content:', error);
        this.showSnackbar('Error fetching pricing popup content', 3000);
        this.pricingPopupContent = []; // Clear on error
        // **** CRITICAL STEP ****
        this.cdr.detectChanges(); // <<< Update view even on error (e.g., to clear the list)
        // **** END CRITICAL STEP ****
      }
   });
  }


  // Edit popup content field (title, subtitle, etc.)
  editPopupField(field: string, itemId: any, currentValue: any): void {
    this.editingField = field + itemId;
    this.editableValue = currentValue;
  }

  // Save edited popup content
  savePopupEdit(field: string, itemId: any): void {
    const valueToSave = typeof this.editableValue === 'string' ? this.editableValue.trim() : this.editableValue;

    if (valueToSave !== '') {
      this.supSubService.updatePricePopupContent(itemId, field, valueToSave).subscribe(
        (response) => {
          if (response.status) {
            this.loadPricingPopupContent(); // Reload pricing popup content after update
            this.cancelEdit(); // Clear edit state
            this.showSnackbar('Pricing popup content updated successfully', 3000);
          } else {
            this.showSnackbar('Failed to update pricing popup content', 3000);
          }
        },
        (error) => {
          console.error('Error updating pricing popup content:', error);
          this.showSnackbar('Error updating pricing popup content', 3000);
        }
      );
    } else {
      this.showSnackbar('Please enter a valid value', 3000);
    }
  }


  // In support-subscription-settings.component.ts

  savePopupFeatureEdit(field: string, featureId: any): void {
    const valueToSave = typeof this.editableValue === 'string' ? this.editableValue.trim() : this.editableValue;

    if (valueToSave !== '') {
      // Pass 'feature_name' instead of 'feature' to the service
      this.supSubService.updatePricePopupFeature(featureId, 'feature_name', valueToSave).subscribe(
        (response) => {
          if (response.status) {
            this.loadPricingPopupContent(); // Reload pricing popup content after update
            this.cancelEdit(); // Clear edit state
            this.showSnackbar('Pricing popup feature updated successfully', 3000);
          } else {
            this.showSnackbar('Failed to update pricing popup feature', 3000);
          }
        },
        (error) => {
          console.error('Error updating pricing popup feature:', error);
          this.showSnackbar('Error updating pricing popup feature', 3000);
        }
      );
    } else {
      this.showSnackbar('Please enter a valid value', 3000);
    }
  }

 // --- Methods for Adding Features ---

  /**
   * Sets the state to show the input field for adding a feature to a specific plan.
   * @param planId The ID of the price_popup_content item.
   */
  startAddingFeature(planId: number): void {
    this.cancelEdit(); // Ensure any other edit is cancelled
    this.addingFeatureToPlanId = planId;
    this.newFeatureName = ''; // Clear previous input
    this.isAddingFeature = false; // Reset loading state
  }

  /**
   * Hides the "Add Feature" input field and resets related state.
   */
  cancelAddFeature(): void {
    this.addingFeatureToPlanId = null;
    this.newFeatureName = '';
    this.isAddingFeature = false;
  }

 
  saveNewFeature(): void {
    const featureNameToAdd = this.newFeatureName.trim();
    const planIdToAdd = this.addingFeatureToPlanId;

    if (!planIdToAdd || !featureNameToAdd) {
      this.showSnackbar('Please enter a feature name.');
      return;
    }
    if (this.isAddingFeature) { return; }

    this.isAddingFeature = true;
    this.cancelAddFeature(); // Hide UI
    this.cdr.detectChanges(); // Update UI to hide input

    this.isAddingFeature = true; // Set loading again for button

    this.supSubService.createPricePopupFeature(planIdToAdd, featureNameToAdd)
      .subscribe({
        next: (response) => {
          this.isAddingFeature = false; // Reset loading
          if (response.status) {
            this.showSnackbar('Feature added successfully!');
            // **** This call will trigger the list refresh ****
            this.loadPricingPopupContent();
            // **** No need for cdr.detectChanges() here ****
          } else {
            this.showSnackbar(response.message || 'Failed to add feature.');
             this.cdr.detectChanges(); // Update button text if needed
          }
        },
        error: (error) => {
          this.isAddingFeature = false; // Reset loading
          console.error('Error adding feature:', error);
          this.showSnackbar('Error adding feature. Please try again.');
          this.cdr.detectChanges(); // Update button text
        }
      });
  }



  // --- End of Methods for Adding Features ---


  // --- MODIFIED DELETE METHOD (without finalize) ---
  /**
   * Handles the deletion of a feature after confirmation.
   * @param featureId The ID of the feature to delete.
   * @param featureName The name for the confirmation dialog.
   */
  deleteFeature(featureId: number, featureName: string): void {
    // Check if already deleting this or another feature
    if (this.deletingFeatureId !== null) {
        console.warn("Deletion already in progress for feature ID:", this.deletingFeatureId);
        return; // Prevent multiple delete actions
    }

    // Confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to delete the feature "${featureName}"? This action cannot be undone.`);

    if (confirmDelete) {
      this.deletingFeatureId = featureId; // Set loading/disabled state BEFORE the call

      this.supSubService.deletePricePopupFeature(featureId)
        .subscribe({
          next: (response: any) => {
            if (response?.status) { // Optional chaining for safety
              this.showSnackbar('Feature deleted successfully!');
              this.loadPricingPopupContent(); // Refresh the list
            } else {
              this.showSnackbar(response?.message || 'Failed to delete feature.');
            }
            // Reset state on success AFTER handling response
            this.deletingFeatureId = null;
          },
          error: (error: any) => {
            console.error('Error deleting feature:', error);
            this.showSnackbar('Error deleting feature. Please try again.');
            // Reset state on error AFTER handling error
            this.deletingFeatureId = null;
          }
          // Note: 'complete' callback is usually not needed here if you reset in next/error
        });
    }
    // If user cancels confirmation, do nothing, deletingFeatureId remains null
  
  // ----------------------------------------------
}




}
