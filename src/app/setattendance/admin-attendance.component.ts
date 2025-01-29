import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SetAttendanceService } from '../services/admin-attendance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { baseUrl } from '../app.config';
import { MonthlyDailyEmployeeDetailsService } from '../services/getdailyemployeedetails.service'; // Import the service

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
    { id: 5, label: 'WFH' },
  ];
  employeeCodes: { Text: string; Value: string }[] = []; // Employee Codes array

  constructor(
    private adminAttendanceService: SetAttendanceService,
    private http: HttpClient, // Injected HttpClient
    private monthlyEmployeeService: MonthlyDailyEmployeeDetailsService // Injected MonthlyEmployeeDetailsService
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeCodes();
  }

  fetchEmployeeCodes(): void {
    const url = `${baseUrl}/EmployeeCodes`;
    this.http.get<{ Text: string; Value: string }[]>(url).subscribe(
      (data: { Text: string; Value: string }[]) => {
        this.employeeCodes = data.sort((a, b) => {
          const nameA = a.Text.split(" - ")[0].trim().toUpperCase(); // Extract name and normalize
          const nameB = b.Text.split(" - ")[0].trim().toUpperCase();
          return nameA.localeCompare(nameB); // Sort alphabetically
        });
      },
      (error: any) => {
        console.error("Error fetching employee codes:", error);
      }
    );
  }
  

  submitAttendance(): void {
    let { empcode, date, checkInTime, checkOutTime, status, remarks } = this.attendanceData;

    // Ensure checkInTime and checkOutTime are formatted correctly as HH:mm:ss
    if (checkInTime && !checkInTime.includes(':00')) {
      checkInTime = `${checkInTime}:00`; // Add seconds if not already present
    }
    if (checkOutTime && !checkOutTime.includes(':00')) {
      checkOutTime = `${checkOutTime}:00`; // Add seconds if not already present
    }

    if (!empcode || !date || !status) {
      alert('Please fill in all required fields.');
      return;
    }

    // Pass the formatted values to the service
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

  // Fetch attendance data when the date changes
  onDateChange(): void {
  if (!this.attendanceData.empcode || !this.attendanceData.date) {
    return; // Do nothing if employee code or date is not selected
  }

  const selectedDate = new Date(this.attendanceData.date);
  const month = selectedDate.getMonth() + 1; // Months are 0-indexed in JavaScript
  const year = selectedDate.getFullYear();

  // Fetch monthly attendance data
  this.monthlyEmployeeService
    .getMonthlyEmployeeDetails(this.attendanceData.empcode, month, year)
    .subscribe({
      next: (response) => {
        // Find attendance data for the selected date
        const selectedDateData = response.attendance_details.find(
          (detail) => detail.date === this.attendanceData.date
        );

        if (selectedDateData) {
          // Map text status to numeric value
          const statusMapping: { [key: string]: string } = {
            Present: '1',
            Absent: '2',
            'Half-day': '3',
            Leave: '4',
            WFH: '5',
          };

          this.attendanceData.checkInTime = selectedDateData.check_in?.slice(0, 5) || '';
          this.attendanceData.checkOutTime = selectedDateData.check_out?.slice(0, 5) || '';
          this.attendanceData.status = statusMapping[selectedDateData.status] || '';
          this.attendanceData.remarks = selectedDateData.remarks || '';
        } else {
          // Clear the form if no data exists for the selected date
          this.attendanceData.checkInTime = '';
          this.attendanceData.checkOutTime = '';
          this.attendanceData.status = '';
          this.attendanceData.remarks = '';
        }
      },
      error: (error) => {
        console.error('Error fetching attendance data:', error);
        alert('Failed to fetch attendance data.');
      },
    });
}

}