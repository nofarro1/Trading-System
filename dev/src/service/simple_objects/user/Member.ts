import {JobType} from "../../../domain/user/Role";
import { Permissions } from "../../../utilities/Permissions";


export class Member {
    private readonly _username: string;
    private readonly _jobType: JobType;
    private readonly _permissions: Permissions[]
    private readonly _title?: string;

    constructor(username: string, jobType: JobType, permissions: Permissions[], title: string) {
        this._username = username;
        this._jobType = jobType;
        this._permissions = permissions;
        this._title = title;
    }

    get username(): string {
        return this._username;
    }

    get jobType(): JobType {
        return this._jobType;
    }

    get permissions(): Permissions[] {
        return this._permissions;
    }

    get title(): string | undefined {
        return this._title;
    }
}