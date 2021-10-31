import { Span } from '../../../telemetry/trace';
export declare const spans: WeakMap<any, Span>;
export declare class ProfilingPlugin {
    compiler: any;
    runWebpackSpan: Span;
    constructor({ runWebpackSpan }: {
        runWebpackSpan: Span;
    });
    apply(compiler: any): void;
    traceHookPair(spanName: string, startHook: any, stopHook: any, { parentSpan, attrs, onSetSpan, }?: {
        parentSpan?: () => Span;
        attrs?: any;
        onSetSpan?: (span: Span) => void;
    }): void;
    traceTopLevelHooks(compiler: any): void;
    traceCompilationHooks(compiler: any): void;
}
