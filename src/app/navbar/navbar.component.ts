import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private router: Router,  private authService: AuthService,) {}

  toggleSidebar() {
    this.toggleSidebarEvent.emit(); // Trigger the event to toggle sidebar
  }

  logout() {
    this.authService.logout(); // Call the AuthService logout method
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }
}
