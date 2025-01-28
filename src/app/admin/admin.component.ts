import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent],
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isSidebarOpen: boolean = false; // Declare the sidebar state

  constructor(private router: Router) {}

  // Navigate to Users page
  navigateToUsers() {
    this.router.navigate(['/registeruser']);  // Replace '/users' with the path to your users page
  }

  // Navigate to Settings page
  navigateToSetAttendance() {
    this.router.navigate(['/setattendance']);  // Replace '/settings' with the path to your settings page
  }

  // Navigate to Reports page
  navigateToReports() {
    this.router.navigate(['/report']);  // Replace '/reports' with the path to your reports page
  }

  // Toggle Sidebar visibility
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isSidebarClick = target.closest('.sidebar') !== null;
    const isHamburgerClick = target.closest('.hamburger') !== null;

    if (this.isSidebarOpen && !isSidebarClick && !isHamburgerClick) {
      this.isSidebarOpen = false;
    }
  }
  
}
