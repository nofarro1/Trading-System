import {Id} from "../../utilities/Utils";


export enum JobType {
    Founder,
    Owner,
    Manager
}

export enum Permission{
    //?
}

export class Role {
    private id : number;
    private title: string;
    private type: JobType;
    private permissions: Permission[];

    constructor(id: number, title: string, type: JobType, permissions: Permission[]){
        this.id = id;
        this.title = title;
        this.type = type;
        this.permissions = permissions;
    }

    getId(){
        return this.id;
    }
    
    addPermition(perm: Permission){
        this.permissions.push(perm);
    }

    removePermission(perm: Permission){
        this.permissions = this.permissions.filter((permition)=> !perm);
    }
}