import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PaymentGateway, PaymentGatewayService } from '../services/payment-gateway.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

  gateways: PaymentGateway[] = [];
  gatewayForm: FormGroup;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  selectedGatewayForView: PaymentGateway | null = null;
  editingGateway: PaymentGateway | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentGatewayService: PaymentGatewayService
  ) {
    this.gatewayForm = this.fb.group({
      gateway_name: ['', Validators.required],
      config: ['', [Validators.required, this.jsonValidator]]
    });
  }

  ngOnInit(): void {
    this.loadGateways();
  }

  jsonValidator(control: AbstractControl): ValidationErrors | null {
    try {
      JSON.parse(control.value);
    } catch (e) {
      return { invalidJson: true };
    }
    return null;
  }

  loadGateways(): void {
    this.isLoading = true;
    this.paymentGatewayService.getAllGateways().subscribe({
      next: (response) => {
        this.gateways = response.gateways;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load gateways. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);

        this.isLoading = false;
        console.error(err);
      }
    });
  }

  startEdit(gateway: PaymentGateway): void {
    this.editingGateway = gateway;
    this.gatewayForm.setValue({
      gateway_name: gateway.gateway_name,
      config: JSON.stringify(gateway.config, null, 2)
    });
  }

  cancelEdit(): void {
    this.editingGateway = null;
    this.gatewayForm.reset();
  }

  onSubmit(): void {
    if (this.gatewayForm.invalid) {
      return;
    }

    const gatewayData = {
      gateway_name: this.gatewayForm.value.gateway_name,
      config: JSON.parse(this.gatewayForm.value.config)
    };

    if (this.editingGateway) {
      // Use the new patchGateway method for updates
      this.paymentGatewayService.patchGateway(this.editingGateway.id!, gatewayData).subscribe({
        next: () => {
          this.successMessage = 'Gateway updated successfully!';
          this.cancelEdit();
          this.loadGateways();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update gateway.';
          setTimeout(() => this.errorMessage = '', 3000);

          console.error(err);
        }
      });
    } else {
      // Use the existing addGateway method for creating new ones
      this.paymentGatewayService.addGateway(gatewayData).subscribe({
        next: () => {
          this.successMessage = 'Gateway added successfully!';
          this.gatewayForm.reset();
          this.loadGateways();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to add gateway.';
          setTimeout(() => this.errorMessage = '', 3000);
          console.error(err);
        }
      });
    }
  }

  onActivate(gatewayId: number | undefined): void {
    if (!gatewayId) return;
    this.paymentGatewayService.activateGateway(gatewayId).subscribe({
      next: () => {
        this.successMessage = 'Gateway activated successfully!';
        this.loadGateways();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to activate gateway.';
        setTimeout(() => this.errorMessage = '', 3000);
        console.error(err);
      }
    });
  }

  onDelete(gatewayId: number | undefined): void {
    if (!gatewayId) return;
    if (confirm('Are you sure you want to delete this gateway?')) {
      this.paymentGatewayService.deleteGateway(gatewayId).subscribe({
        next: () => {
          this.successMessage = 'Gateway deleted successfully!';
          this.loadGateways();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete gateway.';
          setTimeout(() => this.errorMessage = '', 3000);
          console.error(err);
        }
      });
    }
  }

  showConfig(gateway: PaymentGateway): void {
    this.selectedGatewayForView = gateway;
  }

  closeConfigModal(): void {
    this.selectedGatewayForView = null;
  }
}