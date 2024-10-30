import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-info-step-control',
  standalone: true,
  imports: [
    FaIconComponent,
  ],
  template: `
    <div class="info mt-5 flex align-items-center justify-content-between">
      <div>{{ title() }}</div>
      <div class="controls flex align-items-center">
        <button [disabled]="value() <= minValue()"
              [class.p-disabled]="value() <= minValue()"
              class="p-button p-button-secondary p-ripple p-button-icon-only p-button-rounded p-button-outlined" (click)="onDecrement()">
          <fa-icon [icon]="'minus'"></fa-icon>
        </button>
        <div class="value ml-3 mr-3 text-center">{{value()}}</div>
        <button class="p-button p-button-secondary p-ripple p-button-icon-only p-button-rounded p-button-outlined"
            (click)="onIncrement()">
            <fa-icon [icon]="'plus'"></fa-icon>
        </button>
      </div>
    </div>
    @if(separator()){
      <div class="mt-4 border-top-1 border-gray-200"></div>
    }
  `,
  styles: `
    .value {
      width: 15px;
    }
  `
})
export class InfoStepControlComponent {

  title = input.required<string>();
  value = input.required<number>();
  minValue = input<number>(0);
  separator = input<boolean>(true);

  valueChange = output<number>();

  onIncrement() {
    this.valueChange.emit(this.value() + 1);
  }

  onDecrement() {
    this.valueChange.emit(this.value() - 1);
  }
}
