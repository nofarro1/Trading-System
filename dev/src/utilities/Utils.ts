import {Result} from "./Result";


export type UserID = string | number

export const UUIDGenerator = (): UserID => {
    const head:string = Date.now().toString();
    const tail:string = Math.random().toString().substring(2);

    return head + tail
}


export enum ExternalServiceType {
    Payment,
    Delivery,
}