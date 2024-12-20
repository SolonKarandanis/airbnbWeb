import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '@models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // usefull regexes
  private readonly unamePattern = '^[a-z0-9_-]{8,15}$';
  private readonly mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  private readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  private readonly pwdPattern = '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?!.*s).{6,12}$';
  // At least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character...
  // ...at least one special character, must be eight characters or longer for Strong strength
  private readonly strongPasswordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"\'()+,-./:;<=>?[\\]^_`{|}~])(?=.{10,})';


  private datePipe = new DatePipe('en');

  constructor(
    private router: Router,
    private messageService:MessageService,
    private translate:TranslateService,
  ) {}

  public get emailRegex():string{
    return this.emailPattern;
  }

  public get passwordRegex():string{
    return this.pwdPattern;
  }

  public get strongPasswordRegex():string{
    return this.strongPasswordPattern;
  }

  public get usernamePattern():string{
    return this.unamePattern;
  }

  public get mobilePhonePattern():string{
    return this.mobnumPattern;
  }

  public deepCopy(toBeCloned:object):object{
    const copiedObject= structuredClone(toBeCloned);
    return copiedObject;
  }

  public shallowCopy(toBeCloned:object):object{
    const copiedObject = Object.assign({}, toBeCloned);
    return copiedObject;
  }

  public nonNullObject(objectToTest:object):boolean{
    return Object.values(objectToTest).every((value)=> value !==null)
  }

  // Function definition with passing two arrays
  public findCommonElement<T>(array1:T[], array2:T[]):boolean {
         
    // Loop for array1
    for(let i = 0; i < array1.length; i++) {
         
        // Loop for array2
        for(let j = 0; j < array2.length; j++) {
             
            // Compare the element of each and
            // every element from both of the
            // arrays
            if(array1[i] === array2[j]) {
                // Return if common element found
                return true;
            }
        }
    }
    // Return if no common element exist
    return false;
  }

  /**
  * Marks all the controls of a form group as dirty
  * @param formGroup The form group that contains the controls to be marked as dirty
  */
  markAllAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
        formGroup.controls[key].markAsDirty();
    });
  }

  /**
   * Convert an Object to a SelectItem for use with PrimeNG components
   * @param obj The Object to convert
   * @param labelAttribute The object's attribute to use as a label
   * @returns The SelectItem based on the original Object
   */
  convertObjectToSelectItem(obj: any, labelAttribute: string): SelectItem {
    return {
        value: obj,
        label: obj[labelAttribute],
    };
  }

  /**
   * Convert an array of Objects to an array of SelectItems for use with PrimeNG components
   * @param obj The array of Objects to convert
   * @param labelAttribute The object's attribute to use as a label
   * @returns The array of SelectItems based on the original array of Objects
  */
  convertObjectArrToSelectItemArr(obj: any[], labelAttribute: string): SelectItem[] {
      return obj.map((obj: any) => this.convertObjectToSelectItem(obj, labelAttribute));
  }

  /**
   * Download a file.
   *
   * @param data - Array Buffer data
   * @param type - the MIME type of the file.
   * @param filename - The file's name.
   */
  triggerFileDownLoad(data: any, type: string, filename: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
  }

  /**
   * Creates a Blob object from a JSON object
   * @param object The JSON to convert
   * @returns The Blob
   */
  createJsonBlob(object: any): Blob {
    return new Blob([JSON.stringify(object)], {
        type: 'application/json',
    });
  }

  /**
   * Convert a Date object to the Airbnb specific format (this function is a wrapper of the Angular Date Pipe)
   * @param date The date object to convert
   * @returns The converted date string or null
   */
  convertDateObjectsToAirbnbFormat(date: Date): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss Z');
  }


  /**
   * Navigate to the home page after login, depending on the user's type
   * @param userData The user's data for validation
   * @param userType The user's type: {isBuyer: boolean, isSupplier: boolean, isPunchout?: boolean}
   * @returns Nothing only if the userData === null
   */
  goToHomePage(userData: UserModel, userType: userType) {
    if (userData === null) {
        return;
    }

    if (userType.isPunchout) {
        this.router.navigate(['/', 'advanced-search', 'items']);
    } else if (userType.isBuyer) {
        this.router.navigate(['catalogues', 'pending']);
    } else if (userType.isSupplier) {
        this.router.navigate(['catalogues', 'eo']);
    } else {
        this.router.navigate(['advanced-search']);
    }
  }

  showMessage(severity:string, details:string|string[]):void{
    if(!Array.isArray(details)){
      details =[details];
    }

    for(const detail of details){
      switch(severity){
        case 'error':{
          this.messageService.add({
            severity:'error',
            summary: this.translate.instant('GLOBAL.ERRORS.summary'),
            detail
          });
          break;
        }
        case 'success':{
          this.messageService.add({
            severity:'success',
            summary: this.translate.instant('GLOBAL.SUCCESS.summary'),
            detail
          });
          break;
        }
        case 'warn':{
          this.messageService.add({
            severity:'warn',
            summary: this.translate.instant('GLOBAL.WARNING.summary'),
            detail
          });
          break;
        }
      }
    }
  }
  


}


interface userType {
  isBuyer: boolean;
  isSupplier: boolean;
  isPunchout?: boolean;
}
