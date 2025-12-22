import { Component, effect, OnInit } from '@angular/core';
import { AlertService } from '@app/_service/alert.service';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alert: any = null;

  constructor(public alertService: AlertService) {
    effect(() => {
      const a = this.alertService.alert();
      if (a) {
        switch (a?.type) {
          case 'success':
            a.cssClass = 'bg-green-50 text-green-800 border-green-200';
            break;
          case 'error':
            a.cssClass = 'bg-red-50 text-red-800 border-red-200';
            break;
        }
      }
      this.alert = a;
    });
  }
}
