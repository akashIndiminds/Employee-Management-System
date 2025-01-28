import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SetAttendanceService } from '../services/admin-attendance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { baseUrl } from '../app.config';

@Component({
  selector: 'app-admin-attendance',
  standalone: true,
  imports: [SidebarComponent, TopBarComponent, CommonModule, FormsModule],
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.css'],
})
export class AdminAttendanceComponent implements OnInit {
  attendanceData = {
    empcode: '', // This will hold the selected employee code (Value)
    date: '',
    checkInTime: '',
    checkOutTime: '',
    status: '',
    remarks: '',
  };
  isSidebarOpen: boolean = false;
  attendanceStatuses = [
    { id: 1, label: 'Present' },
    { id: 2, label: 'Absent' },
    { id: 3, label: 'Half-day' },
    { id: 4, label: 'Leave' },
    { id: 5, label: 'WFH' }
  ];
  employeeCodes: { Text: string; Value: string }[] = []; // Employee Codes array

  constructor(
    private adminAttendanceService: SetAttendanceService,
    private http: HttpClient // Injected HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeCodes();
  }

  fetchEmployeeCodes(): void {
    const url = `${baseUrl}/EmployeeCodes`;
    this.http.get<{ Text: string; Value: string }[]>(url).subscribe(
      (data: { Text: string; Value: string }[]) => {
        this.employeeCodes = data;
      },
      (error: any) => {
        console.error('Error fetching employee codes:', error);
      }
    );
  }

  submitAttendance(): void {
    const { empcode, date, checkInTime, checkOutTime, status, remarks } =
      this.attendanceData;

    if (!empcode || !date || !status) {
      alert('Please fill in all required fields.');
      return;
    }

    this.adminAttendanceService
      .setAttendanceStatus(empcode, date, checkInTime, checkOutTime, status, remarks)
      .subscribe(
        (response: { messsage: string }) => {
          alert(response.messsage || 'Attendance status updated successfully!');
        },
        (error: any) => {
          console.error('Error updating attendance:', error);
          alert('Failed to update attendance.');
        }
      );
  }

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

  // Update empcode when the dropdown selection changes
  onEmployeeCodeChange(value: string): void {
    this.attendanceData.empcode = value; // Set empcode from selected Value
  }
}
