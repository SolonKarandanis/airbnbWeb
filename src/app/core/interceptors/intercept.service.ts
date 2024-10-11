import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { tap } from 'rxjs/operators';
import jwtService from "../services/jwt.service";
import { AuthStore } from "../store/auth/auth-store";
import { AUTHENTICATE_REQUEST } from "../guards/SecurityConstants";


@Injectable()
export class InterceptService implements HttpInterceptor{

    private authStore = inject(AuthStore);
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>>{
        const userToken = jwtService.getToken();
        if (request.context.get(AUTHENTICATE_REQUEST) && userToken){
            request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${userToken.trim()}`,
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
                            this.authStore.logout()
                        }

                    }
                }
            })
        );
      }
}