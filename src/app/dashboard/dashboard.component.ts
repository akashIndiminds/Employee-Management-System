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

  toggleSidebar() {
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