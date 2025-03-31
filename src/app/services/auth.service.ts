import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasAdminToken()
  );
  public isAdminLoggedIn$: Observable<boolean> =
    this.isAdminLoggedInSubject.asObservable();

  private readonly ADMIN_USERNAME = 'yassin';
  private readonly ADMIN_PASSWORD = 'yassin#012012';
  private readonly TOKEN_EXPIRY_TIME = 3600000 * 68;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      const token = this.generateSecureToken();
      const expiryDate = Date.now() + this.TOKEN_EXPIRY_TIME;

      localStorage.setItem('admin_token', token);
      localStorage.setItem('token_expiry', expiryDate.toString());

      this.isAdminLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_expiry');
    this.isAdminLoggedInSubject.next(false);
    this.router.navigate(['/home']);
  }

  private generateSecureToken(length = 64): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let token = '';
    const randomValues = window.crypto.getRandomValues(new Uint8Array(length));

    for (let i = 0; i < randomValues.length; i++) {
      token += charset[randomValues[i] % charset.length];
    }

    return token;
  }

  private hasAdminToken(): boolean {
    const token = localStorage.getItem('admin_token');
    const tokenExpiry = localStorage.getItem('token_expiry');

    if (!token || !tokenExpiry) {
      return false;
    }

    const currentTime = Date.now();
    if (currentTime > parseInt(tokenExpiry, 10)) {
      this.logout();
      return false;
    }

    return true;
  }

  isAdminLoggedIn(): boolean {
    return this.hasAdminToken();
  }
}
