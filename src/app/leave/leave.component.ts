import { Component, OnInit, HostListener } from '@angular/core';
import { LeaveService } from '../services/leave.service';
import { EmailService } from '../services/email.service';  // New Email Service
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopBarComponent],
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
  isSubmitting: boolean = false;

  constructor(private leaveService: LeaveService, private emailService: EmailService) {}

  submitLeaveRequest(): void {
    if (!this.leaveRequest.leaveType || !this.leaveRequest.startDate || !this.leaveRequest.endDate || !this.leaveRequest.reason) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    this.isSubmitting = true;

    this.leaveService.applyForLeave(this.leaveRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Leave request submitted successfully!';
        this.errorMessage = '';
        this.sendEmail();
      },
      error: (error) => {
        this.errorMessage = 'Failed to submit leave request. Please try again.';
        console.error('Leave request error:', error);
      },
      complete: () => {
        this.isSubmitting = false;
        this.resetForm();
      }
    });
  }

  sendEmail(): void {
    const emailData = {
      to: 'hr@indiminds.in',
      subject: `Leave Request: ${this.leaveRequest.leaveType}`,
      body: `
        <h3>New Leave Request</h3>
        <p><strong>Leave Type:</strong> ${this.leaveRequest.leaveType}</p>
        <p><strong>Start Date:</strong> ${this.leaveRequest.startDate}</p>
        <p><strong>End Date:</strong> ${this.leaveRequest.endDate}</p>
        <p><strong>Reason:</strong> ${this.leaveRequest.reason}</p>
        <p>-- Employee Leave Management System</p>
      `
    };

    this.emailService.sendEmail(emailData).subscribe({
      next: () => console.log('Email sent successfully.'),
      error: (err) => console.error('Email sending failed:', err)
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
    if (this.isSidebarOpen && !target.closest('.sidebar') && !target.closest('.hamburger')) {
      this.isSidebarOpen = false;
    }
  }
}
