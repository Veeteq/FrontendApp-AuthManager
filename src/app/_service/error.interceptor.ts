import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, TimeoutError } from 'rxjs';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      // 1. Handle RxJS TimeoutError specifically
      if (err instanceof TimeoutError || err.name === 'TimeoutError') {
        const timeoutMsg = 'Request timed out. Please check your network connection or server status.';
        console.error('HTTP Timeout Interceptor:', err);
        return throwError(() => timeoutMsg);
      }

      // Exclude authentication endpoints from silent refresh logic
      const isAuthEndpoint = req.url.includes('/auth/login') ||
                             req.url.includes('/auth/refresh') ||
                             req.url.includes('/auth/logout');

      // Attempt silent token refresh on 401 Unauthorized for protected endpoints
      if (err.status === 401 && !isAuthEndpoint && authService.userValue) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` }
            });
            return next(clonedReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // Auto logout on 403 Forbidden
      if (err.status === 403) {
        authService.logout();
      }

      const errorMessage = err.error?.detail || err.error?.message || err.statusText;
      console.error('HTTP Error Interceptor:', err);
      return throwError(() => errorMessage);
    })
  );
};