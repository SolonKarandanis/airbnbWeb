import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CountryService } from '@landlord/service/country.service';
import { BookedListing } from '@models/booking.model';
import { CardListing } from '@models/listing.model';
import { CategoryService } from 'src/app/protected/layout/navbar/category/category.service';

@Component({
  selector: 'app-card-listing',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    FaIconComponent
  ],
  template: `
    <div class="card relative cursor-pointer">
      <div 
        (click)="onClickCard(cardMode() === 'booking' ? bookingListing?.listingPublicId! : cardListing?.publicId!)">
        <div 
          class="border-1 border-transparent border-round-3xl bg-cover bg-center bg-no-repeat h-24rem w-full"
          [style.background-image]="'url(' + 'data:' + listing().cover.fileContentType + ';base64,' + listing().cover.file + ')'">
        </div>
        <div class="mt-2 font-bold">{{ listing().location }}</div>
        @if (cardMode() === 'booking'){
          <div>{{ bookingListing?.dates?.startDate | date: "mediumDate" }} -
            {{ bookingListing?.dates?.endDate | date: "mediumDate" }}
          </div>
          <div class="mt-2">
            <span class="font-bold">{{ bookingListing?.totalPrice?.value | currency }}</span>
          </div>
        }@else {
          <div>{{ categoryDisplayName }}</div>
          <div class="mt-2">
            <span class="font-bold">{{ cardListing?.price?.value! | currency }}</span>
          </div>
        }
      </div>
      <button 
        [disabled]="loading()" 
        class="absolute trash-btn p-button"
        (click)="onClickAction()">
        @if (loading()) {
          <fa-icon icon="circle-notch" animation="spin"></fa-icon>
        } @else {
          <fa-icon icon="trash-can"></fa-icon>
        }
      </button>
    </div>
  `,
  styles: `
    .trash-btn {
      left: calc(100% - 70px);
      top: 10px;
    }

    .cancel-btn {
      left: calc(100% - 140px);
      top: 10px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardListingComponent {

  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private countryService = inject(CountryService);

  listing = input.required<CardListing | BookedListing>();
  cardMode = input<"landlord" | "booking">();
  loading = input<boolean>(false);

  deleteListing = output<CardListing>();
  cancelBooking = output<BookedListing>();

  bookingListing: BookedListing | undefined;
  cardListing: CardListing | undefined;
  categoryDisplayName:string| undefined;

  constructor() {
    this.listenToListing();
    this.listenToCardMode();
    this.setCategoryDisplayName();
  }

  onClickAction():void{
    if(this.cardMode()==='landlord' && this.cardListing){
      this.onDeleteListing(this.cardListing);
    }
    if(this.cardMode()==='booking' && this.bookingListing){
      this.onCancelBooking(this.bookingListing);
    }
  }

  onDeleteListing(displayCardListingDTO: CardListing) {
    this.deleteListing.emit(displayCardListingDTO);
  }

  onCancelBooking(bookedListing: BookedListing) {
    this.cancelBooking.emit(bookedListing);
  }

  onClickCard(publicId: string) {
    this.router.navigate(['listing'],
      {queryParams: {id: publicId}});
  }

  private listenToListing() {
    effect(() => {
      const listing = this.listing();
      const country =this.countryService.getCountryByCode(listing.location);
      if(country){
        this.listing().location = country.region + ", " + country.name.common
      }
    });
  }

  private listenToCardMode() {
    effect(() => {
      const cardMode = this.cardMode();
      if (cardMode && cardMode === "booking") {
        this.bookingListing = this.listing() as BookedListing
      } else {
        this.cardListing = this.listing() as CardListing;
      }
    });
  }

  private setCategoryDisplayName():void{
    if(this.cardMode()==='booking'){
      this.categoryDisplayName = this.categoryService.getCategoryByTechnicalName(this.cardListing?.bookingCategory!)?.displayName;
    }
  }

}
