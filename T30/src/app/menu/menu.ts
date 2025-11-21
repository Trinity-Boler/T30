import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  imports: [
    RouterLink, RouterLinkActive
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

  constructor(private router: Router) {}

isLoggedIn = false;

  ngOnInit(): void {
    // Check token on page load
    this.isLoggedIn = !!localStorage.getItem('token');
  }
   ngDoCheck(): void {
    // Keep menu updated even after login without reloading page
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    // Remove token (or any session data)
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token');

    // Optionally clear all storage:
    localStorage.clear();

    // Redirect to login page
    this.router.navigate(['/login']);
  }
}

