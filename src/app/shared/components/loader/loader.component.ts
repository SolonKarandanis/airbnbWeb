import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <ng-content/>
      @if(loading){
        <div class="blocker">
          <p-progressSpinner/>
        </div>
      }
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  @Input() loading = false;
}
