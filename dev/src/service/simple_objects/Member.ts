import {Role} from "./Role";


export class Member {
    username: string;
    password: string;
    roles: Role[];


    constructor(username: string, password: string, roles: Role[]) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}