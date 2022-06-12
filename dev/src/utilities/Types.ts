import {DiscountType, ProductCategory} from "./Enums";

export type Answer = {
    ok: boolean;
    message: string;
};

export type discountInf = {
    type: DiscountType;
    object: number | ProductCategory | undefined;
};




export type ServiceSettings = {
    min: number;
    max: number;
    url: string;

}

