import type { Revalidate } from '../server/lib/revalidate';
import '../lib/setup-exception-listeners';
import type { Header, Redirect, Rewrite, RouteHas } from '../lib/load-custom-routes';
import type { __ApiPreviewProps } from '../server/api-utils';
import { NEXT_ROUTER_PREFETCH, RSC, RSC_VARY_HEADER } from '../client/components/app-router-headers';
interface ExperimentalBypassForInfo {
    experimentalBypassFor?: RouteHas[];
}
interface DataRouteRouteInfo {
    dataRoute: string | null;
}
export interface SsgRoute extends ExperimentalBypassForInfo, DataRouteRouteInfo {
    initialRevalidateSeconds: Revalidate;
    srcRoute: string | null;
    initialStatus?: number;
    initialHeaders?: Record<string, string>;
}
export interface DynamicSsgRoute extends ExperimentalBypassForInfo, DataRouteRouteInfo {
    routeRegex: string;
    fallback: string | null | false;
    dataRouteRegex: string | null;
}
export type PrerenderManifest = {
    version: 4;
    routes: {
        [route: string]: SsgRoute;
    };
    dynamicRoutes: {
        [route: string]: DynamicSsgRoute;
    };
    notFoundRoutes: string[];
    preview: __ApiPreviewProps;
};
type ManifestBuiltRoute = {
    /**
     * The route pattern used to match requests for this route.
     */
    regex: string;
};
export type ManifestRewriteRoute = ManifestBuiltRoute & Rewrite;
export type ManifestRedirectRoute = ManifestBuiltRoute & Redirect;
export type ManifestHeaderRoute = ManifestBuiltRoute & Header;
export type ManifestRoute = ManifestBuiltRoute & {
    page: string;
    namedRegex?: string;
    routeKeys?: {
        [key: string]: string;
    };
};
export type ManifestDataRoute = {
    page: string;
    routeKeys?: {
        [key: string]: string;
    };
    dataRouteRegex: string;
    namedDataRouteRegex?: string;
};
export type RoutesManifest = {
    version: number;
    pages404: boolean;
    basePath: string;
    redirects: Array<Redirect>;
    rewrites?: Array<ManifestRewriteRoute> | {
        beforeFiles: Array<ManifestRewriteRoute>;
        afterFiles: Array<ManifestRewriteRoute>;
        fallback: Array<ManifestRewriteRoute>;
    };
    headers: Array<ManifestHeaderRoute>;
    staticRoutes: Array<ManifestRoute>;
    dynamicRoutes: Array<ManifestRoute>;
    dataRoutes: Array<ManifestDataRoute>;
    i18n?: {
        domains?: Array<{
            http?: true;
            domain: string;
            locales?: string[];
            defaultLocale: string;
        }>;
        locales: string[];
        defaultLocale: string;
        localeDetection?: false;
    };
    rsc: {
        header: typeof RSC;
        varyHeader: typeof RSC_VARY_HEADER;
        prefetchHeader: typeof NEXT_ROUTER_PREFETCH;
    };
    skipMiddlewareUrlNormalize?: boolean;
    caseSensitive?: boolean;
};
export declare function buildCustomRoute(type: 'header', route: Header): ManifestHeaderRoute;
export declare function buildCustomRoute(type: 'rewrite', route: Rewrite): ManifestRewriteRoute;
export declare function buildCustomRoute(type: 'redirect', route: Redirect, restrictedRedirectPaths: string[]): ManifestRedirectRoute;
export default function build(dir: string, reactProductionProfiling: boolean | undefined, debugOutput: boolean | undefined, runLint: boolean | undefined, noMangling: boolean | undefined, appDirOnly: boolean | undefined, turboNextBuild: boolean | undefined, turboNextBuildRoot: null | undefined, buildMode: 'default' | 'experimental-compile' | 'experimental-generate'): Promise<void>;
export {};
