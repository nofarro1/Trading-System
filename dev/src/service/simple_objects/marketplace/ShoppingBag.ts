

export class ShoppingBag {
    userId: string;
    private shopID: string;
    private products: number[];


    constructor(userId: string, shopID: string, products: number[]) {
        this.userId = userId;
        this.shopID = shopID;
        this.products = products;
    }
}