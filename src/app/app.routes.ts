import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'auth',
        loadChildren: () => 
            import('./auth/auth.module').then((m)=>m.AuthModule),
    },
    {
        path:'',
        loadComponent: () => 
            import('./home/home.component').then((m)=>m.HomeComponent),
    },
];
