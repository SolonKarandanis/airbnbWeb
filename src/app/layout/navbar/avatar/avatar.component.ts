import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    NgClass,
    FontAwesomeModule
  ],
  template: `
  <div class="flex align-content-center">
    @if(imageUrl() != null) {
      <img src="{{imageUrl()}}" alt="user-avatar" class="border-round-3xl avatar"
          [ngClass]="avatarSize()">
    } @else {
      <div class="flex align-items-center justify-content-center unknow-user"
      [ngClass]="avatarSize()">
        <fa-icon [icon]="'user'" class="text-dark"></fa-icon>
      </div>
    }
  </div>
  `,
  styles: `
  .avatar {
    object-fit: contain;
  }

  .avatar-sm {
    width: 35.75px;
    height: 35.75px;
  }

  .avatar-xl {
    width: 50px;
    height: 50px;
  }
  `
})
export class AvatarComponent {

  imageUrl = input<string>();
  avatarSize = input<"avatar-sm" | "avatar-xl">();

}
