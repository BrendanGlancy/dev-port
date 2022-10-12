"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var color_thief_umd_js_1 = tslib_1.__importDefault(require("colorthief/dist/color-thief.umd.js"));
var _1 = require(".");
function getPredominantColorFromImgURL(imgSrc, format, crossOrigin, quality) {
    if (crossOrigin === void 0) { crossOrigin = null; }
    if (quality === void 0) { quality = 10; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var img, ct, arrayRGB;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _1.loadImage(imgSrc, crossOrigin)];
                case 1:
                    img = _a.sent();
                    ct = new color_thief_umd_js_1.default();
                    arrayRGB = ct.getColor(img, quality);
                    return [2 /*return*/, _1.formatRGB(arrayRGB, format)];
            }
        });
    });
}
exports.default = getPredominantColorFromImgURL;
//# sourceMappingURL=getPredominantColorFromImgURL.js.map