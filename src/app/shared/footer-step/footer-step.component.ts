import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from '@i18n/translation.module';
import { Step } from '@landlord/create-property/step.model';

@Component({
  selector: 'app-footer-step',
  standalone: true,
  imports: [FontAwesomeModule,TranslationModule,],
  template: `
    <div class="placeholder"></div>
    <div class="controls flex justify-content-between py-3 border-top-1 px-4">
      @if (currentStep().idPrevious != null){
        <button 
          class="p-button p-button-link" 
          (click)="onPrevious()">
          {{ "GLOBAL.BUTTONS.back" | translate }}
        </button>
      }@else {
        <div></div>
      }
      @if (currentStep().idNext != null){
        <button 
          [disabled]="!currentStep().isValid" 
          [class.p-disabled]="!currentStep().isValid"
          class="p-button p-button-secondary" 
          id="next" 
          (click)="onNext()">
          {{ "GLOBAL.BUTTONS.next" | translate }}
        </button>
      } @else{
        <button 
          class="p-button flex align-items-center" 
          id="create-listing"
          (click)="onFinish()" 
          [disabled]="!isAllStepsValid() || loading()"
          [class.p-disabled]="!isAllStepsValid() || loading()">
          <div class="btn-create">{{ labelFinishedBtn() }}</div>
          @if (loading()) {
            <fa-icon class="ml-2" icon="circle-notch" animation="spin"></fa-icon>
          }
        </button>
      }
    </div>
  `,
  styles: `
    @import "./../../../assets/scss/airbnb-variables";

    .controls {
      background-color: $white;
      border-color: $border-color;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 70px;
      border-radius: 0 0 $dialogBorderRadius $dialogBorderRadius;
    }

    .placeholder {
      height: 70px;
    }
  `
})
export class FooterStepComponent {

  currentStep = input.required<Step>();
  loading = input<boolean>(false);
  isAllStepsValid = input<boolean>(false);
  labelFinishedBtn = input<string>("Finish");

  finish = output<boolean>();
  previous = output<boolean>();
  next = output<boolean>();

  onFinish() {
    this.finish.emit(true);
  }

  onPrevious() {
    this.previous.emit(true);
  }

  onNext() {
    this.next.emit(true);
  }

}
