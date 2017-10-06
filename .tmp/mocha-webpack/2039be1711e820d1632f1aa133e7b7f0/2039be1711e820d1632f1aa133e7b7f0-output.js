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
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _xmlbuilder = __webpack_require__(10);

var _xmlbuilder2 = _interopRequireDefault(_xmlbuilder);

var _xmldom = __webpack_require__(11);

var _xpath = __webpack_require__(12);

var _xpath2 = _interopRequireDefault(_xpath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ResponseTypes = { XML: 'XML', JSON: 'JSON', STRING: 'STRING', NUMBER: 'NUMBER', BOOLEAN: 'BOOLEAN' };

var XMapperService = {
    ResponseTypes: ResponseTypes,
    jsonToXML: function jsonToXML(json) {
        if ((typeof json === 'undefined' ? 'undefined' : _typeof(json)) !== 'object') {
            try {
                json = JSON.parse(json);
            } catch (e) {
                return json.toString();
            }
        }
        return _xmlbuilder2.default.create(json).end();
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
        return new _xmldom.DOMParser().parseFromString(input);
    },
    parseQuery: function parseQuery(query) {
        return _xpath2.default.parse(query);
    },
    query: function query(dom, expr, type, variables) {
        if (dom == null) return null;
        type = type || ResponseTypes.STRING;
        expr = typeof expr === 'string' ? _xpath2.default.parse(expr) : expr;
        if (Array.isArray(dom)) return XMapperService.queryEach(dom, expr, type, variables);
        dom = XMapperService.generateDom(dom);
        var options = { node: dom, variables: variables, functions: xpathFunctions };
        var result = !~[ResponseTypes.XML, ResponseTypes.JSON].indexOf(type) ? expr.evaluate(options) : expr.select(options);
        if (Array.isArray(result) && result.length == 0 || result == '') return null;
        switch (type) {
            case ResponseTypes.NUMBER:
                if (typeof result === 'number') return result;
                return parseFloat(result.toString());
            case ResponseTypes.BOOLEAN:
                return result.toString() === 'true';
            case ResponseTypes.JSON:
                var parsed = new _xmldom.DOMImplementation().createDocument();
                result.forEach(function (e) {
                    return parsed.appendChild(e);
                });
                return XMapperService.xmlToJson(parsed);
            case ResponseTypes.XML:
                var parsed = new _xmldom.DOMImplementation().createDocument();
                result.forEach(function (e) {
                    return parsed.appendChild(e);
                });
                return parsed;
            default:
                return result.toString();
        }
    },
    queryEach: function queryEach(dom, expr, type, variables) {
        return dom.reduce(function (res, curr) {
            var processed = XMapperService.query(curr, expr, type, variables);
            if (processed) {
                if (!res) res = [];
                res.push(processed);
            }
            return res;
        }, null);
    },
    map: function map(mappings, initial, result) {
        if (Array.isArray(initial)) return XMapperService.mapEach(mappings, initial, result);
        if (!result) result = {};
        mappings.forEach(function (mapping) {
            if (!mapping.expression || !mapping.outputPath) throw "Mapping is invalid";
            var parsed = XMapperService.query(initial, mapping.expression, mapping.type || ResponseTypes.JSON);
            if (!parsed) return;
            result = XMapperService.mapValueToResult(mapping.outputPath, parsed, result);
        });
        return result;
    },
    mapEach: function mapEach(mappings, initial, result) {
        return initial.reduce(function (res, curr) {
            var processed = XMapperService.map(mappings, curr, result);
            if (processed) {
                if (!res) res = [];
                res.push(processed);
            }
            return res;
        }, null);
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

exports.default = XMapperService;

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
        return nodes.map(function (n) {
            return parseFloat(n.nodeValue);
        }).reduce(function (a, b) {
            return a + b;
        }) / nodes.length;
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This gets replaced by webpack with the updated files on rebuild
var __webpackManifest__ = ['../../src/JSONxPath', './Grammar/functions.test.js', '../../src/XMapperService', './2039be1711e820d1632f1aa133e7b7f0-entry.js', './Grammar/functions.test.js', '../../src/JSONxPath', './xpath.pegjs', './Service/mapping.test.js', './Service/xml-json-conversions.test.js', './Service/xmldom.test.js', './Service/xpath.test.js', '../../src/JSONxPath', './Grammar/functions.test.js', '../../src/JSONxPath', './Grammar/functions.test.js', '../../src/JSONxPath', './Grammar/functions.test.js', '../../src/JSONxPath', './Grammar/functions.test.js', '../../src/JSONxPath', './Grammar/functions.test.js'];

var testsContext = __webpack_require__(3);

function inManifest(path) {
  return __webpackManifest__.indexOf(path) >= 0;
}

var runnable = testsContext.keys().filter(inManifest);

runnable.forEach(testsContext);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Grammar/functions.test.js": 4,
	"./Service/mapping.test.js": 9,
	"./Service/xml-json-conversions.test.js": 13,
	"./Service/xmldom.test.js": 14,
	"./Service/xpath.test.js": 15
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _JSONxPath = __webpack_require__(5);

var JSONxPath = _interopRequireWildcard(_JSONxPath);

var _chai = __webpack_require__(0);

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var should = _chai2.default.should,
    expect = _chai2.default.expect,
    equal = _chai2.default.equal,
    be = _chai2.default.be,
    an = _chai2.default.an,
    throws = _chai2.default.throws;

console.log(JSONxPath);
describe('matchXpath10', function () {
      it('should recognize opening function', function (done) {
            JSONxPath.generateMap("/foo");
            done();
      });
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateMap = undefined;

var _xpath = __webpack_require__(6);

var _xpath2 = _interopRequireDefault(_xpath);

var _asty = __webpack_require__(7);

var _asty2 = _interopRequireDefault(_asty);

var _pegjsUtil = __webpack_require__(8);

var _pegjsUtil2 = _interopRequireDefault(_pegjsUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asty = new _asty2.default();

var generateMap = exports.generateMap = function generateMap(xPath) {
    var map = _pegjsUtil2.default.parse(_xpath2.default, xPath, { makeAST: function makeAST(line, column, offset, args) {
            return asty.create.apply(asty, args).pos(line, column, offset);
        } });
    console.log(map);
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$DefaultTracer() {
    this.indentLevel = 0;
  }

  peg$DefaultTracer.prototype.trace = function(event) {
    var that = this;

    function log(event) {
      function repeat(string, n) {
         var result = "", i;

         for (i = 0; i < n; i++) {
           result += string;
         }

         return result;
      }

      function pad(string, length) {
        return string + repeat(" ", length - string.length);
      }

      if (typeof console === "object") {
        console.log(
          event.location.start.line + ":" + event.location.start.column + "-"
            + event.location.end.line + ":" + event.location.end.column + " "
            + pad(event.type, 10) + " "
            + repeat("  ", that.indentLevel) + event.rule
        );
      }
    }

    switch (event.type) {
      case "rule.enter":
        log(event);
        this.indentLevel++;
        break;

      case "rule.match":
        this.indentLevel--;
        log(event);
        break;

      case "rule.fail":
        this.indentLevel--;
        log(event);
        break;

      default:
        throw new Error("Invalid event type: " + event.type + ".");
    }
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { XPath: peg$parseXPath },
        peg$startRuleFunction  = peg$parseXPath,

        peg$c0 = function(expr) {
        		return {
        			 tree: expr
        			,nsPrefixes: nsPrefixes
        		}
        	},
        peg$c1 = "/",
        peg$c2 = peg$literalExpectation("/", false),
        peg$c3 = function(path) {
        		return {
        			 type: '/'
        			,args: [
        				null,
        				(path) ? path[1] : null
        			]
        		};
        	},
        peg$c4 = "//",
        peg$c5 = peg$literalExpectation("//", false),
        peg$c6 = function(expr, repeatedExpr) {
        		var i;
        		
        		for(i=0; i < repeatedExpr.length; i++)
        		{
        			expr = expandSlashAbbrev(repeatedExpr[i][1], expr, repeatedExpr[i][3]);
        		}
        		
        		return expr;
        	},
        peg$c7 = function(axis, node, predicate) {
        		return predicateExpression({
        			type: 'step',
        			args: [
        				axis,
        				node
        			]},
        			axis,
        			predicate,
        			1
        		);
        	},
        peg$c8 = "::",
        peg$c9 = peg$literalExpectation("::", false),
        peg$c10 = function(axis) {
        		return axis;
        	},
        peg$c11 = function(aas) {
        		return (aas.length) ? aas : 'child';
        	},
        peg$c12 = "ancestor-or-self",
        peg$c13 = peg$literalExpectation("ancestor-or-self", false),
        peg$c14 = "ancestor",
        peg$c15 = peg$literalExpectation("ancestor", false),
        peg$c16 = "attribute",
        peg$c17 = peg$literalExpectation("attribute", false),
        peg$c18 = "child",
        peg$c19 = peg$literalExpectation("child", false),
        peg$c20 = "descendant-or-self",
        peg$c21 = peg$literalExpectation("descendant-or-self", false),
        peg$c22 = "descendant",
        peg$c23 = peg$literalExpectation("descendant", false),
        peg$c24 = "following-sibling",
        peg$c25 = peg$literalExpectation("following-sibling", false),
        peg$c26 = "following",
        peg$c27 = peg$literalExpectation("following", false),
        peg$c28 = "namespace",
        peg$c29 = peg$literalExpectation("namespace", false),
        peg$c30 = "parent",
        peg$c31 = peg$literalExpectation("parent", false),
        peg$c32 = "preceding-sibling",
        peg$c33 = peg$literalExpectation("preceding-sibling", false),
        peg$c34 = "preceding",
        peg$c35 = peg$literalExpectation("preceding", false),
        peg$c36 = "self",
        peg$c37 = peg$literalExpectation("self", false),
        peg$c38 = "(",
        peg$c39 = peg$literalExpectation("(", false),
        peg$c40 = ")",
        peg$c41 = peg$literalExpectation(")", false),
        peg$c42 = function(nodeType) {
        		return {
        			 type: 'nodeType'
        			,args: [
        				nodeType,
        				[]
        			]
        		};
        	},
        peg$c43 = "processing-instruction",
        peg$c44 = peg$literalExpectation("processing-instruction", false),
        peg$c45 = function(pi, arg) {
        		return {
        			 type: 'nodeType'
        			,args: [
        				pi,
        				[arg]
        			]
        		};
        	},
        peg$c46 = function(nt) {
        		return nt;
        	},
        peg$c47 = "[",
        peg$c48 = peg$literalExpectation("[", false),
        peg$c49 = "]",
        peg$c50 = peg$literalExpectation("]", false),
        peg$c51 = function(expr) {
        		return expr;
        	},
        peg$c52 = function(path) {
        		return expandSlashAbbrev('//', null, path);
        	},
        peg$c53 = "..",
        peg$c54 = peg$literalExpectation("..", false),
        peg$c55 = ".",
        peg$c56 = peg$literalExpectation(".", false),
        peg$c57 = function(abbrev) {
        		/*
        		 * @see http://www.w3.org/TR/xpath/#path-abbrev
        		 */
        		var result = {
        			type: 'step',
        			args: [
        				'self', // assume .
        				{
        					type: 'nodeType',
        					args: [
        						'node',
        						[]
        					]
        				}
        			]
        		}
        		
        		if (abbrev == '..')
        		{
        			result.args[0] = 'parent';
        		}
        		
        		return result;
        	},
        peg$c58 = "@",
        peg$c59 = peg$literalExpectation("@", false),
        peg$c60 = function(attribute) {
        		return (attribute) ? 'attribute' : '';
        	},
        peg$c61 = function(vr) {
        		return vr;
        	},
        peg$c62 = function(l) {
        		return l;
        	},
        peg$c63 = function(n) {
        		return n;
        	},
        peg$c64 = ",",
        peg$c65 = peg$literalExpectation(",", false),
        peg$c66 = function(name, arg) {
        		var i, args = [];
        		if (arg)
        		{
        			args.push(arg[1]);
        			for (i=0; i < arg[2].length; i++)
        			{
        				args.push(arg[2][i][3]);
        			}
        		}
        		return {
        			 type: 'function'
        			,args: [
        				name,
        				args
        			]
        		};
        	},
        peg$c67 = "|",
        peg$c68 = peg$literalExpectation("|", false),
        peg$c69 = function(expr, repeatedExpr) {
        		return expressionSimplifier(expr, repeatedExpr, 1, 3);
        	},
        peg$c70 = function(expr, path) {
        		if (!path)
        			return expr;
        		
        		return expandSlashAbbrev(path[1], expr, path[3]);
        	},
        peg$c71 = function(path) {
        		return path;
        	},
        peg$c72 = function(expr, repeatedExpr) {
        		return predicateExpression(expr, 'child', repeatedExpr, 1);
        	},
        peg$c73 = "or",
        peg$c74 = peg$literalExpectation("or", false),
        peg$c75 = "and",
        peg$c76 = peg$literalExpectation("and", false),
        peg$c77 = "=",
        peg$c78 = peg$literalExpectation("=", false),
        peg$c79 = "!=",
        peg$c80 = peg$literalExpectation("!=", false),
        peg$c81 = "<=",
        peg$c82 = peg$literalExpectation("<=", false),
        peg$c83 = "<",
        peg$c84 = peg$literalExpectation("<", false),
        peg$c85 = ">=",
        peg$c86 = peg$literalExpectation(">=", false),
        peg$c87 = ">",
        peg$c88 = peg$literalExpectation(">", false),
        peg$c89 = "+",
        peg$c90 = peg$literalExpectation("+", false),
        peg$c91 = "-",
        peg$c92 = peg$literalExpectation("-", false),
        peg$c93 = "div",
        peg$c94 = peg$literalExpectation("div", false),
        peg$c95 = "mod",
        peg$c96 = peg$literalExpectation("mod", false),
        peg$c97 = function(expr) {
        		return {
        			 type: '*' // multiply
        			,args: [
        				{
        					type: 'number',
        					args: [
        						-1
        					]
        				},
        				expr
        			]
        		}
        	},
        peg$c98 = "\"",
        peg$c99 = peg$literalExpectation("\"", false),
        peg$c100 = /^[^"]/,
        peg$c101 = peg$classExpectation(["\""], true, false),
        peg$c102 = function(literals) {
        		return {
        			type: 'string',
        			args: [
        				literals.join('')
        			]
        		};
        	},
        peg$c103 = "'",
        peg$c104 = peg$literalExpectation("'", false),
        peg$c105 = /^[^']/,
        peg$c106 = peg$classExpectation(["'"], true, false),
        peg$c107 = function(digits, decimals) {
        		return {
        			 type: 'number'
        			,args: [
        				(decimals) ? parseFloat(digits + '.' + decimals[1]) : parseInt(digits)
        			]
        		};
        	},
        peg$c108 = function(digits) {
        		return {
        			type: 'number',
        			args: [
        				parseFloat('.' + digits)
        			]
        		};
        	},
        peg$c109 = /^[0-9]/,
        peg$c110 = peg$classExpectation([["0", "9"]], false, false),
        peg$c111 = function(digits) {
        		return digits.join('');
        	},
        peg$c112 = "*",
        peg$c113 = peg$literalExpectation("*", false),
        peg$c114 = function(name) { // - NodeType
        		var i;
        		
        		// exclude NodeType names
        		if (lastQNameParsed.args[0] === null) // no namespace
        		{
        			for(i=0; i<nodeTypeNames.length; i++)
        			{
        				if (lastQNameParsed.args[1] == nodeTypeNames[i]) // name
        				{
        					// Reserved NodeType name used, so don't allow this function name
        					return false;
        				}
        			}
        		}
        		
        		// function name ok
        		return true;
        	},
        peg$c115 = function(name) {
        		(name.args[0] === '')
        			? name = {  // NOTE: apparently "name.args[0] = null" doesn't work well because NameTest get's screwed up...
        				 type: name.type
        				,args: [
        					null,
        					name.args[1]
        				]
        			}
        			: trackNsPrefix(name.args[0])
        		;
        		return name;
        	},
        peg$c116 = "$",
        peg$c117 = peg$literalExpectation("$", false),
        peg$c118 = function(name) {
        		trackNsPrefix(name.args[0]);
        		
        		return {
        			 type: '$'
        			,args: [
        				name
        			]
        		};
        	},
        peg$c119 = function() {
        		return {
        			 type: 'name'
        			,args: [
        				null,
        				null
        			]
        		};
        	},
        peg$c120 = ":",
        peg$c121 = peg$literalExpectation(":", false),
        peg$c122 = function(ns) {
        		trackNsPrefix(ns);
        		return {
        			 type: 'name'
        			,args: [
        				ns,
        				null
        			]
        		};
        	},
        peg$c123 = function(name) {
        		trackNsPrefix(name.args[0]);
        		return name;
        	},
        peg$c124 = "comment",
        peg$c125 = peg$literalExpectation("comment", false),
        peg$c126 = "text",
        peg$c127 = peg$literalExpectation("text", false),
        peg$c128 = "node",
        peg$c129 = peg$literalExpectation("node", false),
        peg$c130 = /^[ \t\r\n]/,
        peg$c131 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false),
        peg$c132 = function(name) {
        		lastQNameParsed = name;
        		return name;
        	},
        peg$c133 = function(ns, name) {
        		return {
        			 type: 'name'
        			,args: [
        				ns,
        				name
        			]
        		};
        	},
        peg$c134 = function(name) {
        		return {
        			 type: 'name'
        			,args: [
        				null,
        				name
        			]
        		};
        	},
        peg$c135 = /^[A-Z]/,
        peg$c136 = peg$classExpectation([["A", "Z"]], false, false),
        peg$c137 = "_",
        peg$c138 = peg$literalExpectation("_", false),
        peg$c139 = /^[a-z]/,
        peg$c140 = peg$classExpectation([["a", "z"]], false, false),
        peg$c141 = /^[\xC0-\xD6]/,
        peg$c142 = peg$classExpectation([["\xC0", "\xD6"]], false, false),
        peg$c143 = /^[\xD8-\xF6]/,
        peg$c144 = peg$classExpectation([["\xD8", "\xF6"]], false, false),
        peg$c145 = /^[\xF8-\u02FF]/,
        peg$c146 = peg$classExpectation([["\xF8", "\u02FF"]], false, false),
        peg$c147 = /^[\u0370-\u037D]/,
        peg$c148 = peg$classExpectation([["\u0370", "\u037D"]], false, false),
        peg$c149 = /^[\u037F-\u1FFF]/,
        peg$c150 = peg$classExpectation([["\u037F", "\u1FFF"]], false, false),
        peg$c151 = /^[\u200C-\u200D]/,
        peg$c152 = peg$classExpectation([["\u200C", "\u200D"]], false, false),
        peg$c153 = /^[\u2070-\u218F]/,
        peg$c154 = peg$classExpectation([["\u2070", "\u218F"]], false, false),
        peg$c155 = /^[\u2C00-\u2FEF]/,
        peg$c156 = peg$classExpectation([["\u2C00", "\u2FEF"]], false, false),
        peg$c157 = /^[\u3001-\uD7FF]/,
        peg$c158 = peg$classExpectation([["\u3001", "\uD7FF"]], false, false),
        peg$c159 = /^[\uF900-\uFDCF]/,
        peg$c160 = peg$classExpectation([["\uF900", "\uFDCF"]], false, false),
        peg$c161 = /^[\uFDF0-\uFFFD]/,
        peg$c162 = peg$classExpectation([["\uFDF0", "\uFFFD"]], false, false),
        peg$c163 = /^[\xB7]/,
        peg$c164 = peg$classExpectation(["\xB7"], false, false),
        peg$c165 = /^[\u0300-\u036F]/,
        peg$c166 = peg$classExpectation([["\u0300", "\u036F"]], false, false),
        peg$c167 = /^[\u203F-\u2040]/,
        peg$c168 = peg$classExpectation([["\u203F", "\u2040"]], false, false),
        peg$c169 = function(startchar, chars) {
        		return startchar + chars.join('');
        	},

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$resultsCache = {},

        peg$tracer = "tracer" in options ? options.tracer : new peg$DefaultTracer(),

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseXPath() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "XPath",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 0,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "XPath",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "XPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseExpr();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "XPath",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "XPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseLocationPath() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "LocationPath",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 1,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "LocationPath",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "LocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$parseRelativeLocationPath();
      if (s0 === peg$FAILED) {
        s0 = peg$parseAbsoluteLocationPath();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "LocationPath",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "LocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAbsoluteLocationPath() {
      var s0, s1, s2, s3, s4,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AbsoluteLocationPath",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 2,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbsoluteLocationPath",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbsoluteLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$parseAbbreviatedAbsoluteLocationPath();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 47) {
          s1 = peg$c1;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRelativeLocationPath();
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c3(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbsoluteLocationPath",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbsoluteLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseRelativeLocationPath() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "RelativeLocationPath",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 3,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "RelativeLocationPath",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "RelativeLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseStep();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c4) {
            s5 = peg$c4;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c5); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s5 = peg$c1;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c2); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseStep();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c4) {
              s5 = peg$c4;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c5); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s5 = peg$c1;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c2); }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseStep();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "RelativeLocationPath",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "RelativeLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseStep() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Step",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 4,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Step",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Step",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseAxisSpecifier();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseNodeTest();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$currPos;
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsePredicate();
              if (s7 !== peg$FAILED) {
                s6 = [s6, s7];
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsePredicate();
                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7(s1, s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseAbbreviatedStep();
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Step",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Step",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAxisSpecifier() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AxisSpecifier",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 5,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AxisSpecifier",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AxisSpecifier",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseAxisName();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c8) {
            s3 = peg$c8;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c10(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseAbbreviatedAxisSpecifier();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c11(s1);
        }
        s0 = s1;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AxisSpecifier",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AxisSpecifier",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAxisName() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AxisName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 6,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AxisName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AxisName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      if (input.substr(peg$currPos, 16) === peg$c12) {
        s0 = peg$c12;
        peg$currPos += 16;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c14) {
          s0 = peg$c14;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c16) {
            s0 = peg$c16;
            peg$currPos += 9;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c18) {
              s0 = peg$c18;
              peg$currPos += 5;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 18) === peg$c20) {
                s0 = peg$c20;
                peg$currPos += 18;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c21); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 10) === peg$c22) {
                  s0 = peg$c22;
                  peg$currPos += 10;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c23); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 17) === peg$c24) {
                    s0 = peg$c24;
                    peg$currPos += 17;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c25); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 9) === peg$c26) {
                      s0 = peg$c26;
                      peg$currPos += 9;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c27); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 9) === peg$c28) {
                        s0 = peg$c28;
                        peg$currPos += 9;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c29); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c30) {
                          s0 = peg$c30;
                          peg$currPos += 6;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c31); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 17) === peg$c32) {
                            s0 = peg$c32;
                            peg$currPos += 17;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c33); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 9) === peg$c34) {
                              s0 = peg$c34;
                              peg$currPos += 9;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c35); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 4) === peg$c36) {
                                s0 = peg$c36;
                                peg$currPos += 4;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c37); }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AxisName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AxisName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNodeTest() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NodeTest",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 7,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NodeTest",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NodeTest",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseNodeType();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c39); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c40;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c41); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c42(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 22) === peg$c43) {
          s1 = peg$c43;
          peg$currPos += 22;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s3 = peg$c38;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c39); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseLiteral();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s7 = peg$c40;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c41); }
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c45(s1, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseNameTest();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c46(s1);
          }
          s0 = s1;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NodeTest",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NodeTest",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parsePredicate() {
      var s0, s1, s2, s3, s4, s5,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Predicate",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 8,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Predicate",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Predicate",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c47;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpr();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c49;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c50); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c51(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Predicate",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Predicate",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAbbreviatedAbsoluteLocationPath() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AbbreviatedAbsoluteLocationPath",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 9,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedAbsoluteLocationPath",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedAbsoluteLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c4) {
        s1 = peg$c4;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c5); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseRelativeLocationPath();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c52(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedAbsoluteLocationPath",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedAbsoluteLocationPath",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAbbreviatedStep() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AbbreviatedStep",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 10,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedStep",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedStep",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c53) {
        s1 = peg$c53;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c55;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c56); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c57(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedStep",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedStep",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAbbreviatedAxisSpecifier() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AbbreviatedAxisSpecifier",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 11,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedAxisSpecifier",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedAxisSpecifier",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 64) {
        s1 = peg$c58;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c59); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c60(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AbbreviatedAxisSpecifier",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AbbreviatedAxisSpecifier",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseExpr() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Expr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 12,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Expr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Expr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseOrExpr();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c51(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Expr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Expr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parsePrimaryExpr() {
      var s0, s1, s2, s3, s4, s5,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "PrimaryExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 13,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PrimaryExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PrimaryExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseVariableReference();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c61(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c38;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c39); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseExpr();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c40;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c41); }
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c51(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseLiteral();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c62(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseNumber();
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c63(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$parseFunctionCall();
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PrimaryExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PrimaryExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseFunctionCall() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "FunctionCall",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 14,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FunctionCall",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FunctionCall",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseFunctionName();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c39); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseExpr();
              if (s6 !== peg$FAILED) {
                s7 = [];
                s8 = peg$currPos;
                s9 = peg$parse_();
                if (s9 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s10 = peg$c64;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c65); }
                  }
                  if (s10 !== peg$FAILED) {
                    s11 = peg$parse_();
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parseExpr();
                      if (s12 !== peg$FAILED) {
                        s9 = [s9, s10, s11, s12];
                        s8 = s9;
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s8;
                      s8 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s8;
                  s8 = peg$FAILED;
                }
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$currPos;
                  s9 = peg$parse_();
                  if (s9 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s10 = peg$c64;
                      peg$currPos++;
                    } else {
                      s10 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c65); }
                    }
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parse_();
                      if (s11 !== peg$FAILED) {
                        s12 = peg$parseExpr();
                        if (s12 !== peg$FAILED) {
                          s9 = [s9, s10, s11, s12];
                          s8 = s9;
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s8;
                      s8 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  }
                }
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c40;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c41); }
                }
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c66(s1, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FunctionCall",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FunctionCall",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseUnionExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "UnionExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 15,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnionExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnionExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsePathExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 124) {
            s5 = peg$c67;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsePathExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 124) {
              s5 = peg$c67;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsePathExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnionExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnionExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parsePathExpr() {
      var s0, s1, s2, s3, s4, s5, s6,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "PathExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 16,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PathExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PathExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseFilterExpr();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c4) {
            s4 = peg$c4;
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c5); }
          }
          if (s4 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s4 = peg$c1;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c2); }
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRelativeLocationPath();
              if (s6 !== peg$FAILED) {
                s3 = [s3, s4, s5, s6];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c70(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseLocationPath();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c71(s1);
        }
        s0 = s1;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PathExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PathExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseFilterExpr() {
      var s0, s1, s2, s3, s4, s5,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "FilterExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 17,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FilterExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FilterExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsePrimaryExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsePredicate();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsePredicate();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c72(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FilterExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FilterExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseOrExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "OrExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 18,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "OrExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "OrExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseAndExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c73) {
            s5 = peg$c73;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c74); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAndExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c73) {
              s5 = peg$c73;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c74); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseAndExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "OrExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "OrExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAndExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AndExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 19,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AndExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AndExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseEqualityExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c75) {
            s5 = peg$c75;
            peg$currPos += 3;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseEqualityExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c75) {
              s5 = peg$c75;
              peg$currPos += 3;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c76); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseEqualityExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AndExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AndExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseEqualityExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "EqualityExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 20,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "EqualityExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "EqualityExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseRelationalExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s5 = peg$c77;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c78); }
          }
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c79) {
              s5 = peg$c79;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c80); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseRelationalExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c77;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c78); }
            }
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c79) {
                s5 = peg$c79;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c80); }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseRelationalExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "EqualityExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "EqualityExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseRelationalExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "RelationalExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 21,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "RelationalExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "RelationalExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseAdditiveExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c81) {
            s5 = peg$c81;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c82); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 60) {
              s5 = peg$c83;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c84); }
            }
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c85) {
                s5 = peg$c85;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c86); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s5 = peg$c87;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c88); }
                }
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAdditiveExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c81) {
              s5 = peg$c81;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c82); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 60) {
                s5 = peg$c83;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c84); }
              }
              if (s5 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c85) {
                  s5 = peg$c85;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c86); }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 62) {
                    s5 = peg$c87;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c88); }
                  }
                }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseAdditiveExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "RelationalExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "RelationalExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseAdditiveExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "AdditiveExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 22,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AdditiveExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AdditiveExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseMultiplicativeExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 43) {
            s5 = peg$c89;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c90); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
              s5 = peg$c91;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c92); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseMultiplicativeExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 43) {
              s5 = peg$c89;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c90); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s5 = peg$c91;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c92); }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseMultiplicativeExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "AdditiveExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "AdditiveExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseMultiplicativeExpr() {
      var s0, s1, s2, s3, s4, s5, s6, s7,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "MultiplicativeExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 23,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "MultiplicativeExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "MultiplicativeExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseUnaryExpr();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseMultiplyOperator();
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c93) {
              s5 = peg$c93;
              peg$currPos += 3;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c94); }
            }
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c95) {
                s5 = peg$c95;
                peg$currPos += 3;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c96); }
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseUnaryExpr();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseMultiplyOperator();
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c93) {
                s5 = peg$c93;
                peg$currPos += 3;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c94); }
              }
              if (s5 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c95) {
                  s5 = peg$c95;
                  peg$currPos += 3;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c96); }
                }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseUnaryExpr();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "MultiplicativeExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "MultiplicativeExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseUnaryExpr() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "UnaryExpr",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 24,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnaryExpr",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnaryExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseUnionExpr();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c51(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c91;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c92); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseUnaryExpr();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c97(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnaryExpr",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnaryExpr",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseLiteral() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Literal",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 25,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Literal",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Literal",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c98;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c100.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c100.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c101); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c98;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c99); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c102(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c103;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c104); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c105.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c106); }
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c105.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c106); }
            }
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c103;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c104); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c102(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Literal",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Literal",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNumber() {
      var s0, s1, s2, s3, s4,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Number",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 26,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Number",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Number",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseDigits();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c55;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c56); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseDigits();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c107(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c55;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c56); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseDigits();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c108(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Number",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Number",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseDigits() {
      var s0, s1, s2,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Digits",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 27,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Digits",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Digits",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      if (peg$c109.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c109.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c110); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c111(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Digits",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Digits",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseMultiplyOperator() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "MultiplyOperator",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 28,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "MultiplyOperator",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "MultiplyOperator",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      if (input.charCodeAt(peg$currPos) === 42) {
        s0 = peg$c112;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c113); }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "MultiplyOperator",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "MultiplyOperator",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseFunctionName() {
      var s0, s1, s2,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "FunctionName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 29,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FunctionName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FunctionName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseQName();
      if (s1 !== peg$FAILED) {
        peg$savedPos = peg$currPos;
        s2 = peg$c114(s1);
        if (s2) {
          s2 = void 0;
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c115(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "FunctionName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "FunctionName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseVariableReference() {
      var s0, s1, s2,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "VariableReference",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 30,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "VariableReference",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "VariableReference",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 36) {
        s1 = peg$c116;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseQName();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c118(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "VariableReference",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "VariableReference",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNameTest() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NameTest",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 31,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameTest",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameTest",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 42) {
        s1 = peg$c112;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c113); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c119();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNCName();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s2 = peg$c120;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c121); }
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 42) {
              s3 = peg$c112;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c113); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c122(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseQName();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c123(s1);
          }
          s0 = s1;
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameTest",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameTest",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNodeType() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NodeType",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 32,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NodeType",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NodeType",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      if (input.substr(peg$currPos, 7) === peg$c124) {
        s0 = peg$c124;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c125); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c126) {
          s0 = peg$c126;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c127); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 22) === peg$c43) {
            s0 = peg$c43;
            peg$currPos += 22;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c44); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c128) {
              s0 = peg$c128;
              peg$currPos += 4;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c129); }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NodeType",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NodeType",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseS() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "S",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 33,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "S",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "S",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = [];
      if (peg$c130.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c131); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c130.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c131); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "S",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "S",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parse_() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "_",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 34,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "_",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "_",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$parseS();
      if (s0 === peg$FAILED) {
        s0 = null;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "_",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "_",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseQName() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "QName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 35,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "QName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "QName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsePrefixedName();
      if (s1 === peg$FAILED) {
        s1 = peg$parseUnprefixedName();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c132(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "QName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "QName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parsePrefixedName() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "PrefixedName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 36,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PrefixedName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PrefixedName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseNCName();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s2 = peg$c120;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c121); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseNCName();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c133(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "PrefixedName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "PrefixedName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseUnprefixedName() {
      var s0, s1,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "UnprefixedName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 37,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnprefixedName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnprefixedName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseNCName();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c134(s1);
      }
      s0 = s1;

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "UnprefixedName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "UnprefixedName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNCName() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NCName",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 38,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NCName",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NCName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$parseName();

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NCName",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NCName",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNameStartChar() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NameStartChar",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 39,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameStartChar",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameStartChar",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      if (peg$c135.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c136); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 95) {
          s0 = peg$c137;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c138); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c139.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c140); }
          }
          if (s0 === peg$FAILED) {
            if (peg$c141.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c142); }
            }
            if (s0 === peg$FAILED) {
              if (peg$c143.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c144); }
              }
              if (s0 === peg$FAILED) {
                if (peg$c145.test(input.charAt(peg$currPos))) {
                  s0 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c146); }
                }
                if (s0 === peg$FAILED) {
                  if (peg$c147.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c148); }
                  }
                  if (s0 === peg$FAILED) {
                    if (peg$c149.test(input.charAt(peg$currPos))) {
                      s0 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c150); }
                    }
                    if (s0 === peg$FAILED) {
                      if (peg$c151.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c152); }
                      }
                      if (s0 === peg$FAILED) {
                        if (peg$c153.test(input.charAt(peg$currPos))) {
                          s0 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c154); }
                        }
                        if (s0 === peg$FAILED) {
                          if (peg$c155.test(input.charAt(peg$currPos))) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c156); }
                          }
                          if (s0 === peg$FAILED) {
                            if (peg$c157.test(input.charAt(peg$currPos))) {
                              s0 = input.charAt(peg$currPos);
                              peg$currPos++;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c158); }
                            }
                            if (s0 === peg$FAILED) {
                              if (peg$c159.test(input.charAt(peg$currPos))) {
                                s0 = input.charAt(peg$currPos);
                                peg$currPos++;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c160); }
                              }
                              if (s0 === peg$FAILED) {
                                if (peg$c161.test(input.charAt(peg$currPos))) {
                                  s0 = input.charAt(peg$currPos);
                                  peg$currPos++;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c162); }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameStartChar",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameStartChar",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseNameChar() {
      var s0,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "NameChar",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 40,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameChar",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameChar",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$parseNameStartChar();
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s0 = peg$c91;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c92); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s0 = peg$c55;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
          if (s0 === peg$FAILED) {
            if (peg$c109.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c110); }
            }
            if (s0 === peg$FAILED) {
              if (peg$c163.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c164); }
              }
              if (s0 === peg$FAILED) {
                if (peg$c165.test(input.charAt(peg$currPos))) {
                  s0 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c166); }
                }
                if (s0 === peg$FAILED) {
                  if (peg$c167.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c168); }
                  }
                }
              }
            }
          }
        }
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "NameChar",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "NameChar",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }

    function peg$parseName() {
      var s0, s1, s2, s3,
          startPos = peg$currPos;

      peg$tracer.trace({
        type:     "rule.enter",
        rule:     "Name",
        location: peg$computeLocation(startPos, startPos)
      });

      var key    = peg$currPos * 42 + 41,
          cached = peg$resultsCache[key];

      if (cached) {
        peg$currPos = cached.nextPos;

      if (cached.result !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Name",
          result: cached.result,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Name",
          location: peg$computeLocation(startPos, startPos)
        });
      }

        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseNameStartChar();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseNameChar();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseNameChar();
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c169(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };

      if (s0 !== peg$FAILED) {
        peg$tracer.trace({
          type:   "rule.match",
          rule:   "Name",
          result: s0,
          location: peg$computeLocation(startPos, peg$currPos)
        });
      } else {
        peg$tracer.trace({
          type: "rule.fail",
          rule: "Name",
          location: peg$computeLocation(startPos, startPos)
        });
      }

      return s0;
    }


        var unroll = options.util.makeUnroll(location, options)
        var ast    = options.util.makeAST   (location, options)

    	var expressionSimplifier = function(left, right, rightTypeIndex, rightPartIndex)
    	{
    		var  i, j
    			,result = {
    				type: '',
    				args: []
    			}
    		;

    		result.args.push(left);
    		for(i = 0; i < right.length; i++)
    		{
    			switch(typeof rightTypeIndex)
    			{
    				case 'string':
    					result.type = rightTypeIndex;
    					break;

    				case 'object':
    					result.type = right[i][rightTypeIndex[0]];
    					for(j=1; j < rightTypeIndex.length; j++)
    					{
    						result.type = result.type[rightTypeIndex[j]];
    					}
    					break;

    				default:
    					result.type = right[i][rightTypeIndex];
    					break;
    			}
    			result.args.push(
    				(typeof rightPartIndex == 'undefined') ? right[i] : right[i][rightPartIndex]
    			);
    			
    			result = {
    				type: '',
    				args:[
    					result
    				]
    			};
    		}
    		
    		return result.args[0];
    	}
    	
    	,predicateExpression = function(expr, axis, predicate, predicateIndex)
    	{
    		var i, predicates = [];
    		
    		if (predicate.length < 1)
    		{
    			return expr;
    		}
    		
    		for (i=0; i < predicate.length; i++)
    		{
    			predicates.push(predicate[i][predicateIndex]);
    		}
    		
    		return {
    			type: 'predicate',
    			args: [
    				axis,
    				expr,
    				predicates
    			]
    		}
    	}

    	// Track all namespace prefixes used in the expression
    	,nsPrefixes = []
    	
    	,trackNsPrefix = function(ns)
    	{
    		var  i
    			,nsPrefixExists = false
    		;
    		
    		if (ns === null) return;

    		// add namespace to the list of namespaces
    		for (i = 0; i < nsPrefixes.length; i++) {
    			if (nsPrefixes[i] === ns) {
    				nsPrefixExists = true;
    				break;
    			}
    		}

    		if (!nsPrefixExists)
    		{
    			nsPrefixes.push(ns);
    		}
    	}
    	
    	,lastQNameParsed
    	,nodeTypeNames = [
    		'comment',
    		'text',
    		'processing-instruction',
    		'node'
    	]
    	,expandSlashAbbrev = function(slash, left, right)
    	{
    		if (slash == '/')
    		{
    			return {
    				type: '/',
    				args: [
    					left,
    					right
    				]
    			};
    		}
    		
    		// slash == '//'
    		return {
    			type: '/',
    			args: [
    				{
    					type: '/',
    					args: [
    						left,
    						{
    							type: 'step',
    							args: [
    								'descendant-or-self',
    								{
    									type: 'nodeType',
    									args: [
    										'node',
    										[]
    									]
    								}
    							]
    						}
    					]
    				},
    				right
    			]
    		};
    	}
    	;


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError:   peg$SyntaxError,
    DefaultTracer: peg$DefaultTracer,
    parse:         peg$parse
  };
})();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("asty");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("pegjs-util");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _XMapperService = __webpack_require__(1);

