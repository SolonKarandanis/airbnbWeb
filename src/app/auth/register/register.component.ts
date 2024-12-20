import { CommonModule } from '@angular/common';
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
    CommonModule
  ],
  template: `
    <div class="body">
      <div class="container">
          <div class="title">{{ "REGISTER.title" | translate }}</div>
          <div class="content">
            <form [formGroup]="form">
              <div class="user-details">
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.username" | translate }}</span>
                  <input 
                    type="text" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.enter-username' | translate }}" 
                    autocomplete="username"
                    formControlName="username">
                    <app-form-error 
                      [displayLabels]="isFieldValid('username')"
                      [validationErrors]="form.get('username')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.email" | translate }}</span>
                  <input 
                    type="email" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.enter-email' | translate }}" 
                    autocomplete="email"
                    formControlName="email">
                    <app-form-error 
                      [displayLabels]="isFieldValid('email')"
                      [validationErrors]="form.get('email')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.password" | translate }}</span>
                  <input 
                    type="password" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.enter-password' | translate }}" 
                    autocomplete="new-password"
                    formControlName="password">
                    <app-form-error 
                      [displayLabels]="isFieldValid('password')"
                      [validationErrors]="form.get('password')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.confirm-password" | translate }}</span>
                  <input 
                    type="password" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.confirm-password' | translate }}"
                    autocomplete="new-password"
                    formControlName="confirmPassword">
                    <app-form-error 
                      [displayLabels]="isFieldValid('confirmPassword')"
                      [validationErrors]="form.get('confirmPassword')?.errors" />
                    <div *ngIf="!isFormValid()">
                        {{ form.errors?.['samePassword'].message}}
                    </div>
                </div>
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.first-name" | translate }}</span>
                  <input 
                    type="text" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.enter-first-name' | translate }}" 
                    formControlName="firstName">
                    
                    <app-form-error 
                      [displayLabels]="isFieldValid('firstName')"
                      [validationErrors]="form.get('firstName')?.errors" />
                </div>
                <div class="input-box">
                  <span class="details">{{ "REGISTER.LABELS.last-name" | translate }}</span>
                  <input 
                    type="text" 
                    placeholder="{{ 'REGISTER.PLACEHOLDERS.enter-last-name' | translate }}" 
                    formControlName="lastName">
                    <app-form-error 
                      [displayLabels]="isFieldValid('lastName')"
                      [validationErrors]="form.get('lastName')?.errors" />
                </div>
              </div>
              <div class="role-details">
                <span class="role-title">{{ "REGISTER.LABELS.role" | translate }}</span>
                <div class="category">
                  <label for="landlord">
                    <p-radioButton 
                      formControlName="role" 
                      value={{landlord}} 
                      inputId="landlord" />
                    <span class="role">{{ "REGISTER.LABELS.landlord" | translate }}</span>
                  </label>
                  <label for="tenant">
                    <p-radioButton 
                      formControlName="role" 
                      value={{tenant}} 
                      inputId="tenant" />
                    <span class="role">{{ "REGISTER.LABELS.tenant" | translate }}</span>
                  </label>
                </div>
              </div>
              <div class="button">
                <button 
                  type="submit"
                  (click)="registerUser()"
                  [disabled]="isLoading()">
                  {{ "REGISTER.BUTTONS.register" | translate }}
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
    if (this.form.invalid) {
			Object.keys(this.controls).forEach(controlName =>
				this.controls[controlName].markAsTouched()
			);
			return;
		}
    this.userService.executeRegisterUser(this.form);
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
