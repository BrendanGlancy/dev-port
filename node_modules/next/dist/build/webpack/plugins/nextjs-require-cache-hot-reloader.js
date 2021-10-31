"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _webpack = require("next/dist/compiled/webpack/webpack");
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const originModules = [
    require.resolve('../../../server/require'),
    require.resolve('../../../server/load-components'), 
];
function deleteCache(filePath) {
    try {
        filePath = (0, _fs).realpathSync(filePath);
    } catch (e) {
        if (e.code !== 'ENOENT') throw e;
    }
    const module = require.cache[filePath];
    if (module) {
        // remove the child reference from the originModules
        for (const originModule of originModules){
            const parent = require.cache[originModule];
            if (parent) {
                const idx = parent.children.indexOf(module);
                if (idx >= 0) parent.children.splice(idx, 1);
            }
        }
        // remove parent references from external modules
        for (const child of module.children){
            child.parent = null;
        }
    }
    delete require.cache[filePath];
}
const PLUGIN_NAME = 'NextJsRequireCacheHotReloader';
class NextJsRequireCacheHotReloader {
    apply(compiler) {
        if (_webpack.isWebpack5) {
            // @ts-ignored Webpack has this hooks
            compiler.hooks.assetEmitted.tap(PLUGIN_NAME, (_file, { targetPath  })=>{
                this.currentOutputPathsWebpack5.add(targetPath);
                deleteCache(targetPath);
            });
            compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation)=>{
                const runtimeChunkPath = _path.default.join(compilation.outputOptions.path, 'webpack-runtime.js');
                deleteCache(runtimeChunkPath);
                // we need to make sure to clear all server entries from cache
                // since they can have a stale webpack-runtime cache
                // which needs to always be in-sync
                const entries = [
                    ...compilation.entries.keys()
                ].filter((entry)=>entry.toString().startsWith('pages/')
                );
                entries.forEach((page)=>{
                    const outputPath = _path.default.join(compilation.outputOptions.path, page + '.js');
                    deleteCache(outputPath);
                });
            });
            this.previousOutputPathsWebpack5 = new Set(this.currentOutputPathsWebpack5);
            this.currentOutputPathsWebpack5.clear();
            return;
        }
        compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, (compilation, callback)=>{
            const { assets  } = compilation;
            if (this.prevAssets) {
                for (const f of Object.keys(assets)){
                    deleteCache(assets[f].existsAt);
                }
                for (const f1 of Object.keys(this.prevAssets)){
                    if (!assets[f1]) {
                        deleteCache(this.prevAssets[f1].existsAt);
                    }
                }
            }
            this.prevAssets = assets;
            callback();
        });
    }
    constructor(){
        this.prevAssets = null;
        this.previousOutputPathsWebpack5 = new Set();
        this.currentOutputPathsWebpack5 = new Set();
    }
}
exports.NextJsRequireCacheHotReloader = NextJsRequireCacheHotReloader;

//# sourceMappingURL=nextjs-require-cache-hot-reloader.js.map