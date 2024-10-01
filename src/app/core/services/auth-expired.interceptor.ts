import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthStore } from "../store/auth/auth-store";
import jwtService from "./jwt.service";
import { AUTHENTICATE_REQUEST } from "../guards/SecurityConstants";
import { tap } from 'rxjs/operators';


export const authExpired: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
  ) => {
    const authStore = inject(AuthStore);
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

    return next(request).pipe(
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
                        authStore.logout()
                    }

                }
            }
        })
    )
  }