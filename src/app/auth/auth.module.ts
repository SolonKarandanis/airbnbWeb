import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";

const routes: Routes = [
    {
      path: '',
      component: AuthComponent,
      children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },
        {
          path: 'login',
          loadComponent: () => 
            import('./login/login.component').then((m)=>m.LoginComponent),
          data: { returnUrl: window.location.pathname },
        },
        {
          path: 'registration',
          loadComponent: () => 
            import('./register/register.component').then((m)=>m.RegisterComponent),
        },
        // {
        //   path: 'forgot-password',
        //   component: ForgotPasswordComponent,
        // },
        // {
        //   path: 'logout',
        //   component: LogoutComponent,
        // },
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: '**', redirectTo: 'login', pathMatch: 'full' },
      ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthModule {}