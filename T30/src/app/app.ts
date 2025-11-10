import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { Login } from './login/login';
import { Menu } from './menu/menu';
import { Summary } from './summary/summary';
import { Report } from './report/report';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

    Login,
    Menu,
    Summary,
    Report
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('T30');
}
