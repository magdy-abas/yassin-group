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

  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', 'admin-auth-token');
      this.isAdminLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    this.isAdminLoggedInSubject.next(false);
    this.router.navigate(['/home']);
  }

  private hasAdminToken(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  isAdminLoggedIn(): boolean {
    return this.hasAdminToken();
  }
}
