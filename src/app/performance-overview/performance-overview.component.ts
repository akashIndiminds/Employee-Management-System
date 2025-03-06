import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../topbar/topbar.component';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-performance-overview',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    SidebarComponent,
    TopBarComponent
  ],
  templateUrl: './performance-overview.component.html',
  styleUrls: ['./performance-overview.component.css']
})
export class PerformanceOverviewComponent {
  title = 'Attendance Performance';
  date = new Date().toLocaleDateString();
  status = 'Good';
  statusClass = 'present';
  isSidebarOpen: boolean = false;
  
  totalPresent = 22;
  totalAbsent = 3;
  totalHalfDays = 5;
  totalLeave = 2;
  totalWorkFromHome = 4;

  @Output() viewReportClicked = new EventEmitter<void>();

  // Bar Chart Configuration
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Bar Chart Configuration (Updated for WFH color)
barChartData: ChartConfiguration['data'] = {
  labels: ['John', 'Emma', 'Michael', 'Sophia', 'David'],
  datasets: [
    {
      label: 'Present Days',
      data: [22, 18, 25, 20, 23],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    },
    {
      label: 'Absent Days',
      data: [2, 5, 0, 3, 1],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    },
    {
      label: 'Leave Days',
      data: [1, 2, 0, 1, 3],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    },
    {
      label: 'Work From Home',
      data: [2, 1, 3, 2, 1],
      backgroundColor: 'rgba(142, 68, 173, 0.6)' // Purple for WFH
    }
  ]
};


 
// Pie Chart Configuration (Updated for WFH color)
pieChartData: ChartConfiguration['data'] = {
  labels: ['Present', 'Absent', 'Half-Day', 'Leave', 'Work From Home'],
  datasets: [
    {
      data: [this.totalPresent, this.totalAbsent, this.totalHalfDays, this.totalLeave, this.totalWorkFromHome],
      backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#007bff', '#8e44ad'] // Purple for WFH
    }
  ]
};

// Line Chart Configuration (Updated for WFH color)
lineChartData: ChartConfiguration['data'] = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  datasets: [
    {
      label: 'Present',
      data: [5, 4, 6, 5, 5],
      borderColor: '#28a745',
      fill: false,
      tension: 0.1
    },
    {
      label: 'Absent',
      data: [1, 0, 0, 1, 0],
      borderColor: '#dc3545',
      fill: false,
      tension: 0.1
    },
    {
      label: 'Leave',
      data: [0, 1, 0, 0, 1],
      borderColor: '#007bff',
      fill: false,
      tension: 0.1
    },
    {
      label: 'Work From Home',
      data: [1, 0, 1, 1, 0],
      borderColor: '#8e44ad', // Purple for WFH
      fill: false,
      tension: 0.1
    }
  ]
};

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Employee Leaderboard Data
  topEmployees = [
    { name: 'John', presentDays: 25 },
    { name: 'Sophia', presentDays: 24 },
    { name: 'David', presentDays: 23 }
  ];

  onViewReportClick() {
    console.log('View Report clicked!');
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
