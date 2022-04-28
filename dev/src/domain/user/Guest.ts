import {UUIDGenerator} from "../Utils";


export class Guest {
    id: string


    constructor(id: string) {
        this.id = id;
    }

    static createNewGuest(){
        return new Guest(UUIDGenerator())
    }


}