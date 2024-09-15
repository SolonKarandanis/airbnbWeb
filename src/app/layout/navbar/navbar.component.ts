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
    <p>
      navbar works!
    </p>
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

  // login = () => this.authService.login();

  // logout = () => this.authService.logout();

  // currentMenuItems: MenuItem[] | undefined = [];

  // connectedUser: User = {email: this.authService.notConnected};

  ngOnInit(): void {
    // this.authService.fetch(false);
    // this.extractInformationForSearch();
  }

}
