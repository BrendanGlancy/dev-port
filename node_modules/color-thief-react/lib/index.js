"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPalette = exports.usePalette = exports.Palette = exports.getColor = exports.Color = exports.useColor = void 0;
var tslib_1 = require("tslib");
var Color_component_1 = tslib_1.__importDefault(require("./Color/Color.component"));
exports.Color = Color_component_1.default;
var useColor_1 = tslib_1.__importDefault(require("./Color/useColor"));
exports.useColor = useColor_1.default;
var getColorsPaletteFromImgUrl_1 = tslib_1.__importDefault(require("./utils/getColorsPaletteFromImgUrl"));
exports.getPalette = getColorsPaletteFromImgUrl_1.default;
var Palette_component_1 = tslib_1.__importDefault(require("./Palette/Palette.component"));
exports.Palette = Palette_component_1.default;
var usePalette_1 = tslib_1.__importDefault(require("./Palette/usePalette"));
exports.usePalette = usePalette_1.default;
var getPredominantColorFromImgURL_1 = tslib_1.__importDefault(require("./utils/getPredominantColorFromImgURL"));
exports.getColor = getPredominantColorFromImgURL_1.default;
exports.default = Color_component_1.default;
//# sourceMappingURL=index.js.map