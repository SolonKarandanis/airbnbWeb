import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError, retry, timer } from 'rxjs';
import { ErrorService } from "../services/error.service";

export const httpError: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
  ) =>{
    const router = inject(Router);
    const errorService = inject(ErrorService);

    let retriesCount = 0;
    let maxRetries = 0;
    return next(request).pipe(
        retry({
            delay: (err) => {
                let status;

                if (err instanceof HttpErrorResponse && (err as HttpErrorResponse).status !== undefined) {
                    status = (err as HttpErrorResponse).status.toString();
                }

                // retry for unknown or 5XX errors
                if (retriesCount < maxRetries && status !== undefined && (status.startsWith('5') || status.startsWith('0'))) {
                    retriesCount++;
                    return timer(1000);
                } else {
                    // else throw error and continue with error handling
                    throw err;
                }
            },
        }),
        catchError((error: HttpErrorResponse) =>{
            const isMessageException: boolean = false;
            const errorArray: string[] = error.error;
            
            if (!isMessageException) {
                if (errorArray && errorArray.length > 0) {
                    errorArray.forEach((errorMessage: string) => {
                        errorService.showErrorMessage(error, errorMessage);
                    });
                } else {
                    console.log('else');
                    errorService.showErrorMessage(error);
                }

                if (error.status === 403) {
                    router.navigate(['/']);
                }
            }
            return throwError(() => error);
        })
    );
}
