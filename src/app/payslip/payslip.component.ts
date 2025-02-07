import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { PayslipService } from '../services/payslip.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../topbar/topbar.component';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule for ngModel

interface Payslip {
  employeeId: string;
  employeeName: string;
  salaryMonth: string;
  basicPay: number;
  deductions: number;
  netSalary: number;
}

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopBarComponent],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  payslipData: Payslip | null = null;
  errorMessage: string = '';
  isSidebarOpen: boolean = false;

 // Default values if API fails
 defaultPayslip: Payslip = {
    employeeId: 'N/A',
    employeeName: 'John Doe',
    salaryMonth: 'January 2025',
    basicPay: 30000,
    deductions: 2000,
    netSalary: 28000
  };

  constructor(private payslipService: PayslipService) {}

  ngOnInit(): void {
    this.fetchPayslip();
  }

  fetchPayslip(): void {
    this.payslipService.getPayslip().subscribe({
      next: (data) => {
        this.payslipData = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Failed to fetch payslip:', error);
        this.errorMessage = 'Failed to load payslip. Showing default values.';
        this.payslipData = this.defaultPayslip; // Assign default values
      }
    });
}


  toggleSidebar() {
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
