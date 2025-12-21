import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      // Auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      if ([401, 403].includes(err.status) && userService.userValue) {
        userService.logout();
      }

      // Extract error message from the error response object or default to response status text
      const error = err.error?.message || err.statusText;
      console.error(err);
      return throwError(() => error);
    })
  );
};
