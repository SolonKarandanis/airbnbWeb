import { TenantRepository } from "@tenant/repository/tenant.repository";
import { TenantStore } from "./tenant.store";
import { BookingRepository } from "@tenant/repository/booking.repository";
import { UtilService } from "@core/services/util.service";
import { SearchResult } from "@models/search.model";
import { TestBed } from "@angular/core/testing";

type TenantStore = InstanceType<typeof TenantStore>;

describe('TenantStore', () =>{
    let store: TenantStore;
    let tenantRepoSpy: jasmine.SpyObj<TenantRepository>;
    let bookingRepoSpy: jasmine.SpyObj<BookingRepository>;
    let utilServiceSpy: jasmine.SpyObj<UtilService>;
    let searchResult: SearchResult<any>;

    beforeEach(()=>{
        tenantRepoSpy = jasmine.createSpyObj('TenantRepository',[
            'getAllListingsByBookingAndCategory',
            'searchListings',
            'getListingById'
        ]);
        bookingRepoSpy = jasmine.createSpyObj('BookingRepository',[
            'createBooking',
            'checkAvailability',
            'getTenantBookedListings',
            'getLandlordBookedListings',
            'cancelBooking'
        ]);
        utilServiceSpy = jasmine.createSpyObj('UtilService',[
            'showMessage',
        ]);

        TestBed.configureTestingModule({
            providers:[
              {
                provide: TenantRepository,
                useValue: tenantRepoSpy,
              },
              {
                provide: BookingRepository,
                useValue: bookingRepoSpy,
              },
              {
                provide: UtilService,
                useValue: utilServiceSpy,
              },
            ]
        });

        store = TestBed.inject(TenantStore);

        searchResult = {
            countRows: 1,
            list: [],
        };
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
});