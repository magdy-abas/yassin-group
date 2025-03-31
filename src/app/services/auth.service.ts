import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isAdminLoggedIn$: Observable<boolean> =
    this.isAdminLoggedInSubject.asObservable();

  private readonly ADMIN_UID = '7hXyj3YMbYcbWuSreojixEKgMpy1';

  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    this.isAdminLoggedInSubject.next(isLoggedIn);

    onAuthStateChanged(this.auth, (user) => {
      const isAdmin = user?.uid === this.ADMIN_UID;
      this.isAdminLoggedInSubject.next(isAdmin);

      if (isAdmin) {
        localStorage.setItem('adminLoggedIn', 'true');
      } else {
        localStorage.removeItem('adminLoggedIn');
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (result.user?.uid === this.ADMIN_UID) {
        this.isAdminLoggedInSubject.next(true);
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
      } else {
        await this.logout();
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.isAdminLoggedInSubject.next(false);
      localStorage.removeItem('adminLoggedIn');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  isAdminLoggedIn(): boolean {
    return this.isAdminLoggedInSubject.value;
  }

  getCurrentUser(): Promise<User | null> {
    return Promise.resolve(this.auth.currentUser);
  }
}