var _XMapperService2 = _interopRequireDefault(_XMapperService);

var _chai = __webpack_require__(0);

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should,
    expect = _chai2.default.expect,
    equal = _chai2.default.equal,
    be = _chai2.default.be,
    an = _chai2.default.an,
    throws = _chai2.default.throws;
var ResponseTypes = _XMapperService2.default.ResponseTypes;

describe('mapValueToResult', function () {
  it('should map literal', function (done) {
    var result = {};
    var value = 3;
    var path = "test";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: 3 });
    done();
  });
  it('should map object', function (done) {
    var result = {};
    var value = { foo: "bar" };
    var path = "test";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: { foo: "bar" } });
    done();
  });
  it('should map to root if no path', function (done) {
    var result = {};
    var value = { foo: "bar" };
    var path = "";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ foo: "bar" });
    done();
  });
  it('should overwrite value if already exists', function (done) {
    var result = { test: { foo: "bar" } };
    var value = { foo: "baz" };
    var path = "test";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: { foo: "baz" } });
    done();
  });
  it('should create array when path ends with []', function (done) {
    var result = {};
    var value = { foo: "bar" };
    var path = "test[]";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: [{ foo: "bar" }] });
    done();
  });
  it('should push value to array when path ends with []', function (done) {
    var result = { test: [{ a: "b" }] };
    var value = { foo: "bar" };
    var path = "test[]";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: [{ a: "b" }, { foo: "bar" }] });
    done();
  });
  it('should wrap current value in array and push value to array when path ends with []', function (done) {
    var result = { test: { a: "b" } };
    var value = { foo: "bar" };
    var path = "test[]";
    var res = _XMapperService2.default.mapValueToResult(path, value, result);
    expect(res).to.deep.equal({ test: [{ a: "b" }, { foo: "bar" }] });
    done();
  });
});
describe('map', function () {
  it('should map all the things', function (done) {
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
    var res = _XMapperService2.default.map(mappings, initial, {});
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
    var res1 = _XMapperService2.default.map(mapping1, initial, {});
    expect(res1.players.toString()).to.equal("<players><points>20</points></players><players><points>15</points></players>");
    var mapping2 = [{
      expression: "sum(/players/points/text())",
      type: ResponseTypes.NUMBER,
      outputPath: "totalPoints"
    }];
    var res2 = _XMapperService2.default.map(mapping2, res1.players, {});
    expect(res2).to.deep.equal({ totalPoints: 35 });
    done();
  });
  it('should return array of mapped elements when passed array', function (done) {
    var initial = [{ players: [{ points: 10 }, { points: 20 }, { points: 15 }] }, { players: [{ points: 18 }, { points: 17 }, { points: 6 }] }];
    var mapping1 = [{
      expression: "/players[points > 10]",
      type: ResponseTypes.JSON,
      outputPath: "teams"
    }];
    var res1 = _XMapperService2.default.map(mapping1, initial, {});
    expect(res1).to.deep.equal([{ teams: { players: [{ points: "20" }, { points: "15" }] } }, { teams: { players: [{ points: "18" }, { points: "17" }] } }]);
    done();
  });
});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("xmlbuilder");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("xmldom");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("xpath");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _XMapperService = __webpack_require__(1);

