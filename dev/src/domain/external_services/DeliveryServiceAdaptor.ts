import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";


export class DeliveryServiceAdaptor {

    makeDelivery(deliveryDetails: any): Result<void> {
        logger.info("Delivery has been made successfully");
        return new Result<void>(true, undefined, "Delivery was successful");
    }
}