import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { CategoryService } from '../layout/navbar/category/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <p>
      home works!
    </p>
   
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {



  constructor(
    private categoryService:CategoryService,
  ){
    
  }


  // protected vm = computed(()=>{
  //   const loggedUser = this.authService.loggedUser();
  //   return {
  //     loggedUser
  //   }
  // });


}
