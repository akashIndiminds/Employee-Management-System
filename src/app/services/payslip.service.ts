import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Payslip {
  employeeId: string;
  employeeName: string;
  salaryMonth: string;
  basicPay: number;
  deductions: number;
  netSalary: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayslipService {
  private apiUrl = 'https://your-backend-api.com/payslip'; // Replace with actual API URL

  constructor(private http: HttpClient) {}

  getPayslip(): Observable<Payslip> {
    return this.http.get<Payslip>(this.apiUrl);
  }
}
