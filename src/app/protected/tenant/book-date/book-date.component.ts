import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { BookedDates,  CreateBooking } from '@models/booking.model';
import dayjs from "dayjs";
import { Listing } from '@models/listing.model';
import { TenantService } from '@tenant/service/tenant.service';
import { CalendarModule } from 'primeng/calendar';
import {MessageModule} from "primeng/message";
import { UtilService } from '@core/services/util.service';

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
          [disabledDates]="bookedDates()"
          selectionMode="range">
      </p-calendar>
      <button class="p-button mt-4 w-full justify-content-center"
          [disabled]="!validateMakeBooking()"
          [class.p-disabled]="!validateMakeBooking()"
          (click)="onNewBooking()">
        Reserve
      </button>
      @if (!isAuthenticated) {
        <div class="w-full mt-4">
          <p-message 
            styleClass="w-full" 
            severity="warn"
            text="You need to login before making a reservation">
          </p-message>
        </div>
      }
      <div class="border-1 my-4 w-full border-solid border-200"></div>
      <div class="total flex justify-content-between font-bold text-lg">
        <div>Total</div>
        <div>{{ totalPrice | currency }}</div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDateComponent implements OnInit{
  
  
  listing = input.required<Listing>();

  private bookingService = inject(TenantService);
  private authService = inject(AuthService);
  private utilService = inject(UtilService);
  private router = inject(Router);

  private currentPublicId:Signal<string | null>= this.bookingService.currentPublicId;
  private availabilityDates = this.bookingService.availabilityDates;
  public isAuthenticated = this.authService.isAuthenticated();

  public bookingDates = new Array<Date>();
  public bookedDates = computed(()=> this.mapBookedDatesToDate(this.availabilityDates()));
  public minDate = new Date();
  public totalPrice = 0;

  constructor() {
    this.listenToCreateBooking()
  }

  ngOnInit(): void {
    this.bookingService.resetSelectedBooking();
    const dates = this.availabilityDates();
  }
  
  validateMakeBooking() {
    return this.bookingDates.length === 2
      && this.bookingDates[0] !== null
      && this.bookingDates[1] !== null
      && this.bookingDates[0].getDate() !== this.bookingDates[1].getDate()
      && this.authService.isAuthenticated();
  }

  onDateChange(newBookingDates: Array<Date>):void{
    this.bookingDates = newBookingDates;
    if (this.validateMakeBooking()) {
      const startBookingDateDayJS = dayjs(newBookingDates[0]);
      const endBookingDateDayJS = dayjs(newBookingDates[1]);
      this.totalPrice = endBookingDateDayJS.diff(startBookingDateDayJS, "days") * this.listing().price.value;
    } else {
      this.totalPrice = 0;
    }
  }

  onNewBooking() {
    const currentPublicId = this.currentPublicId();
    if(currentPublicId){
      const newBooking: CreateBooking = {
        listingPublicId: currentPublicId,
        startDate: this.utilService.convertDateObjectsToAirbnbFormat(this.bookingDates[0])!,
        endDate: this.utilService.convertDateObjectsToAirbnbFormat(this.bookingDates[1])!,
      }
      this.bookingService.executeCreateBooking(newBooking);
    }
    
  }

  private mapBookedDatesToDate(dates: BookedDates[]): Date[] {
    const bookedDates = new Array<Date>();
    for (let bookedDate of dates) {
      bookedDates.push(...this.getDatesInRange(bookedDate));
    }
    return bookedDates;
  }

  private getDatesInRange(bookedDate: BookedDates) {
    const dates = new Array<Date>();
    const endDate = dayjs(bookedDate.endDate,'dd-MM-yyyy HH:mm:ss Z');
    let currentDate = dayjs(bookedDate.startDate, 'dd-MM-yyyy HH:mm:ss Z');
    while (currentDate <= endDate) {
      dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }

  private listenToCreateBooking():void{
    effect(() => {
      const booking = this.bookingService.selectedBooking();
      if (booking) {
        this.navigateToBooking();
      } 
    });
  }

  private navigateToBooking():void{
    this.router.navigate(["/booking"]);
  }
}
