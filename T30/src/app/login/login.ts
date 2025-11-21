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
        const token = res.data.token;
        localStorage.setItem('jwt', token);
        localStorage.setItem('username', this.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password');
      }
    });
  }
}


