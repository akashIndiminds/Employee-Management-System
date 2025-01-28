import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AesEncryptionService {
  private secretKey = 'mysecretkey12345'; // 16-byte secret key
  private iv = '1234567890abcdef'; // 16-byte initialization vector (IV)

  constructor() {}

  /**
   * Encrypts the given plaintext using AES, CBC mode, and PKCS5Padding.
   * @param plaintext The text to encrypt.
   * @returns The Base64-encoded ciphertext.
   */
   encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // Base64 encoded ciphertext
  }

  /**
   * Decrypts the given ciphertext using AES, CBC mode, and PKCS5Padding.
   * @param ciphertext The Base64-encoded ciphertext to decrypt.
   * @returns The decrypted plaintext.
   */
  decrypt(ciphertext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8); // Decoded plaintext
  }
}
