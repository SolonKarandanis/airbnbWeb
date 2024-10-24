import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { faLock,faUser,faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitCredentialsDTO } from '@models/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FormErrorComponent } from '@components/form-error/form-error.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslationModule,
    ButtonModule,
    RouterLink,
    FormErrorComponent
  ],
  styles: `
    .container{
      display:flex;
      align-items:center;
      justify-content: center;
      min-height: 100vh;
    }

    .screen {		
      background: linear-gradient(90deg, #5D54A4, #7C78B8);		
      position: relative;	
      height: 600px;
      width: 360px;	
      box-shadow: 0px 0px 24px #5C5696;
    }

    .screen__content {
      z-index: 1;
      position: relative;	
      height: 100%;
    }

    .screen__background {		
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      -webkit-clip-path: inset(0 0 0 0);
      clip-path: inset(0 0 0 0);	
    }

    .screen__background__shape {
      transform: rotate(45deg);
      position: absolute;
    }

    .screen__background__shape1 {
      height: 520px;
      width: 520px;
      background: #FFF;	
      top: -50px;
      right: 120px;	
      border-radius: 0 72px 0 0;
    }

    .screen__background__shape2 {
      height: 220px;
      top: -172px;
      right: 0;	
      border-radius: 32px;
    }

    .screen__background__shape3 {
      height: 540px;
      width: 190px;
      background: linear-gradient(270deg, #5D54A4, #6A679E);
      top: -24px;
      right: 0;	
      border-radius: 32px;
    }

    .screen__background__shape4 {
      height: 400px;
      width: 200px;
      background: #7E7BB9;	
      top: 420px;
      right: 50px;	
      border-radius: 60px;
    }

    .login {
      width: 320px;
      padding: 30px;
      padding-top: 156px;
    }

    .login__field {
      padding: 20px 0px;	
      position: relative;	
    }

    .login__icon {
      position: absolute;
      top: 30px;
      color: #7875B5;
    }

    .login__input {
      border: none;
      border-bottom: 2px solid #D1D1D4;
      background: none;
      padding: 10px;
      padding-left: 24px;
      font-weight: 700;
      width: 75%;
      transition: .2s;
    }

    .login__input:active,
    .login__input:focus,
    .login__input:hover {
      outline: none;
      border-bottom-color: #6A679E;
    }

    .login__submit {
      background: #fff;
      font-size: 14px;
      margin-top: 30px;
      padding: 16px 20px;
      border-radius: 26px;
      border: 1px solid #D4D3E8;
      text-transform: uppercase;
      font-weight: 700;
      display: flex;
      align-items: center;
      width: 100%;
      color: #4C489D;
      box-shadow: 0px 2px 2px #5C5696;
      cursor: pointer;
      transition: .2s;
    }

    .login__submit:active,
    .login__submit:focus,
    .login__submit:hover {
      border-color: #6A679E;
      outline: none;
    }

    .button__icon {
      font-size: 24px;
      margin-left: auto;
      color: #7875B5;
    }

    .register-forget {
      margin: 1rem 0;
      display: flex;
      justify-content: space-between;
    }
    
    .opacity {
        opacity: 0.6;
    }
  `,
  template: `
  <div class="container">
    <div class="screen">
      <div class="screen__content">
        <form class="login" [formGroup]="loginForm">
          <div class="login__field">
            <fa-icon class="login__icon" [icon]="faUser"></fa-icon>
					  <input 
              type="text" 
              class="login__input" 
              placeholder="{{ 'LOGIN.LABELS.username' | translate }}" 
              formControlName="username"
              autocomplete="username">
              <app-form-error 
                [displayLabels]="isFieldValid('username')"
                [validationErrors]="loginForm.get('username')?.errors" />
          </div>
          <div class="login__field">
            <fa-icon class="login__icon" [icon]="faLock"></fa-icon>
            <input 
              type="password" 
              class="login__input" 
              placeholder="{{ 'LOGIN.LABELS.password' | translate }}" 
              formControlName="password"
              autocomplete="current-password">
              <app-form-error 
                [displayLabels]="isFieldValid('password')"
                [validationErrors]="loginForm.get('password')?.errors" />
          </div>
          <button 
            pButton 
            pRipple
            type="button"
            severity="info"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="w-full"
            [rounded]="true"
            label='{{ "LOGIN.BUTTONS.login" | translate }}' 
            (click)="login()"
            [loading]="isLoading()"
            [disabled]="isLoading()">
          </button>
          <div class="register-forget opacity">
            <a routerLink="/auth/registration">REGISTER</a>
            <a href="">{{ "LOGIN.BUTTONS.forgot-pass" | translate }}</a>
          </div>
        </form>
      </div>
      <div class="screen__background">
        <span class="screen__background__shape screen__background__shape4"></span>
        <span class="screen__background__shape screen__background__shape3"></span>		
        <span class="screen__background__shape screen__background__shape2"></span>
        <span class="screen__background__shape screen__background__shape1"></span>
		  </div>	
    </div>
  </div>
  `,  
})
export class LoginComponent implements OnInit{
  
  faLock = faLock;
  faUser=faUser;
  faChevronRight=faChevronRight;
  loginForm!: FormGroup;

  private authService = inject(AuthService);
  private fb= inject(FormBuilder);

  public isLoading = this.authService.isLoading;
  public isFormSubmitted=false;

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  public login():void{
    if (this.loginForm.invalid) {
			Object.keys(this.f).forEach(controlName =>
				this.f[controlName].markAsTouched()
			);
			return;
		}
    const request:SubmitCredentialsDTO={
      username: this.f['username'].value,
      password: this.f['password'].value,
    }
    this.authService.login(request);
  }

  private initForm():void{
    this.loginForm = this.fb.group({
      username:[
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password:[
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ]
    });
  }

  public clear(){
    this.loginForm.reset();
    this.isFormSubmitted=false;
    // this.inputChildren.forEach((input: FormInput) => {
    //   input.clear();
    // });
  }

  protected isFieldValid(field: string): boolean | undefined {
    const control = this.loginForm.get(field);
    return (!control?.valid && control?.touched) || (control?.untouched && this.isFormSubmitted);
  }

}
