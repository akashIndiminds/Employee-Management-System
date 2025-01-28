import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = `${baseUrl}/UpdatePassword`;

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  changePassword(empCode: string, currentPassword: string, newPassword: string): Observable<any> {
    // Encrypt all values
    const encryptedEmpCode = this.encryptionService.encrypt(empCode);
    const encryptedCurrentPassword = this.encryptionService.encrypt(currentPassword);
    const encryptedNewPassword = this.encryptionService.encrypt(newPassword);

    // URL encode the encrypted values
    const encodedEmpCode = encodeURIComponent(encryptedEmpCode);
    const encodedCurrentPassword = encodeURIComponent(encryptedCurrentPassword);
    const encodedNewPassword = encodeURIComponent(encryptedNewPassword);

    // Build the query string with encrypted and encoded values
    const queryString = `?EmployeeCode=${encodedEmpCode}&current_password=${encodedCurrentPassword}&new_password=${encodedNewPassword}`;
    
    // Append the query string to the URL
    const fullUrl = `${this.apiUrl}${queryString}`;

    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send the POST request
    return this.http.post(fullUrl, null, { headers });
  }
}