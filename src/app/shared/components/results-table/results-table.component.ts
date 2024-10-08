import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODELS

//COMPONENTS
import { LinkComponent } from '../link/link.component';

//DIRECTIVES
import { VarDirective } from '../../directives/ng-var.directive';

//PRIMENG
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SearchTableColumn } from '@models/search.model';
import { BaseModel } from '@models/BaseModel.model';
import { TranslationModule } from 'src/app/i18n/translation.module';

const components =[
    LinkComponent,
]

const modules =[
    CommonModule,
    TableModule,
    PaginatorModule,
    TranslationModule,
]

const directives=[
    VarDirective,
]

@Component({
  selector: 'app-results-table',
  standalone:true,
  imports: [
    ...components,
    ...modules,
    ...directives,
],
  template: `
  <p-table
    #td
    [value]="tableItems"
    [totalRecords]="totalRecords"
    [rows]="resultsPerPage"
    [first]="first"
    [columns]="colTitles"
    (onLazyLoad)="handleLazyLoad($event)"
    [lazy]="lazy"
    [lazyLoadOnInit]="false"
    [(selection)]="selectedItems"
    [loading]="loading"
    [rowTrackBy]="trackById"
    [rowHover]="true"
    
    [paginator]="showTablePaginator"
    [rowsPerPageOptions]="rowsPerPageOptions"
    [showCurrentPageReport]="showTablePaginator"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
    <ng-template pTemplate="caption" >
        <div class="flexContainer">
            @if(showTableFilter){
                <div class="content">
                    <div class="search">
                        <input 
                            #searchInput type="search" 
                            class="search__input"
                            aria-label="search"
                            placeholder="search in results....."
                            (input)="applyFilterGlobal($event, 'contains',td)">
                            <button class="search__submit" aria-label="submit search"><i id="icon" class="fa fa-search"></i></button>
                    </div>
                </div> 
            }       
            @if(!showTablePaginator){
                <p-paginator  
                [rows]="resultsPerPage"
				[first]="first"
				[totalRecords]="totalRecords"
				[rowsPerPageOptions]="rowsPerPageOptions"
				[showCurrentPageReport]="true"
				(onPageChange)="handleLazyLoad($event)">
				</p-paginator>
                {{ 'GLOBAL.TABLES.RESULT_SUMMARY'  | translate: {totalRecords} }}
            }       
        </div>
        @if(showTableToolBar){
            <div class="table-toolbar">
                <button
                    type="button"
                    class="btn btn-sm btn-light-primary"
                    (click)="tableToolBarAction()">
                    <span
                        class="svg-icon svg-icon-3">
                    </span>
                    {{ 'GLOBAL.TABLES.ACTIONS.ADD' | translate }}
                </button>
            </div>
        }    
    </ng-template>
    <ng-template
        pTemplate="header"
        let-columns>
        <tr>
            @for(colTitle of columns; track colTitle.field){
                <th [pSortableColumn]="colTitle.enableSorting ? colTitle.field : null"
                    [pSortableColumnDisabled]="!colTitle.enableSorting"
                    [style]="colTitle.style">
                    @if (!colTitle.isCheckbox){
                        <span>{{ colTitle.title }}</span>
                    }
                    @else{
                        <span><p-tableHeaderCheckbox></p-tableHeaderCheckbox></span>
                    }
                    @if (colTitle.enableSorting){
                        <p-sortIcon field="{{ colTitle.field }}"></p-sortIcon>
                    }
                </th>
            }
        </tr>
    </ng-template>
    <ng-template
        pTemplate="emptymessage"
        let-columns>
        <tr>
            <td [attr.colspan]="columns.length">
                {{ 'GLOBAL.TABLES.NO_RESULTS' | translate }}
            </td>
        </tr>
    </ng-template>
    <ng-template
        pTemplate="body"
        let-tableItem>
        <tr>
            @for(col of colTitles; track col.field;){
                <td [style]="col.style">
                    @if(!col.isCheckbox){
                        <span>
                            @if(col.isLink){
                                <app-link [config]="col" [tableItem]="tableItem">
                                    @if(col.onlyIcon){
                                        <span class="{{ col.icon }}"></span>
                                    }
                                    @if(!col.onlyIcon){
                                        <span>
                                            @if(col.icon){
                                                <span class="{{ col.icon }} mr-2"></span>
                                            }
                                            {{ col.field ? tableItem[col.field] : '' }}
                                        </span>
                                    }
                                </app-link>
                            }
                            @if(!col.isStatus &&!col.isLink && !col.isDate && !col.isImage  && col.isTranslatable){
                                <span>{{ col.field ? (tableItem[col.field]) : '' }}</span>
                            }
                            @if(!col.isLink && !col.isDate && !col.isImage  && !col.isTranslatable ){
                                <span>{{ col.field ? tableItem[col.field] : '' }}</span>
                            }
                            @if(!col.isLink && col.isDate && !col.isImage){
                                <span>{{ (col.field ? tableItem[col.field] : '') | date : 'dd/MM/yyyy' }}</span>
                            }
                            @if(!col.isLink && !col.isDate && !col.isImage  && col.isTranslatable && col.isStatus && statusClasses){
                                <span class="badge" [ngClass]="getClass(col.field ? tableItem[col.field] : '')">
                                    {{col.field ? tableItem[col.field] : '' }}
                                </span>
                            }
                        </span> 
                    }
                    @if(col.isCheckbox){
                        <span>
                            <p-tableCheckbox [value]="tableItem"></p-tableCheckbox>
                        </span>
                    }   
                    @if(col.isButton){
                        <span>          
                        </span>
                    }
                    @if(col.isTableActions){
                        <span class="text-dark fw-bolder mb-1 fs-6">
                            @for(action of col.actions; track action.type;){
                                @switch(action.type){
                                    @case ('VIEW'){
                                        <ng-container
                                            *ngTemplateOutlet="viewBlock; context: {tableItem:tableItem, action:action }">
                                        </ng-container>
                                    }
                                    @case ('EDIT'){
                                        <ng-container
                                            *ngTemplateOutlet="editBlock; context: { tableItem:tableItem,action:action }">
                                        </ng-container>
                                    }
                                    @case ('DELETE'){
                                        <ng-container
                                            *ngTemplateOutlet="deleteBlock; context: {uuid:tableItem['uuid'] ,action:action }">
                                        </ng-container>
                                    }
                                    @default{

                                    }
                                }
                            }
                        </span>
                    }
                </td>   
            }
            <ng-template let-tableItem="tableItem" let-action="action" #viewBlock>
                <app-link [config]="action" [tableItem]="tableItem" cssClasses="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1  text-hover-primary">
                    <span
                        class="svg-icon svg-icon-3"></span>
                </app-link>
            </ng-template>
            <ng-template let-tableItem="tableItem" let-action="action" #editBlock>
                <button
                    data-tool-tip="Edit"
                    type="button"
                    (click)="action.callbackFn(tableItem)"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm
                      me-1  text-hover-primary">
                    <span
                      class="svg-icon svg-icon-3"></span>
                </button>
            </ng-template>
            <ng-template let-uuid="uuid" let-action="action" #deleteBlock>
                @if(action.isButton){
                    <button
                        type="button"
                        data-tool-tip="Delete"
                        (click)="action.callbackFn(uuid)"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm text-hover-primary">
                        <span
                        class="svg-icon svg-icon-3"></span>
                    </button>
                }
                @if(action.isLink){
                    <app-link [config]="action" [tableItem]="tableItem" cssClasses="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1  text-hover-primary">
                        <span
                            class="svg-icon svg-icon-3"></span>
                    </app-link>
                }        
            </ng-template>
        </tr>
    </ng-template>
    
  </p-table>
  `,
  styleUrls: ['./results-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsTableComponent {

    @Input() tableItems!:BaseModel[];
    @Input() colTitles: SearchTableColumn[] = [];
    @Input() totalRecords!: number;
    @Input() resultsPerPage = 10;
    @Input() first = 0;
    @Input() lazy = false;
    @Input() loading = false;
    @Input() statusClasses!:Map<string,string>;
    @Input() callbackFunctionToolBar!: (args?: any) => void;

    selectedItems!:BaseModel[];
    protected arrayObj = Array;
    protected rowsPerPageOptions:number[]=[10,20,50,100]; 
    public showTablePaginator = false;
    public showTableFilter = false;
    public showTableToolBar=false;

    @Output() tableStateChanged: EventEmitter<TableLazyLoadEvent> = new EventEmitter();
    @Output() itemsSelected!: EventEmitter<BaseModel[]>;


    protected trackById( li: BaseModel): string| number | undefined {
        return li ? li.publicId : undefined;
    }

    protected applyFilterGlobal($event:Event, stringVal:string,td:Table) {
        td.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    }

    protected handleLazyLoad(event: TableLazyLoadEvent): void {
        this.tableStateChanged.emit(event);
    }

    protected handleSelectItemsClicked(): void {
        this.itemsSelected.emit(this.selectedItems);
    }

    protected getClass(field:string){
        return this.statusClasses.get(field);
    }

    protected tableToolBarAction(uuid?:string){
        const fun = this.callbackFunctionToolBar(uuid);
        console.log(fun);
    }
}
