import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../services/service.registeremployee';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component'; // Adjust the path accordingly

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, TopBarComponent, CustomDialogComponent], // Add CommonModule here
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.css']
})
export class RegisterUserComponent implements OnInit {
  employeeForm: FormGroup; // Declare FormGroup
  message: string = ''; // Initialize with an empty string
  isSidebarOpen: boolean = false;
  showDialog: boolean = false;  // To control dialog visibility
  dialogMessage: string = '';   // Message for the dialog
  dialogTimeout: number = 5000; // Timeout for dialog (5 seconds)
  dialogTitle: string = '';    // Title for the dialog

  constructor(private fb: FormBuilder, private service: Service) {
    // Initialize employeeForm in the constructor
      this.employeeForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      EmailID: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', Validators.required],
      JoiningDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // No need to initialize form again here since it's done in the constructor
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      const joiningDate = new Date(formData.JoiningDate);
      formData.JoiningDate = joiningDate.toISOString().split('T')[0];

      this.service.registerEmployee(formData).subscribe(
        (response: any) => {
          this.dialogMessage = response.message;
          this.dialogTitle = 'Success';
          this.showDialog = true;
        },
        (error: HttpErrorResponse) => {
          this.dialogMessage = `Error: ${error.status} - ${error.message}`;
          this.dialogTitle = 'Error';
          this.showDialog = true;
        }
      );
    }
  }

  toggleSidebar(): void {
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
