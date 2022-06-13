import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";
import {inject, injectable, optional} from "inversify";
import {DeliveryDetails, IDeliveryService} from "./IDeliveryService";
import {ServiceSettings} from "../../utilities/Types";
import {TYPES} from "../../helpers/types";

@injectable()
export class DeliveryServiceAdaptor implements IDeliveryService {
    private _name: string;
    private _settings: ServiceSettings;
    private real: IDeliveryService | null;

    constructor(@inject("delivery") name: string,
                @inject(TYPES.DeliveryService) @optional() real: IDeliveryService | null = null,
                settings: ServiceSettings = {
                    min: 10000,
                    max: 100000,
                    url: "https://cs-bgu-wsep.herokuapp.com/"
                }) {
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

    editServiceSettings(settings: ServiceSettings): void {
        if(this.real !== null) this.real.editServiceSettings(settings);
        this.settings = settings;
    }

    makeDelivery(deliveryDetails: DeliveryDetails): Result<number> {
        logger.info("Delivery has been made successfully");
        return new Result<number>(true, 1, "Delivery was successful");
    }

    cancelSupply(transactionId: string): Promise<Result<boolean>> {
        if (this.real === null) {
            return Promise.resolve(Result.Ok(true, "delivery was cancelled"));
        } else {
            const handshake = this.real.handshake();
            if (handshake) {
                return this.real.cancelSupply(transactionId);
            } else {
                return Promise.reject(Result.Fail("failed to cancel delivery", -1));
            }
        }

    }

    async handshake(): Promise<boolean> {
        if (this.real === null) {
            return Promise.resolve(true);
        } else {
            return this.real.handshake();
        }
    }

    supply(deliveryDetails: DeliveryDetails): Promise<Result<number>> {
        if (this.real === null) {
            return Promise.resolve(this.makeDelivery(deliveryDetails))
        } else {
            const handshake = this.real.handshake();
            if (handshake) {
                return this.real.supply(deliveryDetails)
            } else {
                return Promise.reject(Result.Fail("failed to connect to delivery Service", -1));
            }
        }
    }
}