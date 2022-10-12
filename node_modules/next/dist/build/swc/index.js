"use strict";
const { loadBinding  } = require('@node-rs/helper');
const path = require('path');
/**
 * __dirname means load native addon from current dir
 * 'next-swc' is the name of native addon
 * the second arguments was decided by `napi.name` field in `package.json`
 * the third arguments was decided by `name` field in `package.json`
 * `loadBinding` helper will load `next-swc.[PLATFORM].node` from `__dirname` first
 * If failed to load addon, it will fallback to load from `next-swc-[PLATFORM]`
 */ const bindings = loadBinding(path.join(__dirname, '../../../native'), 'next-swc', '@next/swc');
async function transform(src, options) {
    var ref;
    const isModule = typeof src !== 'string';
    options = options || {
    };
    if (options === null || options === void 0 ? void 0 : (ref = options.jsc) === null || ref === void 0 ? void 0 : ref.parser) {
        var _syntax;
        options.jsc.parser.syntax = (_syntax = options.jsc.parser.syntax) !== null && _syntax !== void 0 ? _syntax : 'ecmascript';
    }
    const { plugin , ...newOptions } = options;
    if (plugin) {
        var ref1;
        const m = typeof src === 'string' ? await this.parse(src, options === null || options === void 0 ? void 0 : (ref1 = options.jsc) === null || ref1 === void 0 ? void 0 : ref1.parser) : src;
        return this.transform(plugin(m), newOptions);
    }
    return bindings.transform(isModule ? JSON.stringify(src) : src, isModule, toBuffer(newOptions));
}
function transformSync(src, options) {
    var ref2;
    const isModule = typeof src !== 'string';
    options = options || {
    };
    if (options === null || options === void 0 ? void 0 : (ref2 = options.jsc) === null || ref2 === void 0 ? void 0 : ref2.parser) {
        var _syntax;
        options.jsc.parser.syntax = (_syntax = options.jsc.parser.syntax) !== null && _syntax !== void 0 ? _syntax : 'ecmascript';
    }
    const { plugin , ...newOptions } = options;
    if (plugin) {
        var ref3;
        const m = typeof src === 'string' ? this.parseSync(src, options === null || options === void 0 ? void 0 : (ref3 = options.jsc) === null || ref3 === void 0 ? void 0 : ref3.parser) : src;
        return this.transformSync(plugin(m), newOptions);
    }
    return bindings.transformSync(isModule ? JSON.stringify(src) : src, isModule, toBuffer(newOptions));
}
function toBuffer(t) {
    return Buffer.from(JSON.stringify(t));
}
module.exports.transform = transform;
module.exports.transformSync = transformSync;

//# sourceMappingURL=index.js.map