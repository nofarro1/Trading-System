import {UUIDGenerator} from "../../utilities/Utils";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { User } from "./User";


export class Guest implements User{
    id: number;
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;

    constructor(id: number, shoppingCart: ShoppingCart, messageBox: MessageBox){
        this.id = id;
        this.shoppingCart = shoppingCart;
        this.messageBox = messageBox;
    }

    getId(): number { return this.id; }

    getShoppingCart(): ShoppingCart { return this.shoppingCart; }

    getMessageBox(): MessageBox { return this.messageBox; }
}