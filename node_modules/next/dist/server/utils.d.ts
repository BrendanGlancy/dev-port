/// <reference types="zen-observable" />
import Observable from 'next/dist/compiled/zen-observable';
export declare function isBlockedPage(pathname: string): boolean;
export declare function cleanAmpPath(pathname: string): string;
export declare type RenderResult = Observable<string>;
export declare function mergeResults(results: Array<RenderResult>): RenderResult;
export declare function resultsToString(results: Array<RenderResult>): Promise<string>;
