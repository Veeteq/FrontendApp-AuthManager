import { Routes } from '@angular/router';
import { authGuard } from './_service/auth.guard';
import { Home } from './components/home/home';
import { Login } from './components/user/login/login';
import { Register } from './components/user/register/register';

export const routes: Routes = [
  { path: '',              component: Home, canActivate: [authGuard] },
  { path: 'users',         loadChildren: () => import('./components/user/user.routes').then(x => x.UserRoutes), canActivate: [authGuard], data: { roles: ['ACCOUNT_ADMIN'] } },
  { path: 'user/login',    component: Login },
  { path: 'user/register', component: Register },
  { path: '**', redirectTo: '' }
];