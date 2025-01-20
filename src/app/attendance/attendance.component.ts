import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastModule } from 'primeng/toast';  // Import ToastModule
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    TopBarComponent, 
    ToastModule,
    FormsModule,
    DropdownModule,    // Add this
    InputTextModule,   // Add this
    ButtonModule ,    // Add this for pButton
    SelectModule
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [MessageService],
})
export class AttendanceComponent implements OnInit {
  isMarkEntryVisible: boolean=true;
  employeeId: string | null = null;
  employeeDetails: { employee_code: string; employee_full_name: string } | null = null;
  isSidebarOpen: boolean = false;
  employeeCode: string | null = null;
  attendanceMarked = false;
  remarks: string = '';  
  statusOptions = [
    { id: 1, status: 'Present' },
    { id: 2, status: 'Absent' },
    { id: 3, status: 'Half-day' },
    { id: 4, status: 'Leave' }
  ];

  selectedStatus: number = 1; // Default to "Present"
  totalWorkingHours: number = 0; // Store total working hours

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private elementRef: ElementRef,
    private messageService: MessageService
  ) { 
    this.attendanceMarked = this.attendanceService.hasMarkedAttendance();
  }

  ngOnInit(): void {
    this.employeeCode = this.authService.getEmployeeCode();
    if (this.attendanceService.hasMarkedAttendance()) {
      this.attendanceMarked = true;
    }

    // Initialize the total working hours (optional: based on stored data or calculations)
    this.calculateTotalWorkingHours();
    this.CheckEmpAlreadyMarkedIn();
  }

  fetchEmployeeDetails(employeeCode: string): void {
    this.employeeService.getEmployeeDetails(employeeCode).subscribe({
      next: (data) => {
        console.log('Employee Details:', data);
        this.employeeDetails = data;
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
      }
    });
  }
  CheckEmpAlreadyMarkedIn():void{
    // check using api
    this.isMarkEntryVisible=false;
  }

  markAttendance(): void {
    if (this.employeeCode) {
      this.attendanceService.markAttendance(this.employeeCode).subscribe({
        next: (response) => {
          if (response.message === 'Attendance already marked for today.') {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: response.message,
              life: 3000,
            });
          } else if (response.message === 'Entry marked successfully') {
            this.attendanceService.handleAttendanceMarked();
            this.attendanceMarked = true;  // Disable the button
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attendance marked successfully!',
              life: 3000,
              styleClass: 'success-toast', // Custom class for styling
            });
            this.calculateTotalWorkingHours(); // Update total working hours after marking attendance
            this.CheckEmpAlreadyMarkedIn();
          }
        },
        error: (error) => {
          console.error('Error marking attendance:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to mark attendance. Please try again.',
            life: 3000,
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Employee code not found. Please log in again.',
        life: 3000,
      });
    }
  }

  markExit(): void {
    if (this.employeeCode) {
      const status = this.selectedStatus;  // Get selected status from dropdown
      const remarks = this.remarks;  // Use the value entered by the user in the remarks field

      console.log('Marking exit for:', this.employeeCode);
      this.attendanceService.markExit(this.employeeCode, status, remarks).subscribe({
        next: (response) => {
          console.log('Exit marked successfully:', response);
          const message = response?.message;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
          this.calculateTotalWorkingHours(); // Update total working hours after marking exit
        },
        error: (error) => {
          console.error('Error marking exit:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to mark exit. Please try again.', life: 3000 });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Employee code not found. Please log in again.', life: 3000 });
    }
  }

  // Calculate total working hours (Example logic, replace with actual logic)
  calculateTotalWorkingHours(): void {
    // For the sake of example, assume that the employee works 8 hours a day.
    const hoursWorkedToday = 8;  // This should come from the attendance API or logic
    this.totalWorkingHours += hoursWorkedToday;  // Add to the total working hours
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isSidebarClick = target.closest('.sidebar') !== null; // Check if click is inside the sidebar
    const isHamburgerClick = target.closest('.hamburger') !== null; // Check if click is on the hamburger button
    
    // Close the sidebar if clicked outside and it's open
    if (this.isSidebarOpen && !isSidebarClick && !isHamburgerClick) {
      this.isSidebarOpen = false;
    }
  }
}
