import { Permissions } from "../../Permissions";
import {JobType} from "../../Enums";


export class SimpleMember {
    private readonly _username: string;
    private readonly _jobType?: JobType;
    private readonly _permissions?: Set<Permissions>
    private readonly _title?: string;

    constructor(username: string, jobType?: JobType, permissions?: Set<Permissions>, title?: string) {
        this._username = username;
        this._jobType = jobType;
        this._permissions = permissions;
        this._title = title;
    }

    get username(): string {
        return this._username;
    }

    get jobType(): JobType | undefined {
        return this._jobType;
    }

    getJobTypeValue(): number {
        return (this._jobType) ? this._jobType.valueOf() : -1 ;
    }

    get permissions(): Set<Permissions> | undefined {
        return this._permissions;
    }

    get title(): string | undefined {
        return this._title;
    }
}