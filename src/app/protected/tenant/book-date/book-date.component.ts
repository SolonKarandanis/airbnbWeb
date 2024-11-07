import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { BookedDatesDTOFromClient } from '@models/booking.model';
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
    <div class="border-300 border-1 border-round-xl shadow-1 p-4">
      <span class="text-2xl font-bold">{{ listing().price.value | currency }}</span>
      <p-calendar class="max-w-full block mt-4"
          [ngModel]="bookingDates"
          (ngModelChange)="onDateChange($event)"
          [minDate]="minDate"
          [inline]="true"
          [touchUI]="false"
          [selectOtherMonths]="true"
          
          selectionMode="range">
      </p-calendar>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDateComponent {
  
  listing = input.required<Listing>();

  private bookingService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private currentPublicId:Signal<string | null>= this.bookingService.currentPublicId;
  public bookedDates = this.bookingService.availabilityDates;

  public bookingDates = new Array<Date>();
  public minDate = new Date();
  

  onDateChange(newBookingDates: Array<Date>):void{
    this.bookingDates = newBookingDates;
  }

  // private mapBookedDatesToDate(bookedDatesDTOFromClients: Array<BookedDatesDTOFromClient>): Array<Date> {
  //   const bookedDates = new Array<Date>();
  //   for (let bookedDate of bookedDatesDTOFromClients) {
  //     bookedDates.push(...this.getDatesInRange(bookedDate));
  //   }
  //   return bookedDates;
  // }

  // private getDatesInRange(bookedDate: BookedDatesDTOFromClient) {
  //   const dates = new Array<Date>();

  //   let currentDate = bookedDate.startDate;
  //   while (currentDate <= bookedDate.endDate) {
  //     dates.push(currentDate.toDate());
  //     currentDate = currentDate.add(1, "day");
  //   }

  //   return dates;
  // }
}
