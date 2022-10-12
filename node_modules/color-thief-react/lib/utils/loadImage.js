"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Load a image in a promise
 */
function loadImage(url, crossOrigin) {
    if (crossOrigin === void 0) { crossOrigin = null; }
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function () {
            resolve(img);
        });
        img.addEventListener('error', function () {
            reject(new Error("Color Thief React | Failed to load image URL: " + url));
        });
        img.crossOrigin = crossOrigin;
        img.src = url;
    });
}
exports.default = loadImage;
//# sourceMappingURL=loadImage.js.map