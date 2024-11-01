import { LandLordStore } from "@landlord/store/landlord.store";
import { LandlordService } from "./landlord.service";
import { TestBed } from "@angular/core/testing";
import { mockNewListing, mockNewListingPicture } from "src/app/testing/mockData";

type LandLordStore = InstanceType<typeof LandLordStore>;

describe('LandlordService', () => {
    let service: LandlordService;
    let landLordStoreSpy: jasmine.SpyObj<LandLordStore>;

    beforeEach(() =>{
        landLordStoreSpy = jasmine.createSpyObj('LandLordStore',[
            'getAllListings',
            'deleteListing',
            'createListing',
            'loading',
            'selectedListing',
            'searchResults',
            'totalCount',
          ]);

        TestBed.configureTestingModule({
        providers:[
                {
                    provide: LandLordStore,
                    useValue: landLordStoreSpy,
                },
            ]
        });

        service = TestBed.inject(LandlordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should execute get all listings', () =>{
        service.executeGetAllListings();

        expect(landLordStoreSpy.getAllListings).toHaveBeenCalled();
        expect(landLordStoreSpy.getAllListings).toHaveBeenCalledTimes(1);
    });

    it('should execute delete listing', () =>{
        const id: string = '1';
        service.executeDeleteListing(id);

        expect(landLordStoreSpy.deleteListing).toHaveBeenCalledWith(id);
        expect(landLordStoreSpy.deleteListing).toHaveBeenCalledTimes(1);
    });

    it('should execute create listing', () =>{
        service.executeCreateListing([mockNewListingPicture],mockNewListing);

        expect(landLordStoreSpy.createListing).toHaveBeenCalledWith({pictures:[mockNewListingPicture],newListing:mockNewListing});
        expect(landLordStoreSpy.createListing).toHaveBeenCalledTimes(1);
    });
});