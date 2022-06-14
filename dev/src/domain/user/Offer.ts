export class Offer{
    private readonly _id: number;
    private readonly _user: string;
    private readonly _shopId: number;
    private readonly _pId: number;
    private readonly _price: number;
    private _approvers: Map<string, boolean>;
    private _answer: boolean;

    constructor(id: number, userId: string, shopId: number,  pId: number, price: number, approvers: Set<string>){
        this._id= id;
        this._user= userId;
        this._shopId = shopId;
        this._pId= pId;
        this._price= price;
        this._approvers = new Map<string, boolean>();
        for (let owner of approvers){
            this._approvers.set(owner, false)
        }
        this._answer= true;
    }


    get id(): number {
        return this._id;
    }

    get pId(): number {
        return this._pId;
    }

    get price(): number {
        return this._price;
    }

    get answer(): boolean {
        return this._answer;
    }

    setAnswer(userId: string, value: boolean) {
        if(this._approvers.has(userId)){
            this._answer = this._answer && value;
            this._approvers.set(userId, true);
        }
        throw new Error("Only a shop owner can approve a price offer.")
    }

    isDone(){
        return [...this._approvers.values()].reduce((acc:boolean, curr:boolean)=> acc&&curr);
    }

    set approvers(value: Map<string, boolean>) {
        this._approvers = value;
    }
}