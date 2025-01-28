import { Component, OnInit, HostListener } from '@angular/core';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EmployeeService } from '../services/employee.service'; // Import the EmployeeService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../services/auth.service';
import { PasswordService } from '../services/password.service';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SidebarComponent, TopBarComponent, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],



})
export class SettingsComponent implements OnInit {
  selectedSetting: string = 'profile';
  isSidebarOpen: boolean = false;
  employeeCode: string | null = null;

  isCurrentPasswordValid: boolean = false; // Flag to enable/disable new password fields
  isCurrentPasswordInvalid: boolean = false; // Flag to show error for current password

  showToast: boolean = false;
  toastMessage: string = '';
  toastClass: string = ''; // To conditionally add styles (success/error)
  toastIcon: string = ''; 

  userDetails = {
    empcode: '',
    name: '',
    email: '',
    phone: '',
    joiningDate: '',
    designation: 'Null', // Static designation
  };

  passwordDetails = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  notificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
  };

  securitySettings = {
    twoFactorAuthEnabled: false,
  };

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private passwordService: PasswordService
    
  ) {}

  ngOnInit(): void {
    this.employeeCode = this.authService.getEmployeeCode();
    if (this.employeeCode) {
      this.fetchEmployeeAllDetails(this.employeeCode);
    }
  }


  fetchEmployeeAllDetails(employeeCode: string): void {
    this.employeeService.getEmployeeDetails(employeeCode).subscribe(
      (response) => {
        this.userDetails.empcode = response.employee_code;
        this.userDetails.name = response.employee_full_name;
        this.userDetails.email = response.email;
        this.userDetails.phone = response.phone;
        this.userDetails.joiningDate = response.joining_date;
      },
      (error) => {
        console.error('Error fetching employee details:', error);
        alert('Failed to fetch employee details.');
      }
    );
  }



  updatePassword() {
    // Validate password fields
    if (this.passwordDetails.newPassword !== this.passwordDetails.confirmPassword) {
      this.showToastMessage('New passwords do not match', 'error');
      return;
    }
  
  // Validate password length
  const passwordLength = this.passwordDetails.newPassword.length;
  if (passwordLength < 8 || passwordLength > 16) {
    this.showToastMessage('New password must be between 8 and 16 characters', 'error');
    return;
  }

    // Call password service to change password
    this.passwordService.changePassword(
      this.userDetails.empcode, 
      this.passwordDetails.currentPassword, 
      this.passwordDetails.newPassword
    ).subscribe({
      next: (response) => {
        // Handle successful password change
        this.showToastMessage('Password changed successfully', 'success');
        // Reset password fields
        this.passwordDetails = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        // Handle error
        this.showToastMessage('Failed to change password: ' + error.message, 'error');
      }
    });
  }
  

  showToastMessage(message: string, type: string) {
    this.toastMessage = message;
  
    // Add an emoji for success and error
    if (type === 'success') {
      this.toastClass = 'success';
      this.toastIcon = '✅'; // Success emoji
    } else if (type === 'error') {
      this.toastClass = 'error';
      this.toastIcon = '❌'; // Error emoji
    }
  
    this.showToast = true;
  
    // Add the 'show' class for the animation
    setTimeout(() => {
      this.showToast = false; // Hide after 3 seconds
    }, 3000);
  }
  

  selectSetting(setting: string): void {
    this.selectedSetting = setting;
  }
  

  toggleTwoFactorAuth(): void {
    // Toggle the two-factor authentication setting
    this.securitySettings.twoFactorAuthEnabled = !this.securitySettings.twoFactorAuthEnabled;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Detect clicks outside the sidebar to close it
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
