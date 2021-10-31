import { IConformanceTestResult, IWebpackConformanceTest } from '../TestInterface';
export declare class GranularChunksConformanceCheck implements IWebpackConformanceTest {
    granularChunksConfig: any;
    constructor(granularChunksConfig: any);
    buildStared(options: any): IConformanceTestResult;
}
