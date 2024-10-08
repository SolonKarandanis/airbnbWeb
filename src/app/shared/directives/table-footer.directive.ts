import { Directive, Input } from "@angular/core";

@Directive({
  selector: 'ktTableFooter ,[ktTableFooter]',
  exportAs: 'ktTableFooter',
  standalone:true
})
export class TableFooterDirective {

  // @Input('ktTableFooter')data!:TItem[] | '';
  
  constructor() { }

}
