interface StringReplacerFn<T> {
    (match : string, offset : number, string : string) : T
}
interface RegExpReplacerFn<T> {
    // Full signature: match, p1, p2, ..., pN, offset, string
    (match : string, ...args : any[]) : T
}

declare function stringReplaceToArray<T = unknown>(string : string, pattern : string, replacer : StringReplacerFn<T> | T) : (T | string)[]
declare function stringReplaceToArray<T = unknown>(string : string, pattern : RegExp, replacer : RegExpReplacerFn<T> | T) : (T | string)[]

export default stringReplaceToArray