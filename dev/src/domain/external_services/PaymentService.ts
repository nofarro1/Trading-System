import {IPaymentService, PaymentDetails} from "./IPaymentService";
import {Result} from "../../utilities/Result";
import {ServiceSettings} from "../../utilities/Types";
import axios from 'axios';


export class PaymentService implements IPaymentService {
    readonly _name: string;
    _settings: ServiceSettings;


    constructor(name: string, settings: ServiceSettings = {
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

    cancelPay(transactionId: string): Promise<Result<boolean>> {
        return Promise.resolve(undefined);
    }

    async handshake(): Promise<boolean> {
        try {
            const res = await axios.post(this.settings.url, {action_type: "handshake"});
            return res.data === "OK";
        } catch {
            return Promise.resolve(false);
        }


    }

    async pay(paymentDetails: PaymentDetails): Promise<Result<number>> {


        return Promise.resolve(undefined);
    }


}