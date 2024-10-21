import { HttpRequest, provideHttpClient, HttpClient, HttpStatusCode } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LanguageInterceptor } from './language.interceptor';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

xdescribe('LanguageInterceptor', () => {
    let interceptor: LanguageInterceptor;
    let requestCloneSpy: jasmine.Spy;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;

    const mockUrl: string = 'test-url';

    beforeEach(() => {
        translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);
        translateServiceSpy.use.and.callThrough();

        TestBed.configureTestingModule({
            providers: [LanguageInterceptor, provideHttpClient(), provideHttpClientTesting(), HttpClient, { provide: TranslateService, useValue: translateServiceSpy }],
        });

        interceptor = TestBed.inject(LanguageInterceptor);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should add Lang-ISO header on each HTTP request', (done) => {
        const mockReq = new HttpRequest('GET', mockUrl);

        requestCloneSpy = spyOn(mockReq, 'clone');
        requestCloneSpy.and.callThrough();

        const next: any = {
            handle: (req: HttpRequest<any>) => {
                expect(req.headers.has('Lang-ISO')).toBeTrue();
                expect(req.headers.get('Lang-ISO')).toBe('en');
                return of({ status: HttpStatusCode.Ok } as Response);
            },
        };

        interceptor.intercept(mockReq, next).subscribe(() => {
            expect(requestCloneSpy).toHaveBeenCalled();
            done();
        });
    });
})