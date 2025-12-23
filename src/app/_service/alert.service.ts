import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSignal = signal<any | null>(null);
  private showAfterRedirect = false;

  constructor(private router: Router) {}

  get alert() {
    return this.alertSignal;
  }

  success(message: string, showAfterRedirect = false) {
    this.showAfterRedirect = showAfterRedirect;
    this.alertSignal.set({ type: 'success', message: message });
  }

  error(message: string, showAfterRedirect = false) {
    this.showAfterRedirect = showAfterRedirect;
    this.alertSignal.set({ type: 'error', message: message });
  }

  clear() {
    // Clear by setting null
    this.alertSignal.set(null);
  }
}
