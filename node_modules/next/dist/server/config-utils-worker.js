"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.install = install;
exports.shouldLoadWithWebpack5 = shouldLoadWithWebpack5;
var _env = require("@next/env");
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../shared/lib/constants");
var _configShared = require("./config-shared");
var Log = _interopRequireWildcard(require("../build/output/log"));
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
let installed = false;
function install(useWebpack5) {
    if (installed) {
        return;
    }
    installed = true;
    (0, _webpack).init(useWebpack5);
    // hook the Node.js require so that webpack requires are
    // routed to the bundled and now initialized webpack version
    require('../build/webpack/require-hook');
}
async function shouldLoadWithWebpack5(phase, dir) {
    var ref;
    await (0, _env).loadEnvConfig(dir, phase === _constants.PHASE_DEVELOPMENT_SERVER, Log);
    const path = await (0, _findUp).default(_constants.CONFIG_FILE, {
        cwd: dir
    });
    if (Number(process.env.NEXT_PRIVATE_TEST_WEBPACK4_MODE) > 0) {
        return {
            enabled: false,
            reason: 'test-mode'
        };
    }
    // Use webpack 5 by default in apps that do not have next.config.js
    if (!(path === null || path === void 0 ? void 0 : path.length)) {
        return {
            enabled: true,
            reason: 'default'
        };
    }
    // Default to webpack 4 for backwards compatibility on boot:
    install(false);
    const userConfigModule = require(path);
    const userConfig = (0, _configShared).normalizeConfig(phase, userConfigModule.default || userConfigModule);
    if ((ref = userConfig.future) === null || ref === void 0 ? void 0 : ref.webpack5) {
        return {
            enabled: false,
            reason: 'future-flag'
        };
    }
    if (userConfig.webpack5 === false) {
        return {
            enabled: false,
            reason: 'flag-disabled'
        };
    }
    return {
        enabled: true,
        reason: 'default'
    };
}

//# sourceMappingURL=config-utils-worker.js.map