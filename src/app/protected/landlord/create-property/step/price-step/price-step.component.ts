import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PriceVO } from '@models/listing-vo.model';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    FontAwesomeModule,
  ],
  template: `
    <div class="mb-3">
      <h1 class="mb-1">Now, set your price</h1>
      <h2 class="mt-0">You can change it anytime.</h2>
        <form #formPrice="ngForm" novalidate class="w-full">
          <span class="p-input-icon-left w-full relative">
            <fa-icon icon="dollar-sign" class="dollar absolute top-0"></fa-icon>
            <input #priceInput="ngModel" name="price" required min="1"
              class="w-full p-inputtext-lg" type="number" pInputText
              [ngModel]="price().value" (ngModelChange)="onPriceChange($event)"/>
            @if (priceInput.dirty && priceInput.hasError('required')) {
              <small id="price-required" class="text-primary">A price is required</small>
            } @else if (priceInput.dirty && priceInput.hasError('min')) {
              <small id="price-min" class="text-primary">The price can't be negative</small>
            } @else {
              <div class="placeholder-validation"></div>
            }
          </span>
        </form>
    </div>
  `,
  styles: `
    .dollar {
      transform: translate(18px, 19px);
    }

    .placeholder-validation {
      height: 21px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceStepComponent {

  public price = input.required<PriceVO>();

  public priceChange = output<PriceVO>();
  public stepValidityChange = output<boolean>();

  formPrice = viewChild(NgForm); 

  onPriceChange(newPrice: number) {
    this.priceChange.emit({value: newPrice});
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm() {
    if (this.formPrice) {
      return this.formPrice()?.valid!;
    } else {
      return false;
    }
  }

}
