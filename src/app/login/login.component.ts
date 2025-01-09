import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { LoginService } from '../services/login.service'; // Import LoginService
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,  // Standalone component flag
  imports: [ReactiveFormsModule]  // Import ReactiveFormsModule here
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Submitting Form Data:', formData); // Log form data


      this.loginService.validateLogin(formData).subscribe({
        next: (response) => {
          console.log('Login Response:', response); // Log login response
          if (response.Authorization) {
            setTimeout(() => {
              this.router.navigate(['/dashboard'], {
                queryParams: {
                  id: response.EmployeeCode,
                  name: response.EmployeeName,
                },
              });
            }, 2000);
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          alert('Server Error: Unable to process your request.');
          console.error(err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}  