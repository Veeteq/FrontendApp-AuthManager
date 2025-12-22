import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from './model/user';
import { AuthService } from './_service/auth.service';
import { Alert } from "./components/alert/alert";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Alert
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AddressBookManagement3');
  user = signal<User | null>(null);

  constructor(private authService: AuthService) {
    // Subscribe to user state to dynamically update the UI
    this.user = this.authService.user;
  }

  logout(): void {
    // Call the service to clear local storage and redirect to login page
    console.log('logout');
    this.authService.logout();
  }

}
