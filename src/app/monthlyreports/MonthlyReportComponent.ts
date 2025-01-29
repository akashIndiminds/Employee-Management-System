import { Component, OnInit , HostListener} from '@angular/core';
import { MonthlyALLEmployeeService } from '../services/getmonthlyemployeedetails.service'; // Adjust import path as needed
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-monthly-report',
  standalone:true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopBarComponent],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {
  selectedMonth: number = 1; // Set default to January\
  isSidebarOpen: boolean = false;
  selectedYear: number = 2025; // Set default to 2025
  attendanceData: any[] = []; // To store the fetched attendance data
  isLoading: boolean = false;
  error: string = '';
  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years = [2023, 2024, 2025]; // Example list of years (you can update it)

  constructor(private monthlyEmployeeService: MonthlyALLEmployeeService) {}

  ngOnInit(): void {}

  // Fetch monthly attendance report for the selected month and year
  fetchMonthlyAttendanceReport(): void {
    if (!this.selectedMonth || !this.selectedYear) {
      return;
    }
  
    this.isLoading = true;
    this.error = '';
  
    this.monthlyEmployeeService.getMonthlyAttendanceReport(this.selectedMonth, this.selectedYear)
      .subscribe(
        (data: any) => {
          console.log("API Response:", data); // Log the response for debugging
  
          // Transform the nested data into a wide-table format
          this.attendanceData = this.transformToWideTable(data.attendance_data);
          this.isLoading = false;
        },
        (err) => {
          console.error("API Error:", err); // Log the error
          this.error = 'Error fetching attendance data';
          this.isLoading = false;
        }
      );
  }
  
  // Helper function to transform nested attendance data into a wide-table format
  // Helper function to transform nested attendance data into a wide-table format
transformToWideTable(attendanceData: any[]): any[] {
  const wideTableData: any[] = [];
  const currentDate = new Date(); // Get the current date
  
  attendanceData.forEach(employee => {
    const employeeRow: any = {
      employee_name: employee.employee_name,
      employee_code: employee.employee_code,
      TotalWorkingDays: employee.total_working_days, // Add this line
      TotalTimeWorked: employee.total_time_worked    // Add this line
    };

    // Add each date's attendance as a column
    Object.keys(employee.daily_attendance).forEach(date => {
      const attendanceDate = new Date(date);
      if (attendanceDate > currentDate) {
        // If the date is in the future, set it as empty ('')
        employeeRow[date] = '';
      } else {
        // If the attendance data exists, use it, otherwise mark as 'A'
        employeeRow[date] = employee.daily_attendance[date] || 'A';
      }
    });

    wideTableData.push(employeeRow);
  });

  return wideTableData;
}

  
  // Helper function to transform nested attendance data
  transformAttendanceData(attendanceData: any[]): any[] {
    const flatData: any[] = [];
  
    attendanceData.forEach(employee => {
      const employeeName = employee.employee_name;
      const employeeCode = employee.employee_code;
      const dailyAttendance = employee.daily_attendance;
  
      // Loop through each date in the daily_attendance object
      Object.keys(dailyAttendance).forEach(date => {
        const attendanceRecord = dailyAttendance[date];
  
        flatData.push({
          employee_name: employeeName,
          employee_code: employeeCode,
          date: date,
          attendance: attendanceRecord || 'A' // If null, mark as 'Absent'
        });
      });
    });
  
    return flatData;
  }

  // Helper function to generate an array of dates for the selected month and year
  getDates(): string[] {
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const daysInMonth = new Date(year, month, 0).getDate(); // Get number of days in the month
  
    const dates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      // Push just the day number (no leading zeros)
      dates.push(day.toString());
    }
  
    return dates;
  }
  

  // Download the attendance report in Excel format
  downloadExcel(): void {
    if (!this.attendanceData.length) {
      return;
    }
  
    // Define the column headers manually
    const headers = ["Employee Name", "Employee Code", ...this.getDates(), "Total Working Days", "Total Time Worked"];
  
    // Convert data to an array of arrays following the headers order
    const sheetData = [
      headers, // First row: column headers
      ...this.attendanceData.map(employee => [
        employee.employee_name,
        employee.employee_code,
        ...this.getDates().map(date => employee[date] || "A"), // Fill attendance
        employee.TotalWorkingDays, // Match the casing used in HTML
        employee.TotalTimeWorked  // Match the casing used in HTML
      ])
    ];
  
    // Create a worksheet from the structured data
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Create and save the workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    XLSX.writeFile(wb, `Attendance_Report_${this.selectedMonth}_${this.selectedYear}.xlsx`);
  }
  
  // Disable the "Fetch Report" button if month or year is not selected
  isFetchButtonDisabled(): boolean {
    return !this.selectedMonth || !this.selectedYear;
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
