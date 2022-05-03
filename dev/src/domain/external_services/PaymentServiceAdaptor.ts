import {logger} from "../../helpers/logger";
import {Result} from "../../utilities/Result";


export class PaymentServiceAdaptor {
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    makePayment(paymentDetails: any): Result<void> {
        logger.info("Payment has been made successfully");
        return new Result<void>(true, undefined, "Payment was successful");
    }
}