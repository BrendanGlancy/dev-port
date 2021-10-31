"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _router = _interopRequireDefault(require("next/router"));
var _onDemandEntriesUtils = require("./on-demand-entries-utils");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = _asyncToGenerator((function*({ assetPrefix  }) {
    _router.default.ready(()=>{
        _router.default.events.on('routeChangeComplete', _onDemandEntriesUtils.setupPing.bind(this, assetPrefix, ()=>_router.default.pathname
        ));
    });
    (0, _onDemandEntriesUtils).setupPing(assetPrefix, ()=>_router.default.query.__NEXT_PAGE || _router.default.pathname
    , _onDemandEntriesUtils.currentPage);
    // prevent HMR connection from being closed when running tests
    if (!process.env.__NEXT_TEST_MODE) {
        document.addEventListener('visibilitychange', (_event)=>{
            const state = document.visibilityState;
            if (state === 'visible') {
                (0, _onDemandEntriesUtils).setupPing(assetPrefix, ()=>_router.default.pathname
                , true);
            } else {
                (0, _onDemandEntriesUtils).closePing();
            }
        });
        window.addEventListener('beforeunload', ()=>{
            (0, _onDemandEntriesUtils).closePing();
        });
    }
}).bind(void 0)).bind(void 0);
exports.default = _default;

//# sourceMappingURL=on-demand-entries-client.js.map