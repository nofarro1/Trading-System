

export class Result<T> {
    ok: boolean
    data: T
    message?:string


    constructor(ok: boolean, data: T, message?: string) {
        this.ok = ok;
        this.data = data;
        this.message = message;
    }
}