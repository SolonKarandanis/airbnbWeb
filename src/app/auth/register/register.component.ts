import { Component, effect, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesConstants } from '@core/guards/SecurityConstants';
import { TranslationModule } from '@i18n/translation.module';
import { UserService } from '@user/service/user.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-register',
  standalone: true,
  styleUrls: ['./register.component.scss'],
  imports: [
    CheckboxModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslationModule,
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
                  <input type="text" placeholder="Enter your username">
                </div>
                <div class="input-box">
                  <span class="details">Email</span>
                  <input type="text" placeholder="Enter your email" >
                </div>
                <div class="input-box">
                  <span class="details">Password</span>
                  <input type="text" placeholder="Enter your password" >
                </div>
                <div class="input-box">
                  <span class="details">Confirm Password</span>
                  <input type="text" placeholder="Confirm your password" >
                </div>
                <div class="input-box">
                  <span class="details">First Name</span>
                  <input type="text" placeholder="Enter your name" >
                </div>
                <div class="input-box">
                  <span class="details">Last Name</span>
                  <input type="text" placeholder="Enter your name" >
                </div>
                <div class="input-box">
                  <span class="details">Phone Number</span>
                  <input type="text" placeholder="Enter your number" >
                </div>
              </div>
              <div class="role-details">
                <input type="radio" name="gender" id="dot-1">
                <input type="radio" name="gender" id="dot-2">
                <input type="radio" name="gender" id="dot-3">
                <span class="role-title">Role</span>
                <div class="category">
                  <label for="landlord">
                    <p-checkbox 
                      formControlName="role" 
                      value={{landlord}} 
                      inputId="landlord" />
                    <span class="role">Landlord</span>
                  </label>
                  <label for="tenant">
                    <p-checkbox 
                      formControlName="role" 
                      value={{tenant}} 
                      inputId="tenant" />
                    <span class="role">Tenant</span>
                  </label>
                </div>
              </div>
              <div class="button">
                <button type="submit">Register</button>
              </div>
            </form>
          </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit{

  private userService = inject(UserService);
  private router= inject(Router);

  public isLoading = this.userService.isLoading;
  public form!: FormGroup;

  public landlord:RolesConstants = RolesConstants.ROLE_LANDLORD;
  public tenant:RolesConstants = RolesConstants.ROLE_TENANT;

  constructor(){
    this.listenToSuccessfullCreation();
  }

  ngOnInit(): void {
    this.userService.resetCreatedUserId();
    this.form = this.userService.initCreateUserForm();
  }

  registerUser():void{

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
