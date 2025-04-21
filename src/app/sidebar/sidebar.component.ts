import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Declare isCollapsed as an input property to get its value from the parent component
   @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Input() isCollapsed: boolean = true;

  // These methods should be defined in the AppComponent, not SidebarComponent
  // But you can define dummy ones here in case you need them for some future use
  expandSidebar() {
    this.isCollapsed = false;
  }

  collapseSidebar() {
    this.isCollapsed = true;
  }

  collapseSidebarOnLinkClick(){
    this.toggleSidebarEvent.emit();
  
  }

 
}
