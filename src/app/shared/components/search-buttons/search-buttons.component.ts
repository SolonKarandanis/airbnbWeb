import { CommonModule } from '@angular/common';
import { TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';


//COMPONENTS
import { ButtonComponent } from '@components/button/button.component';
import { FormGroup, FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { SavedSearchModel, SearchTypeEnum } from '@models/search.model';


// [disabled] ="!form.valid"
// [@buttonStateTrigger] = "searchForm.valid? 'valid':'invalid'"      *ngIf="isDisabled$ | async as isDisabled"

const components =[
  ButtonComponent
]

const modules =[
  CommonModule,
  TranslationModule,
  FormsModule,
  InputTextModule
]

@Component({
  selector: 'app-search-buttons',
  standalone:true,
  imports:[
    ...modules,
    ...components
  ],
  template: `
      <button
        app-button
        btnType="primary"
        type="button"
        (click)="handleSearchClick($event)"
        class="btn-shadow btn-sm w-40"
        [disabled]="isDisabled || isLoading">
          @if(isLoading){
            <span class="indicator-progress" [style.display]="'block'">
                {{ "GLOBAL.BUTTONS.LOADING" | translate }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          }
          @if(!isLoading){
            <span class="indicator-label">{{ "GLOBAL.BUTTONS.SEARCH" | translate }}</span>
          }
      </button>
      <button
        app-button
        btnType="primary"
        type="button"
        (click)="handleSaveSearchClick()"
        class="btn-shadow btn-sm w-40"
        [disabled]="isDisabled || isLoading">
          @if(isLoading){
            <span class="indicator-progress" [style.display]="'block'">
                {{ "GLOBAL.BUTTONS.LOADING" | translate }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          }
          @if(!isLoading){
            <span class="indicator-label">{{ "GLOBAL.BUTTONS.SAVE_SEARCH" | translate }}</span>
          }
      </button>
      <label
          for="saveSearchName"
          class="w-40"
          >{{ 'SAVED_SEARCHES.LABELS.WITH_TITLE' | translate }}:</label
      >
      <input
          type="text"
          class="p-inputtext-sm"
          pInputText
          name="saveSearchName"
          [(ngModel)]="saveSearchTitle"/>
      <button
        app-button
        btnType="danger"
        type="reset"
        class="btn-shadow btn-sm w-40"
        (click)="handleResetClick($event)">
          <ng-container *ngTemplateOutlet="resetBtnTemplate || defaultResetBtnLabel"></ng-container>
          <ng-template #defaultResetBtnLabel>
            <span class="indicator-label">{{ "GLOBAL.BUTTONS.RESET" | translate }}</span>
          </ng-template>
      </button>
  `,
  styleUrls: ['./search-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchButtonsComponent{

  constructor(private authService:AuthService){}

  protected saveSearchTitle = '';

  @Input() isLoading=false
  @Input() isDisabled=false
  @Input() searchType!: SearchTypeEnum;
  @Input() searchForm!: FormGroup;
  @Input() resetBtnTemplate!: TemplateRef<Record<string, unknown>>;

  @Output() searchClicked: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() resetClicked: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() saveSearchClicked: EventEmitter<SavedSearchModel> = new EventEmitter();


  handleSearchClick(event: MouseEvent): void {
    this.searchClicked.emit(event);
  }

  handleResetClick(event: MouseEvent): void {
      this.resetClicked.emit(event);
  }

  protected handleSaveSearchClick(): void{
    const savedSearchName = this.saveSearchTitle;
    const searchType = this.searchType;
    const username = this.authService.getUsername() as string;
    // const criteria = this.searchService.getCriteria(this.searchType,this.searchForm);
    

    // const savedSearch: SavedSearchModel = {
    //   savedSearchName,
    //   searchType,
    //   username,
    //   criteria,
    // };
    // this.saveSearchClicked.emit(savedSearch);
    this.resetSearchTitle();
  }

  private resetSearchTitle(): void {
    this.saveSearchTitle = '';
  }

}
