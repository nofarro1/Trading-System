import Product from "../marketplace/Product";


export class ShopOrder {
    private id: number;
    private shopId: number;
    private products: Product[];
    private totalPrices: number;
    private creationTime: string;

    constructor(id: number, shopId: number, products: Product[], totalPrices: number, creationTime: string){
        this.id = id;
        this.shopId = shopId;
        this.products = products;
        this.totalPrices = totalPrices;
        this.creationTime = creationTime;
    }
}