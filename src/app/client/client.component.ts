import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { MatTableDataSource } from '@angular/material/table';  // Optional if you need to use material tables
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common'; // Import necessary pipes/modules
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  userPurchases: any[] = [];
  originalPurchases: any[] = [];  // Store original data to reset the search
  searchQuery: string = '';

  constructor(private clientService: ClientService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUserPurchases();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  loadUserPurchases(): void {
    this.clientService.getAllUserPurchases().subscribe({
      next: (res: any) => {
        this.userPurchases = res.data;
        this.originalPurchases = [...res.data];  // Store original data for reset
      },
      error: (err) => {
        console.error('Failed to load purchases', err);
      }
    });
  }

  // Search functionality
  searchPurchases(): void {
    if (this.searchQuery.trim() === '') {
      this.userPurchases = [...this.originalPurchases];  // Reset to original data
    } else {
      const query = this.searchQuery.toLowerCase();
      this.userPurchases = this.originalPurchases.filter(purchase =>
        purchase.name.toLowerCase().includes(query) || purchase.email.toLowerCase().includes(query)
      );
    }
  }


  updateStatus(purchase: any, field: string, value: string) {
    const payload: any = {};
    payload[field] = value;
  

    console.log("purchase-->",purchase)

    this.clientService.updateUserPurchaseByAdmin(purchase.purchase_id, payload).subscribe({
      next: () => {
        this.showSnackbar('Status updated successfully');
      },
      error: () => {
        this.showSnackbar('Failed to update status');
      }
    });
  }


  toggleEditMode(purchase: any) {
    purchase.isEditing = !purchase.isEditing;
    if (!purchase.isEditing) {
      this.updateFollowUpNotes(purchase);
    }
  }

  updateFollowUpNotes(purchase: any) {
    const payload = {
      follow_up_notes: purchase.follow_up_notes
    };

    this.clientService.updateUserPurchaseByAdmin(purchase.purchase_id, payload).subscribe({
      next: () => {
        this.showSnackbar('Follow-up note updated successfully');
      },
      error: () => {
        this.showSnackbar('Failed to update follow-up note');
      }
    });
  }
  

}


