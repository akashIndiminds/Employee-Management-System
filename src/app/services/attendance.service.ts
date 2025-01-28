import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { BehaviorSubject } from 'rxjs';
import { baseUrl } from '../app.config';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  
  private markEntryUrl = `${baseUrl}/MarkEntry`; // Constructed using baseUrl
  private markExitUrl = `${baseUrl}/MarkExit`; // Constructed using baseUrl
  private attendanceStatusKey = 'attendanceMarked'; // Key to store attendance status in localStorage

  private attendanceStatusSubject = new BehaviorSubject<boolean>(false);
  public attendanceStatus$ = this.attendanceStatusSubject.asObservable();


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private encryptionService: AesEncryptionService) {

 if (this.isBrowser()) {
      const status = localStorage.getItem(this.attendanceStatusKey) === 'true';
      this.attendanceStatusSubject.next(status);
    }

  }

  // Check if we are in the browser (client-side)
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Check if attendance has already been marked
  hasMarkedAttendance(): boolean {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(this.attendanceStatusKey) === 'true';
      } else {
        console.warn('localStorage is not available. Returning default value.');
        return false; // Default fallback value
      }
    } catch (error) {
      console.error('LocalStorage access failed:', error);
      return false; // Handle gracefully if access fails
    }
  }
  

  markAttendance(employeeCode: string): Observable<any> {
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
    console.log('Encrypted Employee Code:', encryptedEmployeeCode);

    // Create URL-safe encoded version of the encrypted value
    const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);

    // Build the query string manually to preserve encryption
    const queryString = `?EmployeeCode=${encodedEmployeeCode}`;
    
    // Construct the full URL
    const fullUrl = `${this.markEntryUrl}${queryString}`;

    // Use HttpHeaders to set content type if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Send the POST request with the full URL
    return this.http.post(fullUrl, null, { headers });
  }

  handleAttendanceMarked(): void {
    localStorage.setItem(this.attendanceStatusKey, 'true');
  }

  resetAttendanceStatus(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.attendanceStatusKey);
    }
  }

  // Mark exit method
  markExit(employeeCode: string, status: number, remarks: string): Observable<any> {
    console.log('Marking exit for:', employeeCode);

    // Encrypt the employee code
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
    console.log('Encrypted Employee Code:', encryptedEmployeeCode);

    // Create URL-safe encoded version of the encrypted value
    const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);

    // Build the query string manually with all parameters
    const queryString = `?EmployeeCode=${encodedEmployeeCode}&Status=${status}&Remarks=${encodeURIComponent(remarks)}`;
    
    // Construct the full URL
    const fullUrl = `${this.markExitUrl}${queryString}`;

    // Use HttpHeaders to set content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(fullUrl, null, { headers });
  }

}
