import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.config';

@Injectable({
  providedIn: 'root', // Ensures the service is available globally
})
export class Service {
//http://192.168.1.40:8010
  private apiUrl = `${baseUrl}/RegisterEmployee`;  // Your backend API URL

  constructor(private http: HttpClient) { }

  registerEmployee(employeeData: any): Observable<any> {
    const { FirstName, MiddleName, LastName, EmailID, PhoneNumber, JoiningDate } = employeeData;

    // Construct the query string
    const queryParams = `?FirstName=${FirstName}&MiddleName=${MiddleName}&LastName=${LastName}&EmailID=${EmailID}&PhoneNumber=${PhoneNumber}&JoiningDate=${JoiningDate}`;
    
    // Log the constructed URL
   // console.log("Request URL:", `${this.apiUrl}${queryParams}`);

    // Log the body being sent in the POST request
   // console.log("Request Body:", {});

    // Make the GET request with the query params (you may want to use GET instead of POST if it's a query)
    return this.http.post<any>(`${this.apiUrl}${queryParams}`, {});
  }
}
