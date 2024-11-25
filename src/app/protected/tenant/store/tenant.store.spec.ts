import { TenantRepository } from "@tenant/repository/tenant.repository";
import { TenantStore } from "./tenant.store";
import { BookingRepository } from "@tenant/repository/booking.repository";
import { UtilService } from "@core/services/util.service";
import { SearchResult } from "@models/search.model";
import { TestBed } from "@angular/core/testing";
import { mockBookedDates, mockBookedListing, mockBooking, mockCardListing, mockCreateBookingRequest, mockListing, mockListingSearchRequest, mockPaging } from "src/app/testing/mockData";
import { of } from "rxjs";

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

    it('should get listings by booking and category', () =>{
      const pageRequest=mockPaging;
      const category="ALL";
      searchResult.list =[mockCardListing];
      tenantRepoSpy.getAllListingsByBookingAndCategory.and.returnValue(of(searchResult));

      store.getAllListingsByBookingAndCategory({category,pageRequest});

      expect(tenantRepoSpy.getAllListingsByBookingAndCategory).toHaveBeenCalledWith(category,pageRequest);
      expect(tenantRepoSpy.getAllListingsByBookingAndCategory).toHaveBeenCalledTimes(1);
    });

    it('should search listings', () =>{
      searchResult.list =[mockCardListing];
      tenantRepoSpy.searchListings.and.returnValue(of(searchResult));

      store.searchListings(mockListingSearchRequest);

      expect(tenantRepoSpy.searchListings).toHaveBeenCalledWith(mockListingSearchRequest);
      expect(tenantRepoSpy.searchListings).toHaveBeenCalledTimes(1);
    });

    it('should get listing by id', () =>{
      const id = "1";
      tenantRepoSpy.getListingById.and.returnValue(of(mockListing));
      bookingRepoSpy.checkAvailability.and.returnValue(of([mockBookedDates]));

      store.getListingById(id);

      expect(tenantRepoSpy.getListingById).toHaveBeenCalledWith(id);
      expect(tenantRepoSpy.getListingById).toHaveBeenCalledTimes(1);
      expect(bookingRepoSpy.checkAvailability).toHaveBeenCalledWith(id);
      expect(bookingRepoSpy.checkAvailability).toHaveBeenCalledTimes(1);
    });

    it('should create a booking', () =>{
      bookingRepoSpy.createBooking.and.returnValues(of(mockBooking));

      store.createBooking(mockCreateBookingRequest);

      expect(bookingRepoSpy.createBooking).toHaveBeenCalledWith(mockCreateBookingRequest);
      expect(bookingRepoSpy.createBooking).toHaveBeenCalledTimes(1);
    });

    it('should check availability', () =>{
      const id = "1";
      bookingRepoSpy.checkAvailability.and.returnValue(of([mockBookedDates]));

      store.checkAvailability(id);

      expect(bookingRepoSpy.checkAvailability).toHaveBeenCalledWith(id);
      expect(bookingRepoSpy.checkAvailability).toHaveBeenCalledTimes(1);
    });

    it('should get tenant booked listings', () =>{
      bookingRepoSpy.getTenantBookedListings.and.returnValue(of([mockBookedListing]));

      store.getTenantBookedListings();

      expect(bookingRepoSpy.getTenantBookedListings).toHaveBeenCalled();
      expect(bookingRepoSpy.getTenantBookedListings).toHaveBeenCalledTimes(1);
    });

    it('should get landlord booked listings', () =>{
      bookingRepoSpy.getLandlordBookedListings.and.returnValue(of([mockBookedListing]));

      store.getLandlordBookedListings();

      expect(bookingRepoSpy.getLandlordBookedListings).toHaveBeenCalled();
      expect(bookingRepoSpy.getLandlordBookedListings).toHaveBeenCalledTimes(1);
    });

    it('should cancel a booking', () =>{
      const bookingPublicId = "test";
      const listingPublicId = "test";
      const byLandlord = false;
      bookingRepoSpy.cancelBooking.and.returnValue(of());

      store.cancelBooking({bookingPublicId,listingPublicId,byLandlord});
      
      expect(bookingRepoSpy.cancelBooking).toHaveBeenCalledWith(bookingPublicId,listingPublicId,byLandlord);
      expect(bookingRepoSpy.cancelBooking).toHaveBeenCalledTimes(1);
    });

    it('should verify that it should set search results', () =>{
      searchResult.list = [mockCardListing];

      store.setSearchResults(searchResult.list,searchResult.countRows);

      expect(store.searchResults()).toBe(searchResult.list);
      expect(store.totalCount()).toBe(searchResult.countRows);
      expect(store.errorMessage()).toBe(null);
      expect(store.showError()).toBe(false);
      expect(store.loading()).toBe(false);
    });

    it('should verify that it should set selected listing', () =>{
      const id = "1";

      store.setSelectedListing(mockListing,id);

      expect(store.selectedListing()).toBe(mockListing);
      expect(store.currentPublicId()).toBe(id);
      expect(store.errorMessage()).toBe(null);
      expect(store.showError()).toBe(false);
      expect(store.loading()).toBe(false);
    });

    it('should verify that it should set selected booking', () =>{
      store.setSelectedBooking(mockBooking);

      expect(store.selectedBooking()).toBe(mockBooking);
      expect(store.errorMessage()).toBe(null);
      expect(store.showError()).toBe(false);
      expect(store.loading()).toBe(false);
    });

    it('should verify that it should set booked listings', () =>{
      const array = [mockBookedListing];
      store.setBookedListings(array);

      expect(store.bookedListings()).toBe(array);
      expect(store.errorMessage()).toBe(null);
      expect(store.showError()).toBe(false);
      expect(store.loading()).toBe(false);
    });

    it('should verify that it should set availability dates', () =>{
      const array =[mockBookedDates];
      store.setAvailabilityDates(array);

      expect(store.availabilityDates()).toBe(array);
      expect(store.errorMessage()).toBe(null);
      expect(store.showError()).toBe(false);
      expect(store.loading()).toBe(false);
    });
});