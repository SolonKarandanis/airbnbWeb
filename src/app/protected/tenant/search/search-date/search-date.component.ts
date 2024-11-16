import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-search-date',
  standalone: true,
  imports: [],
  template: `
    <p>
      search-date works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDateComponent {

}
