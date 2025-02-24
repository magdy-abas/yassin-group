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
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
