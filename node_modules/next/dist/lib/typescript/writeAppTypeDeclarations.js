"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeAppTypeDeclarations = writeAppTypeDeclarations;
var _fs = require("fs");
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _fileExists = require("../file-exists");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function writeAppTypeDeclarations(baseDir, imageImportsEnabled) {
    // Reference `next` types
    const appTypeDeclarations = _path.default.join(baseDir, 'next-env.d.ts');
    const content = '/// <reference types="next" />' + _os.default.EOL + '/// <reference types="next/types/global" />' + _os.default.EOL + (imageImportsEnabled ? '/// <reference types="next/image-types/global" />' + _os.default.EOL : '') + _os.default.EOL + '// NOTE: This file should not be edited' + _os.default.EOL + '// see https://nextjs.org/docs/basic-features/typescript for more information.' + _os.default.EOL;
    // Avoids a write for read-only filesystems
    if (await (0, _fileExists).fileExists(appTypeDeclarations) && await _fs.promises.readFile(appTypeDeclarations, 'utf8') === content) {
        return;
    }
    await _fs.promises.writeFile(appTypeDeclarations, content);
}

//# sourceMappingURL=writeAppTypeDeclarations.js.map