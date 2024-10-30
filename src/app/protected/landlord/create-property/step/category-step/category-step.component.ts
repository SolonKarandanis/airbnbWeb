import { Component, inject, input, OnInit, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Category, CategoryName } from '@models/category.model';
import { CategoryService } from 'src/app/protected/layout/navbar/category/category.service';

@Component({
  selector: 'app-category-step',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <div class="categories flex flex-column align-items-center">
      <h1>Which of these best describe your place?</h1>
      <div class="flex flex-wrap align-items-center justify-content-center">
        @for(categoryToDisplay of categories; track categoryToDisplay.technicalName){
          @if(categoryToDisplay.technicalName !== 'ALL'){
            <div class="card-step-1 cursor-pointer p-4 m-2 border-round-lg
              border-200 hover:border-800 flex flex-column align-items-start" 
              (click)="onSelectCategory(categoryToDisplay.technicalName)"
              [class.category-selected]="categoryName() == categoryToDisplay.technicalName">
              <fa-icon class="mb-2" [icon]="categoryToDisplay.icon" size="2x"></fa-icon>
              <div class="font-bold white-space-nowrap">{{categoryToDisplay.displayName}}</div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    @import "../../../../../assets/scss/airbnb-variables";

    .categories {
      
      .card-step-1 {
        min-width: 160px;
        width: 20%;
        box-shadow: 0 0 0 1px $border-color;
      }

      .card-step-1:hover, .category-selected {
        border-color: transparent;
        box-shadow: 0 0 0 2px $black;
      }

      .category-selected {
        background-color: #F7F7F7;
      }

    }
  `
})
export class CategoryStepComponent implements OnInit{

  private categoryService = inject(CategoryService);

  public categoryName = input.required<CategoryName>();

  public categoryChange = output<CategoryName>();
  public stepValidityChange = output<boolean>();

  public categories: Category[] | undefined;

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
  }

  onSelectCategory(newCategory: CategoryName): void {
    this.categoryChange.emit(newCategory);
    this.stepValidityChange.emit(true);
  }

}
