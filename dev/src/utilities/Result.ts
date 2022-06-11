export class Result<T> {
    ok: boolean
    data: T
    message?: string


    constructor(ok: boolean, data: T, message?: string) {
        this.ok = ok;
        this.data = data;
        this.message = message;
    }

    public static Ok<T>(data: T, message?: string): Result<T> {
        return new Result(true, data, message);
    }

    public static Fail(message: string): Result<undefined> {
        return new Result(false, undefined, message);
    }
}

const aggregateResultSuccess = <T>(results: Result<T | void>[]): Result<T[]> => {
    const filteredData = results.filter(checkRes).map((r: Result<T>) => r.data);
    return Result.Ok(filteredData);
}

export const checkRes = <T>(res: Result<T | void | undefined>): res is Result<T> => safe(res)

export const safe =
    <T>(o: { ok: boolean, data: T | undefined }): o is {
        ok: boolean,
        data: T
    } => {
        return o.data !== undefined ? o.ok : o.ok;
    };


