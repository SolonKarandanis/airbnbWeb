import { Component } from '@angular/core';

@Component({
  selector: 'app-error500',
  standalone: true,
  imports: [],
  template: `
    <h1 class="fw-bolder fs-4x text-gray-700 mb-10">System Error</h1>

    <div class="fw-bold fs-3 text-gray-400 mb-15">
      Something went wrong! <br />
      Please try again later.
    </div>
  `,
  styles: ``
})
export class Error500Component {

}
