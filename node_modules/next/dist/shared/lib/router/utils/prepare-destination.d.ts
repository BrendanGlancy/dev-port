/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { ParsedUrlQuery } from 'querystring';
import type { RouteHas } from '../../../../lib/load-custom-routes';
declare type Params = {
    [param: string]: any;
};
export declare const getSafeParamName: (paramName: string) => string;
export declare function matchHas(req: IncomingMessage, has: RouteHas[], query: Params): false | Params;
export declare function compileNonPath(value: string, params: Params): string;
export default function prepareDestination(destination: string, params: Params, query: ParsedUrlQuery, appendParamsToQuery: boolean): {
    newUrl: string;
    parsedDestination: import("./parse-url").ParsedUrl;
};
export {};
