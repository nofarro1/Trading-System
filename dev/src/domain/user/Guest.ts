import {Id, UUIDGenerator} from "../../utilities/Utils";


export class Guest {
    id: Id


    constructor(id: Id) {
        this.id = id;
    }

    static createNewGuest(){
        return new Guest(UUIDGenerator())
    }


}