"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventCliSession = eventCliSession;
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _path = _interopRequireDefault(require("path"));
var _constants = require("../../shared/lib/constants");
var _config = require("../../server/config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const EVENT_VERSION = 'NEXT_CLI_SESSION_STARTED';
function hasBabelConfig(dir) {
    try {
        var ref, ref1, ref2, ref3;
        const noopFile = _path.default.join(dir, 'noop.js');
        const res = require('next/dist/compiled/babel/core').loadPartialConfig({
            cwd: dir,
            filename: noopFile,
            sourceFileName: noopFile
        });
        const isForTooling = ((ref = res.options) === null || ref === void 0 ? void 0 : (ref1 = ref.presets) === null || ref1 === void 0 ? void 0 : ref1.every((e)=>{
            var ref4;
            return (e === null || e === void 0 ? void 0 : (ref4 = e.file) === null || ref4 === void 0 ? void 0 : ref4.request) === 'next/babel';
        })) && ((ref2 = res.options) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.plugins) === null || ref3 === void 0 ? void 0 : ref3.length) === 0;
        return res.hasFilesystemConfig() && !isForTooling;
    } catch  {
        return false;
    }
}
function getNextConfig(phase, dir) {
    try {
        const configurationPath = _findUp.default.sync(_constants.CONFIG_FILE, {
            cwd: dir
        });
        if (configurationPath) {
            // This should've already been loaded, and thus should be cached / won't
            // be re-evaluated.
            const configurationModule = require(configurationPath);
            // Re-normalize the configuration.
            return (0, _config).normalizeConfig(phase, configurationModule.default || configurationModule);
        }
    } catch  {
    // ignored
    }
    return null;
}
function eventCliSession(phase, dir, event) {
    // This should be an invariant, if it fails our build tooling is broken.
    if (typeof "11.1.2" !== 'string') {
        return [];
    }
    const userConfiguration = getNextConfig(phase, dir);
    const { images , i18n  } = userConfiguration || {
    };
    var ref1;
    const payload = {
        nextVersion: "11.1.2",
        nodeVersion: process.version,
        cliCommand: event.cliCommand,
        isSrcDir: event.isSrcDir,
        hasNowJson: event.hasNowJson,
        isCustomServer: event.isCustomServer,
        hasNextConfig: !!userConfiguration,
        buildTarget: (ref1 = userConfiguration === null || userConfiguration === void 0 ? void 0 : userConfiguration.target) !== null && ref1 !== void 0 ? ref1 : 'default',
        hasWebpackConfig: typeof (userConfiguration === null || userConfiguration === void 0 ? void 0 : userConfiguration.webpack) === 'function',
        hasBabelConfig: hasBabelConfig(dir),
        imageEnabled: !!images,
        basePathEnabled: !!(userConfiguration === null || userConfiguration === void 0 ? void 0 : userConfiguration.basePath),
        i18nEnabled: !!i18n,
        locales: (i18n === null || i18n === void 0 ? void 0 : i18n.locales) ? i18n.locales.join(',') : null,
        localeDomainsCount: (i18n === null || i18n === void 0 ? void 0 : i18n.domains) ? i18n.domains.length : null,
        localeDetectionEnabled: !i18n ? null : i18n.localeDetection !== false,
        imageDomainsCount: (images === null || images === void 0 ? void 0 : images.domains) ? images.domains.length : null,
        imageSizes: (images === null || images === void 0 ? void 0 : images.sizes) ? images.sizes.join(',') : null,
        imageLoader: images === null || images === void 0 ? void 0 : images.loader,
        trailingSlashEnabled: !!(userConfiguration === null || userConfiguration === void 0 ? void 0 : userConfiguration.trailingSlash),
        reactStrictMode: !!(userConfiguration === null || userConfiguration === void 0 ? void 0 : userConfiguration.reactStrictMode),
        webpackVersion: event.webpackVersion || null
    };
    return [
        {
            eventName: EVENT_VERSION,
            payload
        }
    ];
}

//# sourceMappingURL=version.js.map