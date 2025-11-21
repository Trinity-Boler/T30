import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Login } from './login/login';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Menu,

  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App {
  protected readonly title = signal('T30');
}
