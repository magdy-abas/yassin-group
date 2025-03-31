import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss', // Fixed typo: styleUrl -> styleUrls
})
export class AdminLoginComponent {
  username: string = ''; // This should be the email
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Mark onSubmit as async to use await
  async onSubmit(): Promise<void> {
    try {
      // Await the login result
      const loginSuccess = await this.authService.login(
        this.username,
        this.password
      );

      if (loginSuccess) {
        this.authService.getCurrentUser().then((user) => {
          console.log('🔥 UID:', user?.uid);
        });

        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An error occurred during login. Please try again.';
    }
  }
}
