import {ShoppingCart} from "../../../src/domain/marketplace/ShoppingCart";
import {Shop} from "../../../src/domain/marketplace/Shop";
import {Product} from "../../../src/domain/marketplace/Product";

class TestShoppingCart extends ShoppingCart{
    constuctor(shoppingCart: ShoppingCart){}
}

let sb1: ShoppingCart;
let p1: Product;
let p2: Product;

describe('ShoppingBag- Products', ()=>{
    beforeEach(function(){
        sb1= new ShoppingCart;
        sb1.addBag(0);
        p1= new Product("Ski", 0, "Chees", "Yami chees 2", 5.9, 5.9);
    })
    sb1.addProduct()
})