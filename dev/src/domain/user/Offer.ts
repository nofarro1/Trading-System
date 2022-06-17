export class Offer{
    private readonly _id: number;
    private readonly _user: string;
    private readonly _shopId: number;
    private readonly _pId: number;
    private _price: number;
    private _approves: Map<string, boolean>;
    private _answer: boolean;

    constructor(id: number, userId: string, shopId: number,  pId: number, price: number, approvers: Set<string>){
        this._id= id;
        this._user= userId;
        this._shopId = shopId;
        this._pId= pId;
        this._price= price;
        this._approves = new Map<string, boolean>();
        for (let owner of approvers){
            this._approves.set(owner, false)
        }
        this._answer= true;
    }


    get id(): number {
        return this._id;
    }


    get user(): string {
        return this._user;
    }

    get shopId(): number {
        return this._shopId;
    }

    get pId(): number {
        return this._pId;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get answer(): boolean {
        return this._answer;
    }

    setAnswer(userId: string, value: boolean) {
        if(this._approves.has(userId)){
            this._answer = this._answer && value;
            this._approves.set(userId, true);
        }
        throw new Error("Only a shop owner can approve a price offer.")
    }

    isDone(){
        return [...this._approves.values()].reduce((acc:boolean, curr:boolean)=> acc&&curr);
    }

    set approves(value: Map<string, boolean>) {
        this._approves = value;
    }

    resetApproves(){
        for (let i=0; i< this._approves.size; i++ ){
            this._approves[i]= false;
        }
    }

}