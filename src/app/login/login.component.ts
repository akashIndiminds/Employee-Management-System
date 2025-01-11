// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService // Inject AuthService here
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Submitting Form Data:', formData);

      this.loginService.validateLogin(formData).subscribe({
        next: (response) => {
          console.log('Login Response:', response);
          if (response.Authorization) {
            // Store employee code in AuthService
            this.authService.setEmployeeCode(response.EmployeeCode);

            // Optionally log here as well
            console.log('Employee Code set in AuthService:', response.EmployeeCode);

            // Navigate to dashboard after a delay
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
