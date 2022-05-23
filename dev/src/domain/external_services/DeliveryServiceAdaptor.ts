import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";
import {inject, injectable} from "inversify";

@injectable()
export class DeliveryServiceAdaptor {
    private readonly _name: string;
    private _settings: any;

    constructor(@inject("DeliveryServiceName")name: string, settings: any = {}) {
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

    makeDelivery(deliveryDetails: any): Result<void> {
        logger.info("Delivery has been made successfully");
        return new Result<void>(true, undefined, "Delivery was successful");
    }
}