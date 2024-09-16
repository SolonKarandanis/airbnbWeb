import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import { AvatarComponent } from './avatar/avatar.component';
import { CategoryComponent } from './category/category.component';
import { ToastService } from '../toast.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent
  ],
  providers:[DialogService],
  template: `
    <div class="sticky top-0 border-bottom-1 border-gray-200 shadow-1 z-1">
      <p-toolbar [styleClass]="'bg-white border-top-none border-x-none border-noround'
        + 'sm:flex sm:justify-content-center sm:w-full md:flex md:justify-content-between px-8'">
        <div class="p-toolbar-group-start pl-1 sm:hidden md:flex cursor-pointer" routerLink="/">
          <fa-icon [icon]="['fab', 'airbnb']" size="3x" class="text-primary"></fa-icon>
          <div class="font-bold text-primary pl-2 text-2xl">airbnb</div>
        </div>
      </p-toolbar>
    </div>
  `,
  styles: `
  .search-icon {
    width: 15px;
    height: 30px;
    border-radius: 70px;
    padding: 15px;
  }

  .guest-btn {
    padding: 5px 10px !important;
  }

  .separator {
    height: 23px;
  }

  .middle-group {
    height: 50px;
  }

  .menu {
    width: 90px;
    height: 50px;
  }

  .search {
    width: 380px;
  }
  
  `
})
export class NavbarComponent implements OnInit{

  location = "Anywhere";
  guests = "Add guests";
  dates = "Any week";

  toastService = inject(ToastService);
  // authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  ref: DynamicDialogRef | undefined;

  login(){
    // this.authService.login();
  }

  logout(){
    // this.authService.logout();
  }

  // currentMenuItems: MenuItem[] | undefined = [];

  // connectedUser: User = {email: this.authService.notConnected};

  ngOnInit(): void {
    // this.authService.fetch(false);
    // this.extractInformationForSearch();
  }

  hasToBeLandlord(): boolean {
    return true;
    // return this.authService.hasAnyAuthority("ROLE_LANDLORD");
  }


  private fetchMenu(): MenuItem[] {
    if (true) {
      return [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "My booking",
          routerLink: "booking",
        },
        {
          label: "My reservation",
          routerLink: "landlord/reservation",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "Log out",
          command: this.logout
        },
      ]
    } else {
      return [
        {
          label: "Sign up",
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: "Log in",
          command: this.login
        }
      ]
    }
  }

}
