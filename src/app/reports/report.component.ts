import { Component, OnInit,HostListener } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule, SidebarComponent, TopBarComponent  // Add CommonModule to the imports array
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reports: any[] = [
    { id: 1, title: 'Employee Attendance', date: '2025-01-15', status: 'Completed' },
    { id: 2, title: 'Monthly Task Report', date: '2025-01-10', status: 'In Progress' },
    { id: 3, title: 'Performance Overview', date: '2025-01-05', status: 'Completed' },
  ];
  isSidebarOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // You could fetch reports from an API here
  }
  toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
      }
    
      // Detect clicks outside the sidebar to close it
     // HostListener to detect clicks outside the sidebar and close it
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
