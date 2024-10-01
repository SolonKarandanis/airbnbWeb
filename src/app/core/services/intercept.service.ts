import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { tap } from 'rxjs/operators';
import jwtService from "./jwt.service";

export const AUTHENTICATE_REQUEST = new HttpContextToken(() => true);

@Injectable()
export class InterceptService implements HttpInterceptor{

    // constructor(private store: Store<AppState>){}
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>>{
        const userToken = jwtService.getToken();
        if (request.context.get(AUTHENTICATE_REQUEST)){
            request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${userToken}`,
                  'Content-Type':  'application/json',
                },
                // withCredentials:true
              });
        }
        return next.handle(request).pipe(
            tap({
                next: (event: HttpEvent<any>) => {
                  if (event instanceof HttpResponse) {
                     // console.log('all looks good');
                    // http response status code
                    // console.log(event.status);
                  }
                }, 
                error: (error) => {
                    if(error instanceof HttpErrorResponse){
                        if(error.status === 403){
                            // redirect to login
                            // this.store.dispatch(logout());
                        }

                    }
                }
            })
        );
      }
}