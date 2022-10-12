"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var color_thief_umd_js_1 = tslib_1.__importDefault(require("colorthief/dist/color-thief.umd.js"));
var _1 = require(".");
/**
 * Get a list of colors from img url
 */
function getColorsPaletteFromImgUrl(imgUrl, colorCount, format, crossOrigin, quality) {
    if (colorCount === void 0) { colorCount = 2; }
    if (crossOrigin === void 0) { crossOrigin = null; }
    if (quality === void 0) { quality = 10; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var img, cf, arrayRGB;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _1.loadImage(imgUrl, crossOrigin)];
                case 1:
                    img = _a.sent();
                    cf = new color_thief_umd_js_1.default();
                    arrayRGB = cf.getPalette(img, colorCount, quality);
                    return [2 /*return*/, arrayRGB.map(function (color) { return _1.formatRGB(color, format); })];
            }
        });
    });
}
exports.default = getColorsPaletteFromImgUrl;
//# sourceMappingURL=getColorsPaletteFromImgUrl.js.map