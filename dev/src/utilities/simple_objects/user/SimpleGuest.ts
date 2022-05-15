

export class SimpleGuest {
    private readonly _guestID: number;

    constructor(guestID: number) {
        this._guestID = guestID;
    }


    get guestID(): number {
        return this._guestID;
    }
}