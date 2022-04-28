import {Id} from "../Utils";


export enum JobType {
    Founder,
    Owner,
    Manager
}

export class Role {
    title: string
    type: JobType
    AssociatedMemberId: Id
}