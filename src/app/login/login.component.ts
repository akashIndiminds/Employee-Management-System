import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import AuthService
import { AesEncryptionService } from '../Utility/RequestInterceptor';
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
    private authService: AuthService, // Inject AuthService here
    private encryptionService: AesEncryptionService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }




 onSubmit() {
  if (this.loginForm.valid) {
    const formData = this.loginForm.value;
    //console.log('Submitting Form Data:', formData);

    this.loginService.validateLogin(formData).subscribe({
      next: (response) => {
       // console.log('Login Response:', response);
        if (response.Authorization) {
          try {
            // Decrypt the employee code
            const decryptedEmployeeCode = this.encryptionService.decrypt(response.EmployeeCode);
            // console.log('Encrypted Employee Code:', response.EmployeeCode);
            // console.log('Decrypted Employee Code:', decryptedEmployeeCode);

            // Store the decrypted employee code in AuthService
            this.authService.setEmployeeCode(decryptedEmployeeCode);

            // Navigate to the dashboard without query parameters
            this.router.navigate(['/dashboard']);
            
          } catch (error) {
            alert('Error processing login response');
          }
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
