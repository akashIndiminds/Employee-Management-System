import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://127.0.0.1:8000/EmployeeDetails'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getEmployeeDetails(employeeCode: string): Observable<any> {
    console.log('Fetching Employee Details for:', employeeCode);

    // Using HttpParams to pass employeeCode as query parameters
    const params = new HttpParams().set('EmployeeCode', employeeCode);

    // Sending `null` as the body, and passing the params in the options
    return this.http.post(this.apiUrl, null, { params });
  }
 
}



