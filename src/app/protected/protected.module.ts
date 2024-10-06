import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { protectedRoutes } from './protected.routes';


const routes: Routes =[
  {
    path: '',
    component: LayoutComponent,
    children:protectedRoutes
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
