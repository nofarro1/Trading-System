

export class BuyerOrder {
    userId: string;
    shopOrderIDs: number[];
    totalPrice: number;
    creationDate: number;


    constructor(userId: string, shopOrderIDs: Array<number>, totalPrice: number, creationDate: number) {
        this.userId = userId;
        this.shopOrderIDs = shopOrderIDs;
        this.totalPrice = totalPrice;
        this.creationDate = creationDate;
    }
}