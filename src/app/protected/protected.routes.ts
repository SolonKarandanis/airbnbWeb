import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RoleGuard } from "@core/guards/role.guard";
import { RolesConstants } from "@core/guards/SecurityConstants";

export const protectedRoutes: Routes =[
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'landlord/properties',
    loadComponent: () => 
      import('./landlord/properties/properties.component').then((m)=>m.PropertiesComponent),
    canActivate: [RoleGuard],
    data: {
      allowedRoles: [RolesConstants.ROLE_LANDLORD]
    }
  },
  {
    path: 'listing',
    loadComponent: () => 
      import('./tenant/display-listing/display-listing.component').then((m)=>m.DisplayListingComponent),
  },
  {
    path: "booking",
    loadComponent: () => 
      import('./tenant/booked-listing/booked-listing.component').then((m)=>m.BookedListingComponent),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
    
]