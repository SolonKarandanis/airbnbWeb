import { AfterViewInit, Directive, ElementRef, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';


@Directive({
  selector: 'a:not([noBlank])[href]',
  standalone: true
})
export class ExternalLinkDirective implements 
OnInit, AfterViewInit, OnDestroy{

  private readonly elRef: ElementRef<HTMLAnchorElement> = inject(
    ElementRef,
  );

  // A MutationObserver is a class that can take an HTML element, 
  // observe changes to its attributes, child nodes, and so on, 
  // and notify us about them, allowing us to run callbacks on those events
  private readonly observer = new MutationObserver(() =>
    this.setAnchorTarget()
  );

  @HostBinding('target') 
  target!: '_blank' | '_self' | '_parent' | '_top' | '';

  ngOnInit(): void {
    this.setAnchorTarget();
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.elRef.nativeElement, {
      attributes: true, //attributes: true - we want to observe attribute changes
      subtree: false,   //subtree: false - we don't want to observe changes in child nodes
      childList: false, //childList: false - we don't want to observe changes in direct child nodes
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
  

  private setAnchorTarget() {
    if (this.isLinkExternal(this.elRef.nativeElement.href)) {
      this.target = '_blank';
    } else if (this.elRef.nativeElement.target === '_blank') {
      this.target = '';
    }
    else if(this.isLinkScrollable(this.elRef.nativeElement.href)){
      this.target = '';
    }
  }

  private isLinkExternal(url: string):boolean{
    return new URL(url).origin !== location.origin;
  }

  private isLinkScrollable(url: string):boolean{
    const {href} = new URL(url);
    const hash =href.split('/')[3];
    return hash.startsWith('#')
  }


}
