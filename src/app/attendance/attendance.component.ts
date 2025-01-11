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

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent, ToastModule], // Add ToastModule here
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [MessageService]
})
export class AttendanceComponent implements OnInit {
  employeeId: string | null = null;
  employeeDetails: { employee_code: string; employee_full_name: string } | null = null;
  isSidebarOpen: boolean = false;
  employeeCode: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private elementRef: ElementRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.employeeCode = this.authService.getEmployeeCode();
    console.log('Employee Code:', this.employeeCode);
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

  markAttendance(): void {
    if (this.employeeCode) {
      console.log('Marking attendance for:', this.employeeCode);
      this.attendanceService.markAttendance(this.employeeCode).subscribe({
        next: (response) => {
          console.log('Attendance marked successfully:', response);
          const message = response?.message || 'Attendance marked successfully!';
          this.messageService.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        },
        error: (error) => {
          console.error('Error marking attendance:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to mark attendance. Please try again.', life: 3000 });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Employee code not found. Please log in again.', life: 3000 });
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isSidebarClick = target.closest('.p-sidebar') !== null;
    const isHamburgerClick = target.closest('.hamburger') !== null;
    
    if (this.isSidebarOpen && !isSidebarClick && !isHamburgerClick) {
      this.isSidebarOpen = false;
    }
  }
}
