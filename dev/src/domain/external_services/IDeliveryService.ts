import {Result} from "../../utilities/Result";

export type DeliveryDetails = {
    action_type: "supply";
    name: string,
    address: string,
    city: string,
    country: string,
    zip: string
};
export interface IDeliveryService {
    editServiceSettings(settings: any);
    handshake(): Promise<boolean>;
    supply(deliveryDetails: DeliveryDetails):Promise<Result<number>>;
    cancelSupply(transactionId:string):Promise<Result<boolean>>;
}