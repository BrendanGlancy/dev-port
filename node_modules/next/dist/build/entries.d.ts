import { __ApiPreviewProps } from '../server/api-utils';
import { LoadedEnvFiles } from '@next/env';
import { NextConfigComplete } from '../server/config-shared';
declare type PagesMapping = {
    [page: string]: string;
};
export declare function createPagesMapping(pagePaths: string[], extensions: string[], isWebpack5: boolean, isDev: boolean): PagesMapping;
export declare type WebpackEntrypoints = {
    [bundle: string]: string | string[] | {
        import: string | string[];
        dependOn?: string | string[];
    };
};
declare type Entrypoints = {
    client: WebpackEntrypoints;
    server: WebpackEntrypoints;
};
export declare function createEntrypoints(pages: PagesMapping, target: 'server' | 'serverless' | 'experimental-serverless-trace', buildId: string, previewMode: __ApiPreviewProps, config: NextConfigComplete, loadedEnvFiles: LoadedEnvFiles): Entrypoints;
export {};
