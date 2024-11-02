import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PropertiesComponent } from "@landlord/properties/properties.component";
import { RoleGuard } from "@core/guards/role.guard";

export const protectedRoutes: Routes =[
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'landlord/properties',
    component: PropertiesComponent,
    canActivate: [RoleGuard],
    data: {
      allowedRoles: ["ROLE_LANDLORD"]
    }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
    
]