import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import { AvatarComponent } from './avatar/avatar.component';
import { CategoryComponent } from './category/category.component';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { CreatePropertyComponent } from '@landlord/create-property/create-property.component';
import { SearchComponent } from '@tenant/search/search.component';
import dayjs from 'dayjs';
import { TranslationModule } from '@i18n/translation.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent,
    TranslationModule,
  ],
  providers:[DialogService],
  template: `
    <div class="sticky top-0 border-bottom-1 border-gray-200 shadow-1 z-1">
      @if(vm(); as vm){
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
              {{vm.location}}
            </button>
            <div class="border-1 border-left-none border-gray-300 separator"></div>
            <button class="p-button border-none border-noround bg-white text-dark focus:shadow-none">
              {{vm.dates}}
            </button>
            <div class="border-1 border-left-none border-gray-300 separator"></div>
            <button class="p-button guest-btn border-none border-round-right-3xl bg-white text-dark focus:shadow-none text-gray-400 p-2">
              <div>{{vm.guests}}</div>
            </button>
            <button class="mr-2 p-button search-icon flex align-items-center justify-content-center">
              <fa-icon [icon]="'search'" class="text-sm"></fa-icon>
            </button>
          </div>
          <div class="p-toolbar-group-end sm:hidden md:flex">
            <a class="p-button p-button-link" (click)="openNewListing()">{{ "GLOBAL.app-full-name" | translate }}</a>
            <p-menu #menu [model]="currentMenuItems" [popup]="true" styleClass="border-round-xl mt-1"></p-menu>
            <button (click)="menu.toggle($event)" class="menu flex align-content-center
              justify-content-around ml-2 pl-3 p-2 border-gray-300 focus:shadow-none hover:shadow-1 border-round-3xl bg-white p-button">
              <fa-icon [icon]="'bars'" class="text-sm text-dark mr-3"></fa-icon>
              <app-avatar [imageUrl]="vm.connectedUser?.imageUrl" avatarSize="avatar-sm"></app-avatar>
            </button>
          </div>
        </p-toolbar>
      }
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

  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private activatedRoute = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private ref: DynamicDialogRef | undefined;

  private locationDefault = this.translateService.instant('HEADER.SEARCH.anywhere');
  private guestsDefault = this.translateService.instant('HEADER.SEARCH.any-week');
  private datesDefault = this.translateService.instant('HEADER.SEARCH.anywhere');

  private location = signal(this.locationDefault);
  private guests = signal(this.guestsDefault);
  private dates = signal(this.datesDefault);

  protected vm = computed(()=>{
    const connectedUser = this.authService.loggedUser();
    const location = this.location();
    const guests = this.guests();
    const dates = this.dates();

    return {
      connectedUser,
      location,
      guests,
      dates
    }

  });

  // protected  connectedUser =this.authService.loggedUser();

  login(){
    // this.authService.login();
  }

  logout(){
    this.authService.logout();
  }

  currentMenuItems: MenuItem[] | undefined = [];

  ngOnInit(): void {
    this.extractInformationForSearch();
    this.currentMenuItems = this.fetchMenu();
  }

  hasToBeLandlord(): boolean {
    const result = this.authService.hasAnyAuthority(RolesConstants.ROLE_LANDLORD);
    return result();
  }


  private fetchMenu(): MenuItem[] {
    const menuItems: MenuItem[] = []
    if (this.hasToBeLandlord()) {
      menuItems.push({
        label: this.translateService.instant('HEADER.MENU.my-properties'),
        routerLink: "landlord/properties",
      });
      menuItems.push({
        label: this.translateService.instant('HEADER.MENU.my-reservation'),
        routerLink: "landlord/reservation",
      });
      
    } else {
      menuItems.push({
        label:this.translateService.instant('HEADER.MENU.my-booking'),
        routerLink: "booking",
      });
    }
    menuItems.push({
      label: this.translateService.instant('HEADER.MENU.log-out'),
      command: () => this.logout()
    });
    return menuItems;
  }

  openNewListing(): void {
    this.ref = this.dialogService.open(CreatePropertyComponent,
      {
        width: "60%",
        header: this.translateService.instant('GLOBAL.app-full-name'),
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      })
  }

  openNewSearch(): void {
    this.ref = this.dialogService.open(SearchComponent,
      {
        width: "40%",
        header: this.translateService.instant('HEADER.SEARCH.title'),
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      });
  }

  private extractInformationForSearch(): void{
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params["location"]) {
          this.location.set(params["location"]);
          this.guests.set(params["guests"] + " Guests");
          this.dates.set(dayjs(params["startDate"]).format("MMM-DD")+" to "+dayjs(params["endDate"]).format("MMM-DD"));
        } else if (this.location() !== this.locationDefault) {
          this.location.set(this.locationDefault);
          this.guests.set(this.guestsDefault);
          this.dates.set(this.datesDefault);
        }
      }
    })
  }

}
