"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cssFileResolve = cssFileResolve;
function cssFileResolve(url, _resourcePath) {
    if (url.startsWith('/')) {
        return false;
    }
    return true;
}

//# sourceMappingURL=file-resolve.js.map