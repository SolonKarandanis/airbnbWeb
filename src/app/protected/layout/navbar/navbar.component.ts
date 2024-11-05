import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
import { AuthService } from '@core/services/auth.service';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { CreatePropertyComponent } from '@landlord/create-property/create-property.component';

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
        <div class="p-toolbar-group-start pl-1 sm:hidden md:flex cursor-pointer" routerLink="/home">
          <fa-icon [icon]="['fab', 'airbnb']" size="3x" class="text-primary"></fa-icon>
          <div class="font-bold text-primary pl-2 text-2xl">airbnb</div>
        </div>
        <div class="p-toolbar-group-center bg-white border-round-3xl p-0 border-1
          border-gray-300 shadow-1 hover:shadow-2 middle-group search flex justify-content-around" (click)="openNewSearch()">
          <button class="p-button border-round-left-3xl border-noround-right border-right-none
            border-none bg-white text-dark focus:shadow-none">
            {{location}}
          </button>
          <div class="border-1 border-left-none border-gray-300 separator"></div>
          <button class="p-button border-none border-noround bg-white text-dark focus:shadow-none">
            {{dates}}
          </button>
          <div class="border-1 border-left-none border-gray-300 separator"></div>
          <button class="p-button guest-btn border-none border-round-right-3xl bg-white text-dark focus:shadow-none text-gray-400 p-2">
            <div>{{guests}}</div>
          </button>
          <button class="mr-2 p-button search-icon flex align-items-center justify-content-center">
            <fa-icon [icon]="'search'" class="text-sm"></fa-icon>
          </button>
        </div>
        <div class="p-toolbar-group-end sm:hidden md:flex">
          <a class="p-button p-button-link" (click)="openNewListing()">Airbnb your home</a>
          <p-menu #menu [model]="currentMenuItems" [popup]="true" styleClass="border-round-xl mt-1"></p-menu>
          <button (click)="menu.toggle($event)" class="menu flex align-content-center
            justify-content-around ml-2 pl-3 p-2 border-gray-300 focus:shadow-none hover:shadow-1 border-round-3xl bg-white p-button">
            <fa-icon [icon]="'bars'" class="text-sm text-dark mr-3"></fa-icon>
            <app-avatar [imageUrl]="connectedUser?.imageUrl" avatarSize="avatar-sm"></app-avatar>
          </button>
        </div>
      </p-toolbar>
      <app-category />
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
  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit{

  location = "Anywhere";
  guests = "Add guests";
  dates = "Any week";

  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private activatedRoute = inject(ActivatedRoute);
  private ref: DynamicDialogRef | undefined;

  protected  connectedUser =this.authService.loggedUser();

  login(){
    // this.authService.login();
  }

  logout(){
    this.authService.logout();
  }

  currentMenuItems: MenuItem[] | undefined = [];

  ngOnInit(): void {
    // this.authService.fetch(false);
    // this.extractInformationForSearch();
    this.currentMenuItems = this.fetchMenu();
    this.connectedUser = this.authService.loggedUser();
  }

  hasToBeLandlord(): boolean {
    const result = this.authService.hasAnyAuthority(RolesConstants.ROLE_LANDLORD);
    return result();
  }


  private fetchMenu(): MenuItem[] {
    if (this.authService.isAuthenticated()) {
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
          command: () => this.logout()
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

  openNewListing(): void {
    this.ref = this.dialogService.open(CreatePropertyComponent,
      {
        width: "60%",
        header: "Airbnb your home",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      })
  }

  openNewSearch(): void {
    // this.ref = this.dialogService.open(SearchComponent,
    //   {
    //     width: "40%",
    //     header: "Search",
    //     closable: true,
    //     focusOnShow: true,
    //     modal: true,
    //     showHeader: true
    //   });
  }

}
