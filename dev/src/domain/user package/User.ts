import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";

export interface User{
    id: number;
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;

    getId(): number;

    getShoppingCart(): ShoppingCart;

    getMessageBox(): MessageBox;
}