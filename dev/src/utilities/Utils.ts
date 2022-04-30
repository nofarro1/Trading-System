

export type Id = string | number

export const UUIDGenerator = (): Id => {
    const head:string = Date.now().toString();
    const tail:string = Math.random().toString().substring(2);

    return head + tail
}


export enum ExternalServiceType {
    Payment,
    Delivery,
}