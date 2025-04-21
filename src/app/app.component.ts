import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed: boolean = true;

  constructor(private router: Router) {} // Inject Router

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Toggle the sidebar's collapsed state
  }

  expandSidebar() {
    this.isCollapsed = false; // Expand the sidebar on hover
  }

  collapseSidebar() {
    this.isCollapsed = true; // Collapse the sidebar on hover out
  }

  isLoginPage(): boolean {
    return this.router.url === '/login'; // Check if the current route is the login page
  }
}
