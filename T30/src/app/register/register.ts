import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register',
    standalone: true,  
  templateUrl: './register.html',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  styleUrls: ['./register.scss']
})
export class Register {

  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    this.http.post<any>('http://localhost:3000/api/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = "Account created successfully! Redirecting to login...";
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = res.err || "Registration failed";
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.err || "Server error";
      }
    });
  }
}
