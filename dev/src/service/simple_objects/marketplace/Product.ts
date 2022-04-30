

export class Product {
    shopID: number;
    productID: number;
    productName: string;
    productQuantity: number;


    constructor(shopID: number, productID: number, productName: string, productQuantity: number) {
        this.shopID = shopID;
        this.productID = productID;
        this.productName = productName;
        this.productQuantity = productQuantity;
    }
}