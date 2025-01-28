import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MonthlyALLEmployeeService {
  private apiUrl = `${baseUrl}/AllEmployeeReport`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches the monthly attendance report for all employees using query parameters.
   * @param month The month number (1-12).
   * @param year The year (e.g., 2025).
   */
  getMonthlyAttendanceReport(month: number, year: number): Observable<any> {
    // Set up query parameters for month and year
    const params = new HttpParams()
      .set('Month', month.toString())
      .set('Year', year.toString());

    // Log the request params for debugging
    console.log("Request Params:", params);

    // Send POST request with query parameters
    return this.http.post<any>(this.apiUrl, null, { params });
  }
}