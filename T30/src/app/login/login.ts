import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule,

  ],
  styleUrls: ['./login.scss']
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
        // save token
        localStorage.setItem('token', res.token);
        // go to summary page
        this.router.navigate(['/dashboard']);
      },
      
    });
  }
}
