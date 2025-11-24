import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  // standalone component
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    FormsModule,       // for ngModel
    HttpClientModule   // for HttpClient
  ]
})
export class Login {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:3000/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        // FIX: Only save token if login was successful
        if (res && res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', this.username);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid login response.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password');
      }
    });
  }
}
