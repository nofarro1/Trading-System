import {DiscountType, ProductCategory} from "./Enums";
import {Product} from "../domain/marketplace/Product";

export type Answer = {
    ok: boolean;
    message: string;
};

export type discountInf = {
    type: DiscountType;
    object: number | ProductCategory | undefined;
};

