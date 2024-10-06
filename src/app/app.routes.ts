import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'auth/login',
        loadComponent: () => 
            import('./auth/login/login.component').then((m)=>m.LoginComponent),
    },
    {
        path:'auth/register',
        loadComponent: () => 
            import('./auth/register/register.component').then((m)=>m.RegisterComponent),
    },
];
