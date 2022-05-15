import {logger} from "../../helpers/logger";
import {Result} from "../../utilities/Result";


export class PaymentServiceAdaptor {
    private readonly _name: string;

    private _settings: any;

    constructor(name: string, settings: any) {
        this._name = name;
        this._settings = settings;
    }

    get name(): string {
        return this._name;
    }

    get settings(): any {
        return this._settings;
    }

    set settings(value: any) {
        this._settings = value;
    }

    editServiceSettings(settings: any): void {
        this.settings = settings;
    }

    makePayment(paymentDetails: any): Result<void> {
        logger.info("Payment has been made successfully");
        return new Result<void>(true, undefined, "Payment was successful");
    }
}