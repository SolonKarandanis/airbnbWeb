import { IconName } from "@fortawesome/free-solid-svg-icons"

export type CategoryName = "ALL" | "AMAZING_VIEWS" | "OMG" | "TREEHOUSES" | "BEACH" | "FARMS" | "TINY_HOMES" | "LAKES" 
| "CONTAINERS" | "CAMPING" | "CASTLE" | "SKIING" | "CAMPERS" | "ARCTIC" | "BOAT" | "BED_AND_BREAKFAST" | "ROOMS"
| "EARTH_HOMES" | "TOWER" | "CAVES" | "LUXES" | "CHEFS_KITCHEN"

export interface Category{
    icon: IconName;
    displayName: string;
    technicalName: CategoryName;
    activated: boolean;
}