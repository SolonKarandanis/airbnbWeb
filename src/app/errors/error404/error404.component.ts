import { Component } from '@angular/core';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  template: `
    <h1 class="fw-bolder fs-4x text-gray-700 mb-10">Page Not Found</h1>

    <div class="fw-bold fs-3 text-gray-400 mb-15">
      The page you looked not found! <br />
      Plan your blog post by choosing a topic
    </div>
  `,
  styles: ``
})
export class Error404Component {

}
