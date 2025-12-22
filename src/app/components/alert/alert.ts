import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '@app/_service/alert.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert implements OnInit, OnDestroy {
  private subscription!: Subscription;
  alert: any;

  constructor(public alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe((alert) => {
      switch (alert?.type) {
        case 'success':
          alert.cssClass = 'bg-green-50 text-green-800 border-green-200'; // Tailwind success style
          break;
        case 'error':
          alert.cssClass = 'bg-red-50 text-red-800 border-red-200'; // Tailwind error style
          break;
      }
      this.alert = alert;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks [6, 7]
    this.subscription.unsubscribe();
  }
}
