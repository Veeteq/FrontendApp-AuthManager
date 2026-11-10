import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(AuthService);
  const configService = inject(ConfigService);
  const user = userService.userValue;

  // Check if the user is logged in and the request is directed to the API URL
  const isLoggedIn = user?.token;
  const isApiUrl = req.url.startsWith(configService.authApiUrl);

  // Przygotowanie nagłówków
  let setHeaders: { [key: string]: string } = {};
  if (isLoggedIn && isApiUrl) {
    setHeaders['Authorization'] = `Bearer ${user.token}`;
  }

  // Klonowanie żądania z nagłówkami i włączoną obsługą ciasteczek
  req = req.clone({    
    setHeaders,           // Add the token to the request headers
    withCredentials: true // <--- Włącza wysyłanie i odbieranie ciasteczek httpOnly
  });

  return next(req);
}