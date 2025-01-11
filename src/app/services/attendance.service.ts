import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = 'http://127.0.0.1:8000/MarkEntry';

  constructor(private http: HttpClient) {}

  markAttendance(employeeCode: string): Observable<any> {
    const params = new HttpParams().set('EmployeeCode', employeeCode); // Pass EmployeeCode as query parameter
    console.log('Sending request with EmployeeCode:', employeeCode); // Optional: Debug log
    
    // Make a POST request instead of GET
    return this.http.post(this.apiUrl, null, { params });
  }
}
