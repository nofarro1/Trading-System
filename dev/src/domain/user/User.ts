import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";

export interface User{
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;

    getShoppingCart(): ShoppingCart;

    getMessageBox(): MessageBox;
}