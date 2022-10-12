"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__overrideCssConfiguration = __overrideCssConfiguration;
var _plugins = require("./plugins");
async function __overrideCssConfiguration(rootDirectory, isProduction, config) {
    var ref, ref1;
    const postCssPlugins = await (0, _plugins).getPostCssPlugins(rootDirectory, isProduction);
    function patch(rule) {
        if (rule.options && typeof rule.options === 'object' && typeof rule.options.postcssOptions === 'object') {
            rule.options.postcssOptions.plugins = postCssPlugins;
        } else if (Array.isArray(rule.oneOf)) {
            rule.oneOf.forEach(patch);
        } else if (Array.isArray(rule.use)) {
            rule.use.forEach((u)=>{
                if (typeof u === 'object') {
                    patch(u);
                }
            });
        }
    }
    (ref = config.module) === null || ref === void 0 ? void 0 : (ref1 = ref.rules) === null || ref1 === void 0 ? void 0 : ref1.forEach((entry)=>{
        patch(entry);
    });
}

//# sourceMappingURL=overrideCssConfiguration.js.map