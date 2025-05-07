import CryptoJS from 'crypto-js';

// Function to encrypt content using AES
export function encryptContent(content: string, key: string): string {
  return CryptoJS.AES.encrypt(content, key).toString();
}

// Function to decrypt content using AES
export function decryptContent(encrypted: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate a random encryption key
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

// Function to encrypt file URL (for premium content)
export function encryptFileUrl(url: string, key: string): string {
  return encryptContent(url, key);
}

// Function to decrypt file URL
export function decryptFileUrl(encryptedUrl: string, key: string): string {
  return decryptContent(encryptedUrl, key);
}

// Helper to encrypt object data
export function encryptObject(obj: any, key: string): string {
  const jsonString = JSON.stringify(obj);
  return encryptContent(jsonString, key);
}

// Helper to decrypt object data
export function decryptObject<T>(encrypted: string, key: string): T {
  const decrypted = decryptContent(encrypted, key);
  return JSON.parse(decrypted) as T;
}
