import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import necessary module
import { ButtonModule } from 'primeng/button'; // For PrimeNG buttons
import { SidebarModule } from 'primeng/sidebar'; // For PrimeNG sidebar
import { Router } from '@angular/router'; // For routing between pages
import { LucideAngularModule } from 'lucide-angular';
import { Settings, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,  // Ensure the component is standalone
  imports: [CommonModule, ButtonModule, SidebarModule ],  // Import dependencies
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;  // Sidebar visibility controlled by parent component
  @Output() isOpenChange = new EventEmitter<boolean>();  // Emit event to toggle sidebar visibility

  constructor(private router: Router) {}
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen); // Emit new state to the parent
  }

  stopSidebarClose(event: MouseEvent) {
    // Prevent the sidebar from closing if the click is not on the close button
    const closeButton = event.target as HTMLElement;
    if (closeButton && closeButton.classList.contains('close-btn')) {
      // If clicked on the close button, let the sidebar close
      return;
    }
    event.stopPropagation(); // Prevent propagation if clicked elsewhere inside the sidebar
  }




  // Navigate to Attendance page
  navigateToAttendance() {
    this.router.navigate(['/attendance']);
    this.toggle();  // Close sidebar after navigation
  }
 // Method to toggle dropdown visibility
 toggleDropdown(index: number): void {
  const dropdownItem = document.querySelectorAll('.submenu li')[index];
  dropdownItem.classList.toggle('active');
}
  // Navigate to Admin page
  navigateToAdmin() {
    this.router.navigate(['/admin']);
    this.toggle();  // Close sidebar after navigation
  }
  navigateToReports() {
    this.router.navigate(['/report']); // Add this method
  }
  
  logout(): void {
    // // Clear any authentication data (e.g., tokens or user data)
    // localStorage.removeItem('authToken');  // If you're using localStorage
    // sessionStorage.removeItem('authToken');  // If you're using sessionStorage

    // Redirect the user to the login page after logging out
    this.router.navigate(['/login']);  // Adjust the route to your login page
  }
}
