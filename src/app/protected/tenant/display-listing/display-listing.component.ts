import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AvatarComponent } from '../../layout/navbar/avatar/avatar.component';
import { BookDateComponent } from '@tenant/book-date/book-date.component';
import { TenantService } from '@tenant/service/tenant.service';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../layout/navbar/category/category.service';
import { CountryService } from '@landlord/service/country.service';
import { DisplayPicture, Listing } from '@models/listing.model';
import { map } from 'rxjs';
import { VarDirective } from '@shared/directives/ng-var.directive';

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    AvatarComponent,
    BookDateComponent,
    VarDirective,
  ],
  styles: `
    .gallery{
      display: grid;
      grid-template-columns: repeat(8,1fr);
      grid-template-rows: repeat(6, 5vw);
      grid-gap: 10px;

      .cover {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 1;
        grid-row-end: 7;
        border-top-left-radius: 1.5rem;
        border-bottom-left-radius: 1.5rem;
      }
      .gallery-picture-2 {
        grid-column-start: 5;
        grid-column-end: 7;
        grid-row-start: 1;
        grid-row-end: 4;
      }

      .gallery-picture-3 {
        grid-column-start: 7;
        grid-column-end: 9;
        grid-row-start: 1;
        grid-row-end: 4;
        border-top-right-radius: 1.5rem;
      }

      .gallery-picture-4 {
        grid-column-start: 5;
        grid-column-end: 7;
        grid-row-start: 4;
        grid-row-end: 7;
      }

      .gallery-picture-5 {
        grid-column-start: 7;
        grid-column-end: 9;
        grid-row-start: 4;
        grid-row-end: 7;
        border-bottom-right-radius: 1.5rem;
      }
    }

    ol{
      list-style-type: circle;
      margin-block-start: 0.3em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 0;
      unicode-bidi: isolate;

      li {
        display: inline-block;
        margin-right: 6px;
      }

      fa-icon {
        font-size: 3px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  `,
  template: `
    @if(vm(); as vm){
      @if (vm.listing  && !vm.loading){
        <ng-container *ngVar="vm.listing as listing">
          <h1>{{ listing.description.title.value }}</h1>
          <div class="gallery">
            @for (picture of listing.pictures; track picture.file; let index = $index){
              <div class="border-1 border-transparent bg-cover bg-center bg-no-repeat h-full w-full"
                  [class.cover]="picture.isCover"
                  [ngClass]="'gallery-picture-'+ (index + 1)"
                  [style.background-image]="'url(' + 'data:' + picture.fileContentType + ';base64,' + picture.file + ')'">
              </div>
            }
          </div>
          <div class="flex justify-content-between mt-4">
            <div id="content" class="flex-grow-1 mr-7">
              <div class="text-xl font-bold">{{ listing.location }}</div>
              <ol>
                <li>{{ listing.infos.guests.value }} guests</li>
                <li>
                  <fa-icon icon="circle"></fa-icon>
                  <span>{{ listing.infos.bedrooms.value }} bedrooms</span>
                </li>
                <li>
                  <fa-icon icon="circle"></fa-icon>
                  <span>{{ listing.infos.beds.value }} beds</span>
                </li>
                <li>
                  <fa-icon icon="circle"></fa-icon>
                  <span>{{ listing.infos.baths.value }} baths</span>
                </li>
              </ol>
              <div class="border-1 my-4 w-full border-solid border-200"></div>
              <div class="flex justify-content-start align-items-center" *ngVar="vm.category as category">
                <fa-icon class="ml-2" [icon]="category?.icon!" size="2x"></fa-icon>
                <div class="ml-4">This house is of type {{ category?.displayName }}</div>
              </div>
              <div class="border-1 my-4 w-full border-solid border-200"></div>
              <div class="landlord flex justify-content-start align-items-center">
                <app-avatar [imageUrl]="listing.landlord.imageUrl" avatarSize="avatar-xl"></app-avatar>
                <div class="font-bold ml-3">Hosted by {{ listing.landlord.firstname }}</div>
              </div>
              <div class="border-1 my-4 w-full border-solid border-200"></div>
              <div>{{ listing.description.description.value }}</div>
            </div>
            <app-book-date  [listing]="listing"></app-book-date>
          </div>
        </ng-container>
      }

      @if (vm.loading) {
        <div class="flex justify-content-center align-items-center">
          <fa-icon class="ml-2 text-primary" icon="circle-notch" size="3x" animation="spin"></fa-icon>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayListingComponent implements OnInit {

  private tenantService = inject(TenantService);
  private activatedRoute = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private countryService = inject(CountryService);

  private loading:Signal<boolean> = this.tenantService.isLoading;
  private currentPublicId:Signal<string | null>= this.tenantService.currentPublicId;

  
  protected vm = computed(()=>{
    const loading = this.loading();
    const listing = this.tenantService.selectedListing();
    let category
    if(listing ){
      const country =this.countryService.getCountryByCode(listing.location);
      listing.location = country.region + ", " + country.name.common
      listing.pictures = this.putCoverPictureFirst(listing.pictures);
      category = this.categoryService.getCategoryByTechnicalName(listing.category);
    }

    return {
      loading,
      listing,
      category,
    }
  });

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(params => params['id'])
    ).subscribe({
      next: publicId => this.fetchListing(publicId)
    })
  }

  private fetchListing(publicId: string){
    this.tenantService.executeGetListingById(publicId)
  }

  private putCoverPictureFirst(pictures:DisplayPicture[]) {
    const coverIndex = pictures.findIndex(picture => picture.isCover);
    if (coverIndex) {
      const cover = pictures[coverIndex];
      pictures.splice(coverIndex, 1);
      pictures.unshift(cover);
    }
    return pictures;
  }

}
