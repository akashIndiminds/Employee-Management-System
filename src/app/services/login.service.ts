import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000/login';

  constructor(
    private http: HttpClient, 
    private encryptionService: AesEncryptionService
  ) {}

  validateLogin(data: { email: string; password: string }): Observable<any> {
    const encryptedEmail = this.encryptionService.encrypt(data.email);
    const encryptedPassword = this.encryptionService.encrypt(data.password);

    console.log('Encrypted Email:', encryptedEmail);
    console.log('Encrypted Password:', encryptedPassword);

    // Create URL-safe encoded versions of the encrypted values
    const encodedEmail = encodeURIComponent(encryptedEmail);
    const encodedPassword = encodeURIComponent(encryptedPassword);

    // Build the query string manually to preserve the encryption
    const queryString = `?Email=${encodedEmail}&Password=${encodedPassword}`;
    
    // Append the query string to the URL
    const fullUrl = `${this.apiUrl}${queryString}`;

    // Use HttpHeaders to set content type if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send the POST request with the full URL
    return this.http.post(fullUrl, null, { headers });
  }
}