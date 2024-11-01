import { LandLordStore } from "@landlord/store/landlord.store";
import { LandlordService } from "./landlord.service";
import { TestBed } from "@angular/core/testing";

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
});