export declare type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
