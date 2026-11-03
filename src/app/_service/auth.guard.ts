import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.userValue;

  if (currentUser) {
    // Check if the route requires specific roles (e.g., ACCOUNT_ADMIN)
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = currentUser.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        // Logged in but missing required role -> redirect to home
        router.navigate(['/']);
        return false;
      }
    }
    
    // Authenticated and authorized
    return true;
  }

  // Unauthenticated -> redirect to login page with return URL
  router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
  return false;
}