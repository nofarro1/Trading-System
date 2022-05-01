import {Role} from "./Role";


export class Member {
    private username: string;
    private roles?: Role[];

    constructor(username: string, roles?: Role[]) {
        this.username = username;
        this.roles = roles;
    }
}