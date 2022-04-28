
class Result<T> {
    ok: boolean
    data: T
    massage?:string


    constructor(ok: boolean, data: T, massage?: string) {
        this.ok = ok;
        this.data = data;
        this.massage = massage;
    }
}