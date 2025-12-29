import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  private authService = inject(AuthService);
  protected readonly title = signal('Access Manager');
  protected readonly userSignal = this.authService.user;
  protected readonly user = this.userSignal();

  logout(): void {
    // Call the service to clear local storage and redirect to login page
    console.log('logout');
    this.authService.logout();
  }

}
