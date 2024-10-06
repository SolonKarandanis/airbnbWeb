import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

const childrenRoutes: Routes =[
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
]

const routes: Routes =[
  {
    path: '',
    component: LayoutComponent,
    children:childrenRoutes
  },
]

@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    NavbarComponent, 
    FooterComponent,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ProtectedModule { }
