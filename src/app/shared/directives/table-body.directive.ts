import { Directive, Input } from "@angular/core";

@Directive({
  selector: 'ktTableBody ,[ktTableBody]',
  exportAs: 'ktTableBody',
  standalone:true
})
export class TableBodyDirective<TItem extends object> {
  @Input('ktTableBody')data!:TItem[] | '';

  constructor() { }

}