var _XMapperService2 = _interopRequireDefault(_XMapperService);

var _chai = __webpack_require__(0);

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should,
    expect = _chai2.default.expect,
    equal = _chai2.default.equal;


describe('jsonToXML', function () {
  it('should handle empty element', function (done) {
    var test = { root: {} };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><root/>');
    done();
  });

  it('should read string as text', function (done) {
    var test = { foo: "bar" };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });
  it('should handle single string result', function (done) {
    var test = "bar";
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('bar');
    done();
  });
  it('should read @ element as attribute', function (done) {
    var test = { foo: { "@baz": "bar" } };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo baz="bar"/>');
    done();
  });

  it('should read #text element as text', function (done) {
    var test = { foo: { "#text": "bar" } };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo>bar</foo>');
    done();
  });
  it('should handle text arrays', function (done) {
    var test = { root: { foo: ["bar", "baz"] } };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><root><foo>bar</foo><foo>baz</foo></root>');
    done();
  });
  it('should handle arrays', function (done) {
    var test = { foo: { bar: [{ id: "1" }, { id: "2" }] } };
    var res = _XMapperService2.default.jsonToXML(test);
    expect(res).to.equal('<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>');
    done();
  });
});

describe('xmlToJson', function () {
  it('should handle empty element', function (done) {
    var test = '<root/>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ root: {} });
    done();
  });
  it('should read string as text', function (done) {
    var test = '<?xml version="1.0"?><foo>bar</foo>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ foo: "bar" });
    done();
  });
  it('should handle single string result', function (done) {
    var test = '<?xml version="1.0"?>bar';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal("bar");
    done();
  });
  it('should read attributes as @ elements', function (done) {
    var test = '<?xml version="1.0"?><foo baz="bar"/>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ foo: { "@baz": "bar" } });
    done();
  });
  it('should set text as #text if @attr', function (done) {
    var test = '<?xml version="1.0"?><foo id="1">bar</foo>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ foo: { "@id": "1", "#text": "bar" } });
    done();
  });

  it('should handle text arrays', function (done) {
    var test = '<root><foo>bar</foo><foo>baz</foo></root>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ root: { foo: ["bar", "baz"] } });
    done();
  });
  it('should handle arrays', function (done) {
    var test = '<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>';
    var res = _XMapperService2.default.xmlToJson(test);
    expect(res).to.deep.equal({ foo: { bar: [{ id: "1" }, { id: "2" }] } });
    done();
  });
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _XMapperService = __webpack_require__(1);

var _XMapperService2 = _interopRequireDefault(_XMapperService);

var _chai = __webpack_require__(0);

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should,
    expect = _chai2.default.expect,
    equal = _chai2.default.equal,
    be = _chai2.default.be,
    an = _chai2.default.an;


describe('generateDom', function () {
  it('should build from xml', function (done) {
    var test = '<?xml version="1.0"?><foo><bar><id>1</id></bar><bar><id>2</id></bar></foo>';
    var res = _XMapperService2.default.generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
  it('should build from html', function (done) {
    var test = '<html><header><title>This is title</title></header><body>Hello world</body></html>';
    var res = _XMapperService2.default.generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
  it('should build from json', function (done) {
    var test = { foo: "bar" };
    var res = _XMapperService2.default.generateDom(test);
    expect(res).to.be.an('object');
    done();
  });
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _XMapperService = __webpack_require__(1);

var _XMapperService2 = _interopRequireDefault(_XMapperService);

var _chai = __webpack_require__(0);

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should,
    expect = _chai2.default.expect,
    equal = _chai2.default.equal,
    be = _chai2.default.be,
    an = _chai2.default.an,
    throws = _chai2.default.throws;
var ResponseTypes = _XMapperService2.default.ResponseTypes;

describe('query', function () {
  it('should return text value for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo>';
    var res = _XMapperService2.default.query(test, "/foo/text()");
    expect(res).to.equal('1');
    done();
  });
  it('should return number for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo>';
    var res = _XMapperService2.default.query(test, "/foo", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should return attribute value for xpath search', function (done) {
    var test = '<?xml version="1.0"?><foo bar="1"/>';
    var res = _XMapperService2.default.query(test, "/foo/@bar");
    expect(res).to.equal('1');
    done();
  });
  it('should return first if multiple results for query', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>2</foo>';
    var res = _XMapperService2.default.query(test, "/foo");
    expect(res).to.equal('1');
    done();
  });
  it('should return null if no results for query', function (done) {
    var test = '<?xml version="1.0"?>';
    var res = _XMapperService2.default.query(test, "/foo/text()");
    expect(res).to.equal(null);
    done();
  });
  it('should handle advanced xpath', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>';
    var res = _XMapperService2.default.query(test, '/foo[id=2]/name');
    expect(res).to.equal('baz');
    done();
  });
  it('should handle advanced xpath - contains', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>';
    var res = _XMapperService2.default.query(test, '/foo[contains(name,"baz")]/name');
    expect(res).to.deep.equal('baz');
    done();
  });
  it('should handle Json ', function (done) {
    var test = { foo: [{ id: 1, name: "bar" }, { id: 2, name: "baz" }] };
    var res = _XMapperService2.default.query(test, '/foo[id="2"]/name');
    expect(res).to.equal('baz');
    done();
  });
  it('should return xml if type is xml', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>';
    var res = _XMapperService2.default.query(test, "/foo/bar", ResponseTypes.XML);
    expect(res).to.be.an('object');
    expect(res.toString()).to.equal('<bar id="1">baz</bar>');
    done();
  });
  it('should return xml with multiple results ', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar><bar id="2">baz2</bar></foo>';
    var res = _XMapperService2.default.query(test, "/foo/bar", ResponseTypes.XML);
    expect(res).to.be.an('object');
    expect(res.toString()).to.equal('<bar id="1">baz</bar><bar id="2">baz2</bar>');
    done();
  });
  it('should return xml with single result', function (done) {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>';
    var res = _XMapperService2.default.query(test, "/foo/bar/text()", ResponseTypes.XML);
    expect(res).to.be.an('object').that.has.property('childNodes').which.has.lengthOf(1);
    expect(_XMapperService2.default.xmlToJson(res)).to.equal("baz");
    done();
  });
  it('should return json if type is json', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>';
    var res = _XMapperService2.default.query(test, "/foo", ResponseTypes.JSON);
    expect(res).to.deep.equal({ foo: { id: "1", name: "bar" } });
    done();
  });
  it('should return json object with array when multiple results', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><named>baz</named></foo>';
    var res = _XMapperService2.default.query(test, "/foo/id", ResponseTypes.JSON);
    expect(res).to.deep.equal({ id: ["1", "2"] });
    done();
  });
  it('should return json object with string when only one result', function (done) {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>';
    var res = _XMapperService2.default.query(test, "/foo/id", ResponseTypes.JSON);
    expect(res).to.deep.equal({ id: "1" });
    done();
  });
  it('should handle count', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    var res = _XMapperService2.default.query(test, "count(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.deep.equal(2);
    done();
  });
  it('should handle sum', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    var res = _XMapperService2.default.query(test, "sum(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.deep.equal(10);
    done();
  });
  it('should handle min', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "min(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should handle max', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "max(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(9);
    done();
  });
  it('should handle avg', function (done) {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo><foo>20</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "avg(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(10);
    done();
  });
  it('should handle ceiling', function (done) {
    var test = '<?xml version="1.0"?><foo>1.3</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "ceiling(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(2);
    done();
  });
  it('should handle floor', function (done) {
    var test = '<?xml version="1.0"?><foo>1.7</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "floor(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(1);
    done();
  });
  it('should handle round', function (done) {
    var test = '<?xml version="1.0"?><foo>1.7</foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "round(/foo/text())", ResponseTypes.NUMBER);
    expect(res).to.equal(2);
    done();
  });
  it('should handle normalize-space', function (done) {
    var test = '<?xml version="1.0"?><foo>\n 1.7 </foo>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "normalize-space(/foo/text())");
    expect(res).to.equal('1.7');
    done();
  });
  it('should handle boolean', function (done) {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "boolean(/foo/text())", ResponseTypes.BOOLEAN);
    expect(res).to.equal(true);
    var res2 = _XMapperService2.default.query(test, "boolean(/bar/text())", ResponseTypes.BOOLEAN);
    expect(res2).to.equal(false);
    done();
  });
  it('should handle boolean not', function (done) {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>';
    _XMapperService2.default.parseQuery("/foo");
    var res = _XMapperService2.default.query(test, "not(boolean(/foo/text()))", ResponseTypes.BOOLEAN);
    expect(res).to.equal(false);
    var res2 = _XMapperService2.default.query(test, "not(boolean(/bar/text()))", ResponseTypes.BOOLEAN);
    expect(res2).to.equal(true);
    done();
  });
  it('should run query against each element if json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = _XMapperService2.default.parseQuery("/*[self::name or self::email]");
    var res = _XMapperService2.default.query(test, expr, ResponseTypes.JSON);
    expect(res).to.deep.equal([{ name: "foo", email: "foo@email.com" }, { name: "bar", email: "bar@email.com" }, { name: "baz", email: "baz@email.com" }]);
    done();
  });
  it('should not return elements that returned null from json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = _XMapperService2.default.parseQuery('/*[text() = "foo"]');
    var res = _XMapperService2.default.query(test, expr, ResponseTypes.JSON);
    expect(res).to.deep.equal([{ name: "foo" }]);
    done();
  });
  it('should return null if all elements returned null from json array', function (done) {
    var test = [{ id: 1, name: "foo", email: "foo@email.com" }, { id: 2, name: "bar", email: "bar@email.com" }, { id: 3, name: "baz", email: "baz@email.com" }];
    var expr = _XMapperService2.default.parseQuery('/*[text() = "asdf"]');
    var res = _XMapperService2.default.query(test, expr, ResponseTypes.JSON);
    expect(res).to.equal(null);
    done();
  });
});

/***/ })
/******/ ]);