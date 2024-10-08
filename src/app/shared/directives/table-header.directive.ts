import { Directive, Input } from "@angular/core";

@Directive({
  selector: 'ktTableHeader ,[ktTableHeader]',
  exportAs: 'ktTableHeader',
  standalone:true
})
export class TableHeaderDirective<TItem extends object> {

  @Input('ktTableHeader')data!:TItem[] | '';

  constructor() { }

}
