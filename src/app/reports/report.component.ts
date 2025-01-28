import { Component, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthlyDailyEmployeeDetailsService } from '../services/getdailyemployeedetails.service';
import { AttendanceResponse, CalendarDay } from '../interfaces/attendance.interface';
import { baseUrl } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnDestroy {
  reports = [
    { id: 1, title: 'Daily Attendance', date: '2025-01-15', status: 'completed' },
    { id: 2, title: 'Monthly Attendance Report', date: '2025-01-10', status: 'in-progress' },
    { id: 3, title: 'Performance Overview', date: '2025-01-05', status: 'completed' },
  ];

  employeeCodes: { Text: string; Value: string }[] = [];
  selectedEmployee: string = 'all'; // Default to 'all'
  isEmployee: boolean = false; // Flag to track if the user is an employee or admin
  showAttendanceReport = false;
  showmonthlyAttendanceReport = false;
  isSidebarOpen = false;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
  }));
  years = [2025];
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  attendanceData: AttendanceResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private monthlyEmployeeService: MonthlyDailyEmployeeDetailsService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
      const savedReportState = localStorage.getItem('showAttendanceReport');
      this.showAttendanceReport = savedReportState ? JSON.parse(savedReportState) : false;

      const storedEmployee = localStorage.getItem('selectedEmployee');
      if (storedEmployee) {
        this.selectedEmployee = storedEmployee;
      } else {
        this.selectedEmployee = 'all'; // Default to 'all' if not found in localStorage
      }
    }

    if (this.selectedEmployee !== 'all') {
      this.fetchAttendanceData();
    }
    this.fetchEmployeeCodes();
    this.checkUserRole();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
      this.resetValues();
    }
  }

  resetValues(): void {
    // Reset all state variables
    this.selectedEmployee = 'all';
    this.showAttendanceReport = false;
    this.attendanceData = null;
    this.isLoading = false;
    this.error = null;

    // Clear localStorage values
    localStorage.removeItem('selectedEmployee');
    localStorage.removeItem('showAttendanceReport');
  }

  initializeEmployeeSelection(): void {
    const loggedInEmployeeCode = this.authService.getEmployeeCode();
    const storedEmployee = localStorage.getItem('selectedEmployee');

    // For both admin and regular employees, default to their own code
    this.selectedEmployee = storedEmployee || loggedInEmployeeCode;
  }

  fetchEmployeeCodes(): void {
    const url = `${baseUrl}/EmployeeCodes`;
    const loggedInEmployeeCode = this.authService.getEmployeeCode();
    const adminCodes = ['ITL-KOL-1017', 'ITL-KOL-1007', 'ITL-KOL-1001'];
    const isAdmin = adminCodes.includes(loggedInEmployeeCode);

    this.http.get<{ Text: string; Value: string }[]>(url).subscribe({
      next: (data) => {
        if (!isAdmin) {
          // For regular employees, only show their own code
          this.employeeCodes = data.filter(employee => employee.Value === loggedInEmployeeCode);
          this.selectedEmployee = loggedInEmployeeCode;
        } else {
          // For admins, show all codes
          this.employeeCodes = data;

          // If no employee is selected or selection is invalid, default to admin's own code
          if (!this.selectedEmployee || !data.some(emp => emp.Value === this.selectedEmployee)) {
            this.selectedEmployee = loggedInEmployeeCode;
            localStorage.setItem('selectedEmployee', loggedInEmployeeCode);
          }
        }

        // Fetch attendance data for the selected employee
        if (this.selectedEmployee) {
          this.fetchAttendanceData();
        }
      },
      error: (error) => {
        console.error('Error fetching employee codes:', error);
      },
    });
  }

  checkUserRole(): void {
    const loggedInEmployeeCode = this.authService.getEmployeeCode();
    const adminCodes = ['ITL-KOL-1017', 'ITL-KOL-1007', 'ITL-KOL-1001'];
    this.isEmployee = !adminCodes.includes(loggedInEmployeeCode);
  }

  onSelectionChange(): void {
    localStorage.setItem('selectedEmployee', this.selectedEmployee); // Store selected employee in localStorage

    if (this.isEmployee) {
      // Employee users can't change their selection
      return;
    }

    // Only store selection in localStorage for admin users
    if (!this.isEmployee) {
      localStorage.setItem('selectedEmployee', this.selectedEmployee);
    }

    // If 'all' is selected, clear the attendance data
    if (this.selectedEmployee === 'all') {
      this.attendanceData = null;
      return;
    }

    // Fetch attendance data for the selected employee
    this.fetchAttendanceData();
  }

  fetchAttendanceData(): void {
    this.isLoading = true; // Show loading spinner or message
    this.error = null; // Reset error message

    // Call the service to get data
    this.monthlyEmployeeService
      .getMonthlyEmployeeDetails(this.selectedEmployee, this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (response) => {
          this.attendanceData = response; // Store fetched data
          this.isLoading = false; // Hide loading spinner/message
        },
        error: (error) => {
          console.error('Error fetching attendance data:', error);
          this.error = 'Failed to fetch attendance data. Please try again.'; // Display error message
          this.isLoading = false; // Hide loading spinner/message
        },
      });
  }

  viewReport(report: any): void {
    if (report.title === 'Daily Attendance') {
      this.showAttendanceReport = true;
      localStorage.setItem('showAttendanceReport', JSON.stringify(this.showAttendanceReport));

      // Always fetch data when viewing report if an employee is selected
      if (this.selectedEmployee !== 'all') {
        this.fetchAttendanceData();
      }
    }
    if (report.title === 'Monthly Attendance Report') {
      this.router.navigate(['/monthlyreports']);

    }
  }

  backToReports(): void {
    this.showAttendanceReport = false;
    localStorage.setItem('showAttendanceReport', JSON.stringify(this.showAttendanceReport)); // Persist state
  }

  generateCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const lastDay = new Date(Date.UTC(year, month, 0));
    const daysInMonth = lastDay.getUTCDate();

    let firstDayOfWeek = firstDay.getUTCDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: undefined,
        isWeekend: false,
        isCurrentMonth: false,
      });
    }

    const attendanceMap: { [key: string]: any } = {};
    this.attendanceData?.attendance_details.forEach((detail) => {
      attendanceMap[detail.date] = detail;
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month - 1, day));
      const dayOfWeek = date.getUTCDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateString = date.toISOString().split('T')[0];

      days.push({
        date,
        isWeekend,
        attendance: attendanceMap[dateString],
        isCurrentMonth: true,
      });
    }

    return days;
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

  
}