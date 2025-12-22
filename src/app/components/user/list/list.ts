import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '@app/_service/alert.service';
import { AuthService } from '@app/_service/auth.service';
import { User } from '@app/model/user';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [
    RouterLink 
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  users = signal<User[] | null>(null);

  constructor(private authService: AuthService, private alertService: AlertService) {}

  ngOnInit() {
    this.authService.getAll()
    .pipe(first())
    .subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.log(err),
    });
  }

  deleteUser(id: number): void {
    const currentUsers = this.users();
    if (!currentUsers) return;
        
    this.authService.delete(id)
    .pipe(first())
    .subscribe(() => {
      this.alertService.success('User deleted', true);
      this.users.set(currentUsers.filter(x => x.id !== id));
    });
  }

}
