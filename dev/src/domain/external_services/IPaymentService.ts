import {Result} from "../../utilities/Result";
import { ServiceSettings } from "../../utilities/Types";

export type PaymentDetails = {
    action_type:"pay",
    card_number: string,
    month: string,
    year: string,
    holder:string,
    ccv:string,
    id:string
};

export interface IPaymentService {
    editServiceSettings(settings: ServiceSettings):void;

    handshake(): Promise<boolean>;
    pay(paymentDetails: PaymentDetails): Promise<Result<number>>;
    cancelPay(transactionId:string):Promise<Result<boolean>>;
}