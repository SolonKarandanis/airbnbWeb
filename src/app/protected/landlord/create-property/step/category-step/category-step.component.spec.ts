import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStepComponent } from './category-step.component';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from 'src/app/protected/layout/navbar/category/category.service';

describe('CategoryStepComponent', () => {
  let component: CategoryStepComponent;
  let fixture: ComponentFixture<CategoryStepComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [CategoryStepComponent,TranslateModule.forRoot()],
      providers:[
        {
          useValue: categoryServiceSpy,
          provide: CategoryService,
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
