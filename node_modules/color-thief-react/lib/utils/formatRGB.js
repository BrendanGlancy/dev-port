"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var color_convert_1 = tslib_1.__importDefault(require("color-convert"));
var rgbStringfy_1 = tslib_1.__importDefault(require("./rgbStringfy"));
var hslStringfy_1 = tslib_1.__importDefault(require("./hslStringfy"));
var formatHex_1 = tslib_1.__importDefault(require("./formatHex"));
/**
 * Transform a RGB Array to another color format
 */
function formatRGB(arrayRGB, format) {
    var responses = {
        rgbString: function () { return rgbStringfy_1.default.apply(void 0, arrayRGB); },
        hex: function () {
            var _a;
            return formatHex_1.default((_a = color_convert_1.default.rgb).hex.apply(_a, arrayRGB));
        },
        rgbArray: function () { return arrayRGB; },
        hslString: function () {
            var _a;
            return hslStringfy_1.default((_a = color_convert_1.default.rgb).hsl.apply(_a, arrayRGB));
        },
        hslArray: function () {
            var _a;
            return (_a = color_convert_1.default.rgb).hsl.apply(_a, arrayRGB);
        },
        keyword: function () {
            var _a;
            return (_a = color_convert_1.default.rgb).keyword.apply(_a, arrayRGB);
        }
    };
    return responses[format]();
}
exports.default = formatRGB;
//# sourceMappingURL=formatRGB.js.map