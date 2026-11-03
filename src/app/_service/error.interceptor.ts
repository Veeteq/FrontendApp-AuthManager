import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      // Check if request is directed to authentication endpoints to avoid infinite refresh loops
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

      // Attempt silent token refresh on 401 Unauthorized for protected endpoints
      if (err.status === 401 && !isAuthEndpoint && authService.userValue) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Retry the original request with the newly issued access token
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` }
            });
            return next(clonedReq);
          }),
          catchError((refreshErr) => {
            // Auto logout if refresh token validation or rotation fails
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // Auto logout if 403 Forbidden is returned
      if (err.status === 403) {
        authService.logout();
      }

      // Extract error message from response or fallback to status text
      const errorMessage = err.error?.detail || err.error?.message || err.statusText;
      console.error('HTTP Error Interceptor:', err);
      return throwError(() => errorMessage);
    })
  );
};
