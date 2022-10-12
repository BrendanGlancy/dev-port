"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _react = require("react");
const isServer = typeof window === 'undefined';
class _class extends _react.Component {
    constructor(props){
        super(props);
        this.emitChange = ()=>{
            if (this._hasHeadManager) {
                this.props.headManager.updateHead(this.props.reduceComponentsToState([
                    ...this.props.headManager.mountedInstances
                ], this.props));
            }
        };
        this._hasHeadManager = this.props.headManager && this.props.headManager.mountedInstances;
        if (isServer && this._hasHeadManager) {
            this.props.headManager.mountedInstances.add(this);
            this.emitChange();
        }
    }
    componentDidMount() {
        if (this._hasHeadManager) {
            this.props.headManager.mountedInstances.add(this);
        }
        this.emitChange();
    }
    componentDidUpdate() {
        this.emitChange();
    }
    componentWillUnmount() {
        if (this._hasHeadManager) {
            this.props.headManager.mountedInstances.delete(this);
        }
        this.emitChange();
    }
    render() {
        return null;
    }
}
exports.default = _class;

//# sourceMappingURL=side-effect.js.map