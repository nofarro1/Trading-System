

export class ShopOrder {
    shopId: string;
    products: number[];
    totalPrice: number;
    creationDate: number;


    constructor(shopId: string, products: Array<number>, totalPrice: number, creationDate: number) {
        this.shopId = shopId;
        this.products = products;
        this.totalPrice = totalPrice;
        this.creationDate = creationDate;
    }
}