"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spans = void 0;
var _webpack = require("next/dist/compiled/webpack/webpack");
var _trace = require("../../../telemetry/trace");
const pluginName = 'ProfilingPlugin';
const spans = new WeakMap();
exports.spans = spans;
function getNormalModuleLoaderHook(compilation) {
    if (_webpack.isWebpack5) {
        // @ts-ignore TODO: Remove ignore when webpack 5 is stable
        return _webpack.webpack.NormalModule.getCompilationHooks(compilation).loader;
    }
    return compilation.hooks.normalModuleLoader;
}
class ProfilingPlugin {
    constructor({ runWebpackSpan  }){
        this.runWebpackSpan = runWebpackSpan;
    }
    apply(compiler) {
        this.traceTopLevelHooks(compiler);
        this.traceCompilationHooks(compiler);
        this.compiler = compiler;
    }
    traceHookPair(spanName, startHook, stopHook, { parentSpan , attrs , onSetSpan  } = {
    }) {
        let span;
        startHook.tap(pluginName, ()=>{
            span = parentSpan ? parentSpan().traceChild(spanName, attrs ? attrs() : attrs) : (0, _trace).trace(spanName, undefined, attrs ? attrs() : attrs);
            onSetSpan === null || onSetSpan === void 0 ? void 0 : onSetSpan(span);
        });
        stopHook.tap(pluginName, ()=>{
            // `stopHook` may be triggered when `startHook` has not in cases
            // where `stopHook` is used as the terminating event for more
            // than one pair of hooks.
            if (!span) {
                return;
            }
            span.stop();
        });
    }
    traceTopLevelHooks(compiler) {
        this.traceHookPair('webpack-compilation', _webpack.isWebpack5 ? compiler.hooks.beforeCompile : compiler.hooks.compile, _webpack.isWebpack5 ? compiler.hooks.afterCompile : compiler.hooks.done, {
            parentSpan: ()=>this.runWebpackSpan
            ,
            attrs: ()=>({
                    name: compiler.name
                })
            ,
            onSetSpan: (span)=>spans.set(compiler, span)
        });
        if (compiler.options.mode === 'development') {
            this.traceHookPair('webpack-invalidated', compiler.hooks.invalid, compiler.hooks.done, {
                attrs: ()=>({
                        name: compiler.name
                    })
            });
        }
    }
    traceCompilationHooks(compiler) {
        this.traceHookPair('webpack-emit', compiler.hooks.emit, compiler.hooks.afterEmit, {
            parentSpan: ()=>this.runWebpackSpan
        });
        compiler.hooks.compilation.tap(pluginName, (compilation)=>{
            compilation.hooks.buildModule.tap(pluginName, (module)=>{
                var ref;
                const compilerSpan = spans.get(compiler);
                if (!compilerSpan) {
                    return;
                }
                const moduleType = (()=>{
                    if (!module.userRequest) {
                        return '';
                    }
                    return module.userRequest.split('.').pop();
                })();
                const issuerModule = compilation === null || compilation === void 0 ? void 0 : (ref = compilation.moduleGraph) === null || ref === void 0 ? void 0 : ref.getIssuer(module);
                let span;
                const spanName = `build-module${moduleType ? `-${moduleType}` : ''}`;
                const issuerSpan = issuerModule && spans.get(issuerModule);
                if (issuerSpan) {
                    span = issuerSpan.traceChild(spanName);
                } else {
                    span = compilerSpan.traceChild(spanName);
                }
                span.setAttribute('name', module.userRequest);
                spans.set(module, span);
            });
            getNormalModuleLoaderHook(compilation).tap(pluginName, (loaderContext, module)=>{
                const moduleSpan = spans.get(module);
                loaderContext.currentTraceSpan = moduleSpan;
            });
            compilation.hooks.succeedModule.tap(pluginName, (module)=>{
                var ref;
                (ref = spans.get(module)) === null || ref === void 0 ? void 0 : ref.stop();
            });
            this.traceHookPair('webpack-compilation-chunk-graph', compilation.hooks.beforeChunks, compilation.hooks.afterChunks, {
                parentSpan: ()=>this.runWebpackSpan
            });
            this.traceHookPair('webpack-compilation-optimize', compilation.hooks.optimize, compilation.hooks.reviveModules, {
                parentSpan: ()=>this.runWebpackSpan
            });
            this.traceHookPair('webpack-compilation-optimize-modules', compilation.hooks.optimizeModules, compilation.hooks.afterOptimizeModules, {
                parentSpan: ()=>this.runWebpackSpan
            });
            this.traceHookPair('webpack-compilation-optimize-chunks', compilation.hooks.optimizeChunks, compilation.hooks.afterOptimizeChunks, {
                parentSpan: ()=>this.runWebpackSpan
            });
            this.traceHookPair('webpack-compilation-optimize-tree', compilation.hooks.optimizeTree, compilation.hooks.afterOptimizeTree, {
                parentSpan: ()=>this.runWebpackSpan
            });
            this.traceHookPair('webpack-compilation-hash', compilation.hooks.beforeHash, compilation.hooks.afterHash, {
                parentSpan: ()=>this.runWebpackSpan
            });
        });
    }
}
exports.ProfilingPlugin = ProfilingPlugin;

//# sourceMappingURL=profiling-plugin.js.map