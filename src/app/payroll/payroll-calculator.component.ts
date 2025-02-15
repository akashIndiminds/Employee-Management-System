import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../topbar/topbar.component';

interface Payslip {
  employeeId: string;
  employeeName: string;
  salaryMonth: string;
  basicPay: number;
  deductions: number;
  overtimePay: number;
  netSalary: number;
}

@Component({
  selector: 'app-payroll-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopBarComponent],
  templateUrl: './payroll-calculator.component.html',
  styleUrls: ['./payroll-calculator.component.css']
})
export class PayrollCalculatorComponent implements OnInit {
  // Employee and payroll input fields
  employeeId: string = '';
  employeeName: string = '';
  salaryMonth: string = '';
  totalDaysWorked: number = 0;
  totalAbsent: number = 0;
  totalOvertime: number = 0;

  // Holds the calculated payslip data once the form is submitted
  payslipData: Payslip | null = null;
  errorMessage: string = '';

  // Sidebar properties
  isSidebarOpen: boolean = false;
  isMobileView: boolean = false;

  // Constants for payroll calculation
  dailyRate: number = 1000;   // Daily wage rate in ₹
  overtimeRate: number = 100; // Overtime hourly rate in ₹

  constructor() {}

  ngOnInit(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  calculatePayroll(): void {
    // Validate required fields
    if (!this.employeeId || !this.employeeName || !this.salaryMonth) {
      this.errorMessage = 'Please fill in all employee details.';
      return;
    }
    if (this.totalDaysWorked < 0 || this.totalAbsent < 0 || this.totalOvertime < 0) {
      this.errorMessage = 'Input values cannot be negative.';
      return;
    }

    // Calculate payroll components
    const basicPay = this.totalDaysWorked * this.dailyRate;
    const deductions = this.totalAbsent * this.dailyRate;
    const overtimePay = this.totalOvertime * this.overtimeRate;
    const netSalary = basicPay - deductions + overtimePay;

    // Prepare the payslip data
    this.payslipData = {
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      salaryMonth: this.salaryMonth,
      basicPay,
      deductions,
      overtimePay,
      netSalary
    };

    this.errorMessage = '';
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
