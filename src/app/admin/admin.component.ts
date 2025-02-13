import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient
import { FormsModule } from '@angular/forms';
import { baseUrl } from '../app.config';


interface EmployeeCode {
  Text: string;
  Value: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopBarComponent, FormsModule],
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isSidebarOpen: boolean = false;
  employeeCodes: EmployeeCode[] = [];
  selectedEmployeeCode: string = '';
  announcementText: string = '';
  announcementMessage: string = '';
  isSuccess: boolean = false;
  private apiUrl = `${baseUrl}/announcements/create`;
  isMobileView: boolean = false;
  constructor(private router: Router, private http: HttpClient) {} // Inject HttpClient
  
  ngOnInit() {
    this.fetchEmployeeCodes();
    this.isMobileView = window.innerWidth <= 768;
  }

  navigateToUsers() {
    this.router.navigate(['/registeruser']);
  }

  navigateToSetAttendance() {
    this.router.navigate(['/setattendance']);
  }

  navigateToReports() {
    this.router.navigate(['/report']);
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


  fetchEmployeeCodes(): void {
    const url = `${baseUrl}/EmployeeCodes`;
    this.http.get<EmployeeCode[]>(url).subscribe(
      (data: EmployeeCode[]) => {
        this.employeeCodes = data.sort((a, b) => {
          const nameA = a.Text.split(" - ")[0].trim().toUpperCase();
          const nameB = b.Text.split(" - ")[0].trim().toUpperCase();
          return nameA.localeCompare(nameB);
        });
      },
      (error: any) => {
        console.error("Error fetching employee codes:", error);
        this.showError("Error loading employee list");
      }
    );
  }

  submitAnnouncement() {
    if (!this.announcementText.trim()) {
      this.showError("Announcement cannot be empty!");
      return;
    }

    const requestBody = {
      text: this.announcementText,
      employee_code: this.selectedEmployeeCode || null // Send null for global announcements
    };

    this.http.post(this.apiUrl, requestBody).subscribe(
      (response: any) => {
        this.showSuccess("Announcement successfully posted!");
        this.announcementText = '';
        this.selectedEmployeeCode = '';
      },
      (error: HttpErrorResponse) => {
        this.showError("Error posting announcement. Please try again!");
        console.error("Error:", error.message);
      }
    );
  }

  private showSuccess(message: string) {
    this.announcementMessage = message;
    this.isSuccess = true;
    this.clearMessage();
  }

  private showError(message: string) {
    this.announcementMessage = message;
    this.isSuccess = false;
    this.clearMessage();
  }

  private clearMessage() {
    setTimeout(() => {
      this.announcementMessage = '';
    }, 3000);
  }
}
