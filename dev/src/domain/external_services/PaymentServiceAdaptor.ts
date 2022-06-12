import {logger} from "../../helpers/logger";
import {Result} from "../../utilities/Result";
import {inject, injectable} from "inversify";
import {IPaymentService, PaymentDetails} from "./IPaymentService";
import {ServiceSettings} from "../../utilities/Types";

@injectable()
export class PaymentServiceAdaptor implements IPaymentService {
    private readonly _name: string;
    private _settings: ServiceSettings;
    private real: IPaymentService | null;

    constructor(@inject("PaymentServiceName") name: string,
                settings: ServiceSettings = {
                    min: 10000,
                    max: 100000,
                    url: "https://cs-bgu-wsep.herokuapp.com/"
                }, real: IPaymentService | null) {
        this._name = name;
        this._settings = settings;
        this.real = real;
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

    makePayment(paymentDetails: PaymentDetails): Result<number> {
        logger.info("Payment has been made successfully");
        return Result.Ok(1, "Payment was successful");
    }

    cancelPay(transactionId: string): Promise<Result<boolean>> {
        if (this.real === null) {
            return Promise.resolve(Result.Ok(true, "delivery was cancelled"));
        } else {
            const handshake = this.real.handshake();
            if (handshake) {
                return this.real.cancelPay(transactionId);
            } else {
                return Promise.reject(Result.Fail("failed to connect to payment Service", -1));
            }
        }
    }

    handshake(): Promise<boolean> {
        if (this.real === null) {
            return Promise.resolve(true);
        } else {
            return this.real.handshake();
        }
    }

    pay(paymentDetails: PaymentDetails):Promise< Result<number>> {
        if (this.real === null) {
            return Promise.resolve(this.makePayment(paymentDetails))
        } else {
            const handshake = this.real.handshake();
            if (handshake) {
                return this.real.pay(paymentDetails)
            } else {
                return Promise.reject(Result.Fail("failed to connect to payment Service", -1));
            }
        }
    }
}