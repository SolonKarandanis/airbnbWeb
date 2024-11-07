import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Listing } from '@models/listing.model';
import { TenantService } from '@tenant/service/tenant.service';
import { CalendarModule } from 'primeng/calendar';
import {MessageModule} from "primeng/message";

@Component({
  selector: 'app-book-date',
  standalone: true,
  imports: [
    CurrencyPipe,
    CalendarModule,
    FormsModule,
    MessageModule
  ],
  template: `
    <p>
      book-date works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDateComponent implements OnInit{
  
  listing = input.required<Listing>();
  listingPublicId = input.required<string>();

  private bookingService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);


  ngOnInit(): void {
    this.bookingService.executeCheckAvailability(this.listingPublicId());
  }

}
