/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { CustomRoutes } from '../../lib/load-custom-routes';
import { __ApiPreviewProps } from '../api-utils';
import Server, { ServerConstructor, FindComponentsResult } from '../next-server';
import { Params } from '../router';
import { NextConfig } from '../config';
import { ParsedUrlQuery } from 'querystring';
import { LoadComponentsReturnType } from '../load-components';
export default class DevServer extends Server {
    private devReady;
    private setDevReady?;
    private webpackWatcher?;
    private hotReloader?;
    private isCustomServer;
    protected sortedRoutes?: string[];
    protected staticPathsWorker: import('jest-worker').Worker & {
        loadStaticPaths: typeof import('./static-paths-worker').loadStaticPaths;
    };
    constructor(options: ServerConstructor & {
        conf: NextConfig;
        isNextDevCommand?: boolean;
    });
    protected readBuildId(): string;
    addExportPathMapRoutes(): Promise<void>;
    startWatcher(): Promise<void>;
    stopWatcher(): Promise<void>;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(req: IncomingMessage, res: ServerResponse, params: Params, parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    private logErrorWithOriginalStack;
    protected getCustomRoutes(): CustomRoutes;
    private _devCachedPreviewProps;
    protected getPreviewProps(): __ApiPreviewProps;
    generateRoutes(): {
        basePath: string;
        headers: import("../router").Route[];
        rewrites: {
            beforeFiles: import("../router").Route[];
            afterFiles: import("../router").Route[];
            fallback: import("../router").Route[];
        };
        redirects: import("../router").Route[];
        catchAllRoute: import("../router").Route;
        pageChecker: import("../router").PageChecker;
        useFileSystemPublicRoutes: boolean;
        dynamicRoutes: import("../router").DynamicRoutes | undefined;
        locales: string[];
        fsRoutes: import("../router").Route[];
    };
    protected generatePublicRoutes(): never[];
    protected getDynamicRoutes(): never[];
    _filterAmpDevelopmentScript(html: string, event: {
        line: number;
        col: number;
        code: string;
    }): boolean;
    protected getStaticPaths(pathname: string): Promise<{
        staticPaths: string[] | undefined;
        fallbackMode: false | 'static' | 'blocking';
    }>;
    protected ensureApiPage(pathname: string): Promise<any>;
    protected findPageComponents(pathname: string, query?: ParsedUrlQuery, params?: Params | null): Promise<FindComponentsResult | null>;
    protected getFallbackErrorComponents(): Promise<LoadComponentsReturnType | null>;
    protected setImmutableAssetCacheControl(res: ServerResponse): void;
    private servePublic;
    hasPublicFile(path: string): Promise<boolean>;
    getCompilationError(page: string): Promise<any>;
    protected isServeableUrl(untrustedFileUrl: string): boolean;
}
