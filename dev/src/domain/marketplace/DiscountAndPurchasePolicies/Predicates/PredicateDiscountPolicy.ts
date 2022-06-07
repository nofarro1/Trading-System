import {
    DiscountType,
    LogicalPolicy,
    PolicyType,
    ProductCategory,
    RelationType,
    SimplePolicyType
} from "../../../../utilities/Enums";
import {Guest} from "../../../user/Guest";
import {ShoppingBag} from "../../../user/ShoppingBag";
import {Product} from "../../Product";
import {Answer} from "../../../../utilities/Types";

export class PredicateDiscountPolicy {
    type: DiscountType; // Simple.Product
    object: number | ProductCategory | undefined; //0 => tomatoes id
    relation: RelationType; // <=
    value: number;// 5

    constructor(type: DiscountType, object: number | ProductCategory | undefined, relation: RelationType, value: number) {
        this.type = type;
        this.object = object;
        this.relation = relation;
        this.value = value;
    }

    checkPredicate(products: [Product, number, number][]): boolean {
        if (this.type === DiscountType.Product)
            return this.predicateOnProduct(products);
        if (this.type === DiscountType.Category)
            return this.predicateOnCategory(products);
        if (this.type === DiscountType.Bag)
            return this.predicateOnShoppingBag(products);
    }

    private predicateOnProduct(products: [Product, number, number][]): boolean {
        if (typeof this.object === "number") {
            for (let [p, price, quantity] of products)
                if (p.id === this.object)
                    return this.applyRelation(quantity, this.value);
        }
        else
            throw Error("Type problem");
    }

    private predicateOnCategory(products: [Product, number, number][]): boolean {
        if(this.object === ProductCategory.A || this.object === ProductCategory.B || this.object === ProductCategory.C){
            let filteredProducts = products.filter((curr: [Product, number, number]):boolean => {
                return curr[0].category === this.object;
            })
            let quantity = filteredProducts.length;
            return this.applyRelation(quantity , this.value);

        }
        else
            throw Error("Type problem");
    }

    private predicateOnShoppingBag(products: [Product, number, number][]): boolean {
        if(this.object === undefined) {
            let totalPrice =0;
            for (let [p, price, quantity] of products){
                totalPrice += price;
            }
            return this.applyRelation(totalPrice, this.value);
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