import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../services/auth.service'; // Import AuthService
import {EmployeeAttendanceService} from '../services/getemployeedetailstatus.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employeeCode: string | null = null;
  employeeDetails: { employee_code: string; employee_full_name: string; message?: string } | null = null;
  attendanceDetails: {
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string | null;
    remarks: string | null;
  } = { checkInTime: null, checkOutTime: null, status: null, remarks: null };
  isSidebarOpen: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService, // Inject AuthService
    private attendanceService: EmployeeAttendanceService
  ) {}

  ngOnInit(): void {
    // Fetch the employee code from AuthService
    this.employeeCode = this.authService.getEmployeeCode();

    if (this.employeeCode) {
      this.fetchEmployeeDetails(this.employeeCode);
      this.fetchAttendanceDetails(this.employeeCode);
    } else {
     // console.error('Employee code not found. Redirecting to login.');
      // Optional: Redirect to login page if employee code is missing
    }

     // Do not toggle the sidebar automatically
     this.isSidebarOpen = false;
    // console.log('Sidebar state on init:', this.isSidebarOpen); 
  }

  fetchEmployeeDetails(employeeCode: string): void {
    this.employeeService.getEmployeeDetails(employeeCode).subscribe({
      next: (data) => {
       // console.log('Employee Details:', data);
        this.employeeDetails = data;
      },
      error: (error) => {
      //  console.error('Error fetching employee details:', error);
      },
    });
   // console.log('Dashboard Component - Employee Code:', employeeCode);
  }


  fetchAttendanceDetails(employeeCode: string): void {
    this.attendanceService.getAttendanceStatus(employeeCode).subscribe({
      next: (data) => {
      //  console.log('Attendance Details:', data);
        this.attendanceDetails = data;
      },
      error: (error) => {
      //  console.error('Error fetching attendance details:', error);
        this.attendanceDetails = {
          checkInTime: 'Error',
          checkOutTime: 'Error',
          status: 'Error',
          remarks: 'Failed to fetch attendance details'
        };
      }
    });
  }

  getStatusClass(status: string | null): string {
    if (!status) return '';
    const statusMap: { [key: string]: string } = {
      'Present': 'status-present',
      'Absent': 'status-absent',
      'Half-day': 'status-halfday',
      'Leave': 'status-leave'
    };
    return statusMap[status] || '';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    //console.log('Sidebar toggled. Current state:', this.isSidebarOpen);
  }
  

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isSidebarClick = target.closest('.sidebar') !== null; // Check if click is inside the sidebar
    const isHamburgerClick = target.closest('.hamburger') !== null; // Check if click is on the hamburger button
  
   // console.log('Sidebar outside click detected', { isSidebarClick, isHamburgerClick, isSidebarOpen: this.isSidebarOpen });
  
    // Close the sidebar if clicked outside and it's open
    if (this.isSidebarOpen && !isSidebarClick && !isHamburgerClick) {
      this.isSidebarOpen = false;
    // console.log('Sidebar closed due to outside click');
    }
  }
  
}
