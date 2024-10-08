import { ComponentRef, Directive, DoCheck, EmbeddedViewRef, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { LoaderComponent } from '@components/loader/loader.component';

@Directive({
  selector: '[appLoading]',
  standalone: true
})
export class LoadingDirective implements OnInit,DoCheck, OnChanges{
  private readonly templateRef = inject(TemplateRef);
  private readonly vcRef = inject(ViewContainerRef);
  @Input() appLoading = false;
  templateView!: EmbeddedViewRef<unknown>;
  loaderRef!: ComponentRef<LoaderComponent>;

  ngOnInit(): void {
    this.templateView = this.templateRef.createEmbeddedView({});
    this.loaderRef = this.vcRef.createComponent(LoaderComponent, {
      injector: this.vcRef.injector,
      projectableNodes: [this.templateView.rootNodes],
    });

    this.loaderRef.setInput('loading', this.appLoading);
  }

  ngOnChanges() {
    this.loaderRef?.setInput('loading', this.appLoading);
  }

  ngDoCheck() {
    this.templateView?.detectChanges();
  }
}
