import {ShoppingBag} from "../../ShoppingBag";
import {Product} from "../../Product";

export interface DiscountComponent {
    calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][];
}