import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { CategoryService } from '../layout/navbar/category/category.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import {  ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '@tenant/service/tenant.service';
import { CardListing } from '@models/listing.model';
import { ListingSearchRequest, Paging } from '@models/search.model';
import { filter, Subscription } from 'rxjs';
import { Category } from '@models/category.model';
import { UtilService } from '@core/services/util.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  template: `
   @if(vm(); as vm){
    @if (vm.loading){
      <div class="flex justify-content-center align-items-center">
        <fa-icon class="ml-2 text-primary" icon="circle-notch" animation="spin" size="3x"></fa-icon>
      </div>
    }@else{
      <div class="listing-grid">
        @for (listing of vm.searchResults; track listing.publicId) {
          <app-card-listing [listing]="listing"></app-card-listing>
        }
      </div>
    }
    @if (!vm.loading && vm.emptySearch) {
      <div class="flex flex-column align-items-center justify-content-center h-10rem">
        <h1>No match for your search !</h1>
        <div class="text-xl">Try with different parameters</div>
        <button class="p-button mt-3" (click)="onResetSearchFilter()">Reset all the filters</button>
      </div>
    }
   }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit,OnDestroy{

  private tenantService = inject(TenantService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private utilService = inject(UtilService);

  private loading:Signal<boolean> = this.tenantService.isLoading;
  private searchResults:Signal<CardListing[]> = this.tenantService.searchResults;
  private totalCount:Signal<number|null> = this.tenantService.totalCount;
  private emptySearch:Signal<boolean> = computed(()=> this.totalCount() ===0 ? true:false );

  private pageRequest: Paging = {limit:20,page:0};
  private categoryServiceSubscription: Subscription | undefined;

  constructor(){
    this.listenToGetAllCategory();
  }

  ngOnInit(): void {
    this.startNewSearch();
  }

  ngOnDestroy(): void {
    if (this.categoryServiceSubscription) {
      this.categoryServiceSubscription.unsubscribe();
    }
  }
  

  protected vm = computed(()=>{
    const loading = this.loading();
    const searchResults = this.searchResults();
    const totalCount = this.totalCount();
    const emptySearch = this.emptySearch();

    return {
      loading,
      searchResults,
      totalCount,
      emptySearch
    }
  });

  onResetSearchFilter():void{
    const defaultCat = this.categoryService.getCategoryByDefault();
    this.router.navigate(["/"], {
      queryParams: {"category": defaultCat.technicalName}
    });
    this.categoryService.changeCategory(defaultCat);
  }

  private listenToGetAllCategory():void{
    this.categoryServiceSubscription=this.categoryService.changeCategoryObs.subscribe({
      next: (category: Category) =>{
        this.tenantService.executeGetAllListingsByBookingAndCategory(category.technicalName,this.pageRequest);
      }
    });
  }

  private startNewSearch(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => params['location']),
    ).subscribe({
      next: params => {
        const request:ListingSearchRequest={
          startDate: this.utilService.convertDateObjectsToAirbnbFormat(params["startDate"])!,
          endDate:this.utilService.convertDateObjectsToAirbnbFormat(params["endDate"])!,
          location:params['location'],
          guests:{value: params['guests']},
          bedrooms:{value: params['bedrooms']},
          beds:{value: params['beds']},
          baths:{value: params['baths']},
          paging:{
            page:0,
            limit:6
          }
        };
        this.tenantService.executeSearchListings(request);
      }
    })
  }
  


}
