// report.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthlyEmployeeDetailsService } from '../services/getmonthlyemployeedetails.service';
import { AttendanceResponse, CalendarDay } from '../interfaces/attendance.interface';
import { baseUrl } from '../app.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reports = [
    { id: 1, title: 'Employee Monthly Attendance', date: '2025-01-15', status: 'Completed' },
    { id: 2, title: 'Monthly Attendance Report', date: '2025-01-10', status: 'In Progress' },
    { id: 3, title: 'Performance Overview', date: '2025-01-05', status: 'Completed' },
  ];
  employeeCodes: { Text: string; Value: string }[] = [];
  selectedEmployee: string = 'all'; // Default to 'all'
  isEmployee: boolean = false; // Flag to track if the user is an employee or admin
  showAttendanceReport = false;
  isSidebarOpen = false;
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  
  months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
  }));
  years = [2024, 2025];
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  attendanceData: AttendanceResponse | null = null;
  isLoading = false;
  error: string | null = null;
  
  constructor(private monthlyEmployeeService: MonthlyEmployeeDetailsService,  private http: HttpClient ) {}

  ngOnInit(): void {
    if (this.selectedEmployee !== 'all') {
      this.fetchAttendanceData();
    }
    this.fetchEmployeeCodes();
    this.checkUserRole();
  }



// Fetch employee codes from the backend API
fetchEmployeeCodes(): void {
  const url = `${baseUrl}/EmployeeCodes`;
  this.http.get<{ Text: string; Value: string }[]>(url).subscribe(
    (data) => {
      this.employeeCodes = data;
    },
    (error) => {
      console.error('Error fetching employee codes:', error);
    }
  );
}

// Check if the current user is an employee or an admin
checkUserRole(): void {
  // Assume the role is stored in localStorage or retrieved from session
  const userRole = localStorage.getItem('userRole'); // 'admin' or 'employee'
  if (userRole === 'employee') {
    this.isEmployee = true;
    // Here, you might set the selectedEmployee to the logged-in user's employee code
    this.selectedEmployee = localStorage.getItem('employeeCode') || 'all'; // Default to 'all' if not set
  } else {
    this.isEmployee = false;
  }
}
// Handle the selection change (only needed for admin role)
onSelectionChange(): void {
  if (this.isEmployee) {
    // Prevent further changes if the user is an employee
    if (this.selectedEmployee !== localStorage.getItem('employeeCode')) {
      this.selectedEmployee = localStorage.getItem('employeeCode') || 'all'; // Reset to the logged-in employee code
      return;
    }
  }

  // If 'all' is selected, clear the attendance data
  if (this.selectedEmployee === 'all') {
    this.attendanceData = null;
    return;
  }

  // Fetch attendance data for the selected employee
  this.fetchAttendanceData();
}

// Method to fetch attendance data for the selected employee
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
      }
    });
}


  viewReport(report: any): void {
    if (report.title === 'Employee Monthly Attendance') {
      this.showAttendanceReport = true;
      if (this.selectedEmployee !== 'all') {
        this.fetchAttendanceData();
      }
    }
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

  //removed code to fill the rows

    return days;
}
  
  
  backToReports(): void {
    this.showAttendanceReport = false;
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

