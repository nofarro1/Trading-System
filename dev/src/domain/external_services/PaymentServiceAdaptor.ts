import {logger} from "../../helpers/logger";
import {Result} from "../../utilities/Result";


export class PaymentServiceAdaptor {

    makePayment(paymentDetails: any): Result<void> {
        logger.info("Payment has been made successfully");
        return new Result<void>(true, undefined, "Payment was successful");
    }
}