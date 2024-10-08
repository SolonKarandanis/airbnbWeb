import {
  Component,
  ChangeDetectionStrategy,
  Attribute,
  HostBinding
} from '@angular/core';

type ButtonType = 'primary' | 'secondary'| 'danger';
type ButtonSize = 'sm' | 'lg';

@Component({
  selector: 'button[app-button]',
  standalone:true,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./button.component.scss'],
  host:{ class:'btn'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent{

  // @Input() disabled: boolean = false;
  // @Output() pressed = new EventEmitter();

  constructor(
    @Attribute('btnType') public type: ButtonType = 'primary',
    @Attribute('size') public size: ButtonSize = 'lg'
  ) { }



  @HostBinding('class.btn-primary')
  get isPrimary(){
    return this.type === 'primary';
  }

  @HostBinding('class.btn-secondary')
  get isSecondary(){
    return this.type === 'secondary';
  }

  @HostBinding('class.btn-danger')
  get isDanger(){
    return this.type === 'danger';
  }

  @HostBinding('class.btn-sm')
  get isSm(){
    return this.size === 'sm';
  }

  @HostBinding('class.btn-lg')
  get isLg(){
    return this.size === 'lg';
  }

}
