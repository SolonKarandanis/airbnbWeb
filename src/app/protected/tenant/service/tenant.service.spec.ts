import { TenantStore } from "@tenant/store/tenant.store";
import { TenantService } from "./tenant.service";
import { TestBed } from "@angular/core/testing";

type TenantStore = InstanceType<typeof TenantStore>;

describe('TenantService', () => {
    let service: TenantService;
    let tenantStoreSpy: jasmine.SpyObj<TenantStore>;

    beforeEach(() =>{
        tenantStoreSpy = jasmine.createSpyObj('TenantStore',[
            'getAllListingsByBookingAndCategory',
            'searchListings',
            'getListingById',
            'createBooking',
            'checkAvailability',
            'getTenantBookedListings',
            'getLandlordBookedListings',
            'cancelBooking',
            'loading',
            'searchResults',
            'totalCount',
            'selectedListing',
            'selectedBooking',
            'availabilityDates',
            'bookedListings',
            'currentPublicId',
        ]);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: TenantStore,
                useValue: tenantStoreSpy,
              },
            ]
        });

        service = TestBed.inject(TenantService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});