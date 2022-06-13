import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../../user/ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Guest} from "../../../../user/Guest";

export class ConditioningPurchasePolicies implements ImmediatePurchasePolicyComponent{
   private _id: number;
    private dependent: ImmediatePurchasePolicyComponent;
    private dependentOn: ImmediatePurchasePolicyComponent;
    private _description: string;

    constructor(id: number, dependent: ImmediatePurchasePolicyComponent, dependentOn: ImmediatePurchasePolicyComponent) {
        this._id = id;
        this.dependent = dependent ;
        this.dependentOn = dependentOn;
        this._description = `Could ${dependent.description} only if ${dependentOn}.`
    }

    get id(): number {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        let ans = this.dependent.CanMakePurchase(purchaseInfo)
        return ans.ok ? this.dependentOn.CanMakePurchase(purchaseInfo) : ans;
    }
}