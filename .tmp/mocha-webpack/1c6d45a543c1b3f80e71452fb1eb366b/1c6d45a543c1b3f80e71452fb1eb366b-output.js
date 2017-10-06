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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xmlbuilder__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xmlbuilder___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_xmlbuilder__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_xmldom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_xmldom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_xmldom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_xpath__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_xpath___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_xpath__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }





var ResponseTypes = { XML: 'XML', JSON: 'JSON', STRING: 'STRING', NUMBER: 'NUMBER', BOOLEAN: 'BOOLEAN' };

var XMapperService = {
    ResponseTypes: ResponseTypes,
    traces: [],
    handleTrace: function handleTrace(trace, e) {
        var path = [];

        while (e && e.nodeName !== '#document') {
            var index = 0;
            var sibling = e.previousSibling;
            while (sibling && sibling.constructor.name == 'Element') {
                if (sibling.nodeName == e.nodeName) index++;
                sibling = sibling.previousSibling;
            }
            if (index > 0) {
                path.push(index);
            }
            if (index == 0) {
                sibling = e.nextSibling;
                while (sibling && sibling.constructor.name == 'Element') {
                    if (sibling.nodeName == e.nodeName) {
                        path.push(0);
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
            }
            path.push(e.nodeName);
            e = e.parentNode;
        }
        XMapperService.traces.push({ trace: trace, path: path });
    },
    jsonToXML: function jsonToXML(json) {
        if ((typeof json === 'undefined' ? 'undefined' : _typeof(json)) !== 'object') {
            try {
                json = JSON.parse(json);
            } catch (e) {
                return json.toString();
            }
        }
        return __WEBPACK_IMPORTED_MODULE_0_xmlbuilder___default.a.create(json).end();
    },
    xmlToJson: function xmlToJson(xml) {
        if (typeof xml == 'string') xml = XMapperService.generateDom(xml);
        return _xmlToJson(xml);
    },
    generateDom: function generateDom(input) {
        if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
            if (input.constructor.name === 'Document') return input;
            input = XMapperService.jsonToXML(input);
        }
        return new __WEBPACK_IMPORTED_MODULE_1_xmldom__["DOMParser"]().parseFromString(input, "application/xml");
    },
    parseQuery: function parseQuery(query) {
        return __WEBPACK_IMPORTED_MODULE_2_xpath___default.a.parse(query);
    },
    query: function query(dom, expr, type, variables, trace, multipart) {
        if (dom == null) return null;
        type = type || ResponseTypes.STRING;
        expr = typeof expr === 'string' ? __WEBPACK_IMPORTED_MODULE_2_xpath___default.a.parse(expr) : expr;
        if (Array.isArray(dom)) return XMapperService.queryEach(dom, expr, type, variables, trace, multipart);
        if (!multipart && trace) XMapperService.traces = [];
        dom = XMapperService.generateDom(dom);
        var options = { node: dom, variables: variables, functions: xpathFunctions };
        var result = !~[ResponseTypes.XML, ResponseTypes.JSON].indexOf(type) ? expr.evaluate(options) : expr.select(options);
        if (trace) (Array.isArray(result) ? result : result.nodes).forEach(function (e) {
            return XMapperService.handleTrace(trace, e);
        });
        if (Array.isArray(result) && result.length == 0 || result == '') return null;
        switch (type) {
            case ResponseTypes.NUMBER:
                if (typeof result === 'number') return result;
                return parseFloat(result.toString());
            case ResponseTypes.BOOLEAN:
                return result.toString() === 'true';
            case ResponseTypes.JSON:
                var parsed = new __WEBPACK_IMPORTED_MODULE_1_xmldom__["DOMImplementation"]().createDocument();
                result.forEach(function (e) {
                    return parsed.appendChild(e);
                });
                return XMapperService.xmlToJson(parsed);
            case ResponseTypes.XML:
                var parsed = new __WEBPACK_IMPORTED_MODULE_1_xmldom__["DOMImplementation"]().createDocument();
                result.forEach(function (e) {
                    return parsed.appendChild(e);
                });
                return parsed;
            default:
                return result.toString();
        }
    },
    queryEach: function queryEach(dom, expr, type, variables, trace, multipart) {
        if (!multipart && trace) XMapperService.traces = [];
        var result = dom.reduce(function (res, curr) {
            var processed = XMapperService.query(curr, expr, type, variables, trace, true);
            if (processed) {
                if (!res) res = [];
                res.push(processed);
            }
            return res;
        }, null);
        return result;
    },
    map: function map(mappings, initial, result, variables, trace, multipart) {
        if (Array.isArray(initial)) return XMapperService.mapEach(mappings, initial, result, variables, trace);
        if (!multipart && trace) XMapperService.traces = [];
        if (!result) result = {};
        mappings.forEach(function (mapping) {
            //if(!mapping.expression || !mapping.outputPath && mapping.outputPath !== "") throw "Mapping is invalid"
            var parsed = XMapperService.query(initial, mapping.expression, mapping.type || ResponseTypes.JSON, variables, trace ? mapping.outputPath !== "" ? mapping.outputPath : "#root" : false, true);
            if (!parsed) return;
            result = XMapperService.mapValueToResult(mapping.outputPath, parsed, result);
        });
        return result;
    },
    mapEach: function mapEach(mappings, initial, result, variables, trace) {
        if (trace) XMapperService.traces = [];
        var result = initial.reduce(function (res, curr) {
            var processed = XMapperService.map(mappings, curr, result, variables, trace, true);
            if (processed) {
                if (!res) res = [];
                res.push(processed);
            }
            return res;
        }, null);
        return result;
    },
    mapValueToResult: function mapValueToResult(path, value, output) {
        if (!path || path == "") return value;
        var result = Object.assign({}, output);
        path.split('.').reduce(function (res, el, i, arr) {
            var isLast = i == arr.length - 1;
            var isArray = isLast && el.endsWith('[]');
            if (isArray) el = el.substr(0, el.length - 2);
            if (!res[el]) {
                res[el] = isArray ? [] : {};
            } else if (isArray && !Array.isArray(res[el])) {
                res[el] = [res[el]];
            }

            if (isLast) {
                if (isArray) return res[el].push(value);
                res[el] = value;
            }
            return res[el];
        }, result);
        return result;
    }
};

var _default = XMapperService;
/* harmony default export */ __webpack_exports__["a"] = (_default);
var xpathFunctions = {
    min: function min(context, _ref) {
        var nodes = _ref.nodes;
        return Math.min.apply(Math, _toConsumableArray(nodes.map(function (n) {
            return n.nodeValue;
        })));
    },
    max: function max(context, _ref2) {
        var nodes = _ref2.nodes;
        return Math.max.apply(Math, _toConsumableArray(nodes.map(function (n) {
            return n.nodeValue;
        })));
    },
    avg: function avg(context, _ref3) {
        var nodes = _ref3.nodes;
        return nodes.reduce(function (a, b) {
            return a + parseFloat(b.nodeValue);
        }, 0) / nodes.length;
    }
};
var _xmlToJson = function _xmlToJson(xml) {
    var obj = {};
    Object.keys(xml.attributes || {}).forEach(function (key) {
        var attr = xml.attributes[key];
        if (attr.constructor.name !== "Attr") return;
        obj["@" + attr.nodeName] = attr.nodeValue;
    });
    if (xml.constructor.name == "Text") return xml.nodeValue;
    Object.keys(xml.childNodes || {}).forEach(function (key) {
        var item = xml.childNodes[key];
        var nodeName = item.nodeName;
        if (!nodeName) return;
        if (!obj[nodeName]) {
            obj[nodeName] = _xmlToJson(item);
        } else {
            if (!Array.isArray(obj[nodeName])) {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
            }
            obj[nodeName].push(_xmlToJson(item));
        }
    });
    var keys = Object.keys(obj) || [];
    if (keys.length == 1 && keys[0] == "#text") return obj['#text'];
    return obj;
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(ResponseTypes, 'ResponseTypes', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/src/XMapperService.js');

    __REACT_HOT_LOADER__.register(XMapperService, 'XMapperService', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/src/XMapperService.js');

    __REACT_HOT_LOADER__.register(xpathFunctions, 'xpathFunctions', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/src/XMapperService.js');

    __REACT_HOT_LOADER__.register(_xmlToJson, 'xmlToJson', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/src/XMapperService.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/src/XMapperService.js');
}();

;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


// This gets replaced by webpack with the updated files on rebuild
var __webpackManifest__ = ['../../src/XMapperService', './1c6d45a543c1b3f80e71452fb1eb366b-entry.js', './Service/mapping.test.js', './Service/xml-json-conversions.test.js', './Service/xmldom.test.js', './Service/xpath.test.js'];

var testsContext = __webpack_require__(3);

function inManifest(path) {
    return __webpackManifest__.indexOf(path) >= 0;
}

var runnable = testsContext.keys().filter(inManifest);

runnable.forEach(testsContext);
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(__webpackManifest__, "__webpackManifest__", "C:/Users/dandelp/Source/Repos/monaco-pegjs/.tmp/mocha-webpack/1c6d45a543c1b3f80e71452fb1eb366b-entry.js");

    __REACT_HOT_LOADER__.register(testsContext, "testsContext", "C:/Users/dandelp/Source/Repos/monaco-pegjs/.tmp/mocha-webpack/1c6d45a543c1b3f80e71452fb1eb366b-entry.js");

    __REACT_HOT_LOADER__.register(inManifest, "inManifest", "C:/Users/dandelp/Source/Repos/monaco-pegjs/.tmp/mocha-webpack/1c6d45a543c1b3f80e71452fb1eb366b-entry.js");

    __REACT_HOT_LOADER__.register(runnable, "runnable", "C:/Users/dandelp/Source/Repos/monaco-pegjs/.tmp/mocha-webpack/1c6d45a543c1b3f80e71452fb1eb366b-entry.js");
}();

;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Service/mapping.test.js": 4,
	"./Service/xml-json-conversions.test.js": 8,
	"./Service/xmldom.test.js": 9,
	"./Service/xpath.test.js": 10
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
webpackContext.id = 3;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_chai__);


var should = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.should,
    expect = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.expect,
    equal = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.equal,
    be = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.be,
    an = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.an,
    throws = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.throws;
var ResponseTypes = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].ResponseTypes;

describe('mapValueToResult', function () {
	it('should map literal', function (done) {
		var result = {};
		var value = 3;
		var path = "test";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: 3 });
		done();
	});
	it('should map object', function (done) {
		var result = {};
		var value = { foo: "bar" };
		var path = "test";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: { foo: "bar" } });
		done();
	});
	it('should map to root if no path', function (done) {
		var result = {};
		var value = { foo: "bar" };
		var path = "";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ foo: "bar" });
		done();
	});
	it('should overwrite value if already exists', function (done) {
		var result = { test: { foo: "bar" } };
		var value = { foo: "baz" };
		var path = "test";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: { foo: "baz" } });
		done();
	});
	it('should create array when path ends with []', function (done) {
		var result = {};
		var value = { foo: "bar" };
		var path = "test[]";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: [{ foo: "bar" }] });
		done();
	});
	it('should push value to array when path ends with []', function (done) {
		var result = { test: [{ a: "b" }] };
		var value = { foo: "bar" };
		var path = "test[]";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: [{ a: "b" }, { foo: "bar" }] });
		done();
	});
	it('should wrap current value in array and push value to array when path ends with []', function (done) {
		var result = { test: { a: "b" } };
		var value = { foo: "bar" };
		var path = "test[]";
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].mapValueToResult(path, value, result);
		expect(res).to.deep.equal({ test: [{ a: "b" }, { foo: "bar" }] });
		done();
	});
});
describe('map the things', function () {
	it('should map basic values', function (done) {
		var initial = { players: [{ points: 10 }, { points: 20 }, { points: 15 }] };
		var mappings = [{
			expression: "count(/players)",
			type: ResponseTypes.NUMBER,
			outputPath: "totalPlayers"
		}, {
			expression: "avg(/players/points/text())",
			type: ResponseTypes.NUMBER,
			outputPath: "averagePoints"
		}];
		var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mappings, initial, {});
		expect(res).to.deep.equal({ totalPlayers: 3, averagePoints: 15 });
		done();
	});
	it('should map xml for future use', function (done) {
		var initial = { players: [{ points: 10 }, { points: 20 }, { points: 15 }] };
		var mapping1 = [{
			expression: "/players[points > 10]",
			type: ResponseTypes.XML,
			outputPath: "players"
		}];
		var res1 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mapping1, initial, {});
		expect(res1.players.toString()).to.equal("<players><points>20</points></players><players><points>15</points></players>");
		var mapping2 = [{
			expression: "sum(/players/points/text())",
			type: ResponseTypes.NUMBER,
			outputPath: "totalPoints"
		}];
		var res2 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mapping2, res1.players, {});
		expect(res2).to.deep.equal({ totalPoints: 35 });
		done();
	});

	it('should return array of mapped elements when passed array', function (done) {
		var initial = [{ team: { id: 1, players: [{ points: 10 }, { points: 20 }, { points: 15 }] } }, { team: { id: 2, players: [{ points: 18 }, { points: 17 }, { points: 6 }] } }];
		var mappings = [{
			expression: "sum(/team/players/points)",
			type: ResponseTypes.NUMBER,
			outputPath: "team.totalPoints"
		}];
		var res1 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mappings, initial, {});
		expect(res1).to.deep.equal([{ team: { totalPoints: 45 } }, { team: { totalPoints: 41 } }]);
		done();
	}), it('should copy entire element to root if no outputPath', function (done) {
		var initial = [{ team: { id: 1, players: [{ points: 10 }, { points: 20 }, { points: 15 }] } }, { team: { id: 2, players: [{ points: 18 }, { points: 17 }, { points: 6 }] } }];
		var mappings = [{
			expression: "/team",
			type: ResponseTypes.JSON,
			outputPath: ""
		}, {
			expression: "sum(/team/players/points)",
			type: ResponseTypes.NUMBER,
			outputPath: "team.totalPoints"
		}];
		var res1 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mappings, initial, {});
		expect(res1).to.deep.equal([{ team: { id: "1", players: [{ points: "10" }, { points: "20" }, { points: "15" }], totalPoints: 45 } }, { team: { id: "2", players: [{ points: "18" }, { points: "17" }, { points: "6" }], totalPoints: 41 } }]);
		done();
	}), it('should append if output path array already exists', function (done) {
		var initial = { team: { id: 1, players: [{ points: 10 }, { points: 20 }, { points: 15 }] } };
		var mappings = [{
			expression: "/team/players/points[1]",
			type: ResponseTypes.NUMBER,
			outputPath: "points[]"
		}];
		var res1 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].map(mappings, initial, { points: [2] });
		expect(res1).to.deep.equal({ points: [2, 10] });
		done();
	});
	/*
 it('should trace basic mappings',done => {
   var initial = XMapperService.generateDom({team:{id:1}})
   var mappings = [
 	  {
 		  expression:"/team/id",
 		  type:ResponseTypes.JSON,
 		  outputPath:"team.id"
 	  }
   ]
   var res1 = XMapperService.map(mappings,initial,{},{},true)
   expect(XMapperService.xmlToJson(initial)).to.deep.equal({team:{id:{__trace:"team.id","#text":"1"}}}) 
   done()
 })
 it('should trace text elements',done => {
   var initial = XMapperService.generateDom({team:{id:1,players:[{points:10},{points:20},{points:15}]}})
   var mappings = [
 	   {
 		 expression:"/team/players/points/text()",
 		 type:ResponseTypes.JSON,
 		 outputPath:"team.points"
 	  }
   ]
   var res1 = XMapperService.map(mappings,initial,{},{},true)
   expect(XMapperService.xmlToJson(initial)).to.deep.equal({team:{id:"1",players:[{points:{__trace:"team.points","#text":"10"}},{points:{__trace:"team.points","#text":"20"}},{points:{__trace:"team.points","#text":"15"}}]}}) 
   done()
 })
    
 it('should trace all mappings',done => {
   var initial = XMapperService.generateDom({team:{id:1,players:[{points:10},{points:20},{points:15}]}})
   var mappings = [
 	{
 	  expression:"/team/id",
 	  type:ResponseTypes.NUMBER,
 	  outputPath:"team.id"
 	},
 	{
 	  expression:"/team/players/points/text()",
 	  type:ResponseTypes.JSON,
 	  outputPath:"team.points"
 	}  
   ]
   var res1 = XMapperService.map(mappings,initial,{},{},true)
   expect(XMapperService.xmlToJson(initial)).to.deep.equal({team:{id:{__trace:"team.id","#text":"1"},players:[{points:{__trace:"team.points","#text":"10"}},{points:{__trace:"team.points","#text":"20"}},{points:{__trace:"team.points","#text":"15"}}]}}) 
   done()
 })*/
});
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(should, 'should', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(expect, 'expect', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(equal, 'equal', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(be, 'be', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(an, 'an', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(throws, 'throws', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');

	__REACT_HOT_LOADER__.register(ResponseTypes, 'ResponseTypes', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/mapping.test.js');
}();

;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("xmlbuilder");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("xmldom");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("xpath");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_chai__);


var should = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.should,
    expect = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.expect,
    equal = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.equal;


describe('jsonToXML', function () {
  it('should handle empty element', function (done) {
    var test = { root: {} };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><root/>');
    done();
  });

  it('should read string as text', function (done) {
    var test = { foo: "bar" };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });
  it('should handle single string result', function (done) {
    var test = "bar";
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('bar');
    done();
  });
  it('should read @ element as attribute', function (done) {
    var test = { foo: { "@baz": "bar" } };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo baz="bar"/>');
    done();
  });

  it('should read #text element as text', function (done) {
    var test = { foo: { "#text": "bar" } };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });
  it('should handle text arrays', function (done) {
    var test = { root: { foo: ["bar", "baz"] } };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><root><foo>bar</foo><foo>baz</foo></root>');
    done();
  });
  it('should handle arrays', function (done) {
    var test = { foo: { bar: [{ id: "1" }, { id: "2" }] } };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>');
    done();
  });
});

describe('xmlToJson', function () {
  it('should handle empty element', function (done) {
    var test = '<root/>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ root: {} });
    done();
  });
  it('should read string as text', function (done) {
    var test = '<?xml version="1.0"?><foo>bar</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ foo: "bar" });
    done();
  });
  it('should handle single string result', function (done) {
    var test = '<?xml version="1.0"?>bar';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal("bar");
    done();
  });
  it('should read attributes as @ elements', function (done) {
    var test = '<?xml version="1.0"?><foo baz="bar"/>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ foo: { "@baz": "bar" } });
    done();
  });
  it('should set text as #text if @attr', function (done) {
    var test = '<?xml version="1.0"?><foo id="1">bar</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ foo: { "@id": "1", "#text": "bar" } });
    done();
  });

  it('should handle text arrays', function (done) {
    var test = '<root><foo>bar</foo><foo>baz</foo></root>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ root: { foo: ["bar", "baz"] } });
    done();
  });
  it('should handle arrays', function (done) {
    var test = '<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(test);
    expect(res).to.deep.equal({ foo: { bar: [{ id: "1" }, { id: "2" }] } });
    done();
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(should, 'should', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xml-json-conversions.test.js');

  __REACT_HOT_LOADER__.register(expect, 'expect', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xml-json-conversions.test.js');

  __REACT_HOT_LOADER__.register(equal, 'equal', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xml-json-conversions.test.js');
}();

;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_chai__);


var should = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.should,
    expect = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.expect,
    equal = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.equal,
    be = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.be,
    an = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.an;


describe('generateDom', function () {
  it('should build from xml', function (done) {
    var test = '<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
  it('should build from html', function (done) {
    var test = '<html><header><title>This is title</title></header><body>Hello world</body></html>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
  it('should build from json', function (done) {
    var test = { foo: "bar" };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(should, 'should', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xmldom.test.js');

  __REACT_HOT_LOADER__.register(expect, 'expect', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xmldom.test.js');

  __REACT_HOT_LOADER__.register(equal, 'equal', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xmldom.test.js');

  __REACT_HOT_LOADER__.register(be, 'be', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xmldom.test.js');

  __REACT_HOT_LOADER__.register(an, 'an', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xmldom.test.js');
}();

;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_chai__);


var should = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.should,
    expect = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.expect,
    equal = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.equal,
    be = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.be,
    an = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.an,
    throws = __WEBPACK_IMPORTED_MODULE_1_chai___default.a.throws;
var ResponseTypes = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].ResponseTypes;

describe('query', function () {
  it('should return text value for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/text()");
    expect(res).to.equal('1');
    done();
  });
  it('should return number for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should return attribute value for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo bar="1"/>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/@bar");
    expect(res).to.equal('1');
    done();
  });
  it('should return first if multiple results for query', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>2</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo");
    expect(res).to.equal('1');
    done();
  });
  it('should return null if no results for query', function (done) {
    var test = '<?xml version="1.0"?>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/text()");
    expect(res).to.equal(null);
    done();
  });
  it('should handle advanced xpath', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, '/foo[id=2]/name');
    expect(res).to.equal('baz');
    done();
  });
  it('should handle advanced xpath - contains', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, '/foo[contains(name,"baz")]/name');
    expect(res).to.deep.equal('baz');
    done();
  });
  it('should handle Json ', function (done) {
    var test = { foo: [{ id: 1, name: "bar" }, { id: 2, name: "baz" }] };
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, '/foo[id="2"]/name');
    expect(res).to.equal('baz');
    done();
  });
  it('should return xml if type is xml', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/bar", ResponseTypes.XML);
    expect(res).to.be.an('object');
    expect(res.toString()).to.equal('<bar id="1">baz</bar>');
    done();
  });
  it('should return xml with multiple results ', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar><bar id="2">baz2</bar></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/bar", ResponseTypes.XML);
    expect(res).to.be.an('object');
    expect(res.toString()).to.equal('<bar id="1">baz</bar><bar id="2">baz2</bar>');
    done();
  });
  it('should return xml with single result', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/bar/text()", ResponseTypes.XML);
    expect(res).to.be.an('object').that.has.property('childNodes').which.has.lengthOf(1);
    expect(__WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].xmlToJson(res)).to.equal("baz");
    done();
  });
  it('should return json if type is json', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo", ResponseTypes.JSON);
    expect(res).to.deep.equal({ foo: { id: "1", name: "bar" } });
    done();
  });
  it('should return json object with array when multiple results', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><named>baz</named></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/id", ResponseTypes.JSON);
    expect(res).to.deep.equal({ id: ["1", "2"] });
    done();
  });
  it('should return json object with string when only one result', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo/id", ResponseTypes.JSON);
    expect(res).to.deep.equal({ id: "1" });
    done();
  });
  it('should handle count', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "count(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.deep.equal(2);
    done();
  });
  it('should handle sum', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "sum(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.deep.equal(10);
    done();
  });
  it('should handle min', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "min(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should handle max', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "max(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(9);
    done();
  });
  it('should handle avg', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo><foo>20</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "avg(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(10);
    done();
  });
  it('should handle ceiling', function (done) {
    var test = '<?xml version="1.0"?><foo>1.3</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "ceiling(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(2);
    done();
  });
  it('should handle floor', function (done) {
    var test = '<?xml version="1.0"?><foo>1.7</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "floor(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should handle round', function (done) {
    var test = '<?xml version="1.0"?><foo>1.7</foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "round(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(2);
    done();
  });
  it('should handle normalize-space', function (done) {
    var test = '<?xml version="1.0"?><foo>\n 1.7 </foo>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "normalize-space(/foo/text())");
    expect(res).to.equal('1.7');
    done();
  });
  it('should handle boolean', function (done) {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "boolean(/foo/text())", ResponseTypes.BOOLEAN);
    expect(res).to.equal(true);
    var res2 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "boolean(/bar/text())", ResponseTypes.BOOLEAN);
    expect(res2).to.equal(false);
    done();
  });
  it('should handle boolean not', function (done) {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>';
    __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/foo");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "not(boolean(/foo/text()))", ResponseTypes.BOOLEAN);
    expect(res).to.equal(false);
    var res2 = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "not(boolean(/bar/text()))", ResponseTypes.BOOLEAN);
    expect(res2).to.equal(true);
    done();
  });
  it('should run query against each element if json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery("/*[self::name or self::email]");
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, expr, ResponseTypes.JSON);
    expect(res).to.deep.equal([{ name: "foo", email: "foo@email.com" }, { name: "bar", email: "bar@email.com" }, { name: "baz", email: "baz@email.com" }]);
    done();
  });
  it('should not return elements that returned null from json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery('/*[text() = "foo"]');
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, expr, ResponseTypes.JSON);
    expect(res).to.deep.equal([{ name: "foo" }]);
    done();
  });
  it('should return null if all elements returned null from json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].parseQuery('/*[text() = "asdf"]');
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, expr, ResponseTypes.JSON);
    expect(res).to.equal(null);
    done();
  });
  it('should trace result objects', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo", ResponseTypes.JSON, {}, true);
    expect(__WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].traces).to.deep.equal([{ trace: true, path: ['foo'] }]);
    done();
  });
  it('should trace result object with array value', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>';
    var res = __WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].query(test, "/foo[id=1]", ResponseTypes.JSON, {}, true);
    expect(__WEBPACK_IMPORTED_MODULE_0__src_XMapperService__["a" /* default */].traces).to.deep.equal([{ trace: true, path: [0, 'foo'] }]);
    done();
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(should, 'should', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(expect, 'expect', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(equal, 'equal', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(be, 'be', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(an, 'an', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(throws, 'throws', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');

  __REACT_HOT_LOADER__.register(ResponseTypes, 'ResponseTypes', 'C:/Users/dandelp/Source/Repos/monaco-pegjs/test/Service/xpath.test.js');
}();

;

/***/ })
/******/ ]);