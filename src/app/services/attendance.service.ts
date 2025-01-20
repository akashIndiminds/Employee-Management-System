import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private markEntryUrl = 'http://127.0.0.1:8000/MarkEntry'; // Existing endpoint
  private markExitUrl = 'http://127.0.0.1:8000/MarkExit'; // New endpoint for marking exit
  private attendanceStatusKey = 'attendanceMarked'; // Key to store attendance status in localStorage

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Check if we are in the browser (client-side)
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Check if attendance has already been marked
  hasMarkedAttendance(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(this.attendanceStatusKey) === 'true';
    }
    return false;
  }

  markAttendance(employeeCode: string): Observable<any> {
    const params = new HttpParams().set('EmployeeCode', employeeCode);
    return this.http.post(this.markEntryUrl, null, { params });
  }

  handleAttendanceMarked(): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.attendanceStatusKey, 'true');
    }
  }

  resetAttendanceStatus(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.attendanceStatusKey);
    }
  }

  // Mark exit method
  markExit(employeeCode: string, status: number, remarks: string): Observable<any> {
    const params = new HttpParams()
      .set('EmployeeCode', employeeCode)
      .set('Status', status.toString())  // Status will be passed as a number, so convert to string
      .set('Remarks', remarks);

    console.log('Sending request with parameters:', { employeeCode, status, remarks }); // Optional: Debug log

    return this.http.post(this.markExitUrl, null, { params });
  }

}
