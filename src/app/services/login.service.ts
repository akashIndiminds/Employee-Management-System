import { Injectable } from '@angular/core';
import { HttpClient , HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000/login';

  constructor(private http: HttpClient) {}

  validateLogin(data: { email: string; password: string }): Observable<any> {
    console.log('API Call Data:', data);
    const params = new HttpParams()
    .set('Email', data.email)   // CHANGED: Passing email as query parameter
    .set('Password', data.password); // CHANGED: Passing password as query parameter

  // CHANGED: Sending `null` as the body, and passing the params in the options
  return this.http.post(this.apiUrl, null, { params }); // CHANGED: Used HttpParams
}
}
