import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const user = this.authService.userValue;
    if (user) {
      // Authorized so return true
      return true;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
