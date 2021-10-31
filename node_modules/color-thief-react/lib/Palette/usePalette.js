"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var use_current_effect_1 = require("use-current-effect");
var utils_1 = require("../utils");
/**
 * React Hook to get palette color from img url
 */
function usePalette(imgSrc, colorCount, format, options) {
    if (colorCount === void 0) { colorCount = 2; }
    if (options === void 0) { options = {}; }
    var _a = options.crossOrigin, crossOrigin = _a === void 0 ? null : _a, _b = options.quality, quality = _b === void 0 ? 10 : _b;
    var _c = React.useReducer(utils_1.reducer, utils_1.initialReducerState), state = _c[0], dispatch = _c[1];
    use_current_effect_1.useCurrentEffect(function (isCurrent) {
        dispatch({ type: 'start', payload: null });
        utils_1.getColorsPaletteFromImgUrl(imgSrc, colorCount, format, crossOrigin, quality)
            .then(function (color) {
            if (isCurrent()) {
                dispatch({ type: 'resolve', payload: color });
            }
        })
            .catch(function (ex) {
            if (isCurrent()) {
                dispatch({ type: 'reject', payload: ex });
            }
        });
    }, [imgSrc]);
    return state;
}
exports.default = usePalette;
//# sourceMappingURL=usePalette.js.map