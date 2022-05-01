

export class Shop {
    private ID: number;
    private founderID: string;
    private personnelIDs: string[];
    private products: number[];

    constructor(shopID: number, founderID: string, personnelIDs: string[], products: number[]) {
        this.ID = shopID;
        this.founderID = founderID;
        this.personnelIDs = personnelIDs;
        this.products = products;
    }

}