import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../app.config';
@Injectable({
  providedIn: 'root',
})
export class SetAttendanceService {
  private apiUrl = `${baseUrl}/SetAttendanceStatus`;

  constructor(private http: HttpClient) {}

  setAttendanceStatus(
    empcode: string,
    date: string,
    checkInTime: string,
    checkOutTime: string,
    status: string,
    remarks: string
  ): Observable<{ messsage: string }> {
    const params = new URLSearchParams({
      EmployeeCode: empcode,
      Date: date,
      CheckInTime: checkInTime,
      CheckOutTime: checkOutTime,
      Status: status,
      Remarks: remarks,
    });

    return this.http.post<{ messsage: string }>(`${this.apiUrl}?${params.toString()}`, {});
  }
}
