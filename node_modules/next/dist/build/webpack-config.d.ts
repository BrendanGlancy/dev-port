import { webpack } from 'next/dist/compiled/webpack/webpack';
import { CustomRoutes } from '../lib/load-custom-routes.js';
import { NextConfigComplete } from '../server/config-shared';
import { WebpackEntrypoints } from './entries';
import type { Span } from '../telemetry/trace';
export declare function attachReactRefresh(webpackConfig: webpack.Configuration, targetLoader: webpack.RuleSetUseItem): void;
export default function getBaseWebpackConfig(dir: string, { buildId, config, dev, isServer, pagesDir, target, reactProductionProfiling, entrypoints, rewrites, isDevFallback, runWebpackSpan, }: {
    buildId: string;
    config: NextConfigComplete;
    dev?: boolean;
    isServer?: boolean;
    pagesDir: string;
    target?: string;
    reactProductionProfiling?: boolean;
    entrypoints: WebpackEntrypoints;
    rewrites: CustomRoutes['rewrites'];
    isDevFallback?: boolean;
    runWebpackSpan: Span;
}): Promise<webpack.Configuration>;
