import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
  ],
  template: `
    <div class="flex align-items-center justify-content-center h-screen">
      <p-card header="Login" subheader="">
        <form >
          <div class="flex flex-column ">
            <span class="p-input-icon-left my-2">
              <i class="pi pi-user"></i>
              <input id="username" formControlName="username" type="text" pInputText placeholder="Username">
            </span>
            <div *ngIf="submitted && f['username'].errors" class="flex align-items-center justify-content-end">
              <small *ngIf="f['username'].errors['required']" id="username-help" class="p-error block flex align-items-center justify-content-end">Username is
                required.</small>
            </div>
            <span class="p-input-icon-left my-2">
              <i class="pi pi-key"></i>
              <input id="password" formControlName="password" type="password" pInputText placeholder="Password">
            </span>
            <div *ngIf="submitted && f['password'].errors" class="flex align-items-center justify-content-end">
              <small *ngIf="f['password'].errors['required']" id="passwword-help" class="p-error block flex align-items-center justify-content-end">Password is
                required.</small>
            </div>
          </div>
        </form>
        <p-divider></p-divider>
        <ng-template pTemplate="footer">
          <div class="flex align-items-center justify-content-center">
            <button pButton type="submit" form="loginForm" label="Submit" ></button>
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: ``
})
export class LoginComponent {

}
