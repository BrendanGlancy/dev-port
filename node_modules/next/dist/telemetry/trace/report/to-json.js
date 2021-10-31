"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _crypto = require("crypto");
var _toZipkin = require("./to-zipkin");
var _shared = require("../shared");
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let writeStream;
let traceId;
let batch;
const reportToLocalHost = (name, duration, timestamp, id, parentId, attrs)=>{
    const distDir = _shared.traceGlobals.get('distDir');
    if (!distDir) {
        return;
    }
    if (!traceId) {
        traceId = process.env.TRACE_ID || (0, _crypto).randomBytes(8).toString('hex');
    }
    if (!batch) {
        batch = (0, _toZipkin).batcher(async (events)=>{
            if (!writeStream) {
                const tracesDir = _path.default.join(distDir, 'traces');
                await _fs.default.promises.mkdir(tracesDir, {
                    recursive: true
                });
                const file = _path.default.join(distDir, 'trace');
                writeStream = _fs.default.createWriteStream(file, {
                    flags: 'a',
                    encoding: 'utf8'
                });
            }
            const eventsJson = JSON.stringify(events);
            try {
                await new Promise((resolve, reject)=>{
                    writeStream.write(eventsJson + '\n', 'utf8', (err)=>{
                        err ? reject(err) : resolve();
                    });
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    batch.report({
        traceId,
        parentId,
        name,
        id,
        timestamp,
        duration,
        tags: attrs
    });
};
var _default = {
    flushAll: ()=>batch ? batch.flushAll().then(()=>{
            writeStream.end('', 'utf8');
        }) : undefined
    ,
    report: reportToLocalHost
};
exports.default = _default;

//# sourceMappingURL=to-json.js.map