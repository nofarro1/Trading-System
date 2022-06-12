import {ImmediatePurchasePolicyComponent} from "../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../user/ShoppingBag";
import {ProductCategory, RelationType, SimplePolicyType} from "../../../../utilities/Enums";
import {Answer} from "../../../../utilities/Types";
import {Guest} from "../../../user/Guest";
import {PredicatePurchasePolicy} from "../Predicates/PredicatePurchasePolicy";



export class SimplePurchase implements ImmediatePurchasePolicyComponent{
    private _id: number;
    private _predicate: PredicatePurchasePolicy;
    private _answer: Answer;

    constructor(id: number, type: SimplePolicyType, object: number | ProductCategory | Guest, relation: RelationType, value: number, msg: string ) {
        this._id = id;
        this._predicate = new PredicatePurchasePolicy(type, object, relation, value);
        this._answer={ok: true, message: msg};
    }

    get id(): number {
        return this._id;
    }

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        this._answer.ok = this._predicate.checkPredicate(purchaseInfo);
        return this._answer;
    }

    get description(): string {
        return this._predicate.description;
    }



}