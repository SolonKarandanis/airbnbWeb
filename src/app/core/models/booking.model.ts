import { LoadingModel } from "./BaseModel.model";
import { PriceVO } from "./listing-vo.model";
import { DisplayPicture } from "./listing.model";
import {Dayjs} from "dayjs";

export interface BookedDates {
    startDate: string;
    endDate: string;
}

export interface Booking{
  publicId: string,
  startDate: string,
  endDate: string,
  totalPrice:number,
  numberOfTravelers:number,
  fkTenant: string,
  fkListing: string,
}
  
export interface BookedListing extends LoadingModel{
    location: string,
    cover: DisplayPicture,
    totalPrice: PriceVO,
    dates: BookedDates,
    bookingPublicId: string,
    listingPublicId: string,
}

export interface CreateBooking {
    startDate: string,
    endDate: string,
    listingPublicId: string,
}

export interface BookedDatesDTOFromClient {
    startDate: Dayjs,
    endDate: Dayjs,
}
  
export interface BookedListing {
    location: string,
    cover: DisplayPicture,
    totalPrice: PriceVO,
    dates: BookedDates,
    bookingPublicId: string,
    listingPublicId: string,
}