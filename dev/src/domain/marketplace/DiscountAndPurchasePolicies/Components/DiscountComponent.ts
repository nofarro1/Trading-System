import {Product} from "../../Product";
import {Entity} from "../../../../utilities/Entity";

export interface DiscountComponent extends Entity{
    calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][];
    predicate: (products: [Product, number, number][]) => boolean;
    get id(): number ;
    get description(): string;
}