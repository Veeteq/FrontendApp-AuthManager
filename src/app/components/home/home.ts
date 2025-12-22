import { Component } from '@angular/core';
import { AuthService } from '@app/_service/auth.service';
import { User } from '@app/model/user';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  user: User | null;

  constructor(private authService: AuthService) {
    this.user = this.authService.userValue;
  }

}
