import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { faLock,faUser,faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitCredentialsDTO } from '@models/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { FormErrorComponent } from '@components/form-error/form-error.component';
import { BaseComponent } from '@shared/abstract/BaseComponent';

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
        <form class="login" [formGroup]="form">
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
                [validationErrors]="form.get('username')?.errors" />
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
                [validationErrors]="form.get('password')?.errors" />
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
            <a routerLink="/auth/registration">{{ "LOGIN.BUTTONS.register" | translate }}</a>
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
export class LoginComponent extends BaseComponent implements OnInit{
  
  faLock = faLock;
  faUser=faUser;
  faChevronRight=faChevronRight;

  private authService = inject(AuthService);
  private fb= inject(FormBuilder);
  private router= inject(Router);

  public isLoading = this.authService.isLoading;

  constructor(){
    super();
    this.listenToSuccessfullLogin();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public login():void{
    if (this.form.invalid) {
			Object.keys(this.controls).forEach(controlName =>
				this.controls[controlName].markAsTouched()
			);
			return;
		}
    const request:SubmitCredentialsDTO={
      username: this.controls['username'].value,
      password: this.controls['password'].value,
    }
    this.authService.login(request);
  }

  private initForm():void{
    this.form = this.fb.group({
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

}
