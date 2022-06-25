export class AppointmentAgreement{
    readonly member: string;
    private readonly _assigner: string;
    private _approves: Map<string, [boolean, boolean]>;
    private _answer: boolean;

    constructor(member: string, assigner: string, approves: Set<string>) {
        this. member = member;
        this._assigner = assigner;
        this._approves = new Map<string, [boolean, boolean]>(); //(owner name, [has answered, answer]
        for (let owner of approves){
            if(owner != this._assigner)
                this._approves.set(owner, [false, true]);
            else
                this._approves.set(owner, [true, true]);
        }
        this._answer = true;
    }

    get assigner(): string {
        return this._assigner;
    }

    getAnswer(): boolean {
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
            throw new Error("Only an exist shop owner can approve the appointment of a new shop owner");
    }

    isDone(){
        return [...this._approves.values()].filter((curr)=> !curr[0]).length===0;
    }

    approves_for_test(value: Map<string, [boolean, boolean]>) {
        this._approves = value;
    }

    getApproves(): Map<string, [boolean, boolean]> {
        return this._approves;
    }

    set approves(value: Set<string>) {
        let newApproves = new Map<string, [boolean, boolean]>();
        for (let owner of value){
            if(this._approves.has(owner))
                newApproves.set(owner, this._approves.get(owner));
            else
                newApproves.set(owner, [false, true]);
        }
        this._approves = newApproves;
    }

    resetApproves(){
        for (let i=0; i< this._approves.size; i++ ){
            this._approves[i]= [false, true];
        }
    }


}