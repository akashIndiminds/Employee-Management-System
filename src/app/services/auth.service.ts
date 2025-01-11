import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private employeeCodeKey = 'employeeCode';

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setEmployeeCode(code: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.employeeCodeKey, code);
    } else {
      console.warn('localStorage is not available. Employee code will not persist.');
    }
    this.logEmployeeCode();
  }

  getEmployeeCode(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.employeeCodeKey);
    } else {
      console.warn('localStorage is not available. Returning null for employee code.');
      return null;
    }
  }

  logEmployeeCode(): void {
    console.log('Current Employee Code:', this.getEmployeeCode());
  }
}
