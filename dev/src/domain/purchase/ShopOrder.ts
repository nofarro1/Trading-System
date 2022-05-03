import { Product } from "../marketplace/Product";



export class ShopOrder {
    private id: number;
    private shopId: number;
    private products: Product[];
    private totalPrice: number;
    private creationTime: string;

    constructor(id: number, shopId: number, products: Product[], totalPrices: number, creationTime: string){
        this.id = id;
        this.shopId = shopId;
        this.products = products;
        this.totalPrice = totalPrices;
        this.creationTime = creationTime;
    }

    getId(): number { return this.id; }

    getShopId(): number { return this.shopId; }

    getProducts(): Product[] { return this.products; }

    setProducts(products: Product[]): void {
        products = products;
    }

    getTotalPrice(): number { return this.totalPrice; }

    setTotalPrice(totalPrice: number): void {
        this.totalPrice = totalPrice;
    }

    getCreationTime(): string { return this.creationTime; }

    setCreationTime(creationTime: string){
        this.creationTime = creationTime;
    }

}