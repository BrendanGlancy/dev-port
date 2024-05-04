import '../next';
import '../node-polyfill-fetch';
import '../require-hook';
import type { SelfSignedCertificate } from '../../lib/mkcert';
import { initialize } from './router-server';
export interface StartServerOptions {
    dir: string;
    port: number;
    isDev: boolean;
    hostname: string;
    allowRetry?: boolean;
    customServer?: boolean;
    minimalMode?: boolean;
    keepAliveTimeout?: number;
    envInfo?: string[];
    expFeatureInfo?: string[];
    selfSignedCertificate?: SelfSignedCertificate;
    isExperimentalTestProxy?: boolean;
}
export declare function getRequestHandlers({ dir, port, isDev, server, hostname, minimalMode, isNodeDebugging, keepAliveTimeout, experimentalTestProxy, experimentalHttpsServer, }: {
    dir: string;
    port: number;
    isDev: boolean;
    server?: import('http').Server;
    hostname: string;
    minimalMode?: boolean;
    isNodeDebugging?: boolean;
    keepAliveTimeout?: number;
    experimentalTestProxy?: boolean;
    experimentalHttpsServer?: boolean;
}): ReturnType<typeof initialize>;
export declare function startServer({ dir, port, isDev, hostname, minimalMode, allowRetry, keepAliveTimeout, isExperimentalTestProxy, selfSignedCertificate, envInfo, expFeatureInfo, }: StartServerOptions): Promise<void>;
