"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _stream = require("stream");
var _bfj = _interopRequireDefault(require("next/dist/compiled/bfj"));
var _profilingPlugin = require("./profiling-plugin");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const STATS_VERSION = 0;
function reduceSize(stats) {
    stats.chunks = stats.chunks.map((chunk)=>{
        const reducedChunk = {
            id: chunk.id,
            files: chunk.files,
            size: chunk.size
        };
        for (const module of chunk.modules){
            if (!module.id) {
                continue;
            }
            if (!reducedChunk.modules) {
                reducedChunk.modules = [];
            }
            reducedChunk.modules.push(module.id);
        }
        return reducedChunk;
    });
    stats.modules = stats.modules.map((module)=>{
        const reducedModule = {
            type: module.type,
            moduleType: module.moduleType,
            size: module.size,
            name: module.name
        };
        if (module.reasons) {
            for (const reason of module.reasons){
                if (!reason.moduleName || reason.moduleId === module.id) {
                    continue;
                }
                if (!reducedModule.reasons) {
                    reducedModule.reasons = [];
                }
                reducedModule.reasons.push(reason.moduleId);
            }
        }
        return [
            module.id,
            reducedModule
        ];
    });
    for(const entrypointName in stats.entrypoints){
        delete stats.entrypoints[entrypointName].assets;
    }
    return stats;
}
const THRESHOLD = 16 * 1024;
class BufferingStream extends _stream.Transform {
    _transform(chunk, encoding, callback) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        const size = buffer.length;
        if (this.itemsSize > 0 && this.itemsSize + size > THRESHOLD) {
            this.push(Buffer.concat(this.items));
            this.itemsSize = 0;
            this.items.length = 0;
        }
        if (size > THRESHOLD) {
            this.push(buffer);
        } else {
            this.items.push(buffer);
            this.itemsSize += size;
        }
        callback();
    }
    _flush(callback) {
        if (this.itemsSize > 0) {
            this.push(Buffer.concat(this.items));
            this.itemsSize = 0;
            this.items.length = 0;
        }
        callback();
    }
    constructor(...args){
        super(...args);
        this.items = [];
        this.itemsSize = 0;
    }
}
class BuildStatsPlugin {
    constructor(options){
        this.distDir = options.distDir;
    }
    apply(compiler) {
        compiler.hooks.done.tapAsync('NextJsBuildStats', async (stats, callback)=>{
            const compilerSpan = _profilingPlugin.spans.get(compiler);
            try {
                const writeStatsSpan = compilerSpan.traceChild('NextJsBuildStats');
                await writeStatsSpan.traceAsyncFn(()=>{
                    return new Promise((resolve, reject)=>{
                        const statsJson = reduceSize(stats.toJson({
                            all: false,
                            cached: true,
                            reasons: true,
                            entrypoints: true,
                            chunks: true,
                            errors: false,
                            warnings: false,
                            maxModules: Infinity,
                            chunkModules: true,
                            modules: true,
                            // @ts-ignore this option exists
                            ids: true
                        }));
                        const fileStream = _fs.default.createWriteStream(_path.default.join(this.distDir, 'next-stats.json'), {
                            highWaterMark: THRESHOLD
                        });
                        const jsonStream = _bfj.default.streamify({
                            version: STATS_VERSION,
                            stats: statsJson
                        });
                        jsonStream.pipe(new BufferingStream()).pipe(fileStream);
                        jsonStream.on('error', reject);
                        fileStream.on('error', reject);
                        jsonStream.on('dataError', reject);
                        fileStream.on('close', resolve);
                    });
                });
                callback();
            } catch (err) {
                callback(err);
            }
        });
    }
}
exports.default = BuildStatsPlugin;

//# sourceMappingURL=build-stats-plugin.js.map