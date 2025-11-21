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

  logout() {
    // Remove token (or any session data)
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token');

    // Optionally clear all storage:
    // localStorage.clear();

    // Redirect to login page
    this.router.navigate(['/login']);
  }
}

