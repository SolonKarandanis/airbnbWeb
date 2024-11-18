import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  BookedDatesD } from '@models/booking.model';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-search-date',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule
  ],
  template: `
    <div class="flex justify-content-center">
      <p-calendar class="max-w-full block mt-4"
                  [ngModel]="searchDateRaw"
                  (ngModelChange)="onDateChange($event)"
                  [minDate]="minDate"
                  selectionMode="range"
                  [inline]="true"
                  [touchUI]="false"
                  [selectOtherMonths]="true">
      </p-calendar>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDateComponent {


  dates = input.required<BookedDatesD>();

  datesChange = output<BookedDatesD>();
  stepValidityChange = output<boolean>();

  protected searchDateRaw = new Array<Date>();

  protected minDate = new Date();

  constructor() {
    this.restorePreviousDate();
  }

  onDateChange(newBookingDate: Date[]):void{
    this.searchDateRaw = newBookingDate;
    const isDateValid = this.validateDateSearch();
    this.stepValidityChange.emit(isDateValid);
    if (isDateValid) {
      const searchDate: BookedDatesD = {
        startDate: this.searchDateRaw[0],
        endDate: this.searchDateRaw[1]
      }
      this.datesChange.emit(searchDate);
    }
  }

  private validateDateSearch():boolean {
    return this.searchDateRaw.length === 2
      && this.searchDateRaw[0] !== null
      && this.searchDateRaw[1] !== null
      && this.searchDateRaw[0].getDate() !== this.searchDateRaw[1].getDate()
  }

  private restorePreviousDate():void {
    effect(() => {
      if(this.dates()) {
        this.searchDateRaw[0] = new Date(this.dates().startDate);
        this.searchDateRaw[1] = new Date(this.dates().endDate);
      }
    });
  }

}
