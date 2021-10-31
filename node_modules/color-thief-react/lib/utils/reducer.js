"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var initialReducerState_1 = tslib_1.__importDefault(require("./initialReducerState"));
function reducer(state, action) {
    var responses = {
        start: function () { return initialReducerState_1.default; },
        resolve: function () { return (tslib_1.__assign(tslib_1.__assign({}, state), { data: action.payload, loading: false })); },
        reject: function () { return (tslib_1.__assign(tslib_1.__assign({}, state), { error: action.payload, loading: false })); }
    };
    return responses[action.type]();
}
exports.default = reducer;
//# sourceMappingURL=reducer.js.map