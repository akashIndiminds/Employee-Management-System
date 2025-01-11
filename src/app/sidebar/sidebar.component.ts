import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-sidebar',
  standalone: true,  // Mark as standalone
  imports: [CommonModule, ButtonModule, SidebarModule],  // Import required modules
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() employeeCode: string = '';
  constructor(private router: Router) {}  // Inject Router for navigation

  // Method to toggle sidebar visibility
  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);  // Emit the updated visibility state
  }

  // Method to navigate to the Attendance page
  navigateToAttendance() {
    console.log('Navigating to Attendance...');
    this.router.navigate(['/attendance']);  // Navigate to the Attendance component
  }
}
