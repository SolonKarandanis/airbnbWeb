import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { faLock,faUser,faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitCredentialsDTO } from '@models/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
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
  styleUrls: ['./login.component.scss'],
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
  private router= inject(Router);

  public isLoading = this.authService.isLoading;
  public isFormSubmitted=false;

  constructor(){
    this.listenToSuccessfullLogin();
  }

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

  private listenToSuccessfullLogin():void{
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      if (loggedIn) {
        this.navigateToHome();
      } 
    });
  }

  private navigateToHome():void{
    this.router.navigate(['/home'], {
      queryParams: {},
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
