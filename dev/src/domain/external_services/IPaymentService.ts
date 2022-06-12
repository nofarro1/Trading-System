import {Result} from "../../utilities/Result";

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

    handshake(): Promise<boolean>;
    pay(paymentDetails: PaymentDetails): Promise<Result<number>>;
    cancelPay(transactionId:string):Promise<Result<boolean>>;
}