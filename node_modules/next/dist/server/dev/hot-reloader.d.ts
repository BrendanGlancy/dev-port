/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlObject } from 'url';
import { webpack } from 'next/dist/compiled/webpack/webpack';
import { __ApiPreviewProps } from '../api-utils';
import { NextConfigComplete } from '../config-shared';
import { CustomRoutes } from '../../lib/load-custom-routes';
export declare function renderScriptError(res: ServerResponse, error: Error, { verbose }?: {
    verbose?: boolean | undefined;
}): Promise<void>;
export default class HotReloader {
    private dir;
    private buildId;
    private middlewares;
    private pagesDir;
    private webpackHotMiddleware;
    private config;
    private stats;
    serverStats: webpack.Stats | null;
    private clientError;
    private serverError;
    private serverPrevDocumentHash;
    private prevChunkNames?;
    private onDemandEntries;
    private previewProps;
    private watcher;
    private rewrites;
    private fallbackWatcher;
    private hotReloaderSpan;
    isWebpack5: any;
    constructor(dir: string, { config, pagesDir, buildId, previewProps, rewrites, }: {
        config: NextConfigComplete;
        pagesDir: string;
        buildId: string;
        previewProps: __ApiPreviewProps;
        rewrites: CustomRoutes['rewrites'];
    });
    run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlObject): Promise<{
        finished?: true;
    }>;
    private clean;
    private getWebpackConfig;
    buildFallbackError(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getCompilationErrors(page: string): Promise<any[]>;
    send(action?: string | any, ...args: any[]): void;
    ensurePage(page: string): Promise<any>;
}
