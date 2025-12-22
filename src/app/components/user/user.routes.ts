import { Routes } from '@angular/router'
import { List } from "./list/list";
import { AddEdit } from './addedit/addedit';

export const UserRoutes: Routes = [
    { path: '',         component: List },
    { path: 'add',      component: AddEdit },
    { path: 'edit/:id', component: AddEdit }
];