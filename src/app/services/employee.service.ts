import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${baseUrl}/EmployeeDetails`; // Replace with your backend API URL

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  getEmployeeDetails(employeeCode: string): Observable<any> {
    //console.log('Fetching Employee Details for:', employeeCode);

    // Encrypt the employee code
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
   // console.log('Encrypted Employee Code:', encryptedEmployeeCode);

    // Create URL-safe encoded version of the encrypted value
    const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);

    // Build the query string manually to preserve encryption
    const queryString = `?EmployeeCode=${encodedEmployeeCode}`;
    
    // Construct the full URL
    const fullUrl = `${this.apiUrl}${queryString}`;

    // Use HttpHeaders to set content type if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Send the POST request with the full URL
    return this.http.post(fullUrl, null, { headers });
  }
}

