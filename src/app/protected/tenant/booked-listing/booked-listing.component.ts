import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BookedListing } from '@models/booking.model';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import { VarDirective } from '@shared/directives/ng-var.directive';
import { TenantService } from '@tenant/service/tenant.service';

@Component({
  selector: 'app-booked-listing',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent,
    VarDirective
  ],
  template: `
    <h1>My Booking</h1>
    <h2>Past and Next booking</h2>
    @if(vm(); as vm){
      <ng-container *ngVar="vm.bookedListings as bookedListings">
        <div class="listing-grid">
          @for (bookedListing of bookedListings; track bookedListing.bookingPublicId) {
            <app-card-listing 
              [listing]="bookedListing" 
              [cardMode]="'booking'"
              (cancelBooking)="onCancelBooking($event)">
            </app-card-listing>
          }
        </div>
        @if (!vm.loading && bookedListings.length === 0) {
          <div class="flex flex-column align-items-center justify-content-center h-10rem">
            <h1>No booking found</h1>
            <div class="text-xl">It seems that you don't have any booking yet.</div>
          </div>
        }
        @if (vm.loading) {
          <div class="flex justify-content-center align-items-center h-10rem">
            <fa-icon class="ml-2 text-primary" icon="circle-notch" size="3x" animation="spin"></fa-icon>
          </div>
        }
      </ng-container>
    }
    
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookedListingComponent {

  private bookingService = inject(TenantService);

  private loading:Signal<boolean> = this.bookingService.isLoading;
  private bookedListings:Signal<BookedListing[]> = this.bookingService.bookedListings;

  protected vm = computed(()=>{
    const loading = this.loading();
    const bookedListings = this.bookedListings();

    return {
      loading,
      bookedListings
    }
  });

  constructor() {
    this.fetchBookings();
  }

  onCancelBooking(bookedListing: BookedListing):void {
    bookedListing.loading = true;
    this.bookingService.executeCancelBooking(bookedListing.bookingPublicId, bookedListing.listingPublicId, false);
  }

  private fetchBookings() {
    this.bookingService.executeGetTenantBookedListings();
  }

  private listenCancelBooking():void{

  }

}
