import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private apiUrl = 'http://127.0.0.1:8000/RegisterEmployee';  // Your backend API URL

  constructor(private http: HttpClient) { }

  registerEmployee(employeeData: any): Observable<any> {
    const { FirstName, MiddleName, LastName, EmailID, PhoneNumber, JoiningDate } = employeeData;

    // Construct the query string
    const queryParams = `?FirstName=${FirstName}&MiddleName=${MiddleName}&LastName=${LastName}&EmailID=${EmailID}&PhoneNumber=${PhoneNumber}&JoiningDate=${JoiningDate}`;

    // Make the GET request with the query params
    return this.http.post<any>(`${this.apiUrl}${queryParams}`, {});
  }
}
