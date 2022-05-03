import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";


export class DeliveryServiceAdaptor {
    private readonly _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    makeDelivery(deliveryDetails: any): Result<void> {
        logger.info("Delivery has been made successfully");
        return new Result<void>(true, undefined, "Delivery was successful");
    }
}