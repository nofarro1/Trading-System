import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Offer extends BaseEntity{
    @PrimaryColumn({type: "int", name: "id"})
    private readonly _id: number;
    @Column({type: "text", name: "user"}) //TODO - FK
    private readonly _user: string;
    @PrimaryColumn({type: "int", name: "shopId"}) //TODO - FK
    private readonly _shopId: number;
    @Column({type: "int", name: "productId"}) //TODO - FK
    private readonly _pId: number;
    @Column({type: "int", name: "price"})
    private readonly _price: number;
    // @Column({type: "json", array: true, name: "approvers"})
    private _approvers: Map<string, boolean>;
    @Column({type: "boolean", name: "answer"})
    private _answer: boolean;

    constructor(id: number, userId: string, shopId: number,  pId: number, price: number, approvers: Set<string>){
        super();
        this._id= id;
        this._user= userId;
        this._shopId = shopId;
        this._pId= pId;
        this._price= price;
        this._approvers = new Map<string, boolean>();
        if(approvers) {
            for (let owner of approvers) {
                this._approvers.set(owner, false)
            }
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