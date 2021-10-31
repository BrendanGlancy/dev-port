"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "install", {
    enumerable: true,
    get: function() {
        return _configUtilsWorker.install;
    }
});
Object.defineProperty(exports, "shouldLoadWithWebpack5", {
    enumerable: true,
    get: function() {
        return _configUtilsWorker.shouldLoadWithWebpack5;
    }
});
exports.loadWebpackHook = loadWebpackHook;
var _path = _interopRequireDefault(require("path"));
var _jestWorker = require("jest-worker");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _configUtilsWorker = require("./config-utils-worker");
var _constants = require("../shared/lib/constants");
var _utils = require("./lib/utils");
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
function reasonMessage(reason) {
    switch(reason){
        case 'default':
            return 'Enabled by default';
        case 'flag-disabled':
            return 'webpack5 flag is set to false in next.config.js';
        case 'test-mode':
            return 'internal test mode';
        default:
            return '';
    }
}
async function loadWebpackHook(phase, dir) {
    let useWebpack5 = true;
    let usesRemovedFlag = false;
    const worker = new _jestWorker.Worker(_path.default.resolve(__dirname, './config-utils-worker.js'), {
        enableWorkerThreads: false,
        numWorkers: 1,
        forkOptions: {
            env: {
                ...process.env,
                NODE_OPTIONS: (0, _utils).getNodeOptionsWithoutInspect()
            }
        }
    });
    try {
        const result = await worker.shouldLoadWithWebpack5(phase, dir);
        if (result.reason === 'future-flag') {
            usesRemovedFlag = true;
        } else {
            if (phase !== _constants.PHASE_PRODUCTION_SERVER) {
                Log.info(`Using webpack ${result.enabled ? '5' : '4'}. Reason: ${reasonMessage(result.reason)} https://nextjs.org/docs/messages/webpack5`);
            }
        }
        useWebpack5 = Boolean(result.enabled);
    } catch  {
    // If this errors, it likely will do so again upon boot, so we just swallow
    // it here.
    } finally{
        worker.end();
    }
    if (usesRemovedFlag) {
        throw new Error('`future.webpack5` in `next.config.js` has moved to the top level `webpack5` flag https://nextjs.org/docs/messages/future-webpack5-moved-to-webpack5');
    }
    (0, _configUtilsWorker).install(useWebpack5);
}

//# sourceMappingURL=config-utils.js.map