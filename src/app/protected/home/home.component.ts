import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal } from '@angular/core';
import { CategoryService } from '../layout/navbar/category/category.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '@tenant/service/tenant.service';
import { CardListing } from '@models/listing.model';
import { Paging } from '@models/search.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  template: `
   @if(vm(); as vm){
    <p>
      home works!
    </p>
   }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private tenantService = inject(TenantService);
  private categoryService = inject(CategoryService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private loading:Signal<boolean> = this.tenantService.isLoading;
  private searchResults:Signal<CardListing[]> = this.tenantService.searchResults;
  private totalCount:Signal<number|null> = this.tenantService.totalCount;

  private pageRequest: Paging = {limit:20,page:0};

  protected vm = computed(()=>{
    const loading = this.loading();
    const searchResults = this.searchResults();
    const totalCount = this.totalCount();

    return {
      loading,
      searchResults,
      totalCount
    }
  });


}
