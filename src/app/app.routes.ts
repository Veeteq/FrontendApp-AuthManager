import { Routes } from '@angular/router';
import { Login } from './components/user/login/login';
import { Register } from './components/user/register/register';
import { Home } from './components/home/home';

export const routes: Routes = [
    { path: '',              component: Home },
    { path: 'user/login',    component: Login },
    { path: 'user/register', component: Register },
    { path: '**', redirectTo: '' }  
];
