import { LandlordRepository } from "@landlord/repository/landlord.repository";
import { LandLordStore } from "./landlord.store";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { mockCardListing, mockCreatedListing, mockNewListing, mockNewListingPicture } from "src/app/testing/mockData";
import { Router } from "@angular/router";
import { UtilService } from "@core/services/util.service";

type LandLordStore = InstanceType<typeof LandLordStore>;

describe('LandLordStore', () =>{
    let store: LandLordStore;
    let landlordRepoSpy: jasmine.SpyObj<LandlordRepository>;
    let utilServiceSpy: jasmine.SpyObj<UtilService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(()=>{
        landlordRepoSpy = jasmine.createSpyObj('LandlordRepository',[
            'getAllListings',
            'deleteListing',
            'createListing',
        ]);
        utilServiceSpy = jasmine.createSpyObj('MessageService',[
            'showMessage',
        ]);
        routerSpy = jasmine.createSpyObj('Router',[
            'navigate',
        ]);


        TestBed.configureTestingModule({
            providers:[
              {
                provide: LandlordRepository,
                useValue: landlordRepoSpy,
              },
              {
                provide: UtilService,
                useValue: utilServiceSpy,
              },
              {
                provide: Router,
                useValue: routerSpy,
              },
            ]
        });

        store = TestBed.inject(LandLordStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should get all listings ', () =>{
        landlordRepoSpy.getAllListings.and.returnValue(of([mockCardListing]));

        store.getAllListings();

        expect(landlordRepoSpy.getAllListings).toHaveBeenCalled();
        expect(landlordRepoSpy.getAllListings).toHaveBeenCalledTimes(1);
    });

    it('should delete listing by id', () =>{
        const id ='1';
        landlordRepoSpy.deleteListing.and.returnValue(of());

        store.deleteListing(id);

        expect(landlordRepoSpy.deleteListing).toHaveBeenCalledWith(id);
        expect(landlordRepoSpy.deleteListing).toHaveBeenCalledTimes(1);
    });

    it('should create a new listing', () =>{
        landlordRepoSpy.createListing.and.returnValue(of(mockCreatedListing));

        store.createListing({pictures:[mockNewListingPicture], newListing:mockNewListing});

        expect(landlordRepoSpy.createListing).toHaveBeenCalledWith([mockNewListingPicture],mockNewListing);
        expect(landlordRepoSpy.createListing).toHaveBeenCalledTimes(1);
    });

    it('should set search results', () =>{
        const results = [mockCardListing];
        store.setSearchResults(results);

        expect(store.searchResults()).toBe(results);
        expect(store.totalCount()).toBe(results.length);
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });

    it('should set created listing public id', () =>{
        store.setCreatedListingPublicId('test');

        expect(store.createdListingPublicId()).toBe('test');
        expect(store.errorMessage()).toBe(null);
        expect(store.showError()).toBe(false);
        expect(store.loading()).toBe(false);
    });

});