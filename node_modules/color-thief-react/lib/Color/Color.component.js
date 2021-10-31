"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var useColor_1 = tslib_1.__importDefault(require("./useColor"));
function Color(_a) {
    var src = _a.src, format = _a.format, _b = _a.crossOrigin, crossOrigin = _b === void 0 ? undefined : _b, _c = _a.quality, quality = _c === void 0 ? 10 : _c, children = _a.children;
    var state = useColor_1.default(src, format, { crossOrigin: crossOrigin, quality: quality });
    return React.createElement(React.Fragment, null, children(state));
}
exports.default = Color;
//# sourceMappingURL=Color.component.js.map