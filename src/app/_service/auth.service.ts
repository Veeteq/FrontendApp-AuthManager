import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { User } from '@app/model/user'; // importujemy Twój model
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private router = inject(Router);

  private userSignal = signal<User | null>(null);
  public user = this.userSignal.asReadonly; // components can only read user()

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSignal.set(JSON.parse(savedUser));
    }    
  }

  public get userValue(): User | null {
    return this.userSignal();
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.config.apiUrl}/users/authenticate`, { username, password }).pipe(
      map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSignal.set(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.router.navigate(['/user/login']);
  }

  // New register method sending data to Spring Boot
  register(user: User) {
    return this.http.post(`${this.config.apiUrl}/users`, user);
  }

  getAll() : Observable<User[]> {
    return this.http.get<User[]>(`${this.config.apiUrl}/users`);
  }

  getById(id: number) : Observable<User> {
    return this.http.get<User>(`${this.config.apiUrl}/users/${id}`);
  }

  update(id: number, params: any) : Observable<User> {
    return this.http.put(`${this.config.apiUrl}/users/${id}`, params).pipe(
      map((user) => {
        //Update local storage if the logged in user updated their own record
        if (id === this.userValue?.id) {
          const updatedUser = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userSignal.set(updatedUser);
        }
        return user;
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.config.apiUrl}/users/${id}`)
    .pipe(map((user) => {
        // Auto logout if the logged-in user deleted their own record [4]
        if (id == this.userValue?.id) {
          this.logout();
        }
      })
    );
  }
}
