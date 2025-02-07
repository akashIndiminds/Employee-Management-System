import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { LeaveService } from '../services/leave.service';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule for ngModel

interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopBarComponent], // ✅ Add FormsModule here
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent {
  leaveRequest: LeaveRequest = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  isSidebarOpen: boolean = false;

  constructor(private leaveService: LeaveService) {}

  submitLeaveRequest(): void {
    if (!this.leaveRequest.leaveType || !this.leaveRequest.startDate || !this.leaveRequest.endDate || !this.leaveRequest.reason) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    this.leaveService.applyForLeave(this.leaveRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Leave request submitted successfully!';
        this.errorMessage = '';
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = 'Failed to submit leave request. Please try again.';
        console.error('Leave request error:', error);
      }
    });
  }

  resetForm(): void {
    this.leaveRequest = {
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    };
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
