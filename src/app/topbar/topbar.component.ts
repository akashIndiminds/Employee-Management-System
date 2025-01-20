import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopBarComponent implements OnInit {
  welcomeMessage: string = ''; // Holds the welcome message

  @Output() toggleSidebar = new EventEmitter<void>(); // Event emitter to toggle the sidebar

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    const employeeCode = this.authService.getEmployeeCode(); // Get employee code from AuthService

    if (employeeCode) {
      this.employeeService.getEmployeeDetails(employeeCode).subscribe(
        (response) => {
          this.welcomeMessage = response.message; // Extract the welcome message
        },
        (error) => {
          console.error('Error fetching employee details:', error);
          this.welcomeMessage = 'Welcome, Guest!'; // Fallback message
        }
      );
    } else {
      console.warn('No employee code found.');
      this.welcomeMessage = 'Welcome, Guest!'; // Fallback for missing employee code
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit(); // Emit the event to toggle the sidebar
  }
}
