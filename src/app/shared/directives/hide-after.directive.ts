import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

class HideAfterContext{
  public $implicit = 1000;
  public ktHideAfter = 0;
  public counter = 0;
};

@Directive({
  selector: '[ktHideAfter]',
  standalone:true
})
export class HideAfterDirective implements OnInit{
  @Input('ktHideAfter')
  set delay(value:number|null){
    this._delay=value ?? 0;
    this.context.ktHideAfter= this.context.counter= this._delay /1000; //convert to seconds
  }

  private _delay = 0;
  // *ktHideAfter="5000"
  @Input('ktHideAfterThen') placeholder: TemplateRef<unknown>|null = null;
  // *ktHideAfter="5000; then placeholder"
  // <ng-template #placeholder></ng-template>

  private context = new HideAfterContext();

  constructor(
    private viewContainerRef:ViewContainerRef,
    private template:TemplateRef<HideAfterContext>
  ) { }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template,this.context);
    const intervalId =setInterval(()=>{
      this.context.counter= this.context.counter - 1;
    },1000);
    setTimeout(()=> {
      this.viewContainerRef.clear();
      if(this.placeholder){
        this.viewContainerRef.createEmbeddedView(this.placeholder,this.context);
      }
      clearInterval(intervalId);
    },this._delay);
  }

  static ngTemplateContextGuard(dir:HideAfterDirective, ctx:unknown): ctx is HideAfterContext{
    return true;
  }

}
