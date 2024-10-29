import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { filter, map } from 'rxjs/operators';
import { Category, CategoryName } from '@models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (isHome) {
      <div class="categories pt-3 mx-8">
        @for (category of categories; track category.technicalName) {
          @if (category.technicalName !== 'ALL') {
            <div class="flex flex-column align-items-center pb-3 category"
                (click)="onChangeCategory(category)" [class.category-activated]="category.activated">
              <fa-icon class="mb-1" [icon]="category.icon"></fa-icon>
              <div title="{{category.displayName}}" class="name">{{ category.displayName }}</div>
            </div>
          }
        }
      </div>
    }
  `,
  styles: `
    @import "./../../../../../assets/scss/airbnb-variables";

    .categories {
      -ms-overflow-style: none;
      scrollbar-width: none;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      overflow-x: scroll;
      gap: 30px;
      background-color: $white;

      .category {
        cursor: pointer;
        border-bottom: 2px transparent solid;

        fa-icon {
          font-size: 1.4rem;
        }

        .name {
          text-align: center;
          font-size: 0.8rem;
          white-space: nowrap;
          letter-spacing: 0.25px;
        }

        .name::before {
          display: block;
          content: attr(title);
          font-weight: bold;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
      }

      .category-activated {
        border-bottom: 2px $dark solid;
        font-weight: bold;
      }

      .category:hover {
        .name {
          font-weight: bold;
        }
        border-bottom: 2px $border-color solid;
      }
    }
  `
})
export class CategoryComponent implements OnInit {

  categoryService = inject(CategoryService);

  categories: Category[] | undefined;

  currentActivateCategory = this.categoryService.getCategoryByDefault();

  isHome = true;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.listenRouter();
    this.currentActivateCategory.activated = false;
    this.fetchCategories();
  }

  private fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }

  private listenRouter() {
    this.router.events.pipe(
      filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd)
    )
      .subscribe({
        next: (evt: NavigationEnd) => {
          this.isHome = evt.url.split("?")[0] === "/";
          if (this.isHome && evt.url.indexOf("?") === -1) {
            const categoryByTechnicalName = this.categoryService.getCategoryByTechnicalName("ALL");
            this.categoryService.changeCategory(categoryByTechnicalName!);
          }
        },
      });

    this.activatedRoute.queryParams
      .pipe(
        map(params => params["category"])
      )
      .subscribe({
        next: (categoryName: CategoryName) => {
          const category = this.categoryService.getCategoryByTechnicalName(categoryName);
          if (category) {
            this.activateCategory(category);
            this.categoryService.changeCategory(category);
          }
        }
      })
  }

  private activateCategory(category: Category) {
    this.currentActivateCategory.activated = false;
    this.currentActivateCategory = category;
    this.currentActivateCategory.activated = true;
  }

  onChangeCategory(category: Category) {
    this.activateCategory(category);
    this.router.navigate([], {
      queryParams: {"category": category.technicalName},
      relativeTo: this.activatedRoute
    })
  }

}
