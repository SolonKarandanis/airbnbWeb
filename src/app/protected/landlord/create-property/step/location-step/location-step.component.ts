import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LocationMapComponent } from './location-map/location-map.component';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [
    LocationMapComponent
  ],
  template: `
    <div class="mb-3">
      <h1 class="mb-1">Is the pin right in the spot?</h1>
      <h2 class="mt-0">Your address is only shared with guests after they've made a reservation</h2>
      <app-location-map 
        [location]="location()" 
        (locationChange)="onLocationChange($event)"></app-location-map>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationStepComponent {

  location = input.required<string>();

  locationChange = output<string>();
  stepValidityChange = output<boolean>();

  onLocationChange(location: string) {
    this.locationChange.emit(location);
    this.stepValidityChange.emit(true);
  }
}
