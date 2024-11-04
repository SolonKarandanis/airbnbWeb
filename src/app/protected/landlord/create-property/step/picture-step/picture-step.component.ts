import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewListingPicture } from '@models/picture.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [
    FontAwesomeModule,
    InputTextModule,
    ButtonModule,
  ],
  template: `
    <div class="mb-3">
      <h1 class="mb-1">Add some photos of your house</h1>
      <h2 class="mt-0">You'll need 5 photos to get started. You can add more later</h2>
      <div class="flex align-items-center justify-content-center mt-3">
        <input type="file" pInputText id="pictures"
          placeholder="Pictures"
          accept=".jpg,.jpeg,.png,.svg"
          multiple="multiple"
          (change)="onUploadNewPicture($event.target)">
      </div>
    </div>
    @if (pictures()){
      <div class="mt-2 flex flex-wrap w-full h-full">
        @for (picture of pictures(); track picture.file.name){
          <div class="border-1 relative border-transparent border-round-3xl container-picture">
            <button class="absolute trash-btn p-button" (click)="onTrashPicture(picture)">
              <fa-icon icon="trash-can"></fa-icon>
            </button>
            <div class="border-1 border-transparent border-round-3xl bg-cover bg-no-repeat h-30rem w-full"
              [style.background-image]="'url(' + picture.urlDisplay + ')'"></div>
          </div>
        }
      </div>
    }
  `,
  styles: `
    .trash-btn {
      left: calc(100% - 70px);
      top: 10px;
    }

    .container-picture {
      width: 50%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureStepComponent {

  public pictures = input.required<NewListingPicture[]>();
  public picturesChange = output<NewListingPicture[]>();
  public stepValidityChange = output<boolean>();

  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget | null) {
    const picturesFileList = this.extractFileFromTarget(target);
    if(picturesFileList !== null) {
      for(let i = 0 ; i < picturesFileList.length; i++) {
        const picture = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewListingPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture)
          }
          this.pictures().push(displayPicture);
        }
      }
      this.picturesChange.emit(this.pictures());
      this.validatePictures();
    }
  }

  onTrashPicture(pictureToDelete: NewListingPicture) {
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1);
    this.validatePictures();
  }

  private validatePictures() {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }


}
