"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.matchHas = matchHas;
exports.compileNonPath = compileNonPath;
exports.default = prepareDestination;
exports.getSafeParamName = void 0;
var _parseUrl = require("./parse-url");
var pathToRegexp = _interopRequireWildcard(require("next/dist/compiled/path-to-regexp"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const getSafeParamName = (paramName)=>{
    let newParamName = '';
    for(let i = 0; i < paramName.length; i++){
        const charCode = paramName.charCodeAt(i);
        if (charCode > 64 && charCode < 91 || charCode > 96 && charCode < 123 // a-z
        ) {
            newParamName += paramName[i];
        }
    }
    return newParamName;
};
exports.getSafeParamName = getSafeParamName;
function matchHas(req, has, query) {
    const params = {
    };
    const allMatch = has.every((hasItem)=>{
        let value;
        let key = hasItem.key;
        switch(hasItem.type){
            case 'header':
                {
                    key = key.toLowerCase();
                    value = req.headers[key];
                    break;
                }
            case 'cookie':
                {
                    value = req.cookies[hasItem.key];
                    break;
                }
            case 'query':
                {
                    value = query[key];
                    break;
                }
            case 'host':
                {
                    const { host  } = (req === null || req === void 0 ? void 0 : req.headers) || {
                    };
                    // remove port from host if present
                    const hostname = host === null || host === void 0 ? void 0 : host.split(':')[0].toLowerCase();
                    value = hostname;
                    break;
                }
            default:
                {
                    break;
                }
        }
        if (!hasItem.value && value) {
            params[getSafeParamName(key)] = value;
            return true;
        } else if (value) {
            const matcher = new RegExp(`^${hasItem.value}$`);
            const matches = value.match(matcher);
            if (matches) {
                if (matches.groups) {
                    Object.keys(matches.groups).forEach((groupKey)=>{
                        params[groupKey] = matches.groups[groupKey];
                    });
                } else if (hasItem.type === 'host' && matches[0]) {
                    params.host = matches[0];
                }
                return true;
            }
        }
        return false;
    });
    if (allMatch) {
        return params;
    }
    return false;
}
function compileNonPath(value, params) {
    if (!value.includes(':')) {
        return value;
    }
    for (const key of Object.keys(params)){
        if (value.includes(`:${key}`)) {
            value = value.replace(new RegExp(`:${key}\\*`, 'g'), `:${key}--ESCAPED_PARAM_ASTERISKS`).replace(new RegExp(`:${key}\\?`, 'g'), `:${key}--ESCAPED_PARAM_QUESTION`).replace(new RegExp(`:${key}\\+`, 'g'), `:${key}--ESCAPED_PARAM_PLUS`).replace(new RegExp(`:${key}(?!\\w)`, 'g'), `--ESCAPED_PARAM_COLON${key}`);
        }
    }
    value = value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g, '\\$1').replace(/--ESCAPED_PARAM_PLUS/g, '+').replace(/--ESCAPED_PARAM_COLON/g, ':').replace(/--ESCAPED_PARAM_QUESTION/g, '?').replace(/--ESCAPED_PARAM_ASTERISKS/g, '*');
    // the value needs to start with a forward-slash to be compiled
    // correctly
    return pathToRegexp.compile(`/${value}`, {
        validate: false
    })(params).substr(1);
}
function prepareDestination(destination, params, query, appendParamsToQuery) {
    // clone query so we don't modify the original
    query = Object.assign({
    }, query);
    const hadLocale = query.__nextLocale;
    delete query.__nextLocale;
    delete query.__nextDefaultLocale;
    const parsedDestination = (0, _parseUrl).parseUrl(destination);
    const destQuery = parsedDestination.query;
    const destPath = `${parsedDestination.pathname}${parsedDestination.hash || ''}`;
    const destPathParamKeys = [];
    pathToRegexp.pathToRegexp(destPath, destPathParamKeys);
    const destPathParams = destPathParamKeys.map((key)=>key.name
    );
    let destinationCompiler = pathToRegexp.compile(destPath, // we don't validate while compiling the destination since we should
    // have already validated before we got to this point and validating
    // breaks compiling destinations with named pattern params from the source
    // e.g. /something:hello(.*) -> /another/:hello is broken with validation
    // since compile validation is meant for reversing and not for inserting
    // params from a separate path-regex into another
    {
        validate: false
    });
    let newUrl;
    // update any params in query values
    for (const [key, strOrArray] of Object.entries(destQuery)){
        // the value needs to start with a forward-slash to be compiled
        // correctly
        if (Array.isArray(strOrArray)) {
            destQuery[key] = strOrArray.map((value)=>compileNonPath(value, params)
            );
        } else {
            destQuery[key] = compileNonPath(strOrArray, params);
        }
    }
    // add path params to query if it's not a redirect and not
    // already defined in destination query or path
    let paramKeys = Object.keys(params);
    // remove internal param for i18n
    if (hadLocale) {
        paramKeys = paramKeys.filter((name)=>name !== 'nextInternalLocale'
        );
    }
    if (appendParamsToQuery && !paramKeys.some((key1)=>destPathParams.includes(key1)
    )) {
        for (const key1 of paramKeys){
            if (!(key1 in destQuery)) {
                destQuery[key1] = params[key1];
            }
        }
    }
    try {
        newUrl = destinationCompiler(params);
        const [pathname, hash] = newUrl.split('#');
        parsedDestination.pathname = pathname;
        parsedDestination.hash = `${hash ? '#' : ''}${hash || ''}`;
        delete parsedDestination.search;
    } catch (err) {
        if (err.message.match(/Expected .*? to not repeat, but got an array/)) {
            throw new Error(`To use a multi-match in the destination you must add \`*\` at the end of the param name to signify it should repeat. https://nextjs.org/docs/messages/invalid-multi-match`);
        }
        throw err;
    }
    // Query merge order lowest priority to highest
    // 1. initial URL query values
    // 2. path segment values
    // 3. destination specified query values
    parsedDestination.query = {
        ...query,
        ...parsedDestination.query
    };
    return {
        newUrl,
        parsedDestination
    };
}

//# sourceMappingURL=prepare-destination.js.map