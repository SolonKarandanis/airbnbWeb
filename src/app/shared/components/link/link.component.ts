import { Attribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchTableColumn, SearchTableColumnAction } from '@models/search.model';


@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
     <a [attr.data-tool-tip]="config.toolTip"
        [routerLink]="
        arrayObj.prototype.concat(
            config.routerLinkConfig?.preRoutes ? config.routerLinkConfig?.preRoutes : [],
            [config.dataFieldForRoute ? tableItem[config.dataFieldForRoute] : ''],
            config.routerLinkConfig?.postRoutes ? config.routerLinkConfig?.postRoutes : []
        )"
        [class]="cssClasses">
          <ng-content ></ng-content>
      </a>
  `,
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent  {

  @Input() config!:SearchTableColumn | SearchTableColumnAction;
  @Input() tableItem!:Record<string, unknown>;

  protected arrayObj = Array;

  constructor(
    @Attribute('cssClasses') public cssClasses:string='',
  ) { }
  


}
