

export class Product {
    private shopID: number;
    private productID: number;
    private productName: string;
    private productQuantity: number;
    private description?: string;


    constructor(shopID: number, productID: number, productName: string, productQuantity: number, description?: string) {
        this.shopID = shopID;
        this.productID = productID;
        this.productName = productName;
        this.productQuantity = productQuantity;
        this.description = description;
    }
}