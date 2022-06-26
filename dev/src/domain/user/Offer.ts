export class Offer{
    private readonly _id: number;
    private readonly _user: string;
    private readonly _shopId: number;
    private readonly _pId: number;
    private _price: number;
    private _approves: Map<string, [boolean, boolean]>;
    private _answer: boolean;

    constructor(id: number, userId: string, shopId: number,  pId: number, price: number, approves: Set<string>){
        this._id= id;
        this._user= userId;
        this._shopId = shopId;
        this._pId= pId;
        this._price= price;
        this._approves = new Map<string, [boolean, boolean]>(); //(owner name, [has answered, answer]
        for (let owner of approves){
            this._approves.set(owner, [false, true])
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
      let answer: boolean = true;
      for(let tuple of [...this._approves.values()]){
          if(tuple[0])
              answer = answer && tuple[1];
      }
      return answer;
    }

    setAnswer(userId: string, answer: boolean) {
        if(this._approves.has(userId)){
            this._approves.set(userId, [true, answer]);
        }
        else
            throw new Error("Only a shop owner can approve a price offer.");
    }

    isDone(){
        return [...this._approves.values()].filter((curr)=> !curr[0]).length===0;
    }


    approves_for_test(value: Map<string, [boolean, boolean]>) {
        this._approves = value;
    }

    set approves(value: Set<string>) {
        let newApproves = new Map<string, [boolean, boolean]>();
        for (let owner of value){
            let ans = this._approves.get(owner);
            if(this._approves.has(owner) && ans)
                newApproves.set(owner, ans);
            else
                newApproves.set(owner, [false, true]);
        }
        this._approves = newApproves;
    }

    resetApproves(){
        let keys = this._approves.keys();
        for(let key of keys){
            this._approves.set(key, [false, true]);
        }
    }


    getApproves(): Map<string, [boolean, boolean]> {
        return this._approves;
    }
}