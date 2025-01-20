import { Component, OnInit,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../services/service.registeremployee';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, TopBarComponent], // Add CommonModule here
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.css']
})
export class RegisterUserComponent implements OnInit {
  employeeForm: FormGroup; // Declare FormGroup
  message: string = ''; // Initialize with an empty string
  isSidebarOpen: boolean = false;

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
      
      this.service.registerEmployee(formData).subscribe(
        (response: any) => { // Explicitly define response type as 'any'
          this.message = response.message;
          this.employeeForm.reset(); // Reset the form on success
        },
        (error: HttpErrorResponse) => { // Explicitly define error type as 'HttpErrorResponse'
          this.message = `Error: ${error.status} - ${error.message}`;
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
