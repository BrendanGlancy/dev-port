"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isBlockedPage = isBlockedPage;
exports.cleanAmpPath = cleanAmpPath;
exports.mergeResults = mergeResults;
exports.resultsToString = resultsToString;
var _zenObservable = _interopRequireDefault(require("next/dist/compiled/zen-observable"));
var _constants = require("../shared/lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isBlockedPage(pathname) {
    return _constants.BLOCKED_PAGES.includes(pathname);
}
function cleanAmpPath(pathname) {
    if (pathname.match(/\?amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, '?');
    }
    if (pathname.match(/&amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/&amp=(y|yes|true|1)/, '');
    }
    pathname = pathname.replace(/\?$/, '');
    return pathname;
}
function mergeResults(results) {
    // @ts-ignore
    return _zenObservable.default.prototype.concat.call(...results);
}
async function resultsToString(results) {
    const chunks = [];
    await mergeResults(results).forEach((chunk)=>{
        chunks.push(chunk);
    });
    return chunks.join('');
}

//# sourceMappingURL=utils.js.map