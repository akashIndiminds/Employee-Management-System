import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthlyDailyEmployeeDetailsService } from '../services/getdailyemployeedetails.service';
import { AttendanceResponse, CalendarDay } from '../interfaces/attendance.interface';
import { baseUrl } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent, SidebarComponent],
  templateUrl: './daily-attendance.component.html',
  styleUrls: ['./daily-attendance.component.css']
})
export class DailyAttendanceComponent implements OnInit, OnDestroy {
  employeeCodes: { Text: string; Value: string }[] = [];
  selectedEmployee: string = 'all';
  isEmployee: boolean = false;
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmployee = localStorage.getItem('selectedEmployee');
      if (storedEmployee) {
        this.selectedEmployee = storedEmployee;
      }
    }

    if (this.selectedEmployee !== 'all') {
      this.fetchAttendanceData();
    }
    this.fetchEmployeeCodes();
    this.checkUserRole();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resetValues();
    }
  }

  resetValues(): void {
    this.selectedEmployee = 'all';
    this.attendanceData = null;
    this.isLoading = false;
    this.error = null;
    localStorage.removeItem('selectedEmployee');
  }

  fetchEmployeeCodes(): void {
    const url = `${baseUrl}/EmployeeCodes`;
    const loggedInEmployeeCode = this.authService.getEmployeeCode();
    const adminCodes = ['ITL-KOL-1017', 'ITL-KOL-1007', 'ITL-KOL-1001'];
    const isAdmin = adminCodes.includes(loggedInEmployeeCode);
  
    this.http.get<{ Text: string; Value: string }[]>(url).subscribe({
      next: (data) => {
        if (!isAdmin) {
          this.employeeCodes = data.filter(employee => employee.Value === loggedInEmployeeCode);
          this.selectedEmployee = loggedInEmployeeCode;
        } else {
          this.employeeCodes = data.sort((a, b) => {
            const nameA = a.Text.split(" - ")[0].trim().toUpperCase();
            const nameB = b.Text.split(" - ")[0].trim().toUpperCase();
            return nameA.localeCompare(nameB);
          });
  
          if (!this.selectedEmployee || !data.some(emp => emp.Value === this.selectedEmployee)) {
            this.selectedEmployee = loggedInEmployeeCode;
            localStorage.setItem('selectedEmployee', loggedInEmployeeCode);
          }
        }
  
        if (this.selectedEmployee) {
          this.fetchAttendanceData();
        }
      },
      error: (error) => {
        this.error = 'Error fetching employee codes. Please try again.';
      },
    });
  }

  checkUserRole(): void {
    const loggedInEmployeeCode = this.authService.getEmployeeCode();
    const adminCodes = ['ITL-KOL-1017', 'ITL-KOL-1007', 'ITL-KOL-1001'];
    this.isEmployee = !adminCodes.includes(loggedInEmployeeCode);
  }

  onSelectionChange(): void {
    localStorage.setItem('selectedEmployee', this.selectedEmployee);

    if (this.isEmployee) {
      return;
    }

    if (!this.isEmployee) {
      localStorage.setItem('selectedEmployee', this.selectedEmployee);
    }

    if (this.selectedEmployee === 'all') {
      this.attendanceData = null;
      return;
    }

    this.fetchAttendanceData();
  }

  fetchAttendanceData(): void {
    this.isLoading = true;
    this.error = null;

    this.monthlyEmployeeService
      .getMonthlyEmployeeDetails(this.selectedEmployee, this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (response) => {
          this.attendanceData = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to fetch attendance data. Please try again.';
          this.isLoading = false;
        },
      });
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

  backToReports(): void {
    this.router.navigate(['/reports']);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}