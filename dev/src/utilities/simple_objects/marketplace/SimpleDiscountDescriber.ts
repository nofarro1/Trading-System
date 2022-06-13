

export class SimpleDiscountDescriber {
    private readonly _id: number;
    private readonly _description: string;


    constructor(id: number, description: string) {
        this._id = id;
        this._description = description;
    }


    get id(): number {
        return this._id;
    }

    get description(): string {
        return this._description;
    }
}