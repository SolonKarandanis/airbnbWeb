import { HttpErrorResponse, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiControllers } from "../repository/ApiControllers";

@Injectable({
    providedIn: 'root',
})
export class HttpUtil {
    private readonly webApiEndpoint: string = environment.webApiEndpointLocal + '/';

    private readonly HttpErrorMessageExceptions: HttpErrorMessageException[] = [
        {
            urlRegExp: ApiControllers.SEARCH + '/[0-9]+/approval-settings',
            status: HttpStatusCode.NotFound,
        },
        {
            urlRegExp: ApiControllers.SEARCH + '\\?contractId=[0-9]+&supplierId=[0-9]+',
            status: HttpStatusCode.NotFound,
        },
        {
            urlRegExp: ApiControllers.SEARCH + '/eo',
            status: HttpStatusCode.Forbidden,
        },
        {
            urlRegExp: ApiControllers.SEARCH + '/ca',
            status: HttpStatusCode.Forbidden,
        },
        {
            urlRegExp: ApiControllers.SEARCH,
            status: HttpStatusCode.NotFound,
        },
    ];

    isHttpErrorMessageException(errorResponse: HttpErrorResponse): boolean {
        if (!errorResponse || !errorResponse.url) {
            return false;
        }

        const urlSuffix: string = errorResponse.url.replace(this.webApiEndpoint, '');
        let check = false;
        let i = 0;

        while (!check && i < this.HttpErrorMessageExceptions.length) {
            const messageEx: HttpErrorMessageException = this.HttpErrorMessageExceptions[i];
            const statusMatch: boolean = messageEx.status === errorResponse.status;
            if (statusMatch) {
                const regexp = new RegExp(messageEx.urlRegExp);
                check = regexp.test(urlSuffix);
            }
            i++;
        }

        return check;
    }

    /**
     * Get a files name from the Content-Disposition response header
     * @param headers The headers of the response
     * @returns The file's name if found, otherwise an empty string
     */
    getFileNameForContentDisposition(headers: HttpHeaders): string {
        const header: string | null = headers.get('Content-Disposition');

        if (header) {
            const hasFilename: boolean = header.includes('filename');
            return hasFilename ? header.split('"')[1] : '';
        } else {
            return '';
        }
    }
}

export interface HttpErrorMessageException {
    urlRegExp: string;
    status: HttpStatusCode;
}