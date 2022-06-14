import {DeliveryDetails, IDeliveryService} from "./IDeliveryService";
import {Result} from "../../utilities/Result";
import {ServiceSettings} from "../../utilities/Types";
import axios from "axios";
import {inject, injectable} from "inversify";

@injectable()
export class DeliveryService implements IDeliveryService {
    readonly _name: string;
    _settings: ServiceSettings;

    constructor(@inject("RealDelivery") name: string, settings: ServiceSettings = {
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

    async cancelSupply(transactionId: string): Promise<Result<boolean>> {
        try {
            const res = await axios.post(this.settings.url,
                {
                    action_type: "cancel_supply",
                    transaction_id: transactionId
                });
            if(res.data === -1){
                return Promise.reject(Result.Fail("failed to cancel delivery", -1));
            }
            return Result.Ok(res.data, "supplement cancelled");
        } catch {
            return Promise.reject(Result.Fail("failed to cancel delivery", -1));
        }
    }

    async handshake(): Promise<boolean> {
        try {
            const res = await axios.post(this.settings.url, {action_type: "handshake"});
            return res.data === "OK";
        } catch {
            return Promise.resolve(false);
        }
    }

    async supply(deliveryDetails: DeliveryDetails): Promise<Result<number>> {
        try {
            const handshake = await this.handshake();
            if (handshake) {
                return await axios.post(this.settings.url, deliveryDetails)
            } else {
                return Promise.reject(Result.Fail("failed to connect to payment Service", -1));
            }
        } catch (e) {
            return Promise.reject(Result.Fail("failed to complete payment", -1));
        }
    }

}