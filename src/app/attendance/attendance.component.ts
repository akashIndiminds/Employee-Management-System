import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CheckInService } from '../services/checkin.service';
import {EmployeeAttendanceService} from '../services/getemployeedetailstatus.service';



@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TopBarComponent,
    ToastModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [MessageService],
  styles: [`
    :host ::ng-deep .custom-toast .p-toast-message {
        background: linear-gradient(135deg, rgb(52, 97, 22) 30%, rgb(0, 204, 255) 100%);
        color: rgb(255, 255, 255);
        border: none;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        font-weight: bold;
        animation: fadeIn 0.5s ease-in-out;
        margin-top: 40px;
        font-size: 1rem; /* Default font size for text */
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :host ::ng-deep .custom-toast .p-toast-message .p-toast-title {
        font-size: 1.2em;
        margin-bottom: 5px;
    }

    :host ::ng-deep .custom-toast .p-toast-message .p-toast-detail {
        font-size: 0.9em;
    }

    /* Responsive styles for smaller screens */
    @media (max-width: 768px) {
        :host ::ng-deep .custom-toast .p-toast-message {
            border-radius: 8px; /* Slightly smaller radius for mobile */
            padding: 8px; /* Adjust padding for compact layout */
            font-size: 0.9rem; /* Reduce font size for better readability */
            margin-top: 20px; /* Adjust margin for smaller screens */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Lighter shadow for mobile */
        }

        :host ::ng-deep .custom-toast .p-toast-message .p-toast-title {
            font-size: 1em; /* Slightly smaller title font size */
        }

        :host ::ng-deep .custom-toast .p-toast-message .p-toast-detail {
            font-size: 0.8em; /* Smaller detail font size for compact view */
        }
    }

    @media (max-width: 480px) {
        :host ::ng-deep .custom-toast .p-toast-message {
            padding: 6px; /* Compact padding for very small devices */
            font-size: 0.8rem; /* Reduce font size further for small screens */
            margin-top: 30px;
        }

        :host ::ng-deep .custom-toast .p-toast-message .p-toast-title {
            font-size: 0.9em; /* Adjust title size for extra-small screens */
        }

        :host ::ng-deep .custom-toast .p-toast-message .p-toast-detail {
            font-size: 0.7em; /* Further reduce detail font size */
        }
    }
`]



})
export class AttendanceComponent implements OnInit {
  isMarkEntryVisible: boolean = true;
  employeeDetails: { employee_code: string; employee_full_name: string } | null = null;
  isSidebarOpen: boolean = false;
  employeeCode: string = '';
  attendanceMarked: boolean = false;
  remarks: string = '';
  totalWorkingHours: string = '0 hrs 0 mins';
  selectedStatus: number = 1;
  private lastToastMessage: string | null = null;
  isMobileView: boolean = false;
  statusOptions = [
    { id: 1, status: 'Present' },
    { id: 2, status: 'Absent' },
    { id: 3, status: 'Half-day' },
    { id: 4, status: 'Leave' },
    {id: 5, status:  'WFH'}
  ];

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private messageService: MessageService,
    private checkInService: CheckInService,
    private EmployeeAttendanceService: EmployeeAttendanceService
  ) { this.employeeCode = this.authService.getEmployeeCode();
    if (!this.employeeCode) {
     // console.warn('Employee code not found in localStorage. Please re-login.');
    }
  }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth <= 768;
    this.employeeCode = this.authService.getEmployeeCode(); // Fetch employee code from AuthService
  
    if (this.employeeCode) {
      this.initializeComponent();
      if (!this.attendanceMarked) {
        this.fetchLastAttendanceDetails(); // Fetch details only after initializing employeeCode
      }
    } else {
    //  console.error('Employee code not found. Please log in again.');
    }
    this.fetchLastAttendanceDetails();
  }
  

  private fetchLastAttendanceDetails(): void {
    if (!this.employeeCode) {
      //console.error('Employee code is missing.');
      return;
    }
  
    this.checkInService.checkAttendanceStatus(this.employeeCode).subscribe({
      next: (response) => {
        this.isMarkEntryVisible = response.CheckInStatus !== 'true';
        this.totalWorkingHours = response.Duration || '0 hrs';
  
        // Fetch last attendance details
        this.EmployeeAttendanceService.getAttendanceStatus(this.employeeCode).subscribe({
          next: (attendanceDetails) => {
            this.selectedStatus = this.statusOptions.find(
              (option) => option.status === attendanceDetails.status
            )?.id || 1;
            this.remarks = attendanceDetails.remarks;
         //   console.log('Last Attendance:', attendanceDetails);
          },
          error: (error) => {
         //   console.error('Error fetching last attendance details:', error);
          },
        });
      },
      error: (error) => {
      //  console.error('Error checking attendance status:', error);
      },
    });
  }
  

  private initializeComponent(): void {
    this.employeeCode = this.authService.getEmployeeCode();
    if (!this.employeeCode) {
      this.showMessage('warn', 'Warning', 'Employee code not found. Please log in again.');
      return;
    }
  
    // Force check attendance status with date consideration
    this.attendanceMarked = this.attendanceService.hasMarkedAttendance();
    this.isMarkEntryVisible = !this.attendanceMarked;
    this.setStatusOptions();
    this.updateCheckInStatus();
  }

  private updateCheckInStatus(): void {
    this.checkInService.checkAttendanceStatus(this.employeeCode).subscribe({
      next: (response) => {
        this.isMarkEntryVisible = response.CheckInStatus !== 'true';
        this.totalWorkingHours = response.Duration || '0 Hours 0 Minutes'; // Use the backend-provided format
  
        if (response.CheckInStatus === 'true') {
          this.showMessage(
            'info',
            'Attendance Info',
            `Attendance already marked. Working Hours: ${response.Duration}`
          );
        }
      },
      error: (error) => {
       // console.error('Error checking attendance status:', error);
        this.showMessage('error', 'Error', 'Failed to fetch attendance status.');
      }
    });
  }
  

  private setStatusOptions(): void {
    if (this.employeeCode !== 'ITL-KOL-1001') {
      this.statusOptions = [
        { id: 1, status: 'Present' },     
        { id: 3, status: 'Half-day' }
      ];
    } 
    this.selectedStatus = 1;
  }


  markExit(): void {
    if (this.employeeCode) {
      const status = this.selectedStatus;
      const remarks = this.remarks;

      this.attendanceService.markExit(this.employeeCode, status, remarks).subscribe({
        next: (response) => {
          this.showMessage('success', 'Success! You have successfully marked the exit.', response?.message);
        },
        error: (error) => {
          this.showMessage('error', 'Error', 'Failed to mark exit. Please try again.');
        }
      });
    } else {
      this.showMessage('warn', 'Warning', 'Employee code not found. Please log in again.');
    }
  }

  markAttendance(): void {
    if (this.employeeCode) {
      // Check if attendance has already been marked
      if (this.attendanceMarked) {
        this.showMessage('warn', 'Warning', 'Entry already Marked. Please contact admin for update!!!');
        return;
      }
  
      // Proceed to mark attendance
      this.attendanceService.markAttendance(this.employeeCode).subscribe({
        next: (response) => {
          if (response.message === 'Entry already Marked. Please contact admin for update!!!') {
            this.handleAlreadyMarked(response.message);
          } else if (response.message === 'Entry Marked Successfully!') {
            this.handleSuccess(response.message);
          }
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showMessage('warn', 'Warning', 'Employee code not found. Please log in again.');
    }
  }
  
  private handleAlreadyMarked(message: string): void {
    this.attendanceMarked = true;
    this.isMarkEntryVisible = false;  // Disable the mark attendance button
    this.attendanceService.handleAttendanceMarked();
    this.showMessage('warn', 'Warning', message);
    this.updateCheckInStatus();
  }
  
  private handleSuccess(message: string): void {
    this.attendanceMarked = true;
    this.isMarkEntryVisible = false;  // Disable the mark attendance button
    this.attendanceService.handleAttendanceMarked();
    this.showMessage('success', 'Success', message);
    this.updateCheckInStatus();
  }
  
  

  private handleError(error: any): void {
   // console.error('Error marking attendance:', error);
    this.showMessage('error', 'Error', 'Failed to mark attendance. Please try again.');
  }

 private showMessage(severity: string, summary: string, detail: string): void {
  const currentMessage = `${severity}-${summary}-${detail}`;
  if (this.lastToastMessage === currentMessage) {
    return; // Prevent duplicate messages
  }
  this.lastToastMessage = currentMessage;
  this.messageService.add({ severity, summary, detail, life: 2000 });

  // Clear the last message after a delay
  setTimeout(() => (this.lastToastMessage = null), 2000);
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
