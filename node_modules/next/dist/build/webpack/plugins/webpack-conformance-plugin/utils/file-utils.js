"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLocalFileName = getLocalFileName;
const cwd = process.cwd();
function getLocalFileName(request) {
    return request.substr(request.lastIndexOf(cwd) + cwd.length);
}

//# sourceMappingURL=file-utils.js.map