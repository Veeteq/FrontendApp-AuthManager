import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/model/user'; // importujemy Twój model

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userSignal = signal<User | null>(null);
  public user = this.userSignal; // components can read user()

  constructor(private router: Router, private http: HttpClient) {
    this.userSignal.set(JSON.parse(localStorage.getItem('user')!));
  }

  public get userValue(): User | null {
    return this.userSignal();
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/users/authenticate`, { username, password }).pipe(
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
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getAll() : Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: number) : Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: number, params: any) : Observable<User> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
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
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
    .pipe(map((user) => {
        // Auto logout if the logged-in user deleted their own record [4]
        if (id == this.userValue?.id) {
          this.logout();
        }
      })
    );
  }
}
