import { LoadingModel } from "./BaseModel.model";
import { CategoryName } from "./category.model";
import { BathsVO, BedroomsVO, BedsVO, DescriptionVO, GuestsVO, PriceVO, TitleVO } from "./listing-vo.model";
import { NewListingPicture } from "./picture.model";


export interface NewListingInfo {
    guests: GuestsVO,
    bedrooms: BedroomsVO,
    beds: BedsVO,
    baths: BathsVO
}
  
export interface NewListing {
    category: CategoryName,
    location: string,
    infos: NewListingInfo,
    description: Description,
    price: PriceVO
}

export interface Description {
    title: TitleVO,
    description: DescriptionVO
}
  
export interface CreatedListing {
    publicId: string
}
  
export interface DisplayPicture {
    file?: string,
    fileContentType?: string,
    isCover?: boolean
}

export interface CardListing extends LoadingModel {
    price: PriceVO,
    location: string,
    cover: DisplayPicture,
    bookingCategory: CategoryName,
    publicId: string,
}
  
export interface Listing {
    description: Description,
    pictures: Array<DisplayPicture>,
    infos: NewListingInfo,
    price: PriceVO,
    category: CategoryName,
    location: string,
    landlord: LandlordListing
}
  
export interface LandlordListing {
    firstname: string,
    imageUrl: string,
}