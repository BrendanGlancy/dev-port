"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var usePalette_1 = tslib_1.__importDefault(require("./usePalette"));
function Palette(_a) {
    var src = _a.src, _b = _a.colorCount, colorCount = _b === void 0 ? 2 : _b, format = _a.format, _c = _a.crossOrigin, crossOrigin = _c === void 0 ? undefined : _c, _d = _a.quality, quality = _d === void 0 ? 10 : _d, children = _a.children;
    var state = usePalette_1.default(src, colorCount, format, {
        crossOrigin: crossOrigin,
        quality: quality
    });
    return React.createElement(React.Fragment, null, children(state));
}
exports.default = Palette;
//# sourceMappingURL=Palette.component.js.map