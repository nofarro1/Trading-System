import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";

export interface User{
    _shoppingCart: ShoppingCart;

    get shoppingCart(): ShoppingCart;
}