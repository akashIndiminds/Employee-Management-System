import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  reports = [
    { id: 1, title: 'Daily Attendance', date: '2025-01-15', status: 'completed' },
    { id: 2, title: 'Monthly Attendance Report', date: '2025-01-10', status: 'in-progress' },
    { id: 3, title: 'Performance Overview', date: '2025-01-05', status: 'completed' },
  ];

  isSidebarOpen = false;

  constructor(private router: Router) {}

  viewReport(report: any): void {
    if (report.title === 'Daily Attendance') {
      this.router.navigate(['/daily-attendance']);
    }
    if (report.title === 'Monthly Attendance Report') {
      this.router.navigate(['/monthlyreports']);
    }
    if (report.title === 'Performance Overview') {
      this.router.navigate(['/performance-overview']);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}