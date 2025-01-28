import { Component, OnInit } from '@angular/core';
import { MonthlyALLEmployeeService } from '../services/getmonthlyemployeedetails.service'; // Adjust import path as needed
import * as XLSX from 'xlsx';
import { Router } from '@angular/router'; // For routing between pages
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-report',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {
  selectedMonth: number = 1; // Set default to January
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
  transformToWideTable(attendanceData: any[]): any[] {
    const wideTableData: any[] = [];
  
    attendanceData.forEach(employee => {
      const employeeRow: any = {
        employee_name: employee.employee_name,
        employee_code: employee.employee_code
      };
  
      // Add each date's attendance as a column
      Object.keys(employee.daily_attendance).forEach(date => {
        employeeRow[date] = employee.daily_attendance[date] || 'Absent'; // If null, mark as 'Absent'
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
          attendance: attendanceRecord || 'Absent' // If null, mark as 'Absent'
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
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    dates.push(date);
  }

  return dates;
}

  // Download the attendance report in Excel format
 downloadExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.attendanceData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
  XLSX.writeFile(wb, `Attendance_Report_${this.selectedMonth}_${this.selectedYear}.xlsx`);
}

  // Disable the "Fetch Report" button if month or year is not selected
  isFetchButtonDisabled(): boolean {
    return !this.selectedMonth || !this.selectedYear;
  }
}
