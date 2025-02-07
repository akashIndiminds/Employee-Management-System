import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.config';  // Make sure to have baseUrl defined

interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  constructor(private http: HttpClient) {}

  applyForLeave(leaveRequest: LeaveRequest): Observable<any> {
    return this.http.post(`${baseUrl}/leave/apply`, leaveRequest);
  }
}
