import {Result} from "./Result";


export type Id = string

export const UUIDGenerator = (): Id => {
    const head = Date.now().toString();
    const tail = Math.random().toString().substring(2);

    return head + tail
}


export const aggregateSuccessResults = <T>(results:Result<T>[]):Result<T[]> =>{
    const allData = results.filter(r => r.ok).map( x => x.data);
    let allsucc = results.length === allData.length
    return new Result<T[]>(allsucc,allData,allsucc ? '' : 'not all results have been resolved successfully');

}

export const aggregateFailedResults = <T>(results:Result<T>[]):Result<T[]> =>{
    const allData = results.filter(r => !r.ok).map( x => x.data);
    return

}
