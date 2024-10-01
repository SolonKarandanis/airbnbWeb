import { Injectable,
	ComponentFactoryResolver,
	ApplicationRef,
	Injector,
	EmbeddedViewRef,
	ComponentRef,
	Type,
	TemplateRef, Inject, ViewContainerRef, ComponentFactory, Compiler, NgModuleRef, NgModule, Component, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
// import { JitCompiler } from '@angular/compiler';

export type Content<T> = string | TemplateRef<T> | Type<T>;
export type InputData$ = Observable<any[]> | Observable<HttpResponse<any>>| Observable<HttpResponse<any[]>> |Observable<any>;

@Injectable()
export class DynamicComponentService{

	constructor(private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		@Inject(DOCUMENT) private document: Document,
		private _compiler: Compiler,
		private _m: NgModuleRef<any>,
		private rendererFactory: RendererFactory2) { }

	public createComponentFactory(component: Type<unknown>): ComponentFactory<unknown>{
		return this.componentFactoryResolver.resolveComponentFactory(component);
	}

	public createComp(componentFactory: ComponentFactory<unknown>, viewContainer: ViewContainerRef): ComponentRef<unknown>{
		// console.log(viewContainer);
		return viewContainer.createComponent(componentFactory,viewContainer.length,undefined,[
			[
				document.createTextNode('First ng-content'),
			]
		]);
	}

	public destroyComp(compRef: ComponentRef<unknown>): void{
		compRef.destroy();

	}

	public createComponent<T>(componentFactory: ComponentFactory<unknown>,
							injector?:Injector,
							content?: Content<T>,
							viewCompContainer?: ViewContainerRef,
							viewContentContainer?:ViewContainerRef,
							context?:InputData$): ComponentRef<unknown> | undefined{
		// console.log(context);
		// const ngContent = this.resolveNgContent(content,viewCompContainer,context);
		// const rootSelectorOrNode=viewContentContainer.element;
		const componentRef = viewCompContainer?.createComponent(componentFactory,viewCompContainer.length,injector);
		// const componentRef = componentFactory.create(injector);
		// const contentRef = componentFactory.create(null, ngContent,rootSelectorOrNode);
		// viewContainer.insert(componentRef.hostView);
		// this.appRef.attachView(componentRef.hostView);
		// componentRef.hostView.detectChanges();
		// const { nativeElement } = componentRef.location;
		// console.log(nativeElement);
		// document.body.appendChild(nativeElement);

		// this.renderer = this.rendererFactory.createRenderer(null, null);
		// this.renderer.appendChild(nativeElement,this.tpl);
		return componentRef;
	}

	public createRenderer(): Renderer2 {
		const renderer = this.rendererFactory.createRenderer(null, null);
		return renderer;
	}

	public createViewInComponent(tempRef: TemplateRef<any>,viewContentContainer:ViewContainerRef,context:InputData$): EmbeddedViewRef<any>{
		return viewContentContainer.createEmbeddedView(tempRef,{
			tableData: context,
		})
	}

	public getContext(tempRef: TemplateRef<any>) {
			const embeddedViewRef = tempRef.createEmbeddedView(null);
			console.log(embeddedViewRef.context);
			return embeddedViewRef.context;
	}

	private resolveNgContent<T>(content: Content<T>,viewContainer: ViewContainerRef,context:InputData$): any[][] |undefined {
		if (typeof content === 'string') {
		  const element = this.document.createTextNode(content);
		  return [[element]];
		}

		if (content instanceof TemplateRef) {
			const tempRef = content as TemplateRef<any>;
		  	const embeddedViewRef =viewContainer.createEmbeddedView(tempRef, {
				  tableData: context,
			});
			// console.log(embeddedViewRef.context.tableData);

			// const embeddedViewRef = content.createEmbeddedView(tempRef, {$implicit: {description: 'some description'} });
		//   return [viewRef.rootNodes];
		  	return [embeddedViewRef.rootNodes];
		}
	}



	// create component using compiler!!!! Low Level Api!!!!!
	public createAndCompileComp<T>(viewContainer: ViewContainerRef, content: Content<T>,){
		// const ngContent = this.resolveNgContent(content,viewContainer);
		// ngContent
		const tmpCmp = Component({template: "template"})(class {});
		const tmpModule = NgModule({declarations: [tmpCmp]})(class {});

		this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
   			.then((factories) => {
     			const f = factories.componentFactories[0];
     			const cmpRef = viewContainer.createComponent(f);
     			cmpRef.instance.name = 'dynamic';
   		})
	}

}
