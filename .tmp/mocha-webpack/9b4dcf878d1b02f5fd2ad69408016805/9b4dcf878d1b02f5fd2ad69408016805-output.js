/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This gets replaced by webpack with the updated files on rebuild
var __webpackManifest__ = ['../src', './json.test.js'];

var testsContext = __webpack_require__(1);

function inManifest(path) {
  return __webpackManifest__.indexOf(path) >= 0;
}

var runnable = testsContext.keys().filter(inManifest);

runnable.forEach(testsContext);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./json.test.js": 2,
	"./xmldom.test.js": 7
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 1;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _src = __webpack_require__(3);

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chai = __webpack_require__(6);
var should = chai.should,
    expect = chai.expect,
    equal = chai.equal;


describe('JSON', function () {
  it('should handle empty element', function (done) {
    var test = { root: {} };
    var res = _src2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><root/>');
    done();
  });

  it('should read string as text', function (done) {
    var test = { foo: "bar" };
    var res = _src2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });

  it('should read @ element as attribute', function (done) {
    var test = { foo: { "@baz": "bar" } };
    var res = _src2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo baz="bar"/>');
    done();
  });

  it('should read #text element as text', function (done) {
    var test = { foo: { "#text": "bar" } };
    var res = _src2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });
  it('should handle arrays', function (done) {
    var test = { foo: { bar: [{ id: "1" }, { id: "2" }] } };
    var res = _src2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>');
    done();
  });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _xmlbuilder = __webpack_require__(4);

var _xmlbuilder2 = _interopRequireDefault(_xmlbuilder);

var _xmldom = __webpack_require__(5);

var _xmldom2 = _interopRequireDefault(_xmldom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XMapper = {
    jsonToXML: function jsonToXML(json) {
        return _xmlbuilder2.default.create(json).end();
    },
    generateDom: function generateDom(xml) {
        return new _xmldom2.default().parseFromString(xml);
    }
};

exports.default = XMapper;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("xmlbuilder");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("xmldom");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ })
/******/ ]);