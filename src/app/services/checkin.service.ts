import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class CheckInService {
  private apiUrl = `${baseUrl}/CheckInStatus`; // Replace with your backend API URL
  private checkInStatusKey = 'checkInStatus'; // Key for storing check-in status
  private durationKey = 'duration'; // Key for storing duration

  public checkInStatus: string = ''; // Public property to store check-in status
  public duration: string = ''; // Public property to store duration

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Store the check-in status and duration in localStorage
  storeCheckInStatus(status: string, duration: string): void {
    if (this.isLocalStorageAvailable()) {
      const encryptedStatus = this.encryptionService.encrypt(status); // Encrypt the status
      const encryptedDuration = this.encryptionService.encrypt(duration); // Encrypt the duration

      localStorage.setItem(this.checkInStatusKey, encryptedStatus); // Store encrypted status
      localStorage.setItem(this.durationKey, encryptedDuration); // Store encrypted duration
    } else {
      console.warn('localStorage is not available. Check-in status and duration will not persist.');
    }
  }

  // Retrieve the check-in status from localStorage
  getCheckInStatus(): string {
    if (this.isLocalStorageAvailable()) {
      const encryptedStatus = localStorage.getItem(this.checkInStatusKey);
      if (encryptedStatus) {
        return this.encryptionService.decrypt(encryptedStatus); // Decrypt and return the status
      }
      return ''; // Return empty string if not found
    } else {
      console.warn('localStorage is not available. Returning empty string for check-in status.');
      return '';
    }
  }

  // Retrieve the duration from localStorage
  getDuration(): string {
    if (this.isLocalStorageAvailable()) {
      const encryptedDuration = localStorage.getItem(this.durationKey);
      if (encryptedDuration) {
        return this.encryptionService.decrypt(encryptedDuration); // Decrypt and return the duration
      }
      return ''; // Return empty string if not found
    } else {
      console.warn('localStorage is not available. Returning empty string for duration.');
      return '';
    }
  }

  // Reset the check-in status and duration
  resetAttendanceStatus(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.checkInStatusKey); // Remove encrypted status
      localStorage.removeItem(this.durationKey); // Remove encrypted duration
    } else {
      console.warn('localStorage is not available. Could not reset attendance status.');
    }
  }

  // Check attendance status for a given employee code
  checkAttendanceStatus(employeeCode: string): Observable<any> {
    console.log('Checking attendance for Employee Code:', employeeCode);

    // Encrypt the employee code
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
    console.log('Encrypted Employee Code in Check in:', encryptedEmployeeCode);

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
