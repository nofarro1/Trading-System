

export class SimpleGuest {
    readonly _guestID: string;

    constructor(guestID: string) {
        this._guestID = guestID;
    }


    get guestID(): string {
        return this._guestID;
    }
}