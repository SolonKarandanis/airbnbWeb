import { Component, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { TranslationModule } from '@i18n/translation.module';
import { BaseComponent } from '@shared/abstract/BaseComponent';
import { FormErrorComponent } from '@shared/components/form-error/form-error.component';
import { EmailDirective } from '@shared/directives/email.directive';
import { UserService } from '@user/service/user.service';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-register',
  standalone: true,
  styleUrls: ['./register.component.scss'],
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslationModule,
    FormErrorComponent,
    EmailDirective,
  ],
  template: `
    <div class="body">
      <div class="container">
          <div class="title">Registration</div>
          <div class="content">
            <form [formGroup]="form">
              <div class="user-details">
                <div class="input-box">
                  <span class="details">Username</span>
                  <input 
                    type="text" 
                    placeholder="Enter your username"
                    autocomplete="username"
                    formControlName="username">
                    <app-form-error 
                      [displayLabels]="isFieldValid('username')"
                      [validationErrors]="form.get('username')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">Email</span>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    autocomplete="email"
                    formControlName="email">
                    <app-form-error 
                      [displayLabels]="isFieldValid('email')"
                      [validationErrors]="form.get('email')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">Password</span>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    autocomplete="new-password"
                    formControlName="password">
                    <app-form-error 
                      [displayLabels]="isFieldValid('password')"
                      [validationErrors]="form.get('password')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">Confirm Password</span>
                  <input 
                    type="password" 
                    placeholder="Confirm your password" 
                    autocomplete="new-password"
                    formControlName="confirmPassword">
                    <app-form-error 
                      [displayLabels]="isFieldValid('confirmPassword')"
                      [validationErrors]="form.get('confirmPassword')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">First Name</span>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    formControlName="firstName">
                    <app-form-error 
                      [displayLabels]="isFieldValid('firstName')"
                      [validationErrors]="form.get('firstName')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">Last Name</span>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    formControlName="lastName">
                    <app-form-error 
                      [displayLabels]="isFieldValid('lastName')"
                      [validationErrors]="form.get('lastName')?.errors" />
                </div>
              </div>
              <div class="role-details">
                <span class="role-title">Role</span>
                <div class="category">
                  <label for="landlord">
                    <p-radioButton 
                      formControlName="role" 
                      value={{landlord}} 
                      inputId="landlord" />
                    <span class="role">Landlord</span>
                  </label>
                  <label for="tenant">
                    <p-radioButton 
                      formControlName="role" 
                      value={{tenant}} 
                      inputId="tenant" />
                    <span class="role">Tenant</span>
                  </label>
                </div>
              </div>
              <div class="button">
                <button 
                  type="submit"
                  (click)="registerUser()">
                  Register
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  `,
})
export class RegisterComponent extends BaseComponent implements OnInit{

  private userService = inject(UserService);
  private router= inject(Router);

  public isLoading = this.userService.isLoading;

  public landlord:RolesConstants = RolesConstants.ROLE_LANDLORD;
  public tenant:RolesConstants = RolesConstants.ROLE_TENANT;

  constructor(){
    super();
    this.listenToSuccessfullCreation();
  }

  ngOnInit(): void {
    this.userService.resetCreatedUserId();
    this.form = this.userService.initCreateUserForm();
  }

  registerUser():void{
    console.log(this.form.value);
    this.validateAllFormFields();
    // this.userService.executeRegisterUser(this.form);
  }

  private listenToSuccessfullCreation(){
    effect(()=>{
      const publicId = this.userService.createdUserId();
      if (publicId){
        this.navigateToLogin();
      }
    })
  }

  private navigateToLogin():void{
    this.router.navigate(["/login"]);
  }

}
