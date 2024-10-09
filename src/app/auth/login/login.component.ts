import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { faLock,faUser,faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from 'src/app/core/store/auth/auth-store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitCredentialsDTO } from '@models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    FontAwesomeModule,
    ReactiveFormsModule,
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
              placeholder="User name" 
              formControlName="username">
          </div>
          <div class="login__field">
            <fa-icon class="login__icon" [icon]="faLock"></fa-icon>
            <input 
              type="password" 
              class="login__input" 
              placeholder="Password" 
              formControlName="password">
          </div>
          <button 
            type="button" 
            class="button login__submit"
            (click)="login()">
            <span class="button__text">Log In</span>
            <fa-icon class="button__icon" [icon]="faChevronRight"></fa-icon>
				  </button>
          <div class="register-forget opacity">
            <a href="">REGISTER</a>
            <a href="">FORGOT PASSWORD</a>
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

  private authStore = inject(AuthStore);
  private fb= inject(FormBuilder);

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
    this.authStore.login(request);
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
}
