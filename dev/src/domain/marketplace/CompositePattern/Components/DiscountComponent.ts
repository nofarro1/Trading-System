import {Product} from "../../Product";

export interface DiscountComponent {
    calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][];
    predicate: (products: [Product, number, number][]) => boolean;

}