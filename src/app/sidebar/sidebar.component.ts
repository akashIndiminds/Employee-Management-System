import { Component, Input, Output, EventEmitter, Renderer2, OnInit, OnDestroy } from '@angular/core';
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
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;  // Sidebar visibility controlled by parent component
  @Output() isOpenChange = new EventEmitter<boolean>();  // Emit event to toggle sidebar visibility
  private _isOpen = false;
  private bodyScrollListener!: () => void;

  constructor(
    private router: Router,
     private authService: AuthService, 
     private attendanceService: AttendanceService, 
     private checkInService: CheckInService,
     private renderer: Renderer2
    ) {}

    ngOnInit() {
      // Add event listener to prevent body scroll when sidebar is open
      this.bodyScrollListener = this.renderer.listen('body', 'scroll', (event) => {
        if (this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }

    ngOnDestroy() {
      // Clean up event listener
      if (this.bodyScrollListener) {
        this.bodyScrollListener();
      }
    }
    handleOverlayClick(event: MouseEvent) {
      if (event.target === event.currentTarget) { // Only if clicking the overlay itself
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      }
    }
  
    toggle() {
      const newState = !this.isOpen;
      this.isOpenChange.emit(newState);
      
      // Handle body scroll
      if (newState) {
        this.renderer.addClass(document.body, 'sidebar-open');
      } else {
        this.renderer.removeClass(document.body, 'sidebar-open');
      }
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
        this.checkInService.storeCheckInStatus(response.CheckInStatus, response.Duration);
    
        // Pass data as query parameters when navigating
        this.router.navigate(['/attendance'], {
          queryParams: {
            checkInStatus: response.CheckInStatus,
            duration: response.Duration
          }
        }).then(() => {
          this.toggle(); // Close sidebar after navigation
        });
      },
      error: (error) => {
        console.error('Error checking attendance status:', error);
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
