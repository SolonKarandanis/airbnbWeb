import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal, Signal } from '@angular/core';
import { CategoryService } from '../layout/navbar/category/category.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '@tenant/service/tenant.service';
import { CardListing } from '@models/listing.model';
import { Paging } from '@models/search.model';
import { Subscription } from 'rxjs';
import { Category } from '@models/category.model';

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
   }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy{

  private tenantService = inject(TenantService);
  private categoryService = inject(CategoryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private loading:Signal<boolean> = this.tenantService.isLoading;
  private searchResults:Signal<CardListing[]> = this.tenantService.searchResults;
  private totalCount:Signal<number|null> = this.tenantService.totalCount;

  private pageRequest: Paging = {limit:20,page:0};
  private categoryServiceSubscription: Subscription | undefined;

  constructor(){
    this.listenToGetAllCategory();
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
    const emptySearch = signal(false);

    return {
      loading,
      searchResults,
      totalCount
    }
  });

  private listenToGetAllCategory():void{
    this.categoryServiceSubscription=this.categoryService.changeCategoryObs.subscribe({
      next: (category: Category) =>{
        this.tenantService.executeGetAllListingsByBookingAndCategory(category.technicalName,this.pageRequest);
      }
    });
  }


}
