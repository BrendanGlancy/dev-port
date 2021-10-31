import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare class TraceEntryPointsPlugin implements webpack.Plugin {
    private appDir;
    private entryTraces;
    private excludeFiles;
    constructor({ appDir, excludeFiles, }: {
        appDir: string;
        excludeFiles?: string[];
    });
    createTraceAssets(compilation: any, assets: any): void;
    apply(compiler: webpack.Compiler): void;
}
