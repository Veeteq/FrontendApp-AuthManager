import { Routes } from '@angular/router';
import { Login } from './components/user/login/login';
import { Register } from './components/user/register/register';
import { Home } from './components/home/home';
import { AuthGuard } from './_service/auth.guard';

export const routes: Routes = [
    { path: '',              component: Home, canActivate: [AuthGuard] }, // Protected route,    
    { path: 'user/login',    component: Login },
    { path: 'user/register', component: Register },
    { path: 'users',         loadChildren: () => import('./components/user/user.routes').then(x => x.UserRoutes), canActivate: [AuthGuard] }, 

    // Redirect to home for any other paths
    { path: '**', redirectTo: '' }  
];
