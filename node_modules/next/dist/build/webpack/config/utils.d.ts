import { webpack } from 'next/dist/compiled/webpack/webpack';
import { NextConfigComplete } from '../../../server/config-shared';
export declare type ConfigurationContext = {
    rootDirectory: string;
    customAppFile: RegExp;
    isDevelopment: boolean;
    isProduction: boolean;
    isServer: boolean;
    isClient: boolean;
    assetPrefix: string;
    sassOptions: any;
    productionBrowserSourceMaps: boolean;
    future: NextConfigComplete['future'];
    isCraCompat?: boolean;
};
export declare type ConfigurationFn = (a: webpack.Configuration) => webpack.Configuration;
export declare const pipe: <R>(...fns: ((a: R) => R | Promise<R>)[]) => (param: R) => R | Promise<R>;
