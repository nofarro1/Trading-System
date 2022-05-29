import {LogicalPolicy, PolicyType, ProductCategory, RelationType, SimplePolicyType} from "../../../../utilities/Enums";
import {Guest} from "../../../user/Guest";
import {ShoppingBag} from "../../../user/ShoppingBag";
import {Product} from "../../Product";
import {Answer} from "../../../../utilities/Types";

export class PredicatePurchasePolicy {
    type: SimplePolicyType; // Simple.Product
    object: number | ProductCategory | Guest; //0 => tomatoes id
    relation: RelationType; // <=
    value: number;// 5

    constructor(type: SimplePolicyType, object: number | ProductCategory | Guest, relation: RelationType, value: number) {
        this.type = type;
        this.object = object;
        this.relation = relation;
        this.value = value;
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