import {IPaymentService, PaymentDetails} from "./IPaymentService";
import {Result} from "../../utilities/Result";
import {ServiceSettings} from "../../utilities/Types";
import axios from 'axios';
import {inject, injectable} from "inversify";

@injectable()
export class PaymentService implements IPaymentService {
    readonly _name: string;
    _settings: ServiceSettings;


    constructor(@inject("RealPayment") name: string, settings: ServiceSettings = {
        min: 10000,
        max: 100000,
        url: "https://cs-bgu-wsep.herokuapp.com/"
    }) {
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

    async cancelPay(transactionId: string): Promise<Result<boolean>> {
        try {
            const res = await axios.post(this.settings.url,
                {
                    action_type: "cancel_pay",
                    transaction_id: transactionId
                });
            if(res.data === -1){
                return Promise.reject(Result.Fail("failed to cancel payment", false));
            }
            return Result.Ok(true, "supplement cancelled");
        } catch {
            return Promise.resolve(Result.Fail("failed to cancel delivery", false));
        }
    }

    async handshake(): Promise<boolean> {
        try {
            const res = await axios.post(this.settings.url, {action_type: "handshake"});
            return res.data === "OK";
        } catch {
            return Promise.reject(false);
        }


    }

    async pay(paymentDetails: PaymentDetails): Promise<Result<number>> {
        try{
            const handshake = await this.handshake();
            if (handshake) {
                return await axios.post(this.settings.url, paymentDetails)
            } else {
                return Promise.resolve(Result.Fail("failed to connect to payment Service", -1));
            }
        } catch (e) {
            return Promise.resolve(Result.Fail("failed to complete payment", -1));
        }

    }


}