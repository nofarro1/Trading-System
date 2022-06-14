import {ProductCategory, RelationType, SimplePolicyType} from "../../../../utilities/Enums";
import {Guest} from "../../../user/Guest";
import {ShoppingBag} from "../../../user/ShoppingBag";
import {Product} from "../../Product";

export class PredicatePurchasePolicy {
    type: SimplePolicyType; // Simple.Product
    object: number | ProductCategory | Guest; //0 => tomatoes id
    relation: RelationType; // <=
    value: number;// 5
    description: string;

    constructor(type: SimplePolicyType, object: number | ProductCategory | Guest, relation: RelationType, value: number) {
        this.type = type;
        this.object = object;
        this.relation = relation;
        this.value = value;
        let idMSG: string;
        switch (this.type) {
            case SimplePolicyType.Product:
                idMSG = `the number of products with id: ${this.object} `;
            case SimplePolicyType.Category:
                idMSG = `the number of products from ${this.object} `;
            case SimplePolicyType.ShoppingBag:
                idMSG = `the number of products in the bag `;
            case SimplePolicyType.UserInfo:
                idMSG = `the name of the user `

        }
        this.description = `The purchase can only be made if ${idMSG} is ${this.relation} then ${this.value}.`
    }

    checkPredicate(purchaseInfo: [ShoppingBag, Guest]): boolean {
            if (this.type === SimplePolicyType.Product)
                return this.predicateOnProduct(purchaseInfo);
            if (this.type === SimplePolicyType.Category)
                return this.predicateOnCategory(purchaseInfo);
            if (this.type === SimplePolicyType.ShoppingBag)
                return this.predicateOnShoppingBag(purchaseInfo);
            if (this.type === SimplePolicyType.UserInfo)
                return this.predicateOnUserInfo(purchaseInfo);
    }

    private predicateOnProduct(purchaseInfo: [ ShoppingBag,  Guest]): boolean {
        if (typeof this.object === "number") {
            let quantity = purchaseInfo[0].products.get(this.object)[1];
            return this.applyRelation(quantity , this.value);
        }
        else
            throw Error("Type problem");
    }

    private predicateOnCategory(purchaseInfo: [ShoppingBag, Guest]): boolean{
        if(this.object === ProductCategory.A || this.object === ProductCategory.B || this.object === ProductCategory.C){
            let products = Array.from(purchaseInfo[0].products.values());
            let filteredProducts = products.filter((curr: [Product, number]):boolean => {
                return curr[0].category === this.object;
            })
            let quantity = filteredProducts.length;
            return this.applyRelation(quantity , this.value);

        }
        else
            throw Error("Type problem");
    }

    private predicateOnShoppingBag(purchaseInfo: [ShoppingBag, Guest]): boolean {
        if(this.object === undefined) {
            let quantity = Array.from(purchaseInfo[0].products.values()).length;
            return this.applyRelation(quantity , this.value);
        }
        else
            throw Error("Type problem");
    }

    private predicateOnUserInfo(purchaseInfo: [ShoppingBag, Guest]): boolean {
        if(this.object instanceof Guest){
            let quantity = purchaseInfo[1].session.length;
            return this.applyRelation(quantity , this.value);
        }
        else
            throw Error("Type problem");
    }

    private applyRelation(quantity: any, value: number): boolean {
        switch(this.relation){

            case RelationType.Equal:
                return quantity === value;

            case RelationType.NotEqual:
                return quantity != value;

            case RelationType.GreaterThen:
                return quantity > value;

            case RelationType.GreaterThenOrEqual:
                return quantity >= value;

            case RelationType.LessThen:
                return quantity < value;

            case RelationType.LessThenOrEqual:
                return quantity <= value;
        }

    }
}