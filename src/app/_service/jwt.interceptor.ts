import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { environment } from '@environments/environment';

  export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const userService = inject(AuthService);
    const user = userService.userValue;

    // Check if the user is logged in and the request is directed to the API URL
    const isLoggedIn = user?.token;
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl) {
      console.log('JWT Interceptor - adding Authorization header, ' + isLoggedIn + ', ' + isApiUrl);
      // Add the token to the request headers
      //req = req.clone();
      //req.headers.set('Authorization', `Bearer ${user.token}`);
      req = req.clone({setHeaders: {Authorization: `Bearer ${user.token}`}});
      console.log('Modified Request Headers:', req.headers);
      //req = req.clone({setHeaders: {Authorization: `Bearer ${user.token}`}});
    }

    return next(req);
  }