import {Product} from "./Product";


export class Shop {
    ID: number;
    founderID: string;
    personnelIDs: string[];
    products: Product[];

    constructor(shopID: number, founderID: string, personnelIDs: string[], products: Product[]) {
        this.ID = shopID;
        this.founderID = founderID;
        this.personnelIDs = personnelIDs;
        this.products = products;
    }

}