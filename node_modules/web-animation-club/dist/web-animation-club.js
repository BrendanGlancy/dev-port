(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["wac"] = factory();
	else
		root["wac"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setCssEndEvent = setCssEndEvent;\nexports.beforeCssLayout = beforeCssLayout;\nexports.beforeNextCssLayout = beforeNextCssLayout;\nexports.beforeFutureCssLayout = beforeFutureCssLayout;\nexports.onceNextCssLayout = onceNextCssLayout;\nexports.onceTransitionEnd = onceTransitionEnd;\nexports.onceAnimationEnd = onceAnimationEnd;\nfunction recursiveAnimationFrame(frames, callback) {\n  if (window && frames && Number.isInteger(frames) && frames > 0) {\n    window.requestAnimationFrame(function () {\n      recursiveAnimationFrame(frames - 1, callback);\n    });\n    return;\n  }\n  callback();\n}\n\nfunction setCssEndEvent(element, type) {\n  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},\n      _ref$tolerance = _ref.tolerance,\n      tolerance = _ref$tolerance === undefined ? 0 : _ref$tolerance,\n      propertyName = _ref.propertyName;\n\n  return new Promise(function (resolve) {\n    if (!element) {\n      resolve(false);\n      return;\n    }\n    var eventName = null;\n    var capitalized = type.charAt(0).toUpperCase() + type.slice(1);\n    var run = 0;\n    function end(event) {\n      var target = event.srcElement || event.target;\n      if (target === element) {\n        if (run >= tolerance) {\n          if (propertyName && propertyName !== event.propertyName) {\n            return;\n          }\n          element.removeEventListener(eventName, end);\n          resolve(event);\n        }\n        run += 1;\n      }\n    }\n    if (element.style[\"Webkit\" + capitalized] !== undefined) {\n      eventName = \"webkit\" + capitalized + \"End\";\n    }\n    if (element.style.OTransition !== undefined) {\n      eventName = \"o\" + type + \"End\";\n    }\n    if (element.style[type] !== undefined) {\n      eventName = type + \"end\";\n    }\n    if (element.clearCssEndEvent) {\n      element.clearCssEndEvent();\n    }\n    element.clearCssEndEvent = function () {\n      element.removeEventListener(eventName, end);\n    };\n    element.addEventListener(eventName, end);\n  });\n}\n\nfunction beforeCssLayout(callback) {\n  window && window.requestAnimationFrame(callback);\n}\n\nfunction beforeNextCssLayout(callback) {\n  window && window.requestAnimationFrame(function () {\n    window.requestAnimationFrame(callback);\n  });\n}\n\nfunction beforeFutureCssLayout(frames, callback) {\n  recursiveAnimationFrame(frames + 1, callback);\n}\n\nfunction onceNextCssLayout() {\n  return new Promise(function (resolve) {\n    beforeNextCssLayout(resolve);\n  });\n}\n\nfunction onceTransitionEnd(element) {\n  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n  return new Promise(function (resolve) {\n    setCssEndEvent(element, \"transition\", options).then(resolve);\n  });\n}\n\nfunction onceAnimationEnd(element) {\n  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n  return new Promise(function (resolve) {\n    setCssEndEvent(element, \"animation\", options).then(resolve);\n  });\n}\n\n//# sourceURL=webpack://wac/./src/index.js?");

/***/ })

/******/ });
});