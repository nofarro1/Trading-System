import {DeliveryDetails, IDeliveryService} from "./IDeliveryService";
import {Result} from "../../utilities/Result";
import {ServiceSettings} from "../../utilities/Types";
import axios from "axios";



export class DeliveryService implements IDeliveryService{
    readonly _name: string;
    _settings: ServiceSettings;
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

    cancelSupply(transactionId: string): Promise<Result<boolean>> {
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

    supply(deliveryDetails: DeliveryDetails): Promise<Result<number>> {
        return Promise.resolve(undefined);
    }

}