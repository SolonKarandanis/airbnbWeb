import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'auth',
        loadChildren: () => 
            import('./auth/auth.module').then((m)=>m.AuthModule),
    },
    {
        path: 'error',
        loadChildren: () =>
          import('./errors/errors.module').then((m) => m.ErrorsModule),
      },
    {
        path:'',
        loadChildren: () => 
            import('./protected/protected.module').then((m)=>m.ProtectedModule),
    },
];
