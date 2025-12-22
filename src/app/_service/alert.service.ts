import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private subject = new Subject<any>();
  private showAfterRedirect = false;

  constructor(private router: Router) {}

  onAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, showAfterRedirect = false) {
    this.showAfterRedirect = showAfterRedirect;
    this.subject.next({ type: 'success', message: message });
  }

  error(message: string, showAfterRedirect = false) {
    this.showAfterRedirect = showAfterRedirect;
    this.subject.next({ type: 'error', message: message });
  }

  clear() {
    // Clear by calling subject.next() with null
    this.subject.next(null);
  }
}
