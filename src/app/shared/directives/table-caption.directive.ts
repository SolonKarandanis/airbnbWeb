import { Directive, Input } from "@angular/core";

@Directive({
  selector: 'ktTableCaption ,[ktTableCaption]',
  exportAs: 'ktTableCaption',
  standalone:true
})
export class TableCaptionDirective {
  // @Input('ktTableCaption')data!:TItem[] | '';

  constructor() { }

}
