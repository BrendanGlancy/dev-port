"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _path = _interopRequireDefault(require("path"));
var _nft = require("next/dist/compiled/@vercel/nft");
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../../../shared/lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PLUGIN_NAME = 'TraceEntryPointsPlugin';
const TRACE_IGNORES = [
    '**/*/node_modules/react/**/*.development.js',
    '**/*/node_modules/react-dom/**/*.development.js', 
];
function getModuleFromDependency(compilation, dep) {
    if (_webpack.isWebpack5) {
        return compilation.moduleGraph.getModule(dep);
    }
    return dep.module;
}
class TraceEntryPointsPlugin {
    constructor({ appDir , excludeFiles  }){
        this.appDir = appDir;
        this.entryTraces = new Map();
        this.excludeFiles = excludeFiles || [];
    }
    // Here we output all traced assets and webpack chunks to a
    // ${page}.js.nft.json file
    createTraceAssets(compilation, assets) {
        const outputPath = compilation.outputOptions.path;
        for (const entrypoint of compilation.entrypoints.values()){
            const entryFiles = new Set();
            for (const chunk of entrypoint.getEntrypointChunk().getAllReferencedChunks()){
                for (const file of chunk.files){
                    entryFiles.add(_path.default.join(outputPath, file));
                }
                for (const file1 of chunk.auxiliaryFiles){
                    entryFiles.add(_path.default.join(outputPath, file1));
                }
            }
            // don't include the entry itself in the trace
            entryFiles.delete(_path.default.join(outputPath, `${_webpack.isWebpack5 ? '../' : ''}${entrypoint.name}.js`));
            const traceOutputName = `${_webpack.isWebpack5 ? '../' : ''}${entrypoint.name}.js.nft.json`;
            const traceOutputPath = _path.default.dirname(_path.default.join(outputPath, traceOutputName));
            assets[traceOutputName] = new _webpack.sources.RawSource(JSON.stringify({
                version: _constants.TRACE_OUTPUT_VERSION,
                files: [
                    ...entryFiles,
                    ...this.entryTraces.get(entrypoint.name)
                ].map((file)=>{
                    return _path.default.relative(traceOutputPath, file).replace(/\\/g, '/');
                })
            }));
        }
    }
    apply(compiler) {
        if (_webpack.isWebpack5) {
            compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation)=>{
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                compilation.hooks.processAssets.tap({
                    name: PLUGIN_NAME,
                    // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                    stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
                }, (assets)=>{
                    this.createTraceAssets(compilation, assets);
                });
            });
        } else {
            compiler.hooks.emit.tap(PLUGIN_NAME, (compilation)=>{
                this.createTraceAssets(compilation, compilation.assets);
            });
        }
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation)=>{
            compilation.hooks.finishModules.tapAsync(PLUGIN_NAME, async (_stats, callback)=>{
                // we create entry -> module maps so that we can
                // look them up faster instead of having to iterate
                // over the compilation modules list
                const entryNameMap = new Map();
                const entryModMap = new Map();
                try {
                    const depModMap = new Map();
                    compilation.entries.forEach((entry)=>{
                        var ref;
                        const name = entry.name || ((ref = entry.options) === null || ref === void 0 ? void 0 : ref.name);
                        if ((name === null || name === void 0 ? void 0 : name.startsWith('pages/')) && entry.dependencies[0]) {
                            const entryMod = getModuleFromDependency(compilation, entry.dependencies[0]);
                            if (entryMod.resource) {
                                entryNameMap.set(entryMod.resource, name);
                                entryModMap.set(entryMod.resource, entryMod);
                            }
                        }
                    });
                    // TODO: investigate allowing non-sync fs calls in node-file-trace
                    // for better performance
                    const readFile = (path)=>{
                        var ref;
                        const mod = depModMap.get(path) || entryModMap.get(path);
                        // map the transpiled source when available to avoid
                        // parse errors in node-file-trace
                        const source = mod === null || mod === void 0 ? void 0 : (ref = mod.originalSource) === null || ref === void 0 ? void 0 : ref.call(mod);
                        if (source) {
                            return source.buffer();
                        }
                        try {
                            return compilation.inputFileSystem.readFileSync(path);
                        } catch (e) {
                            if (e.code === 'ENOENT' || e.code === 'EISDIR') {
                                return null;
                            }
                            throw e;
                        }
                    };
                    const readlink = (path)=>{
                        try {
                            return compilation.inputFileSystem.readlinkSync(path);
                        } catch (e) {
                            if (e.code !== 'EINVAL' && e.code !== 'ENOENT' && e.code !== 'UNKNOWN') {
                                throw e;
                            }
                            return null;
                        }
                    };
                    const stat = (path)=>{
                        try {
                            return compilation.inputFileSystem.statSync(path);
                        } catch (e) {
                            if (e.code === 'ENOENT') {
                                return null;
                            }
                            throw e;
                        }
                    };
                    const nftCache = {
                    };
                    const entryPaths = Array.from(entryModMap.keys());
                    for (const entry of entryPaths){
                        depModMap.clear();
                        const entryMod = entryModMap.get(entry);
                        // TODO: investigate caching, will require ensuring no traced
                        // files in the cache have changed, we could potentially hash
                        // all traced files and only leverage the cache if the hashes
                        // match
                        // const cachedTraces = entryMod.buildInfo?.cachedNextEntryTrace
                        // Use cached trace if available and trace version matches
                        // if (
                        //   isWebpack5 &&
                        //   cachedTraces &&
                        //   cachedTraces.version === TRACE_OUTPUT_VERSION
                        // ) {
                        //   this.entryTraces.set(
                        //     entryNameMap.get(entry)!,
                        //     cachedTraces.tracedDeps
                        //   )
                        //   continue
                        // }
                        const collectDependencies = (mod)=>{
                            if (!mod || !mod.dependencies) return;
                            for (const dep of mod.dependencies){
                                const depMod = getModuleFromDependency(compilation, dep);
                                if ((depMod === null || depMod === void 0 ? void 0 : depMod.resource) && !depModMap.get(depMod.resource)) {
                                    depModMap.set(depMod.resource, depMod);
                                    collectDependencies(depMod);
                                }
                            }
                        };
                        collectDependencies(entryMod);
                        const toTrace = [
                            entry,
                            ...depModMap.keys()
                        ];
                        const root = _path.default.parse(process.cwd()).root;
                        const result = await (0, _nft).nodeFileTrace(toTrace, {
                            base: root,
                            cache: nftCache,
                            processCwd: this.appDir,
                            readFile,
                            readlink,
                            stat,
                            ignore: [
                                ...TRACE_IGNORES,
                                ...this.excludeFiles
                            ]
                        });
                        const tracedDeps = [];
                        for (const file of result.fileList){
                            if (result.reasons[file].type === 'initial') {
                                continue;
                            }
                            tracedDeps.push(_path.default.join(root, file));
                        }
                        // entryMod.buildInfo.cachedNextEntryTrace = {
                        //   version: TRACE_OUTPUT_VERSION,
                        //   tracedDeps,
                        // }
                        this.entryTraces.set(entryNameMap.get(entry), tracedDeps);
                    }
                    callback();
                } catch (err) {
                    callback(err);
                }
            });
        });
    }
}
exports.TraceEntryPointsPlugin = TraceEntryPointsPlugin;

//# sourceMappingURL=next-trace-entrypoints-plugin.js.map