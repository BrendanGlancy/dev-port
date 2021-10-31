import { webpack } from 'next/dist/compiled/webpack/webpack';
import { NextConfigComplete } from '../../../server/config-shared';
export declare function build(config: webpack.Configuration, { rootDirectory, customAppFile, isDevelopment, isServer, assetPrefix, sassOptions, productionBrowserSourceMaps, future, isCraCompat, }: {
    rootDirectory: string;
    customAppFile: RegExp;
    isDevelopment: boolean;
    isServer: boolean;
    assetPrefix: string;
    sassOptions: any;
    productionBrowserSourceMaps: boolean;
    future: NextConfigComplete['future'];
    isCraCompat?: boolean;
}): Promise<webpack.Configuration>;
