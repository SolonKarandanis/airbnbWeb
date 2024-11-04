import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LandlordService } from '@landlord/service/landlord.service';
import { CardListing } from '@models/listing.model';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  template: `
    <h1>My properties</h1>
    <h2>Add new and remove properties</h2>
    @if(vm(); as vm){
      @if (vm.listings && vm.listings.length > 0 || vm.loading){
        <div class="listing-grid">
          @for(listing of vm.listings; track listing.publicId) {
            <app-card-listing 
              [listing]="listing"
              [cardMode]="'landlord'"
              (deleteListing)="onDeleteListing($event)">
            </app-card-listing>
          }
        </div>
      } @else {
        <div class="flex flex-column justify-content-center align-items-center h-10rem">
          <h1>No property present</h1>
          <div class="text-xl">It seems that you don't have any properties yet</div>
        </div>
      }

      @if (vm.loading) {
        <div class="flex justify-content-center align-items-center h-15rem">
          <fa-icon [icon]="'circle-notch'" size="3x" animation="spin" class="ml-2 text-primary"></fa-icon>
        </div>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesComponent {

  landlordService = inject(LandlordService);

  private listings:Signal<CardListing[]> = this.landlordService.searchResults;
  private loading:Signal<boolean> = this.landlordService.isLoading;

  protected vm = computed(()=>{
    const loading = this.loading();
    const listings = this.listings();

    return {
      loading,
      listings
    }
  });

  constructor() {
    this.fetchListings();
  }

  onDeleteListing(listing: CardListing): void {
    this.landlordService.executeDeleteListing(listing.publicId);
  }

  private fetchListings() {
    this.landlordService.executeGetAllListings();
  }
}
