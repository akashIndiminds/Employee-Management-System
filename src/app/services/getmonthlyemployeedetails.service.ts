// getmonthlyemployeedetails.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

interface AttendanceDetail {
  date: string;
  check_in: string;
  check_out: string;
  hours_worked: number;
  status: string;
  remarks: string;
  arrival_status: string;
}

interface AttendanceResponse {
  attendance_details: AttendanceDetail[];
  summary: {
    total_hours_worked: number;
    month: string;
    year: string;
    employee_code: string;
  };
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MonthlyEmployeeDetailsService {
  private apiUrl = `${baseUrl}/ByEmployeeReport`;

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  getMonthlyEmployeeDetails(
    employeeCode: string,
    month: number,
    year: number
  ): Observable<AttendanceResponse> {
    // Encrypt and encode the employee code
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
    const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);

    // Build the query string
    const queryString = `?EmployeeCode=${encodedEmployeeCode}&Month=${month}&Year=${year}`;
    
    // Append the query string to the URL
    const fullUrl = `${this.apiUrl}${queryString}`;

    // Set headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the GET request
    return this.http.post<AttendanceResponse>(fullUrl, { headers });
  }
}