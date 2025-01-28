import { Injectable } from '@angular/core';
import { AesEncryptionService } from '../Utility/RequestInterceptor'; // Import the encryption service

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private employeeCodeKey = 'employeeCode';

  constructor(private encryptionService: AesEncryptionService) {} // Inject the encryption service

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setEmployeeCode(code: string): void {
    if (this.isLocalStorageAvailable()) {
      const encryptedCode = this.encryptionService.encrypt(code); // Encrypt the employee code
       console.log("Auth file",encryptedCode)
      localStorage.setItem(this.employeeCodeKey, encryptedCode); // Store the encrypted code
    } else {
    //  console.warn('localStorage is not available. Employee code will not persist.');
    }
    
  }

  getEmployeeCode(): string {
    if (this.isLocalStorageAvailable()) {
      const encryptedCode = localStorage.getItem(this.employeeCodeKey); // Retrieve encrypted code
      if (encryptedCode) {
        return this.encryptionService.decrypt(encryptedCode); // Decrypt the code and return it
      }
      return 'NA';
    } else {
     // console.warn('localStorage is not available. Returning null for employee code.');
      return 'NA';
    }
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.employeeCodeKey); // Clear the encrypted employee code
     // console.log('User logged out and employee code cleared.');
    } else {
     // console.warn('localStorage is not available. Could not log out.');
    }
  }
}
