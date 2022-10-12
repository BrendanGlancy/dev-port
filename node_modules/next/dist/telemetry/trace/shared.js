"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.traceGlobals = exports.TARGET = exports.debugLog = exports.setGlobal = void 0;
var TARGET;
exports.TARGET = TARGET;
(function(TARGET1) {
    TARGET1["CONSOLE"] = "CONSOLE";
    TARGET1["ZIPKIN"] = "ZIPKIN";
    TARGET1["JAEGER"] = "JAEGER";
    TARGET1["TELEMETRY"] = "TELEMETRY";
})(TARGET || (exports.TARGET = TARGET = {
}));
const traceGlobals = new Map();
exports.traceGlobals = traceGlobals;
const setGlobal = (key, val)=>{
    traceGlobals.set(key, val);
};
exports.setGlobal = setGlobal;
const debugLog = !!process.env.TRACE_DEBUG ? console.info : function noop() {
};
exports.debugLog = debugLog;

//# sourceMappingURL=shared.js.map