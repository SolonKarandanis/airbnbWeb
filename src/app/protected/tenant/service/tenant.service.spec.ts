import { TenantStore } from "@tenant/store/tenant.store";
import { TenantService } from "./tenant.service";
import { TestBed } from "@angular/core/testing";
import { mockCreateBookingRequest, mockListingSearchRequest, mockPaging } from "src/app/testing/mockData";

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

    it('should execute get listings by booking and category', () =>{
        const pageRequest=mockPaging;
        const category="ALL";
        service.executeGetAllListingsByBookingAndCategory(category,pageRequest);

        expect(tenantStoreSpy.getAllListingsByBookingAndCategory).toHaveBeenCalledWith({category,pageRequest});
        expect(tenantStoreSpy.getAllListingsByBookingAndCategory).toHaveBeenCalledTimes(1);
    });

    it('should execute search listings', () =>{
        service.executeSearchListings(mockListingSearchRequest);

        expect(tenantStoreSpy.searchListings).toHaveBeenCalledWith(mockListingSearchRequest);
        expect(tenantStoreSpy.searchListings).toHaveBeenCalledTimes(1);
    });

    it('should execute get listing by id', () =>{
        const id = "1";
        service.executeGetListingById(id);

        expect(tenantStoreSpy.getListingById).toHaveBeenCalledWith(id);
        expect(tenantStoreSpy.getListingById).toHaveBeenCalledTimes(1);
    });

    it('should execute create a booking', () =>{
        service.executeCreateBooking(mockCreateBookingRequest);

        expect(tenantStoreSpy.createBooking).toHaveBeenCalledWith(mockCreateBookingRequest);
        expect(tenantStoreSpy.createBooking).toHaveBeenCalledTimes(1);
    });

    it('should execute check availability', () =>{
        const id = "1";
        service.executeCheckAvailability(id);

        expect(tenantStoreSpy.checkAvailability).toHaveBeenCalledWith(id);
        expect(tenantStoreSpy.checkAvailability).toHaveBeenCalledTimes(1);
    });

    it('should execute get tenant booked listings', () =>{
        service.executeGetTenantBookedListings();

        expect(tenantStoreSpy.getTenantBookedListings).toHaveBeenCalled();
        expect(tenantStoreSpy.getTenantBookedListings).toHaveBeenCalledTimes(1);
    });

    it('should execute get landlord booked listings', () =>{
        service.executeGetLandlordBookedListings();

        expect(tenantStoreSpy.getLandlordBookedListings).toHaveBeenCalled();
        expect(tenantStoreSpy.getLandlordBookedListings).toHaveBeenCalledTimes(1);
    });

    it('should execute cancel a booking', () =>{
        const bookingPublicId = "test";
        const listingPublicId = "test";
        const byLandlord = false;
        service.executeCancelBooking(bookingPublicId,listingPublicId,byLandlord);

        expect(tenantStoreSpy.cancelBooking).toHaveBeenCalledWith({bookingPublicId,listingPublicId,byLandlord});
        expect(tenantStoreSpy.cancelBooking).toHaveBeenCalledTimes(1);
    });
});