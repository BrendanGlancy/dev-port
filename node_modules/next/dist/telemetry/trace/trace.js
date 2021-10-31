"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flushAllTraces = exports.trace = exports.SpanStatus = void 0;
var _crypto = require("crypto");
var _report = require("./report");
const NUM_OF_MICROSEC_IN_SEC = BigInt('1000');
const getId = ()=>(0, _crypto).randomBytes(8).toString('hex')
;
var SpanStatus;
exports.SpanStatus = SpanStatus;
(function(SpanStatus1) {
    SpanStatus1[SpanStatus1["Started"] = 0] = "Started";
    SpanStatus1[SpanStatus1["Stopped"] = 1] = "Stopped";
})(SpanStatus || (exports.SpanStatus = SpanStatus = {
}));
class Span {
    constructor(name1, parentId, attrs1){
        this.name = name1;
        this.parentId = parentId;
        this.duration = null;
        this.attrs = attrs1 ? {
            ...attrs1
        } : {
        };
        this.status = SpanStatus.Started;
        this.id = getId();
        this._start = process.hrtime.bigint();
    }
    // Durations are reported as microseconds. This gives 1000x the precision
    // of something like Date.now(), which reports in milliseconds.
    // Additionally, ~285 years can be safely represented as microseconds as
    // a float64 in both JSON and JavaScript.
    stop() {
        const end = process.hrtime.bigint();
        const duration = (end - this._start) / NUM_OF_MICROSEC_IN_SEC;
        this.status = SpanStatus.Stopped;
        if (duration > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Duration is too long to express as float64: ${duration}`);
        }
        const timestamp = this._start / NUM_OF_MICROSEC_IN_SEC;
        _report.reporter.report(this.name, Number(duration), Number(timestamp), this.id, this.parentId, this.attrs);
    }
    traceChild(name, attrs) {
        return new Span(name, this.id, attrs);
    }
    setAttribute(key, value) {
        this.attrs[key] = String(value);
    }
    traceFn(fn) {
        try {
            return fn();
        } finally{
            this.stop();
        }
    }
    async traceAsyncFn(fn) {
        try {
            return await fn();
        } finally{
            this.stop();
        }
    }
}
exports.Span = Span;
const trace = (name2, parentId1, attrs2)=>{
    return new Span(name2, parentId1, attrs2);
};
exports.trace = trace;
const flushAllTraces = ()=>_report.reporter.flushAll()
;
exports.flushAllTraces = flushAllTraces;

//# sourceMappingURL=trace.js.map