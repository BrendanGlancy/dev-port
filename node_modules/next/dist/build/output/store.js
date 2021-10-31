"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.store = void 0;
var _unistore = _interopRequireDefault(require("next/dist/compiled/unistore"));
var _stripAnsi = _interopRequireDefault(require("next/dist/compiled/strip-ansi"));
var Log = _interopRequireWildcard(require("./log"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const store = (0, _unistore).default({
    appUrl: null,
    bindAddr: null,
    bootstrap: true
});
exports.store = store;
let lastStore = {
    appUrl: null,
    bindAddr: null,
    bootstrap: true
};
function hasStoreChanged(nextStore) {
    if ([
        ...new Set([
            ...Object.keys(lastStore),
            ...Object.keys(nextStore)
        ]), 
    ].every((key)=>Object.is(lastStore[key], nextStore[key])
    )) {
        return false;
    }
    lastStore = nextStore;
    return true;
}
store.subscribe((state)=>{
    if (!hasStoreChanged(state)) {
        return;
    }
    if (state.bootstrap) {
        if (state.appUrl) {
            Log.ready(`started server on ${state.bindAddr}, url: ${state.appUrl}`);
        }
        return;
    }
    if (state.loading) {
        Log.wait('compiling...');
        return;
    }
    if (state.errors) {
        Log.error(state.errors[0]);
        const cleanError = (0, _stripAnsi).default(state.errors[0]);
        if (cleanError.indexOf('SyntaxError') > -1) {
            const matches = cleanError.match(/\[.*\]=/);
            if (matches) {
                for (const match of matches){
                    const prop = (match.split(']').shift() || '').substr(1);
                    console.log(`AMP bind syntax [${prop}]='' is not supported in JSX, use 'data-amp-bind-${prop}' instead. https://nextjs.org/docs/messages/amp-bind-jsx-alt`);
                }
                return;
            }
        }
        return;
    }
    if (state.warnings) {
        Log.warn(state.warnings.join('\n\n'));
        if (state.appUrl) {
            Log.info(`ready on ${state.appUrl}`);
        }
        return;
    }
    if (state.typeChecking) {
        Log.info('bundled successfully, waiting for typecheck results...');
        return;
    }
    Log.event('compiled successfully');
});

//# sourceMappingURL=store.js.map