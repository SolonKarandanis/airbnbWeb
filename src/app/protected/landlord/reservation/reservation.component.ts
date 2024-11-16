import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BookedListing } from '@models/booking.model';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import { VarDirective } from '@shared/directives/ng-var.directive';
import { TenantService } from '@tenant/service/tenant.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent,
    VarDirective,
  ],
  template: `
    <h1>My Reservation</h1>
    <h2>Past and next reservation for your house</h2>
    @if(vm(); as vm){
      <ng-container *ngVar="vm.reservationListings as reservationListings">
        <div class="listing-grid">
          @for (reservation of reservationListings; track reservation.bookingPublicId) {
            <app-card-listing 
              [listing]="reservation" 
              [cardMode]="'booking'"
              (cancelBooking)="onCancelBooking($event)">
            </app-card-listing>
          }
        </div>
        @if (!vm.loading && reservationListings.length === 0) {
          <div class="flex flex-column align-items-center justify-content-center h-10rem">
            <h1>No reservation found</h1>
            <div class="text-xl">It seems that you don't have any reservation yet.</div>
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
export class ReservationComponent {

  private bookingService = inject(TenantService);

  private loading:Signal<boolean> = this.bookingService.isLoading;
  private reservationListings:Signal<BookedListing[]> = this.bookingService.bookedListings;

  protected vm = computed(()=>{
    const loading = this.loading();
    const reservationListings = this.reservationListings();

    return {
      loading,
      reservationListings
    }
  });

  constructor() {
    this.fetchBookings();
  }

  onCancelBooking(bookedListing: BookedListing):void {
    bookedListing.loading = true;
    this.bookingService.executeCancelBooking(bookedListing.bookingPublicId, bookedListing.listingPublicId, true);
  }

  private fetchBookings() {
    this.bookingService.executeGetLandlordBookedListings();
  }
}
