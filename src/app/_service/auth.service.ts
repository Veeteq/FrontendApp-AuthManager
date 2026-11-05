import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';

import { User } from '@app/model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private router = inject(Router);

  private userSignal = signal<User | null>(null);
  public user = this.userSignal.asReadonly(); // components can only read user()

  // add default Accept header
  private headers = new HttpHeaders({ 'Accept': 'application/json' });

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSignal.set(JSON.parse(savedUser));
    }
  }

  public get userValue(): User | null {
    return this.userSignal();
  }

  /**
   * Authenticates user against Spring Boot backend and stores response details
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.config.apiUrl}/auth/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      map((response) => {
        // Flatten user profile and token into the local session object
        const userData = {
          ...response,
          id: response.user?.id,
          username: response.user?.username || username,
          email: response.user?.email,
          firstName: response.user?.firstName,
          lastName: response.user?.lastName
        };
        localStorage.setItem('user', JSON.stringify(userData));
        this.userSignal.set(userData);
        return userData;
      })
    );
  }

  /**
   * Triggers silent refresh using httpOnly refresh token cookie
   */
  refreshToken(): Observable<any> {
    return this.http.post<any>(
      `${this.config.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      map((response) => {
        const currentUser = this.userValue;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            token: response.token
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userSignal.set(updatedUser);
        }
        return response;
      })
    );
  }

  /**
   * Performs full logout: revokes refresh token on backend,
   * clears httpOnly cookie, wipes local session state, and redirects to login.
   */
  logout(): void {
    this.http.post(`${this.config.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        // Ensure local session cleanup always runs regardless of HTTP response status or network failure
        finalize(() => {
          localStorage.removeItem('user');
          this.userSignal.set(null);
          this.router.navigate(['/user/login']);
        })
      )
      .subscribe();
  }

  /**
   * Registers a new user account
   */
  register(user: User): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/auth/register`, user, { headers: this.headers });
  }

  /**
   * Fetches all users (Admin only)
   */
  getAll(): Observable<User[]> {

    return this.http.get<User[]>(`${this.config.apiUrl}/admin/users`, { headers: this.headers });
  }

  /**
   * Fetches a single user by ID (Admin only)
   */
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.config.apiUrl}/admin/users/${id}`, { headers: this.headers });
  }

  /**
   * Updates user details by ID (Admin only)
   */
  update(id: number, params: any): Observable<User> {
    return this.http.put<User>(`${this.config.apiUrl}/admin/users/${id}`, params, { headers: this.headers }).pipe(
      map((user) => {
        // Update local storage if the logged-in user updated their own record
        if (id === this.userValue?.id) {
          const updatedUser = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userSignal.set(updatedUser);
        }
        return user;
      })
    );
  }

  /**
   * Deletes user by ID (Admin only)
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.config.apiUrl}/admin/users/${id}`, { headers: this.headers }).pipe(
      map((res) => {
        // Auto logout if the logged-in user deleted their own account
        if (id === this.userValue?.id) {
          this.logout();
        }
        return res;
      })
    );
  }
}