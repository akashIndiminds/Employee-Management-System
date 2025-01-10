import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employeeId: string | null = null;
  employeeDetails: { employee_code: string; employee_full_name: string } | null = null;
  isSidebarOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.queryParamMap.get('id');
    if (this.employeeId) {
      this.fetchEmployeeDetails(this.employeeId);
    }
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

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

 @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    // Check if the click is on the hamburger button or inside the sidebar
    const target = event.target as HTMLElement;
    const isSidebarClick = target.closest('.p-sidebar') !== null;
    const isHamburgerClick = target.closest('.hamburger') !== null;
    
    if (this.isSidebarOpen && !isSidebarClick && !isHamburgerClick) {
      this.isSidebarOpen = false;
    }
  }
}