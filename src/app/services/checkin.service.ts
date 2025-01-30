import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class CheckInService {
  private apiUrl = `${baseUrl}/CheckInStatus`;
  private checkInStatusKey = 'checkInStatus';
  private durationKey = 'duration';
  private lastCheckInDateKey = 'lastCheckInDate';

  public checkInStatus: string = '';
  public duration: string = '';

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Helper to get local date in YYYY-MM-DD format
  private getLocalDateString(): string {
    const date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  private resetCheckinDataIfNeeded(): void {
    if (this.isLocalStorageAvailable()) {
      const storedDate = localStorage.getItem(this.lastCheckInDateKey);
      const currentDate = this.getLocalDateString(); // Use local date

      if (storedDate !== currentDate) {
       // console.log('Date changed. Resetting check-in data.');
        this.resetAttendanceStatus();
      }
    }
  }

  storeCheckInStatus(status: string, duration: string): void {
    if (this.isLocalStorageAvailable()) {
      const encryptedStatus = this.encryptionService.encrypt(status);
      const encryptedDuration = this.encryptionService.encrypt(duration);
      const currentDate = this.getLocalDateString(); // Use local date

      localStorage.setItem(this.checkInStatusKey, encryptedStatus);
      localStorage.setItem(this.durationKey, encryptedDuration);
      localStorage.setItem(this.lastCheckInDateKey, currentDate);
    }
  }

  // Rest of the methods remain unchanged
  getCheckInStatus(): string {
    this.resetCheckinDataIfNeeded();
    if (this.isLocalStorageAvailable()) {
      const encryptedStatus = localStorage.getItem(this.checkInStatusKey);
      return encryptedStatus ? this.encryptionService.decrypt(encryptedStatus) : '';
    }
    return '';
  }

  getDuration(): string {
    this.resetCheckinDataIfNeeded();
    if (this.isLocalStorageAvailable()) {
      const encryptedDuration = localStorage.getItem(this.durationKey);
      return encryptedDuration ? this.encryptionService.decrypt(encryptedDuration) : '';
    }
    return '';
  }

  resetAttendanceStatus(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.checkInStatusKey);
      localStorage.removeItem(this.durationKey);
      localStorage.removeItem(this.lastCheckInDateKey);
    }
  }

  checkAttendanceStatus(employeeCode: string): Observable<any> {
    const encryptedEmployeeCode = this.encryptionService.encrypt(employeeCode);
    const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
    const fullUrl = `${this.apiUrl}?EmployeeCode=${encodedEmployeeCode}`;
    return this.http.post(fullUrl, null, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}