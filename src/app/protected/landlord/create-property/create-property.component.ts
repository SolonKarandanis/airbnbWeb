import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../layout/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LandlordService } from '@landlord/service/landlord.service';
import { UserService } from '@user/service/user.service';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [],
  template: `
    <p>
      create-property works!
    </p>
  `,
  styles: ``
})
export class CreatePropertyComponent {

  CATEGORY = "category";
  LOCATION = "location";
  INFO = "info";
  PHOTOS = "photos";
  DESCRIPTION = "description";
  PRICE = "price";

  private dialogDynamicRef = inject(DynamicDialogRef);
  private listingService = inject(LandlordService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private router = inject(Router);

}
