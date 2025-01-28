import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AesEncryptionService } from '../Utility/RequestInterceptor';
import { baseUrl } from '../app.config';

export interface AttendanceResponse {
  success: boolean;
  data: {
    empcode: string;
    date: string;
    checkintime: string;
    checkouttime: string | null;
    status: number;
    remarks: string;
  };
}

export interface AttendanceViewModel {
  checkInTime: string;
  checkOutTime: string;
  status: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceService {
  private apiUrl = `${baseUrl}/AttendanceDetails`;

  constructor(
    private http: HttpClient,
    private encryptionService: AesEncryptionService
  ) {}

  getAttendanceStatus(employeeCode: string): Observable<AttendanceViewModel> {
    // Encrypt the employee code
    const encryptedEmpCode = this.encryptionService.encrypt(employeeCode);
  
    // URL encode the encrypted employee code
    const encodedEmpCode = encodeURIComponent(encryptedEmpCode);
  
    // Send the POST request with the encrypted Empcode as a query parameter
    return this.http.post<AttendanceResponse>(`${this.apiUrl}?Empcode=${encodedEmpCode}`, {}).pipe(
      map((response: AttendanceResponse) => {
        console.log('Full API Response:', response);
  
        if (!response.success) {
          console.error('API returned success: false');
          throw new Error('API returned unsuccessful response');
        }
      
        if (!response.data) {
          console.error('No data in the response');
          throw new Error('No attendance data found');
        }


        if (response.success && response.data) {
          return {
            checkInTime: this.formatTime(response.data.checkintime),
            checkOutTime: this.formatTime(response.data.checkouttime),
            status: this.getStatusText(response.data.status),
            remarks: response.data.remarks || ''
          };
        } else {
          throw new Error('Invalid response format');
        }
      }),
      catchError(error => {
        console.error('Attendance API Error:', error);
        return of({
          checkInTime: 'Not Marked',
          checkOutTime: 'Not Marked',
          status: 'Pending',
          remarks: ''
        });
      })
    );
  }

  private formatTime(time: string | null): string {
    if (!time) return 'Not Marked';
    try {
      const timeOnly = time.split('.')[0]; // Remove milliseconds
      return new Date(`1970-01-01T${timeOnly}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Not Marked';
    }
  }

  private getStatusText(statusCode: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Present',
      2: 'Absent',
      3: 'Half-day',
      4: 'Leave'
    };
    return statusMap[statusCode] || 'Pending';
  }
}