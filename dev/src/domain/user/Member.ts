import {Id, UUIDGenerator} from "../../utilities/Utils";


export class Member {
    readonly id:Id
    username: string;

    constructor( username:string) {
        this.id = username;
        this.username = username;
    }


}