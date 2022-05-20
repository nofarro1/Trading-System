export class Result<T> {
    ok: boolean
    data: T
    message?: string


    constructor(ok: boolean, data: T, message?: string) {
        this.ok = ok;
        this.data = data;
        this.message = message;
    }
}


export const checkRes = <T>(res: Result<T | void | undefined>): res is Result<T> => safe(res)

export const safe =
    <T>(o: { ok: boolean, data: T | undefined }): o is {
                                    ok: boolean,
                                    data: T } => {
                                        return o.data !== undefined ? o.ok: o.ok;
                                    }