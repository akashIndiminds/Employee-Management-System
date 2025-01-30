import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import necessary module
import { ButtonModule } from 'primeng/button'; // For PrimeNG buttons
import { SidebarModule } from 'primeng/sidebar'; // For PrimeNG sidebar
import { Router } from '@angular/router'; // For routing between pages
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { CheckInService } from '../services/checkin.service';

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
  private _isOpen = false;
  
  constructor(private router: Router, private authService: AuthService, private attendanceService: AttendanceService, private checkInService: CheckInService ) {}
  
  toggle() {
    // Only emit the event, let parent handle the state
    this.isOpenChange.emit(!this.isOpen);
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
  navigateToAttendance(): void {
    const employeeCode = this.authService.getEmployeeCode() ?? ''; // Fetch employee code
  
    if (!employeeCode) {
      //console.error('Employee code is null or empty.');
      return;
    }
  
    this.checkInService.checkAttendanceStatus(employeeCode).subscribe({
      next: (response) => {
      //  console.log('Check-in Status:', response.CheckInStatus);
       // console.log('Working Hours:', response.Duration);
  
        // Store the data in the CheckInService
        this.checkInService.storeCheckInStatus(
          response.CheckInStatus,
          response.Duration
        );
  
        // Navigate to the Attendance page only after storing data
        this.router.navigate(['/attendance']).then(() => {
          this.toggle(); // Close sidebar after navigation
        });
      },
      error: (error) => {
        //console.error('Error checking attendance status:', error);
      },
    });
  }
  

  navigateToDashboard() {
    this.router.navigate(['/dashboard']); // Adjust the route as needed
    this.toggle(); 
  }


 // Method to toggle dropdown visibility
 toggleDropdown(index: number): void {
  const dropdownItem = document.querySelectorAll('.submenu li')[index];
  dropdownItem.classList.toggle('active');
}
  // Navigate to Admin page
  navigateToAdmin() {
    const employeeCode = this.authService.getEmployeeCode(); // Fetch employee code
  
    // Check if the employee code is "ITL-KOL-1001"
    if (employeeCode === 'ITL-KOL-1001' || employeeCode === 'ITL-KOL-1007' || employeeCode === 'ITL-KOL-1017' || employeeCode === 'ITL-KOL-1012') {
      this.router.navigate(['/admin']);
      this.toggle();  // Close sidebar after navigation
    } else {
    //  console.warn('Access denied. You are not authorized to view the Admin page.');
    }
  }
  navigateToReports() {
    this.router.navigate(['/report']); // Add this method
    this.toggle(); 
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']); // Navigate to the settings page
    this.toggle(); 
  }
  
  logout(): void {
    this.authService.logout(); // This will clear the employee code

    // Reset attendance status and navigate to login page
    this.attendanceService.resetAttendanceStatus(); 
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
