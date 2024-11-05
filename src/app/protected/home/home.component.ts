import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal } from '@angular/core';
import { CategoryService } from '../layout/navbar/category/category.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '@shared/card-listing/card-listing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '@tenant/service/tenant.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  template: `
    <p>
      home works!
    </p>
   
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

  protected vm = computed(()=>{
    const loading = this.loading();


    return {
      loading,

    }
  });


}
