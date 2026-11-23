// ==UserScript==
// @name         V2EX Polish - 体验更现代化的 V2EX
// @namespace    https://v2p.leoku.dev
// @version      2.5.15
// @description  为 V2EX 带来现代化界面、楼中楼回复、主题预览、用户标签与每日签到，让浏览更清爽、交流更高效。
// @author       LeoKu
// @license      MIT
// @match        https://v2ex.com/*
// @match        https://www.v2ex.com/*
// @match        https://cn.v2ex.com/*
// @match        https://jp.v2ex.com/*
// @match        https://de.v2ex.com/*
// @match        https://us.v2ex.com/*
// @match        https://hk.v2ex.com/*
// @match        https://global.v2ex.com/*
// @match        https://fast.v2ex.com/*
// @match        https://s.v2ex.com/*
// @match        https://origin.v2ex.com/*
// @match        https://edge.v2ex.com/*
// @match        https://staging.v2ex.com/*
// @match        https://global.v2ex.co/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

(function() {

//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) {
			__defProp(target, name, {
				get: all[name],
				enumerable: true
			});
		}
		if (!no_symbols) {
			__defProp(target, Symbol.toStringTag, { value: "Module" });
		}
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) {
					__defProp(to, key, {
						get: ((k) => from[k]).bind(null, key),
						enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
					});
				}
			}
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion
//#region ../../node_modules/.pnpm/jquery@3.6.4/node_modules/jquery/dist/jquery.js
	var require_jquery = /* @__PURE__ */ __commonJSMin(((exports, module, this$1) => {
		/*!
		* jQuery JavaScript Library v3.6.4
		* https://jquery.com/
		*
		* Includes Sizzle.js
		* https://sizzlejs.com/
		*
		* Copyright OpenJS Foundation and other contributors
		* Released under the MIT license
		* https://jquery.org/license
		*
		* Date: 2023-03-08T15:28Z
		*/
		(function(global, factory) {
			"use strict";
			if (typeof module === "object" && typeof module.exports === "object") module.exports = global.document ? factory(global, true) : function(w) {
				if (!w.document) throw new Error("jQuery requires a window with a document");
				return factory(w);
			};
			else factory(global);
		})(typeof window !== "undefined" ? window : this$1, function(window, noGlobal) {
			"use strict";
			var arr = [];
			var getProto = Object.getPrototypeOf;
			var slice = arr.slice;
			var flat = arr.flat ? function(array) {
				return arr.flat.call(array);
			} : function(array) {
				return arr.concat.apply([], array);
			};
			var push = arr.push;
			var indexOf = arr.indexOf;
			var class2type = {};
			var toString = class2type.toString;
			var hasOwn = class2type.hasOwnProperty;
			var fnToString = hasOwn.toString;
			var ObjectFunctionString = fnToString.call(Object);
			var support = {};
			var isFunction = function isFunction(obj) {
				return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
			};
			var isWindow = function isWindow(obj) {
				return obj != null && obj === obj.window;
			};
			var document = window.document;
			var preservedScriptAttributes = {
				type: true,
				src: true,
				nonce: true,
				noModule: true
			};
			function DOMEval(code, node, doc) {
				doc = doc || document;
				var i, val, script = doc.createElement("script");
				script.text = code;
				if (node) for (i in preservedScriptAttributes) {
					val = node[i] || node.getAttribute && node.getAttribute(i);
					if (val) script.setAttribute(i, val);
				}
				doc.head.appendChild(script).parentNode.removeChild(script);
			}
			function toType(obj) {
				if (obj == null) return obj + "";
				return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
			}
			var version = "3.6.4", jQuery = function(selector, context) {
				return new jQuery.fn.init(selector, context);
			};
			jQuery.fn = jQuery.prototype = {
				jquery: version,
				constructor: jQuery,
				length: 0,
				toArray: function() {
					return slice.call(this);
				},
				get: function(num) {
					if (num == null) return slice.call(this);
					return num < 0 ? this[num + this.length] : this[num];
				},
				pushStack: function(elems) {
					var ret = jQuery.merge(this.constructor(), elems);
					ret.prevObject = this;
					return ret;
				},
				each: function(callback) {
					return jQuery.each(this, callback);
				},
				map: function(callback) {
					return this.pushStack(jQuery.map(this, function(elem, i) {
						return callback.call(elem, i, elem);
					}));
				},
				slice: function() {
					return this.pushStack(slice.apply(this, arguments));
				},
				first: function() {
					return this.eq(0);
				},
				last: function() {
					return this.eq(-1);
				},
				even: function() {
					return this.pushStack(jQuery.grep(this, function(_elem, i) {
						return (i + 1) % 2;
					}));
				},
				odd: function() {
					return this.pushStack(jQuery.grep(this, function(_elem, i) {
						return i % 2;
					}));
				},
				eq: function(i) {
					var len = this.length, j = +i + (i < 0 ? len : 0);
					return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
				},
				end: function() {
					return this.prevObject || this.constructor();
				},
				push,
				sort: arr.sort,
				splice: arr.splice
			};
			jQuery.extend = jQuery.fn.extend = function() {
				var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
				if (typeof target === "boolean") {
					deep = target;
					target = arguments[i] || {};
					i++;
				}
				if (typeof target !== "object" && !isFunction(target)) target = {};
				if (i === length) {
					target = this;
					i--;
				}
				for (; i < length; i++) if ((options = arguments[i]) != null) for (name in options) {
					copy = options[name];
					if (name === "__proto__" || target === copy) continue;
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
						src = target[name];
						if (copyIsArray && !Array.isArray(src)) clone = [];
						else if (!copyIsArray && !jQuery.isPlainObject(src)) clone = {};
						else clone = src;
						copyIsArray = false;
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== void 0) target[name] = copy;
				}
				return target;
			};
			jQuery.extend({
				expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
				isReady: true,
				error: function(msg) {
					throw new Error(msg);
				},
				noop: function() {},
				isPlainObject: function(obj) {
					var proto, Ctor;
					if (!obj || toString.call(obj) !== "[object Object]") return false;
					proto = getProto(obj);
					if (!proto) return true;
					Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
					return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
				},
				isEmptyObject: function(obj) {
					var name;
					for (name in obj) return false;
					return true;
				},
				globalEval: function(code, options, doc) {
					DOMEval(code, { nonce: options && options.nonce }, doc);
				},
				each: function(obj, callback) {
					var length, i = 0;
					if (isArrayLike(obj)) {
						length = obj.length;
						for (; i < length; i++) if (callback.call(obj[i], i, obj[i]) === false) break;
					} else for (i in obj) if (callback.call(obj[i], i, obj[i]) === false) break;
					return obj;
				},
				makeArray: function(arr, results) {
					var ret = results || [];
					if (arr != null) {
						if (isArrayLike(Object(arr))) jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
						else push.call(ret, arr);
					}
					return ret;
				},
				inArray: function(elem, arr, i) {
					return arr == null ? -1 : indexOf.call(arr, elem, i);
				},
				merge: function(first, second) {
					var len = +second.length, j = 0, i = first.length;
					for (; j < len; j++) first[i++] = second[j];
					first.length = i;
					return first;
				},
				grep: function(elems, callback, invert) {
					var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
					for (; i < length; i++) {
						callbackInverse = !callback(elems[i], i);
						if (callbackInverse !== callbackExpect) matches.push(elems[i]);
					}
					return matches;
				},
				map: function(elems, callback, arg) {
					var length, value, i = 0, ret = [];
					if (isArrayLike(elems)) {
						length = elems.length;
						for (; i < length; i++) {
							value = callback(elems[i], i, arg);
							if (value != null) ret.push(value);
						}
					} else for (i in elems) {
						value = callback(elems[i], i, arg);
						if (value != null) ret.push(value);
					}
					return flat(ret);
				},
				guid: 1,
				support
			});
			if (typeof Symbol === "function") jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
			jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(_i, name) {
				class2type["[object " + name + "]"] = name.toLowerCase();
			});
			function isArrayLike(obj) {
				var length = !!obj && "length" in obj && obj.length, type = toType(obj);
				if (isFunction(obj) || isWindow(obj)) return false;
				return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
			}
			var Sizzle = (function(window) {
				/*!
				* Sizzle CSS Selector Engine v2.3.10
				* https://sizzlejs.com/
				*
				* Copyright JS Foundation and other contributors
				* Released under the MIT license
				* https://js.foundation/
				*
				* Date: 2023-02-14
				*/
				var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + 1 * /* @__PURE__ */ new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
					if (a === b) hasDuplicate = true;
					return 0;
				}, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, pushNative = arr.push, push = arr.push, slice = arr.slice, indexOf = function(list, elem) {
					var i = 0, len = list.length;
					for (; i < len; i++) if (list[i] === elem) return i;
					return -1;
				}, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
					"ID": new RegExp("^#(" + identifier + ")"),
					"CLASS": new RegExp("^\\.(" + identifier + ")"),
					"TAG": new RegExp("^(" + identifier + "|[*])"),
					"ATTR": new RegExp("^" + attributes),
					"PSEUDO": new RegExp("^" + pseudos),
					"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
					"bool": new RegExp("^(?:" + booleans + ")$", "i"),
					"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
				}, rhtml = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
					var high = "0x" + escape.slice(1) - 65536;
					return nonHex ? nonHex : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
				}, rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
					if (asCodePoint) {
						if (ch === "\0") return "�";
						return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
					}
					return "\\" + ch;
				}, unloadHandler = function() {
					setDocument();
				}, inDisabledFieldset = addCombinator(function(elem) {
					return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
				}, {
					dir: "parentNode",
					next: "legend"
				});
				try {
					push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
					arr[preferredDoc.childNodes.length].nodeType;
				} catch (e) {
					push = { apply: arr.length ? function(target, els) {
						pushNative.apply(target, slice.call(els));
					} : function(target, els) {
						var j = target.length, i = 0;
						while (target[j++] = els[i++]);
						target.length = j - 1;
					} };
				}
				function Sizzle(selector, context, results, seed) {
					var m, i, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
					results = results || [];
					if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) return results;
					if (!seed) {
						setDocument(context);
						context = context || document;
						if (documentIsHTML) {
							if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
								if (m = match[1]) {
									if (nodeType === 9) {
										if (elem = context.getElementById(m)) {
											if (elem.id === m) {
												results.push(elem);
												return results;
											}
										} else return results;
									} else if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
										results.push(elem);
										return results;
									}
								} else if (match[2]) {
									push.apply(results, context.getElementsByTagName(selector));
									return results;
								} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
									push.apply(results, context.getElementsByClassName(m));
									return results;
								}
							}
							if (support.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (nodeType !== 1 || context.nodeName.toLowerCase() !== "object")) {
								newSelector = selector;
								newContext = context;
								if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
									newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
									if (newContext !== context || !support.scope) {
										if (nid = context.getAttribute("id")) nid = nid.replace(rcssescape, fcssescape);
										else context.setAttribute("id", nid = expando);
									}
									groups = tokenize(selector);
									i = groups.length;
									while (i--) groups[i] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i]);
									newSelector = groups.join(",");
								}
								try {
									push.apply(results, newContext.querySelectorAll(newSelector));
									return results;
								} catch (qsaError) {
									nonnativeSelectorCache(selector, true);
								} finally {
									if (nid === expando) context.removeAttribute("id");
								}
							}
						}
					}
					return select(selector.replace(rtrim, "$1"), context, results, seed);
				}
				/**
				* Create key-value caches of limited size
				* @returns {function(string, object)} Returns the Object data after storing it on itself with
				*	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
				*	deleting the oldest entry
				*/
				function createCache() {
					var keys = [];
					function cache(key, value) {
						if (keys.push(key + " ") > Expr.cacheLength) delete cache[keys.shift()];
						return cache[key + " "] = value;
					}
					return cache;
				}
				/**
				* Mark a function for special use by Sizzle
				* @param {Function} fn The function to mark
				*/
				function markFunction(fn) {
					fn[expando] = true;
					return fn;
				}
				/**
				* Support testing using an element
				* @param {Function} fn Passed the created element and returns a boolean result
				*/
				function assert(fn) {
					var el = document.createElement("fieldset");
					try {
						return !!fn(el);
					} catch (e) {
						return false;
					} finally {
						if (el.parentNode) el.parentNode.removeChild(el);
						el = null;
					}
				}
				/**
				* Adds the same handler for all of the specified attrs
				* @param {String} attrs Pipe-separated list of attributes
				* @param {Function} handler The method that will be applied
				*/
				function addHandle(attrs, handler) {
					var arr = attrs.split("|"), i = arr.length;
					while (i--) Expr.attrHandle[arr[i]] = handler;
				}
				/**
				* Checks document order of two siblings
				* @param {Element} a
				* @param {Element} b
				* @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
				*/
				function siblingCheck(a, b) {
					var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;
					if (diff) return diff;
					if (cur) {
						while (cur = cur.nextSibling) if (cur === b) return -1;
					}
					return a ? 1 : -1;
				}
				/**
				* Returns a function to use in pseudos for input types
				* @param {String} type
				*/
				function createInputPseudo(type) {
					return function(elem) {
						return elem.nodeName.toLowerCase() === "input" && elem.type === type;
					};
				}
				/**
				* Returns a function to use in pseudos for buttons
				* @param {String} type
				*/
				function createButtonPseudo(type) {
					return function(elem) {
						var name = elem.nodeName.toLowerCase();
						return (name === "input" || name === "button") && elem.type === type;
					};
				}
				/**
				* Returns a function to use in pseudos for :enabled/:disabled
				* @param {Boolean} disabled true for :disabled; false for :enabled
				*/
				function createDisabledPseudo(disabled) {
					return function(elem) {
						if ("form" in elem) {
							if (elem.parentNode && elem.disabled === false) {
								if ("label" in elem) {
									if ("label" in elem.parentNode) return elem.parentNode.disabled === disabled;
									else return elem.disabled === disabled;
								}
								return elem.isDisabled === disabled || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
							}
							return elem.disabled === disabled;
						} else if ("label" in elem) return elem.disabled === disabled;
						return false;
					};
				}
				/**
				* Returns a function to use in pseudos for positionals
				* @param {Function} fn
				*/
				function createPositionalPseudo(fn) {
					return markFunction(function(argument) {
						argument = +argument;
						return markFunction(function(seed, matches) {
							var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
							while (i--) if (seed[j = matchIndexes[i]]) seed[j] = !(matches[j] = seed[j]);
						});
					});
				}
				/**
				* Checks a node for validity as a Sizzle context
				* @param {Element|Object=} context
				* @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
				*/
				function testContext(context) {
					return context && typeof context.getElementsByTagName !== "undefined" && context;
				}
				support = Sizzle.support = {};
				/**
				* Detects XML nodes
				* @param {Element|Object} elem An element or a document
				* @returns {Boolean} True iff elem is a non-HTML XML node
				*/
				isXML = Sizzle.isXML = function(elem) {
					var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
					return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
				};
				/**
				* Sets document-related variables once based on the current document
				* @param {Element|Object} [doc] An element or document object to use to set the document
				* @returns {Object} Returns the current document
				*/
				setDocument = Sizzle.setDocument = function(node) {
					var hasCompare, subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
					if (doc == document || doc.nodeType !== 9 || !doc.documentElement) return document;
					document = doc;
					docElem = document.documentElement;
					documentIsHTML = !isXML(document);
					if (preferredDoc != document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
						if (subWindow.addEventListener) subWindow.addEventListener("unload", unloadHandler, false);
						else if (subWindow.attachEvent) subWindow.attachEvent("onunload", unloadHandler);
					}
					support.scope = assert(function(el) {
						docElem.appendChild(el).appendChild(document.createElement("div"));
						return typeof el.querySelectorAll !== "undefined" && !el.querySelectorAll(":scope fieldset div").length;
					});
					support.cssHas = assert(function() {
						try {
							document.querySelector(":has(*,:jqfake)");
							return false;
						} catch (e) {
							return true;
						}
					});
					support.attributes = assert(function(el) {
						el.className = "i";
						return !el.getAttribute("className");
					});
					support.getElementsByTagName = assert(function(el) {
						el.appendChild(document.createComment(""));
						return !el.getElementsByTagName("*").length;
					});
					support.getElementsByClassName = rnative.test(document.getElementsByClassName);
					support.getById = assert(function(el) {
						docElem.appendChild(el).id = expando;
						return !document.getElementsByName || !document.getElementsByName(expando).length;
					});
					if (support.getById) {
						Expr.filter["ID"] = function(id) {
							var attrId = id.replace(runescape, funescape);
							return function(elem) {
								return elem.getAttribute("id") === attrId;
							};
						};
						Expr.find["ID"] = function(id, context) {
							if (typeof context.getElementById !== "undefined" && documentIsHTML) {
								var elem = context.getElementById(id);
								return elem ? [elem] : [];
							}
						};
					} else {
						Expr.filter["ID"] = function(id) {
							var attrId = id.replace(runescape, funescape);
							return function(elem) {
								var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
								return node && node.value === attrId;
							};
						};
						Expr.find["ID"] = function(id, context) {
							if (typeof context.getElementById !== "undefined" && documentIsHTML) {
								var node, i, elems, elem = context.getElementById(id);
								if (elem) {
									node = elem.getAttributeNode("id");
									if (node && node.value === id) return [elem];
									elems = context.getElementsByName(id);
									i = 0;
									while (elem = elems[i++]) {
										node = elem.getAttributeNode("id");
										if (node && node.value === id) return [elem];
									}
								}
								return [];
							}
						};
					}
					Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
						if (typeof context.getElementsByTagName !== "undefined") return context.getElementsByTagName(tag);
						else if (support.qsa) return context.querySelectorAll(tag);
					} : function(tag, context) {
						var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
						if (tag === "*") {
							while (elem = results[i++]) if (elem.nodeType === 1) tmp.push(elem);
							return tmp;
						}
						return results;
					};
					Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
						if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) return context.getElementsByClassName(className);
					};
					rbuggyMatches = [];
					rbuggyQSA = [];
					if (support.qsa = rnative.test(document.querySelectorAll)) {
						assert(function(el) {
							var input;
							docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
							if (el.querySelectorAll("[msallowcapture^='']").length) rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
							if (!el.querySelectorAll("[selected]").length) rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
							if (!el.querySelectorAll("[id~=" + expando + "-]").length) rbuggyQSA.push("~=");
							input = document.createElement("input");
							input.setAttribute("name", "");
							el.appendChild(input);
							if (!el.querySelectorAll("[name='']").length) rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + "*(?:''|\"\")");
							if (!el.querySelectorAll(":checked").length) rbuggyQSA.push(":checked");
							if (!el.querySelectorAll("a#" + expando + "+*").length) rbuggyQSA.push(".#.+[+~]");
							el.querySelectorAll("\\\f");
							rbuggyQSA.push("[\\r\\n\\f]");
						});
						assert(function(el) {
							el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
							var input = document.createElement("input");
							input.setAttribute("type", "hidden");
							el.appendChild(input).setAttribute("name", "D");
							if (el.querySelectorAll("[name=d]").length) rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
							if (el.querySelectorAll(":enabled").length !== 2) rbuggyQSA.push(":enabled", ":disabled");
							docElem.appendChild(el).disabled = true;
							if (el.querySelectorAll(":disabled").length !== 2) rbuggyQSA.push(":enabled", ":disabled");
							el.querySelectorAll("*,:x");
							rbuggyQSA.push(",.*:");
						});
					}
					if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) assert(function(el) {
						support.disconnectedMatch = matches.call(el, "*");
						matches.call(el, "[s!='']:x");
						rbuggyMatches.push("!=", pseudos);
					});
					if (!support.cssHas) rbuggyQSA.push(":has");
					rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
					rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
					hasCompare = rnative.test(docElem.compareDocumentPosition);
					contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
						var adown = a.nodeType === 9 && a.documentElement || a, bup = b && b.parentNode;
						return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
					} : function(a, b) {
						if (b) {
							while (b = b.parentNode) if (b === a) return true;
						}
						return false;
					};
					sortOrder = hasCompare ? function(a, b) {
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}
						var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
						if (compare) return compare;
						compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
						if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
							if (a == document || a.ownerDocument == preferredDoc && contains(preferredDoc, a)) return -1;
							if (b == document || b.ownerDocument == preferredDoc && contains(preferredDoc, b)) return 1;
							return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
						}
						return compare & 4 ? -1 : 1;
					} : function(a, b) {
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}
						var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
						if (!aup || !bup) return a == document ? -1 : b == document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
						else if (aup === bup) return siblingCheck(a, b);
						cur = a;
						while (cur = cur.parentNode) ap.unshift(cur);
						cur = b;
						while (cur = cur.parentNode) bp.unshift(cur);
						while (ap[i] === bp[i]) i++;
						return i ? siblingCheck(ap[i], bp[i]) : ap[i] == preferredDoc ? -1 : bp[i] == preferredDoc ? 1 : 0;
					};
					return document;
				};
				Sizzle.matches = function(expr, elements) {
					return Sizzle(expr, null, null, elements);
				};
				Sizzle.matchesSelector = function(elem, expr) {
					setDocument(elem);
					if (support.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
						var ret = matches.call(elem, expr);
						if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) return ret;
					} catch (e) {
						nonnativeSelectorCache(expr, true);
					}
					return Sizzle(expr, document, null, [elem]).length > 0;
				};
				Sizzle.contains = function(context, elem) {
					if ((context.ownerDocument || context) != document) setDocument(context);
					return contains(context, elem);
				};
				Sizzle.attr = function(elem, name) {
					if ((elem.ownerDocument || elem) != document) setDocument(elem);
					var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
					return val !== void 0 ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				};
				Sizzle.escape = function(sel) {
					return (sel + "").replace(rcssescape, fcssescape);
				};
				Sizzle.error = function(msg) {
					throw new Error("Syntax error, unrecognized expression: " + msg);
				};
				/**
				* Document sorting and removing duplicates
				* @param {ArrayLike} results
				*/
				Sizzle.uniqueSort = function(results) {
					var elem, duplicates = [], j = 0, i = 0;
					hasDuplicate = !support.detectDuplicates;
					sortInput = !support.sortStable && results.slice(0);
					results.sort(sortOrder);
					if (hasDuplicate) {
						while (elem = results[i++]) if (elem === results[i]) j = duplicates.push(i);
						while (j--) results.splice(duplicates[j], 1);
					}
					sortInput = null;
					return results;
				};
				/**
				* Utility function for retrieving the text value of an array of DOM nodes
				* @param {Array|Element} elem
				*/
				getText = Sizzle.getText = function(elem) {
					var node, ret = "", i = 0, nodeType = elem.nodeType;
					if (!nodeType) while (node = elem[i++]) ret += getText(node);
					else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
						if (typeof elem.textContent === "string") return elem.textContent;
						else for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
					} else if (nodeType === 3 || nodeType === 4) return elem.nodeValue;
					return ret;
				};
				Expr = Sizzle.selectors = {
					cacheLength: 50,
					createPseudo: markFunction,
					match: matchExpr,
					attrHandle: {},
					find: {},
					relative: {
						">": {
							dir: "parentNode",
							first: true
						},
						" ": { dir: "parentNode" },
						"+": {
							dir: "previousSibling",
							first: true
						},
						"~": { dir: "previousSibling" }
					},
					preFilter: {
						"ATTR": function(match) {
							match[1] = match[1].replace(runescape, funescape);
							match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
							if (match[2] === "~=") match[3] = " " + match[3] + " ";
							return match.slice(0, 4);
						},
						"CHILD": function(match) {
							match[1] = match[1].toLowerCase();
							if (match[1].slice(0, 3) === "nth") {
								if (!match[3]) Sizzle.error(match[0]);
								match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
								match[5] = +(match[7] + match[8] || match[3] === "odd");
							} else if (match[3]) Sizzle.error(match[0]);
							return match;
						},
						"PSEUDO": function(match) {
							var excess, unquoted = !match[6] && match[2];
							if (matchExpr["CHILD"].test(match[0])) return null;
							if (match[3]) match[2] = match[4] || match[5] || "";
							else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
								match[0] = match[0].slice(0, excess);
								match[2] = unquoted.slice(0, excess);
							}
							return match.slice(0, 3);
						}
					},
					filter: {
						"TAG": function(nodeNameSelector) {
							var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
							return nodeNameSelector === "*" ? function() {
								return true;
							} : function(elem) {
								return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
							};
						},
						"CLASS": function(className) {
							var pattern = classCache[className + " "];
							return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
								return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
							});
						},
						"ATTR": function(name, operator, check) {
							return function(elem) {
								var result = Sizzle.attr(elem, name);
								if (result == null) return operator === "!=";
								if (!operator) return true;
								result += "";
								return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
							};
						},
						"CHILD": function(type, what, _argument, first, last) {
							var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
							return first === 1 && last === 0 ? function(elem) {
								return !!elem.parentNode;
							} : function(elem, _context, xml) {
								var cache, uniqueCache, outerCache, node, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
								if (parent) {
									if (simple) {
										while (dir) {
											node = elem;
											while (node = node[dir]) if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) return false;
											start = dir = type === "only" && !start && "nextSibling";
										}
										return true;
									}
									start = [forward ? parent.firstChild : parent.lastChild];
									if (forward && useCache) {
										node = parent;
										outerCache = node[expando] || (node[expando] = {});
										uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
										cache = uniqueCache[type] || [];
										nodeIndex = cache[0] === dirruns && cache[1];
										diff = nodeIndex && cache[2];
										node = nodeIndex && parent.childNodes[nodeIndex];
										while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) if (node.nodeType === 1 && ++diff && node === elem) {
											uniqueCache[type] = [
												dirruns,
												nodeIndex,
												diff
											];
											break;
										}
									} else {
										if (useCache) {
											node = elem;
											outerCache = node[expando] || (node[expando] = {});
											uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
											cache = uniqueCache[type] || [];
											nodeIndex = cache[0] === dirruns && cache[1];
											diff = nodeIndex;
										}
										if (diff === false) {
											while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
												if (useCache) {
													outerCache = node[expando] || (node[expando] = {});
													uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
													uniqueCache[type] = [dirruns, diff];
												}
												if (node === elem) break;
											}
										}
									}
									diff -= last;
									return diff === first || diff % first === 0 && diff / first >= 0;
								}
							};
						},
						"PSEUDO": function(pseudo, argument) {
							var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
							if (fn[expando]) return fn(argument);
							if (fn.length > 1) {
								args = [
									pseudo,
									pseudo,
									"",
									argument
								];
								return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
									var idx, matched = fn(seed, argument), i = matched.length;
									while (i--) {
										idx = indexOf(seed, matched[i]);
										seed[idx] = !(matches[idx] = matched[i]);
									}
								}) : function(elem) {
									return fn(elem, 0, args);
								};
							}
							return fn;
						}
					},
					pseudos: {
						"not": markFunction(function(selector) {
							var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
							return matcher[expando] ? markFunction(function(seed, matches, _context, xml) {
								var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
								while (i--) if (elem = unmatched[i]) seed[i] = !(matches[i] = elem);
							}) : function(elem, _context, xml) {
								input[0] = elem;
								matcher(input, null, xml, results);
								input[0] = null;
								return !results.pop();
							};
						}),
						"has": markFunction(function(selector) {
							return function(elem) {
								return Sizzle(selector, elem).length > 0;
							};
						}),
						"contains": markFunction(function(text) {
							text = text.replace(runescape, funescape);
							return function(elem) {
								return (elem.textContent || getText(elem)).indexOf(text) > -1;
							};
						}),
						"lang": markFunction(function(lang) {
							if (!ridentifier.test(lang || "")) Sizzle.error("unsupported lang: " + lang);
							lang = lang.replace(runescape, funescape).toLowerCase();
							return function(elem) {
								var elemLang;
								do
									if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
										elemLang = elemLang.toLowerCase();
										return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
									}
								while ((elem = elem.parentNode) && elem.nodeType === 1);
								return false;
							};
						}),
						"target": function(elem) {
							var hash = window.location && window.location.hash;
							return hash && hash.slice(1) === elem.id;
						},
						"root": function(elem) {
							return elem === docElem;
						},
						"focus": function(elem) {
							return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
						},
						"enabled": createDisabledPseudo(false),
						"disabled": createDisabledPseudo(true),
						"checked": function(elem) {
							var nodeName = elem.nodeName.toLowerCase();
							return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
						},
						"selected": function(elem) {
							if (elem.parentNode) elem.parentNode.selectedIndex;
							return elem.selected === true;
						},
						"empty": function(elem) {
							for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeType < 6) return false;
							return true;
						},
						"parent": function(elem) {
							return !Expr.pseudos["empty"](elem);
						},
						"header": function(elem) {
							return rheader.test(elem.nodeName);
						},
						"input": function(elem) {
							return rinputs.test(elem.nodeName);
						},
						"button": function(elem) {
							var name = elem.nodeName.toLowerCase();
							return name === "input" && elem.type === "button" || name === "button";
						},
						"text": function(elem) {
							var attr;
							return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
						},
						"first": createPositionalPseudo(function() {
							return [0];
						}),
						"last": createPositionalPseudo(function(_matchIndexes, length) {
							return [length - 1];
						}),
						"eq": createPositionalPseudo(function(_matchIndexes, length, argument) {
							return [argument < 0 ? argument + length : argument];
						}),
						"even": createPositionalPseudo(function(matchIndexes, length) {
							var i = 0;
							for (; i < length; i += 2) matchIndexes.push(i);
							return matchIndexes;
						}),
						"odd": createPositionalPseudo(function(matchIndexes, length) {
							var i = 1;
							for (; i < length; i += 2) matchIndexes.push(i);
							return matchIndexes;
						}),
						"lt": createPositionalPseudo(function(matchIndexes, length, argument) {
							var i = argument < 0 ? argument + length : argument > length ? length : argument;
							for (; --i >= 0;) matchIndexes.push(i);
							return matchIndexes;
						}),
						"gt": createPositionalPseudo(function(matchIndexes, length, argument) {
							var i = argument < 0 ? argument + length : argument;
							for (; ++i < length;) matchIndexes.push(i);
							return matchIndexes;
						})
					}
				};
				Expr.pseudos["nth"] = Expr.pseudos["eq"];
				for (i in {
					radio: true,
					checkbox: true,
					file: true,
					password: true,
					image: true
				}) Expr.pseudos[i] = createInputPseudo(i);
				for (i in {
					submit: true,
					reset: true
				}) Expr.pseudos[i] = createButtonPseudo(i);
				function setFilters() {}
				setFilters.prototype = Expr.filters = Expr.pseudos;
				Expr.setFilters = new setFilters();
				tokenize = Sizzle.tokenize = function(selector, parseOnly) {
					var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
					if (cached) return parseOnly ? 0 : cached.slice(0);
					soFar = selector;
					groups = [];
					preFilters = Expr.preFilter;
					while (soFar) {
						if (!matched || (match = rcomma.exec(soFar))) {
							if (match) soFar = soFar.slice(match[0].length) || soFar;
							groups.push(tokens = []);
						}
						matched = false;
						if (match = rleadingCombinator.exec(soFar)) {
							matched = match.shift();
							tokens.push({
								value: matched,
								type: match[0].replace(rtrim, " ")
							});
							soFar = soFar.slice(matched.length);
						}
						for (type in Expr.filter) if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
							matched = match.shift();
							tokens.push({
								value: matched,
								type,
								matches: match
							});
							soFar = soFar.slice(matched.length);
						}
						if (!matched) break;
					}
					return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
				};
				function toSelector(tokens) {
					var i = 0, len = tokens.length, selector = "";
					for (; i < len; i++) selector += tokens[i].value;
					return selector;
				}
				function addCombinator(matcher, combinator, base) {
					var dir = combinator.dir, skip = combinator.next, key = skip || dir, checkNonElements = base && key === "parentNode", doneName = done++;
					return combinator.first ? function(elem, context, xml) {
						while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) return matcher(elem, context, xml);
						return false;
					} : function(elem, context, xml) {
						var oldCache, uniqueCache, outerCache, newCache = [dirruns, doneName];
						if (xml) {
							while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) {
								if (matcher(elem, context, xml)) return true;
							}
						} else while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) {
							outerCache = elem[expando] || (elem[expando] = {});
							uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});
							if (skip && skip === elem.nodeName.toLowerCase()) elem = elem[dir] || elem;
							else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
							else {
								uniqueCache[key] = newCache;
								if (newCache[2] = matcher(elem, context, xml)) return true;
							}
						}
						return false;
					};
				}
				function elementMatcher(matchers) {
					return matchers.length > 1 ? function(elem, context, xml) {
						var i = matchers.length;
						while (i--) if (!matchers[i](elem, context, xml)) return false;
						return true;
					} : matchers[0];
				}
				function multipleContexts(selector, contexts, results) {
					var i = 0, len = contexts.length;
					for (; i < len; i++) Sizzle(selector, contexts[i], results);
					return results;
				}
				function condense(unmatched, map, filter, context, xml) {
					var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
					for (; i < len; i++) if (elem = unmatched[i]) {
						if (!filter || filter(elem, context, xml)) {
							newUnmatched.push(elem);
							if (mapped) map.push(i);
						}
					}
					return newUnmatched;
				}
				function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
					if (postFilter && !postFilter[expando]) postFilter = setMatcher(postFilter);
					if (postFinder && !postFinder[expando]) postFinder = setMatcher(postFinder, postSelector);
					return markFunction(function(seed, results, context, xml) {
						var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
						if (matcher) matcher(matcherIn, matcherOut, context, xml);
						if (postFilter) {
							temp = condense(matcherOut, postMap);
							postFilter(temp, [], context, xml);
							i = temp.length;
							while (i--) if (elem = temp[i]) matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
						if (seed) {
							if (postFinder || preFilter) {
								if (postFinder) {
									temp = [];
									i = matcherOut.length;
									while (i--) if (elem = matcherOut[i]) temp.push(matcherIn[i] = elem);
									postFinder(null, matcherOut = [], temp, xml);
								}
								i = matcherOut.length;
								while (i--) if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) seed[temp] = !(results[temp] = elem);
							}
						} else {
							matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
							if (postFinder) postFinder(null, results, matcherOut, xml);
							else push.apply(results, matcherOut);
						}
					});
				}
				function matcherFromTokens(tokens) {
					var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
						return elem === checkContext;
					}, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
						return indexOf(checkContext, elem) > -1;
					}, implicitRelative, true), matchers = [function(elem, context, xml) {
						var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
						checkContext = null;
						return ret;
					}];
					for (; i < len; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [addCombinator(elementMatcher(matchers), matcher)];
					else {
						matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
						if (matcher[expando]) {
							j = ++i;
							for (; j < len; j++) if (Expr.relative[tokens[j].type]) break;
							return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
						}
						matchers.push(matcher);
					}
					return elementMatcher(matchers);
				}
				function matcherFromGroupMatchers(elementMatchers, setMatchers) {
					var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
						var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || .1, len = elems.length;
						if (outermost) outermostContext = context == document || context || outermost;
						for (; i !== len && (elem = elems[i]) != null; i++) {
							if (byElement && elem) {
								j = 0;
								if (!context && elem.ownerDocument != document) {
									setDocument(elem);
									xml = !documentIsHTML;
								}
								while (matcher = elementMatchers[j++]) if (matcher(elem, context || document, xml)) {
									results.push(elem);
									break;
								}
								if (outermost) dirruns = dirrunsUnique;
							}
							if (bySet) {
								if (elem = !matcher && elem) matchedCount--;
								if (seed) unmatched.push(elem);
							}
						}
						matchedCount += i;
						if (bySet && i !== matchedCount) {
							j = 0;
							while (matcher = setMatchers[j++]) matcher(unmatched, setMatched, context, xml);
							if (seed) {
								if (matchedCount > 0) {
									while (i--) if (!(unmatched[i] || setMatched[i])) setMatched[i] = pop.call(results);
								}
								setMatched = condense(setMatched);
							}
							push.apply(results, setMatched);
							if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) Sizzle.uniqueSort(results);
						}
						if (outermost) {
							dirruns = dirrunsUnique;
							outermostContext = contextBackup;
						}
						return unmatched;
					};
					return bySet ? markFunction(superMatcher) : superMatcher;
				}
				compile = Sizzle.compile = function(selector, match) {
					var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
					if (!cached) {
						if (!match) match = tokenize(selector);
						i = match.length;
						while (i--) {
							cached = matcherFromTokens(match[i]);
							if (cached[expando]) setMatchers.push(cached);
							else elementMatchers.push(cached);
						}
						cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
						cached.selector = selector;
					}
					return cached;
				};
				/**
				* A low-level selection function that works with Sizzle's compiled
				*  selector functions
				* @param {String|Function} selector A selector or a pre-compiled
				*  selector function built with Sizzle.compile
				* @param {Element} context
				* @param {Array} [results]
				* @param {Array} [seed] A set of elements to match against
				*/
				select = Sizzle.select = function(selector, context, results, seed) {
					var i, tokens, token, type, find, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
					results = results || [];
					if (match.length === 1) {
						tokens = match[0] = match[0].slice(0);
						if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
							context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
							if (!context) return results;
							else if (compiled) context = context.parentNode;
							selector = selector.slice(tokens.shift().value.length);
						}
						i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
						while (i--) {
							token = tokens[i];
							if (Expr.relative[type = token.type]) break;
							if (find = Expr.find[type]) {
								if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
									tokens.splice(i, 1);
									selector = seed.length && toSelector(tokens);
									if (!selector) {
										push.apply(results, seed);
										return results;
									}
									break;
								}
							}
						}
					}
					(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
					return results;
				};
				support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
				support.detectDuplicates = !!hasDuplicate;
				setDocument();
				support.sortDetached = assert(function(el) {
					return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
				});
				if (!assert(function(el) {
					el.innerHTML = "<a href='#'></a>";
					return el.firstChild.getAttribute("href") === "#";
				})) addHandle("type|href|height|width", function(elem, name, isXML) {
					if (!isXML) return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				});
				if (!support.attributes || !assert(function(el) {
					el.innerHTML = "<input/>";
					el.firstChild.setAttribute("value", "");
					return el.firstChild.getAttribute("value") === "";
				})) addHandle("value", function(elem, _name, isXML) {
					if (!isXML && elem.nodeName.toLowerCase() === "input") return elem.defaultValue;
				});
				if (!assert(function(el) {
					return el.getAttribute("disabled") == null;
				})) addHandle(booleans, function(elem, name, isXML) {
					var val;
					if (!isXML) return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				});
				return Sizzle;
			})(window);
			jQuery.find = Sizzle;
			jQuery.expr = Sizzle.selectors;
			jQuery.expr[":"] = jQuery.expr.pseudos;
			jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
			jQuery.text = Sizzle.getText;
			jQuery.isXMLDoc = Sizzle.isXML;
			jQuery.contains = Sizzle.contains;
			jQuery.escapeSelector = Sizzle.escape;
			var dir = function(elem, dir, until) {
				var matched = [], truncate = until !== void 0;
				while ((elem = elem[dir]) && elem.nodeType !== 9) if (elem.nodeType === 1) {
					if (truncate && jQuery(elem).is(until)) break;
					matched.push(elem);
				}
				return matched;
			};
			var siblings = function(n, elem) {
				var matched = [];
				for (; n; n = n.nextSibling) if (n.nodeType === 1 && n !== elem) matched.push(n);
				return matched;
			};
			var rneedsContext = jQuery.expr.match.needsContext;
			function nodeName(elem, name) {
				return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
			}
			var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
			function winnow(elements, qualifier, not) {
				if (isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
					return !!qualifier.call(elem, i, elem) !== not;
				});
				if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
					return elem === qualifier !== not;
				});
				if (typeof qualifier !== "string") return jQuery.grep(elements, function(elem) {
					return indexOf.call(qualifier, elem) > -1 !== not;
				});
				return jQuery.filter(qualifier, elements, not);
			}
			jQuery.filter = function(expr, elems, not) {
				var elem = elems[0];
				if (not) expr = ":not(" + expr + ")";
				if (elems.length === 1 && elem.nodeType === 1) return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
				return jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
					return elem.nodeType === 1;
				}));
			};
			jQuery.fn.extend({
				find: function(selector) {
					var i, ret, len = this.length, self = this;
					if (typeof selector !== "string") return this.pushStack(jQuery(selector).filter(function() {
						for (i = 0; i < len; i++) if (jQuery.contains(self[i], this)) return true;
					}));
					ret = this.pushStack([]);
					for (i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
					return len > 1 ? jQuery.uniqueSort(ret) : ret;
				},
				filter: function(selector) {
					return this.pushStack(winnow(this, selector || [], false));
				},
				not: function(selector) {
					return this.pushStack(winnow(this, selector || [], true));
				},
				is: function(selector) {
					return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
				}
			});
			var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
				var match, elem;
				if (!selector) return this;
				root = root || rootjQuery;
				if (typeof selector === "string") {
					if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) match = [
						null,
						selector,
						null
					];
					else match = rquickExpr.exec(selector);
					if (match && (match[1] || !context)) {
						if (match[1]) {
							context = context instanceof jQuery ? context[0] : context;
							jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
							if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for (match in context) if (isFunction(this[match])) this[match](context[match]);
							else this.attr(match, context[match]);
							return this;
						} else {
							elem = document.getElementById(match[2]);
							if (elem) {
								this[0] = elem;
								this.length = 1;
							}
							return this;
						}
					} else if (!context || context.jquery) return (context || root).find(selector);
					else return this.constructor(context).find(selector);
				} else if (selector.nodeType) {
					this[0] = selector;
					this.length = 1;
					return this;
				} else if (isFunction(selector)) return root.ready !== void 0 ? root.ready(selector) : selector(jQuery);
				return jQuery.makeArray(selector, this);
			};
			init.prototype = jQuery.fn;
			rootjQuery = jQuery(document);
			var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
				children: true,
				contents: true,
				next: true,
				prev: true
			};
			jQuery.fn.extend({
				has: function(target) {
					var targets = jQuery(target, this), l = targets.length;
					return this.filter(function() {
						var i = 0;
						for (; i < l; i++) if (jQuery.contains(this, targets[i])) return true;
					});
				},
				closest: function(selectors, context) {
					var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
					if (!rneedsContext.test(selectors)) {
						for (; i < l; i++) for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
							matched.push(cur);
							break;
						}
					}
					return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
				},
				index: function(elem) {
					if (!elem) return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
					if (typeof elem === "string") return indexOf.call(jQuery(elem), this[0]);
					return indexOf.call(this, elem.jquery ? elem[0] : elem);
				},
				add: function(selector, context) {
					return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
				},
				addBack: function(selector) {
					return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
				}
			});
			function sibling(cur, dir) {
				while ((cur = cur[dir]) && cur.nodeType !== 1);
				return cur;
			}
			jQuery.each({
				parent: function(elem) {
					var parent = elem.parentNode;
					return parent && parent.nodeType !== 11 ? parent : null;
				},
				parents: function(elem) {
					return dir(elem, "parentNode");
				},
				parentsUntil: function(elem, _i, until) {
					return dir(elem, "parentNode", until);
				},
				next: function(elem) {
					return sibling(elem, "nextSibling");
				},
				prev: function(elem) {
					return sibling(elem, "previousSibling");
				},
				nextAll: function(elem) {
					return dir(elem, "nextSibling");
				},
				prevAll: function(elem) {
					return dir(elem, "previousSibling");
				},
				nextUntil: function(elem, _i, until) {
					return dir(elem, "nextSibling", until);
				},
				prevUntil: function(elem, _i, until) {
					return dir(elem, "previousSibling", until);
				},
				siblings: function(elem) {
					return siblings((elem.parentNode || {}).firstChild, elem);
				},
				children: function(elem) {
					return siblings(elem.firstChild);
				},
				contents: function(elem) {
					if (elem.contentDocument != null && getProto(elem.contentDocument)) return elem.contentDocument;
					if (nodeName(elem, "template")) elem = elem.content || elem;
					return jQuery.merge([], elem.childNodes);
				}
			}, function(name, fn) {
				jQuery.fn[name] = function(until, selector) {
					var matched = jQuery.map(this, fn, until);
					if (name.slice(-5) !== "Until") selector = until;
					if (selector && typeof selector === "string") matched = jQuery.filter(selector, matched);
					if (this.length > 1) {
						if (!guaranteedUnique[name]) jQuery.uniqueSort(matched);
						if (rparentsprev.test(name)) matched.reverse();
					}
					return this.pushStack(matched);
				};
			});
			var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
			function createOptions(options) {
				var object = {};
				jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
					object[flag] = true;
				});
				return object;
			}
			jQuery.Callbacks = function(options) {
				options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
				var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
					locked = locked || options.once;
					fired = firing = true;
					for (; queue.length; firingIndex = -1) {
						memory = queue.shift();
						while (++firingIndex < list.length) if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
							firingIndex = list.length;
							memory = false;
						}
					}
					if (!options.memory) memory = false;
					firing = false;
					if (locked) {
						if (memory) list = [];
						else list = "";
					}
				}, self = {
					add: function() {
						if (list) {
							if (memory && !firing) {
								firingIndex = list.length - 1;
								queue.push(memory);
							}
							(function add(args) {
								jQuery.each(args, function(_, arg) {
									if (isFunction(arg)) {
										if (!options.unique || !self.has(arg)) list.push(arg);
									} else if (arg && arg.length && toType(arg) !== "string") add(arg);
								});
							})(arguments);
							if (memory && !firing) fire();
						}
						return this;
					},
					remove: function() {
						jQuery.each(arguments, function(_, arg) {
							var index;
							while ((index = jQuery.inArray(arg, list, index)) > -1) {
								list.splice(index, 1);
								if (index <= firingIndex) firingIndex--;
							}
						});
						return this;
					},
					has: function(fn) {
						return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
					},
					empty: function() {
						if (list) list = [];
						return this;
					},
					disable: function() {
						locked = queue = [];
						list = memory = "";
						return this;
					},
					disabled: function() {
						return !list;
					},
					lock: function() {
						locked = queue = [];
						if (!memory && !firing) list = memory = "";
						return this;
					},
					locked: function() {
						return !!locked;
					},
					fireWith: function(context, args) {
						if (!locked) {
							args = args || [];
							args = [context, args.slice ? args.slice() : args];
							queue.push(args);
							if (!firing) fire();
						}
						return this;
					},
					fire: function() {
						self.fireWith(this, arguments);
						return this;
					},
					fired: function() {
						return !!fired;
					}
				};
				return self;
			};
			function Identity(v) {
				return v;
			}
			function Thrower(ex) {
				throw ex;
			}
			function adoptValue(value, resolve, reject, noValue) {
				var method;
				try {
					if (value && isFunction(method = value.promise)) method.call(value).done(resolve).fail(reject);
					else if (value && isFunction(method = value.then)) method.call(value, resolve, reject);
					else resolve.apply(void 0, [value].slice(noValue));
				} catch (value) {
					reject.apply(void 0, [value]);
				}
			}
			jQuery.extend({
				Deferred: function(func) {
					var tuples = [
						[
							"notify",
							"progress",
							jQuery.Callbacks("memory"),
							jQuery.Callbacks("memory"),
							2
						],
						[
							"resolve",
							"done",
							jQuery.Callbacks("once memory"),
							jQuery.Callbacks("once memory"),
							0,
							"resolved"
						],
						[
							"reject",
							"fail",
							jQuery.Callbacks("once memory"),
							jQuery.Callbacks("once memory"),
							1,
							"rejected"
						]
					], state = "pending", promise = {
						state: function() {
							return state;
						},
						always: function() {
							deferred.done(arguments).fail(arguments);
							return this;
						},
						"catch": function(fn) {
							return promise.then(null, fn);
						},
						pipe: function() {
							var fns = arguments;
							return jQuery.Deferred(function(newDefer) {
								jQuery.each(tuples, function(_i, tuple) {
									var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
									deferred[tuple[1]](function() {
										var returned = fn && fn.apply(this, arguments);
										if (returned && isFunction(returned.promise)) returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
										else newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
									});
								});
								fns = null;
							}).promise();
						},
						then: function(onFulfilled, onRejected, onProgress) {
							var maxDepth = 0;
							function resolve(depth, deferred, handler, special) {
								return function() {
									var that = this, args = arguments, mightThrow = function() {
										var returned, then;
										if (depth < maxDepth) return;
										returned = handler.apply(that, args);
										if (returned === deferred.promise()) throw new TypeError("Thenable self-resolution");
										then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
										if (isFunction(then)) {
											if (special) then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));
											else {
												maxDepth++;
												then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
											}
										} else {
											if (handler !== Identity) {
												that = void 0;
												args = [returned];
											}
											(special || deferred.resolveWith)(that, args);
										}
									}, process = special ? mightThrow : function() {
										try {
											mightThrow();
										} catch (e) {
											if (jQuery.Deferred.exceptionHook) jQuery.Deferred.exceptionHook(e, process.stackTrace);
											if (depth + 1 >= maxDepth) {
												if (handler !== Thrower) {
													that = void 0;
													args = [e];
												}
												deferred.rejectWith(that, args);
											}
										}
									};
									if (depth) process();
									else {
										if (jQuery.Deferred.getStackHook) process.stackTrace = jQuery.Deferred.getStackHook();
										window.setTimeout(process);
									}
								};
							}
							return jQuery.Deferred(function(newDefer) {
								tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));
								tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity));
								tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
							}).promise();
						},
						promise: function(obj) {
							return obj != null ? jQuery.extend(obj, promise) : promise;
						}
					}, deferred = {};
					jQuery.each(tuples, function(i, tuple) {
						var list = tuple[2], stateString = tuple[5];
						promise[tuple[1]] = list.add;
						if (stateString) list.add(function() {
							state = stateString;
						}, tuples[3 - i][2].disable, tuples[3 - i][3].disable, tuples[0][2].lock, tuples[0][3].lock);
						list.add(tuple[3].fire);
						deferred[tuple[0]] = function() {
							deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
							return this;
						};
						deferred[tuple[0] + "With"] = list.fireWith;
					});
					promise.promise(deferred);
					if (func) func.call(deferred, deferred);
					return deferred;
				},
				when: function(singleValue) {
					var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i) {
						return function(value) {
							resolveContexts[i] = this;
							resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
							if (!--remaining) primary.resolveWith(resolveContexts, resolveValues);
						};
					};
					if (remaining <= 1) {
						adoptValue(singleValue, primary.done(updateFunc(i)).resolve, primary.reject, !remaining);
						if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) return primary.then();
					}
					while (i--) adoptValue(resolveValues[i], updateFunc(i), primary.reject);
					return primary.promise();
				}
			});
			var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
			jQuery.Deferred.exceptionHook = function(error, stack) {
				if (window.console && window.console.warn && error && rerrorNames.test(error.name)) window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
			};
			jQuery.readyException = function(error) {
				window.setTimeout(function() {
					throw error;
				});
			};
			var readyList = jQuery.Deferred();
			jQuery.fn.ready = function(fn) {
				readyList.then(fn).catch(function(error) {
					jQuery.readyException(error);
				});
				return this;
			};
			jQuery.extend({
				isReady: false,
				readyWait: 1,
				ready: function(wait) {
					if (wait === true ? --jQuery.readyWait : jQuery.isReady) return;
					jQuery.isReady = true;
					if (wait !== true && --jQuery.readyWait > 0) return;
					readyList.resolveWith(document, [jQuery]);
				}
			});
			jQuery.ready.then = readyList.then;
			function completed() {
				document.removeEventListener("DOMContentLoaded", completed);
				window.removeEventListener("load", completed);
				jQuery.ready();
			}
			if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) window.setTimeout(jQuery.ready);
			else {
				document.addEventListener("DOMContentLoaded", completed);
				window.addEventListener("load", completed);
			}
			var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
				var i = 0, len = elems.length, bulk = key == null;
				if (toType(key) === "object") {
					chainable = true;
					for (i in key) access(elems, fn, i, key[i], true, emptyGet, raw);
				} else if (value !== void 0) {
					chainable = true;
					if (!isFunction(value)) raw = true;
					if (bulk) {
						if (raw) {
							fn.call(elems, value);
							fn = null;
						} else {
							bulk = fn;
							fn = function(elem, _key, value) {
								return bulk.call(jQuery(elem), value);
							};
						}
					}
					if (fn) for (; i < len; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
				if (chainable) return elems;
				if (bulk) return fn.call(elems);
				return len ? fn(elems[0], key) : emptyGet;
			};
			var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
			function fcamelCase(_all, letter) {
				return letter.toUpperCase();
			}
			function camelCase(string) {
				return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
			}
			var acceptData = function(owner) {
				return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
			};
			function Data() {
				this.expando = jQuery.expando + Data.uid++;
			}
			Data.uid = 1;
			Data.prototype = {
				cache: function(owner) {
					var value = owner[this.expando];
					if (!value) {
						value = {};
						if (acceptData(owner)) {
							if (owner.nodeType) owner[this.expando] = value;
							else Object.defineProperty(owner, this.expando, {
								value,
								configurable: true
							});
						}
					}
					return value;
				},
				set: function(owner, data, value) {
					var prop, cache = this.cache(owner);
					if (typeof data === "string") cache[camelCase(data)] = value;
					else for (prop in data) cache[camelCase(prop)] = data[prop];
					return cache;
				},
				get: function(owner, key) {
					return key === void 0 ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
				},
				access: function(owner, key, value) {
					if (key === void 0 || key && typeof key === "string" && value === void 0) return this.get(owner, key);
					this.set(owner, key, value);
					return value !== void 0 ? value : key;
				},
				remove: function(owner, key) {
					var i, cache = owner[this.expando];
					if (cache === void 0) return;
					if (key !== void 0) {
						if (Array.isArray(key)) key = key.map(camelCase);
						else {
							key = camelCase(key);
							key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
						}
						i = key.length;
						while (i--) delete cache[key[i]];
					}
					if (key === void 0 || jQuery.isEmptyObject(cache)) {
						if (owner.nodeType) owner[this.expando] = void 0;
						else delete owner[this.expando];
					}
				},
				hasData: function(owner) {
					var cache = owner[this.expando];
					return cache !== void 0 && !jQuery.isEmptyObject(cache);
				}
			};
			var dataPriv = new Data();
			var dataUser = new Data();
			var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
			function getData(data) {
				if (data === "true") return true;
				if (data === "false") return false;
				if (data === "null") return null;
				if (data === +data + "") return +data;
				if (rbrace.test(data)) return JSON.parse(data);
				return data;
			}
			function dataAttr(elem, key, data) {
				var name;
				if (data === void 0 && elem.nodeType === 1) {
					name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
					data = elem.getAttribute(name);
					if (typeof data === "string") {
						try {
							data = getData(data);
						} catch (e) {}
						dataUser.set(elem, key, data);
					} else data = void 0;
				}
				return data;
			}
			jQuery.extend({
				hasData: function(elem) {
					return dataUser.hasData(elem) || dataPriv.hasData(elem);
				},
				data: function(elem, name, data) {
					return dataUser.access(elem, name, data);
				},
				removeData: function(elem, name) {
					dataUser.remove(elem, name);
				},
				_data: function(elem, name, data) {
					return dataPriv.access(elem, name, data);
				},
				_removeData: function(elem, name) {
					dataPriv.remove(elem, name);
				}
			});
			jQuery.fn.extend({
				data: function(key, value) {
					var i, name, data, elem = this[0], attrs = elem && elem.attributes;
					if (key === void 0) {
						if (this.length) {
							data = dataUser.get(elem);
							if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
								i = attrs.length;
								while (i--) if (attrs[i]) {
									name = attrs[i].name;
									if (name.indexOf("data-") === 0) {
										name = camelCase(name.slice(5));
										dataAttr(elem, name, data[name]);
									}
								}
								dataPriv.set(elem, "hasDataAttrs", true);
							}
						}
						return data;
					}
					if (typeof key === "object") return this.each(function() {
						dataUser.set(this, key);
					});
					return access(this, function(value) {
						var data;
						if (elem && value === void 0) {
							data = dataUser.get(elem, key);
							if (data !== void 0) return data;
							data = dataAttr(elem, key);
							if (data !== void 0) return data;
							return;
						}
						this.each(function() {
							dataUser.set(this, key, value);
						});
					}, null, value, arguments.length > 1, null, true);
				},
				removeData: function(key) {
					return this.each(function() {
						dataUser.remove(this, key);
					});
				}
			});
			jQuery.extend({
				queue: function(elem, type, data) {
					var queue;
					if (elem) {
						type = (type || "fx") + "queue";
						queue = dataPriv.get(elem, type);
						if (data) {
							if (!queue || Array.isArray(data)) queue = dataPriv.access(elem, type, jQuery.makeArray(data));
							else queue.push(data);
						}
						return queue || [];
					}
				},
				dequeue: function(elem, type) {
					type = type || "fx";
					var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
						jQuery.dequeue(elem, type);
					};
					if (fn === "inprogress") {
						fn = queue.shift();
						startLength--;
					}
					if (fn) {
						if (type === "fx") queue.unshift("inprogress");
						delete hooks.stop;
						fn.call(elem, next, hooks);
					}
					if (!startLength && hooks) hooks.empty.fire();
				},
				_queueHooks: function(elem, type) {
					var key = type + "queueHooks";
					return dataPriv.get(elem, key) || dataPriv.access(elem, key, { empty: jQuery.Callbacks("once memory").add(function() {
						dataPriv.remove(elem, [type + "queue", key]);
					}) });
				}
			});
			jQuery.fn.extend({
				queue: function(type, data) {
					var setter = 2;
					if (typeof type !== "string") {
						data = type;
						type = "fx";
						setter--;
					}
					if (arguments.length < setter) return jQuery.queue(this[0], type);
					return data === void 0 ? this : this.each(function() {
						var queue = jQuery.queue(this, type, data);
						jQuery._queueHooks(this, type);
						if (type === "fx" && queue[0] !== "inprogress") jQuery.dequeue(this, type);
					});
				},
				dequeue: function(type) {
					return this.each(function() {
						jQuery.dequeue(this, type);
					});
				},
				clearQueue: function(type) {
					return this.queue(type || "fx", []);
				},
				promise: function(type, obj) {
					var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
						if (!--count) defer.resolveWith(elements, [elements]);
					};
					if (typeof type !== "string") {
						obj = type;
						type = void 0;
					}
					type = type || "fx";
					while (i--) {
						tmp = dataPriv.get(elements[i], type + "queueHooks");
						if (tmp && tmp.empty) {
							count++;
							tmp.empty.add(resolve);
						}
					}
					resolve();
					return defer.promise(obj);
				}
			});
			var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
			var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
			var cssExpand = [
				"Top",
				"Right",
				"Bottom",
				"Left"
			];
			var documentElement = document.documentElement;
			var isAttached = function(elem) {
				return jQuery.contains(elem.ownerDocument, elem);
			}, composed = { composed: true };
			if (documentElement.getRootNode) isAttached = function(elem) {
				return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
			};
			var isHiddenWithinTree = function(elem, el) {
				elem = el || elem;
				return elem.style.display === "none" || elem.style.display === "" && isAttached(elem) && jQuery.css(elem, "display") === "none";
			};
			function adjustCSS(elem, prop, valueParts, tween) {
				var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
					return tween.cur();
				} : function() {
					return jQuery.css(elem, prop, "");
				}, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
				if (initialInUnit && initialInUnit[3] !== unit) {
					initial = initial / 2;
					unit = unit || initialInUnit[3];
					initialInUnit = +initial || 1;
					while (maxIterations--) {
						jQuery.style(elem, prop, initialInUnit + unit);
						if ((1 - scale) * (1 - (scale = currentValue() / initial || .5)) <= 0) maxIterations = 0;
						initialInUnit = initialInUnit / scale;
					}
					initialInUnit = initialInUnit * 2;
					jQuery.style(elem, prop, initialInUnit + unit);
					valueParts = valueParts || [];
				}
				if (valueParts) {
					initialInUnit = +initialInUnit || +initial || 0;
					adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
					if (tween) {
						tween.unit = unit;
						tween.start = initialInUnit;
						tween.end = adjusted;
					}
				}
				return adjusted;
			}
			var defaultDisplayMap = {};
			function getDefaultDisplay(elem) {
				var temp, doc = elem.ownerDocument, nodeName = elem.nodeName, display = defaultDisplayMap[nodeName];
				if (display) return display;
				temp = doc.body.appendChild(doc.createElement(nodeName));
				display = jQuery.css(temp, "display");
				temp.parentNode.removeChild(temp);
				if (display === "none") display = "block";
				defaultDisplayMap[nodeName] = display;
				return display;
			}
			function showHide(elements, show) {
				var display, elem, values = [], index = 0, length = elements.length;
				for (; index < length; index++) {
					elem = elements[index];
					if (!elem.style) continue;
					display = elem.style.display;
					if (show) {
						if (display === "none") {
							values[index] = dataPriv.get(elem, "display") || null;
							if (!values[index]) elem.style.display = "";
						}
						if (elem.style.display === "" && isHiddenWithinTree(elem)) values[index] = getDefaultDisplay(elem);
					} else if (display !== "none") {
						values[index] = "none";
						dataPriv.set(elem, "display", display);
					}
				}
				for (index = 0; index < length; index++) if (values[index] != null) elements[index].style.display = values[index];
				return elements;
			}
			jQuery.fn.extend({
				show: function() {
					return showHide(this, true);
				},
				hide: function() {
					return showHide(this);
				},
				toggle: function(state) {
					if (typeof state === "boolean") return state ? this.show() : this.hide();
					return this.each(function() {
						if (isHiddenWithinTree(this)) jQuery(this).show();
						else jQuery(this).hide();
					});
				}
			});
			var rcheckableType = /^(?:checkbox|radio)$/i;
			var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
			var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
			(function() {
				var div = document.createDocumentFragment().appendChild(document.createElement("div")), input = document.createElement("input");
				input.setAttribute("type", "radio");
				input.setAttribute("checked", "checked");
				input.setAttribute("name", "t");
				div.appendChild(input);
				support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
				div.innerHTML = "<textarea>x</textarea>";
				support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
				div.innerHTML = "<option></option>";
				support.option = !!div.lastChild;
			})();
			var wrapMap = {
				thead: [
					1,
					"<table>",
					"</table>"
				],
				col: [
					2,
					"<table><colgroup>",
					"</colgroup></table>"
				],
				tr: [
					2,
					"<table><tbody>",
					"</tbody></table>"
				],
				td: [
					3,
					"<table><tbody><tr>",
					"</tr></tbody></table>"
				],
				_default: [
					0,
					"",
					""
				]
			};
			wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
			wrapMap.th = wrapMap.td;
			if (!support.option) wrapMap.optgroup = wrapMap.option = [
				1,
				"<select multiple='multiple'>",
				"</select>"
			];
			function getAll(context, tag) {
				var ret;
				if (typeof context.getElementsByTagName !== "undefined") ret = context.getElementsByTagName(tag || "*");
				else if (typeof context.querySelectorAll !== "undefined") ret = context.querySelectorAll(tag || "*");
				else ret = [];
				if (tag === void 0 || tag && nodeName(context, tag)) return jQuery.merge([context], ret);
				return ret;
			}
			function setGlobalEval(elems, refElements) {
				var i = 0, l = elems.length;
				for (; i < l; i++) dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
			}
			var rhtml = /<|&#?\w+;/;
			function buildFragment(elems, context, scripts, selection, ignored) {
				var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
				for (; i < l; i++) {
					elem = elems[i];
					if (elem || elem === 0) {
						if (toType(elem) === "object") jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
						else if (!rhtml.test(elem)) nodes.push(context.createTextNode(elem));
						else {
							tmp = tmp || fragment.appendChild(context.createElement("div"));
							tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
							wrap = wrapMap[tag] || wrapMap._default;
							tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
							j = wrap[0];
							while (j--) tmp = tmp.lastChild;
							jQuery.merge(nodes, tmp.childNodes);
							tmp = fragment.firstChild;
							tmp.textContent = "";
						}
					}
				}
				fragment.textContent = "";
				i = 0;
				while (elem = nodes[i++]) {
					if (selection && jQuery.inArray(elem, selection) > -1) {
						if (ignored) ignored.push(elem);
						continue;
					}
					attached = isAttached(elem);
					tmp = getAll(fragment.appendChild(elem), "script");
					if (attached) setGlobalEval(tmp);
					if (scripts) {
						j = 0;
						while (elem = tmp[j++]) if (rscriptType.test(elem.type || "")) scripts.push(elem);
					}
				}
				return fragment;
			}
			var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
			function returnTrue() {
				return true;
			}
			function returnFalse() {
				return false;
			}
			function expectSync(elem, type) {
				return elem === safeActiveElement() === (type === "focus");
			}
			function safeActiveElement() {
				try {
					return document.activeElement;
				} catch (err) {}
			}
			function on(elem, types, selector, data, fn, one) {
				var origFn, type;
				if (typeof types === "object") {
					if (typeof selector !== "string") {
						data = data || selector;
						selector = void 0;
					}
					for (type in types) on(elem, type, selector, data, types[type], one);
					return elem;
				}
				if (data == null && fn == null) {
					fn = selector;
					data = selector = void 0;
				} else if (fn == null) {
					if (typeof selector === "string") {
						fn = data;
						data = void 0;
					} else {
						fn = data;
						data = selector;
						selector = void 0;
					}
				}
				if (fn === false) fn = returnFalse;
				else if (!fn) return elem;
				if (one === 1) {
					origFn = fn;
					fn = function(event) {
						jQuery().off(event);
						return origFn.apply(this, arguments);
					};
					fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
				}
				return elem.each(function() {
					jQuery.event.add(this, types, fn, data, selector);
				});
			}
			jQuery.event = {
				global: {},
				add: function(elem, types, handler, data, selector) {
					var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
					if (!acceptData(elem)) return;
					if (handler.handler) {
						handleObjIn = handler;
						handler = handleObjIn.handler;
						selector = handleObjIn.selector;
					}
					if (selector) jQuery.find.matchesSelector(documentElement, selector);
					if (!handler.guid) handler.guid = jQuery.guid++;
					if (!(events = elemData.events)) events = elemData.events = Object.create(null);
					if (!(eventHandle = elemData.handle)) eventHandle = elemData.handle = function(e) {
						return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
					};
					types = (types || "").match(rnothtmlwhite) || [""];
					t = types.length;
					while (t--) {
						tmp = rtypenamespace.exec(types[t]) || [];
						type = origType = tmp[1];
						namespaces = (tmp[2] || "").split(".").sort();
						if (!type) continue;
						special = jQuery.event.special[type] || {};
						type = (selector ? special.delegateType : special.bindType) || type;
						special = jQuery.event.special[type] || {};
						handleObj = jQuery.extend({
							type,
							origType,
							data,
							handler,
							guid: handler.guid,
							selector,
							needsContext: selector && jQuery.expr.match.needsContext.test(selector),
							namespace: namespaces.join(".")
						}, handleObjIn);
						if (!(handlers = events[type])) {
							handlers = events[type] = [];
							handlers.delegateCount = 0;
							if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
								if (elem.addEventListener) elem.addEventListener(type, eventHandle);
							}
						}
						if (special.add) {
							special.add.call(elem, handleObj);
							if (!handleObj.handler.guid) handleObj.handler.guid = handler.guid;
						}
						if (selector) handlers.splice(handlers.delegateCount++, 0, handleObj);
						else handlers.push(handleObj);
						jQuery.event.global[type] = true;
					}
				},
				remove: function(elem, types, handler, selector, mappedTypes) {
					var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
					if (!elemData || !(events = elemData.events)) return;
					types = (types || "").match(rnothtmlwhite) || [""];
					t = types.length;
					while (t--) {
						tmp = rtypenamespace.exec(types[t]) || [];
						type = origType = tmp[1];
						namespaces = (tmp[2] || "").split(".").sort();
						if (!type) {
							for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, true);
							continue;
						}
						special = jQuery.event.special[type] || {};
						type = (selector ? special.delegateType : special.bindType) || type;
						handlers = events[type] || [];
						tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
						origCount = j = handlers.length;
						while (j--) {
							handleObj = handlers[j];
							if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
								handlers.splice(j, 1);
								if (handleObj.selector) handlers.delegateCount--;
								if (special.remove) special.remove.call(elem, handleObj);
							}
						}
						if (origCount && !handlers.length) {
							if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) jQuery.removeEvent(elem, type, elemData.handle);
							delete events[type];
						}
					}
					if (jQuery.isEmptyObject(events)) dataPriv.remove(elem, "handle events");
				},
				dispatch: function(nativeEvent) {
					var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
					args[0] = event;
					for (i = 1; i < arguments.length; i++) args[i] = arguments[i];
					event.delegateTarget = this;
					if (special.preDispatch && special.preDispatch.call(this, event) === false) return;
					handlerQueue = jQuery.event.handlers.call(this, event, handlers);
					i = 0;
					while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
						event.currentTarget = matched.elem;
						j = 0;
						while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
							event.handleObj = handleObj;
							event.data = handleObj.data;
							ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
							if (ret !== void 0) {
								if ((event.result = ret) === false) {
									event.preventDefault();
									event.stopPropagation();
								}
							}
						}
					}
					if (special.postDispatch) special.postDispatch.call(this, event);
					return event.result;
				},
				handlers: function(event, handlers) {
					var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
					if (delegateCount && cur.nodeType && !(event.type === "click" && event.button >= 1)) {
						for (; cur !== this; cur = cur.parentNode || this) if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
							matchedHandlers = [];
							matchedSelectors = {};
							for (i = 0; i < delegateCount; i++) {
								handleObj = handlers[i];
								sel = handleObj.selector + " ";
								if (matchedSelectors[sel] === void 0) matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
								if (matchedSelectors[sel]) matchedHandlers.push(handleObj);
							}
							if (matchedHandlers.length) handlerQueue.push({
								elem: cur,
								handlers: matchedHandlers
							});
						}
					}
					cur = this;
					if (delegateCount < handlers.length) handlerQueue.push({
						elem: cur,
						handlers: handlers.slice(delegateCount)
					});
					return handlerQueue;
				},
				addProp: function(name, hook) {
					Object.defineProperty(jQuery.Event.prototype, name, {
						enumerable: true,
						configurable: true,
						get: isFunction(hook) ? function() {
							if (this.originalEvent) return hook(this.originalEvent);
						} : function() {
							if (this.originalEvent) return this.originalEvent[name];
						},
						set: function(value) {
							Object.defineProperty(this, name, {
								enumerable: true,
								configurable: true,
								writable: true,
								value
							});
						}
					});
				},
				fix: function(originalEvent) {
					return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
				},
				special: {
					load: { noBubble: true },
					click: {
						setup: function(data) {
							var el = this || data;
							if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) leverageNative(el, "click", returnTrue);
							return false;
						},
						trigger: function(data) {
							var el = this || data;
							if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) leverageNative(el, "click");
							return true;
						},
						_default: function(event) {
							var target = event.target;
							return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
						}
					},
					beforeunload: { postDispatch: function(event) {
						if (event.result !== void 0 && event.originalEvent) event.originalEvent.returnValue = event.result;
					} }
				}
			};
			function leverageNative(el, type, expectSync) {
				if (!expectSync) {
					if (dataPriv.get(el, type) === void 0) jQuery.event.add(el, type, returnTrue);
					return;
				}
				dataPriv.set(el, type, false);
				jQuery.event.add(el, type, {
					namespace: false,
					handler: function(event) {
						var notAsync, result, saved = dataPriv.get(this, type);
						if (event.isTrigger & 1 && this[type]) {
							if (!saved.length) {
								saved = slice.call(arguments);
								dataPriv.set(this, type, saved);
								notAsync = expectSync(this, type);
								this[type]();
								result = dataPriv.get(this, type);
								if (saved !== result || notAsync) dataPriv.set(this, type, false);
								else result = {};
								if (saved !== result) {
									event.stopImmediatePropagation();
									event.preventDefault();
									return result && result.value;
								}
							} else if ((jQuery.event.special[type] || {}).delegateType) event.stopPropagation();
						} else if (saved.length) {
							dataPriv.set(this, type, { value: jQuery.event.trigger(jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this) });
							event.stopImmediatePropagation();
						}
					}
				});
			}
			jQuery.removeEvent = function(elem, type, handle) {
				if (elem.removeEventListener) elem.removeEventListener(type, handle);
			};
			jQuery.Event = function(src, props) {
				if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
				if (src && src.type) {
					this.originalEvent = src;
					this.type = src.type;
					this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && src.returnValue === false ? returnTrue : returnFalse;
					this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
					this.currentTarget = src.currentTarget;
					this.relatedTarget = src.relatedTarget;
				} else this.type = src;
				if (props) jQuery.extend(this, props);
				this.timeStamp = src && src.timeStamp || Date.now();
				this[jQuery.expando] = true;
			};
			jQuery.Event.prototype = {
				constructor: jQuery.Event,
				isDefaultPrevented: returnFalse,
				isPropagationStopped: returnFalse,
				isImmediatePropagationStopped: returnFalse,
				isSimulated: false,
				preventDefault: function() {
					var e = this.originalEvent;
					this.isDefaultPrevented = returnTrue;
					if (e && !this.isSimulated) e.preventDefault();
				},
				stopPropagation: function() {
					var e = this.originalEvent;
					this.isPropagationStopped = returnTrue;
					if (e && !this.isSimulated) e.stopPropagation();
				},
				stopImmediatePropagation: function() {
					var e = this.originalEvent;
					this.isImmediatePropagationStopped = returnTrue;
					if (e && !this.isSimulated) e.stopImmediatePropagation();
					this.stopPropagation();
				}
			};
			jQuery.each({
				altKey: true,
				bubbles: true,
				cancelable: true,
				changedTouches: true,
				ctrlKey: true,
				detail: true,
				eventPhase: true,
				metaKey: true,
				pageX: true,
				pageY: true,
				shiftKey: true,
				view: true,
				"char": true,
				code: true,
				charCode: true,
				key: true,
				keyCode: true,
				button: true,
				buttons: true,
				clientX: true,
				clientY: true,
				offsetX: true,
				offsetY: true,
				pointerId: true,
				pointerType: true,
				screenX: true,
				screenY: true,
				targetTouches: true,
				toElement: true,
				touches: true,
				which: true
			}, jQuery.event.addProp);
			jQuery.each({
				focus: "focusin",
				blur: "focusout"
			}, function(type, delegateType) {
				jQuery.event.special[type] = {
					setup: function() {
						leverageNative(this, type, expectSync);
						return false;
					},
					trigger: function() {
						leverageNative(this, type);
						return true;
					},
					_default: function(event) {
						return dataPriv.get(event.target, type);
					},
					delegateType
				};
			});
			jQuery.each({
				mouseenter: "mouseover",
				mouseleave: "mouseout",
				pointerenter: "pointerover",
				pointerleave: "pointerout"
			}, function(orig, fix) {
				jQuery.event.special[orig] = {
					delegateType: fix,
					bindType: fix,
					handle: function(event) {
						var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
						if (!related || related !== target && !jQuery.contains(target, related)) {
							event.type = handleObj.origType;
							ret = handleObj.handler.apply(this, arguments);
							event.type = fix;
						}
						return ret;
					}
				};
			});
			jQuery.fn.extend({
				on: function(types, selector, data, fn) {
					return on(this, types, selector, data, fn);
				},
				one: function(types, selector, data, fn) {
					return on(this, types, selector, data, fn, 1);
				},
				off: function(types, selector, fn) {
					var handleObj, type;
					if (types && types.preventDefault && types.handleObj) {
						handleObj = types.handleObj;
						jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
						return this;
					}
					if (typeof types === "object") {
						for (type in types) this.off(type, selector, types[type]);
						return this;
					}
					if (selector === false || typeof selector === "function") {
						fn = selector;
						selector = void 0;
					}
					if (fn === false) fn = returnFalse;
					return this.each(function() {
						jQuery.event.remove(this, types, fn, selector);
					});
				}
			});
			var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
			function manipulationTarget(elem, content) {
				if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) return jQuery(elem).children("tbody")[0] || elem;
				return elem;
			}
			function disableScript(elem) {
				elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
				return elem;
			}
			function restoreScript(elem) {
				if ((elem.type || "").slice(0, 5) === "true/") elem.type = elem.type.slice(5);
				else elem.removeAttribute("type");
				return elem;
			}
			function cloneCopyEvent(src, dest) {
				var i, l, type, pdataOld, udataOld, udataCur, events;
				if (dest.nodeType !== 1) return;
				if (dataPriv.hasData(src)) {
					pdataOld = dataPriv.get(src);
					events = pdataOld.events;
					if (events) {
						dataPriv.remove(dest, "handle events");
						for (type in events) for (i = 0, l = events[type].length; i < l; i++) jQuery.event.add(dest, type, events[type][i]);
					}
				}
				if (dataUser.hasData(src)) {
					udataOld = dataUser.access(src);
					udataCur = jQuery.extend({}, udataOld);
					dataUser.set(dest, udataCur);
				}
			}
			function fixInput(src, dest) {
				var nodeName = dest.nodeName.toLowerCase();
				if (nodeName === "input" && rcheckableType.test(src.type)) dest.checked = src.checked;
				else if (nodeName === "input" || nodeName === "textarea") dest.defaultValue = src.defaultValue;
			}
			function domManip(collection, args, callback, ignored) {
				args = flat(args);
				var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
				if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) return collection.each(function(index) {
					var self = collection.eq(index);
					if (valueIsFunction) args[0] = value.call(this, index, self.html());
					domManip(self, args, callback, ignored);
				});
				if (l) {
					fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
					first = fragment.firstChild;
					if (fragment.childNodes.length === 1) fragment = first;
					if (first || ignored) {
						scripts = jQuery.map(getAll(fragment, "script"), disableScript);
						hasScripts = scripts.length;
						for (; i < l; i++) {
							node = fragment;
							if (i !== iNoClone) {
								node = jQuery.clone(node, true, true);
								if (hasScripts) jQuery.merge(scripts, getAll(node, "script"));
							}
							callback.call(collection[i], node, i);
						}
						if (hasScripts) {
							doc = scripts[scripts.length - 1].ownerDocument;
							jQuery.map(scripts, restoreScript);
							for (i = 0; i < hasScripts; i++) {
								node = scripts[i];
								if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
									if (node.src && (node.type || "").toLowerCase() !== "module") {
										if (jQuery._evalUrl && !node.noModule) jQuery._evalUrl(node.src, { nonce: node.nonce || node.getAttribute("nonce") }, doc);
									} else DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
								}
							}
						}
					}
				}
				return collection;
			}
			function remove(elem, selector, keepData) {
				var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
				for (; (node = nodes[i]) != null; i++) {
					if (!keepData && node.nodeType === 1) jQuery.cleanData(getAll(node));
					if (node.parentNode) {
						if (keepData && isAttached(node)) setGlobalEval(getAll(node, "script"));
						node.parentNode.removeChild(node);
					}
				}
				return elem;
			}
			jQuery.extend({
				htmlPrefilter: function(html) {
					return html;
				},
				clone: function(elem, dataAndEvents, deepDataAndEvents) {
					var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
					if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
						destElements = getAll(clone);
						srcElements = getAll(elem);
						for (i = 0, l = srcElements.length; i < l; i++) fixInput(srcElements[i], destElements[i]);
					}
					if (dataAndEvents) {
						if (deepDataAndEvents) {
							srcElements = srcElements || getAll(elem);
							destElements = destElements || getAll(clone);
							for (i = 0, l = srcElements.length; i < l; i++) cloneCopyEvent(srcElements[i], destElements[i]);
						} else cloneCopyEvent(elem, clone);
					}
					destElements = getAll(clone, "script");
					if (destElements.length > 0) setGlobalEval(destElements, !inPage && getAll(elem, "script"));
					return clone;
				},
				cleanData: function(elems) {
					var data, elem, type, special = jQuery.event.special, i = 0;
					for (; (elem = elems[i]) !== void 0; i++) if (acceptData(elem)) {
						if (data = elem[dataPriv.expando]) {
							if (data.events) for (type in data.events) if (special[type]) jQuery.event.remove(elem, type);
							else jQuery.removeEvent(elem, type, data.handle);
							elem[dataPriv.expando] = void 0;
						}
						if (elem[dataUser.expando]) elem[dataUser.expando] = void 0;
					}
				}
			});
			jQuery.fn.extend({
				detach: function(selector) {
					return remove(this, selector, true);
				},
				remove: function(selector) {
					return remove(this, selector);
				},
				text: function(value) {
					return access(this, function(value) {
						return value === void 0 ? jQuery.text(this) : this.empty().each(function() {
							if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) this.textContent = value;
						});
					}, null, value, arguments.length);
				},
				append: function() {
					return domManip(this, arguments, function(elem) {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) manipulationTarget(this, elem).appendChild(elem);
					});
				},
				prepend: function() {
					return domManip(this, arguments, function(elem) {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
							var target = manipulationTarget(this, elem);
							target.insertBefore(elem, target.firstChild);
						}
					});
				},
				before: function() {
					return domManip(this, arguments, function(elem) {
						if (this.parentNode) this.parentNode.insertBefore(elem, this);
					});
				},
				after: function() {
					return domManip(this, arguments, function(elem) {
						if (this.parentNode) this.parentNode.insertBefore(elem, this.nextSibling);
					});
				},
				empty: function() {
					var elem, i = 0;
					for (; (elem = this[i]) != null; i++) if (elem.nodeType === 1) {
						jQuery.cleanData(getAll(elem, false));
						elem.textContent = "";
					}
					return this;
				},
				clone: function(dataAndEvents, deepDataAndEvents) {
					dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
					deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
					return this.map(function() {
						return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
					});
				},
				html: function(value) {
					return access(this, function(value) {
						var elem = this[0] || {}, i = 0, l = this.length;
						if (value === void 0 && elem.nodeType === 1) return elem.innerHTML;
						if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
							value = jQuery.htmlPrefilter(value);
							try {
								for (; i < l; i++) {
									elem = this[i] || {};
									if (elem.nodeType === 1) {
										jQuery.cleanData(getAll(elem, false));
										elem.innerHTML = value;
									}
								}
								elem = 0;
							} catch (e) {}
						}
						if (elem) this.empty().append(value);
					}, null, value, arguments.length);
				},
				replaceWith: function() {
					var ignored = [];
					return domManip(this, arguments, function(elem) {
						var parent = this.parentNode;
						if (jQuery.inArray(this, ignored) < 0) {
							jQuery.cleanData(getAll(this));
							if (parent) parent.replaceChild(elem, this);
						}
					}, ignored);
				}
			});
			jQuery.each({
				appendTo: "append",
				prependTo: "prepend",
				insertBefore: "before",
				insertAfter: "after",
				replaceAll: "replaceWith"
			}, function(name, original) {
				jQuery.fn[name] = function(selector) {
					var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
					for (; i <= last; i++) {
						elems = i === last ? this : this.clone(true);
						jQuery(insert[i])[original](elems);
						push.apply(ret, elems.get());
					}
					return this.pushStack(ret);
				};
			});
			var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
			var rcustomProp = /^--/;
			var getStyles = function(elem) {
				var view = elem.ownerDocument.defaultView;
				if (!view || !view.opener) view = window;
				return view.getComputedStyle(elem);
			};
			var swap = function(elem, options, callback) {
				var ret, name, old = {};
				for (name in options) {
					old[name] = elem.style[name];
					elem.style[name] = options[name];
				}
				ret = callback.call(elem);
				for (name in options) elem.style[name] = old[name];
				return ret;
			};
			var rboxStyle = new RegExp(cssExpand.join("|"), "i");
			var whitespace = "[\\x20\\t\\r\\n\\f]";
			var rtrimCSS = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");
			(function() {
				function computeStyleTests() {
					if (!div) return;
					container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
					div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
					documentElement.appendChild(container).appendChild(div);
					var divStyle = window.getComputedStyle(div);
					pixelPositionVal = divStyle.top !== "1%";
					reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
					div.style.right = "60%";
					pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
					boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
					div.style.position = "absolute";
					scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
					documentElement.removeChild(container);
					div = null;
				}
				function roundPixelMeasures(measure) {
					return Math.round(parseFloat(measure));
				}
				var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document.createElement("div"), div = document.createElement("div");
				if (!div.style) return;
				div.style.backgroundClip = "content-box";
				div.cloneNode(true).style.backgroundClip = "";
				support.clearCloneStyle = div.style.backgroundClip === "content-box";
				jQuery.extend(support, {
					boxSizingReliable: function() {
						computeStyleTests();
						return boxSizingReliableVal;
					},
					pixelBoxStyles: function() {
						computeStyleTests();
						return pixelBoxStylesVal;
					},
					pixelPosition: function() {
						computeStyleTests();
						return pixelPositionVal;
					},
					reliableMarginLeft: function() {
						computeStyleTests();
						return reliableMarginLeftVal;
					},
					scrollboxSize: function() {
						computeStyleTests();
						return scrollboxSizeVal;
					},
					reliableTrDimensions: function() {
						var table, tr, trChild, trStyle;
						if (reliableTrDimensionsVal == null) {
							table = document.createElement("table");
							tr = document.createElement("tr");
							trChild = document.createElement("div");
							table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
							tr.style.cssText = "border:1px solid";
							tr.style.height = "1px";
							trChild.style.height = "9px";
							trChild.style.display = "block";
							documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
							trStyle = window.getComputedStyle(tr);
							reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
							documentElement.removeChild(table);
						}
						return reliableTrDimensionsVal;
					}
				});
			})();
			function curCSS(elem, name, computed) {
				var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
				computed = computed || getStyles(elem);
				if (computed) {
					ret = computed.getPropertyValue(name) || computed[name];
					if (isCustomProp && ret) ret = ret.replace(rtrimCSS, "$1") || void 0;
					if (ret === "" && !isAttached(elem)) ret = jQuery.style(elem, name);
					if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
						width = style.width;
						minWidth = style.minWidth;
						maxWidth = style.maxWidth;
						style.minWidth = style.maxWidth = style.width = ret;
						ret = computed.width;
						style.width = width;
						style.minWidth = minWidth;
						style.maxWidth = maxWidth;
					}
				}
				return ret !== void 0 ? ret + "" : ret;
			}
			function addGetHookIf(conditionFn, hookFn) {
				return { get: function() {
					if (conditionFn()) {
						delete this.get;
						return;
					}
					return (this.get = hookFn).apply(this, arguments);
				} };
			}
			var cssPrefixes = [
				"Webkit",
				"Moz",
				"ms"
			], emptyStyle = document.createElement("div").style, vendorProps = {};
			function vendorPropName(name) {
				var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
				while (i--) {
					name = cssPrefixes[i] + capName;
					if (name in emptyStyle) return name;
				}
			}
			function finalPropName(name) {
				var final = jQuery.cssProps[name] || vendorProps[name];
				if (final) return final;
				if (name in emptyStyle) return name;
				return vendorProps[name] = vendorPropName(name) || name;
			}
			var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = {
				position: "absolute",
				visibility: "hidden",
				display: "block"
			}, cssNormalTransform = {
				letterSpacing: "0",
				fontWeight: "400"
			};
			function setPositiveNumber(_elem, value, subtract) {
				var matches = rcssNum.exec(value);
				return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
			}
			function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
				var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0;
				if (box === (isBorderBox ? "border" : "content")) return 0;
				for (; i < 4; i += 2) {
					if (box === "margin") delta += jQuery.css(elem, box + cssExpand[i], true, styles);
					if (!isBorderBox) {
						delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
						if (box !== "padding") delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
						else extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
					} else {
						if (box === "content") delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
						if (box !== "margin") delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
					}
				}
				if (!isBorderBox && computedVal >= 0) delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - .5)) || 0;
				return delta;
			}
			function getWidthOrHeight(elem, dimension, extra) {
				var styles = getStyles(elem), isBorderBox = (!support.boxSizingReliable() || extra) && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
				if (rnumnonpx.test(val)) {
					if (!extra) return val;
					val = "auto";
				}
				if ((!support.boxSizingReliable() && isBorderBox || !support.reliableTrDimensions() && nodeName(elem, "tr") || val === "auto" || !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && elem.getClientRects().length) {
					isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
					valueIsBorderBox = offsetProp in elem;
					if (valueIsBorderBox) val = elem[offsetProp];
				}
				val = parseFloat(val) || 0;
				return val + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, val) + "px";
			}
			jQuery.extend({
				cssHooks: { opacity: { get: function(elem, computed) {
					if (computed) {
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				} } },
				cssNumber: {
					"animationIterationCount": true,
					"columnCount": true,
					"fillOpacity": true,
					"flexGrow": true,
					"flexShrink": true,
					"fontWeight": true,
					"gridArea": true,
					"gridColumn": true,
					"gridColumnEnd": true,
					"gridColumnStart": true,
					"gridRow": true,
					"gridRowEnd": true,
					"gridRowStart": true,
					"lineHeight": true,
					"opacity": true,
					"order": true,
					"orphans": true,
					"widows": true,
					"zIndex": true,
					"zoom": true
				},
				cssProps: {},
				style: function(elem, name, value, extra) {
					if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) return;
					var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
					if (!isCustomProp) name = finalPropName(origName);
					hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
					if (value !== void 0) {
						type = typeof value;
						if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
							value = adjustCSS(elem, name, ret);
							type = "number";
						}
						if (value == null || value !== value) return;
						if (type === "number" && !isCustomProp) value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
						if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) style[name] = "inherit";
						if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
							if (isCustomProp) style.setProperty(name, value);
							else style[name] = value;
						}
					} else {
						if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) return ret;
						return style[name];
					}
				},
				css: function(elem, name, extra, styles) {
					var val, num, hooks, origName = camelCase(name);
					if (!rcustomProp.test(name)) name = finalPropName(origName);
					hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
					if (hooks && "get" in hooks) val = hooks.get(elem, true, extra);
					if (val === void 0) val = curCSS(elem, name, styles);
					if (val === "normal" && name in cssNormalTransform) val = cssNormalTransform[name];
					if (extra === "" || extra) {
						num = parseFloat(val);
						return extra === true || isFinite(num) ? num || 0 : val;
					}
					return val;
				}
			});
			jQuery.each(["height", "width"], function(_i, dimension) {
				jQuery.cssHooks[dimension] = {
					get: function(elem, computed, extra) {
						if (computed) return rdisplayswap.test(jQuery.css(elem, "display")) && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
							return getWidthOrHeight(elem, dimension, extra);
						}) : getWidthOrHeight(elem, dimension, extra);
					},
					set: function(elem, value, extra) {
						var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", isBorderBox = (scrollboxSizeBuggy || extra) && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0;
						if (isBorderBox && scrollboxSizeBuggy) subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - .5);
						if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
							elem.style[dimension] = value;
							value = jQuery.css(elem, dimension);
						}
						return setPositiveNumber(elem, value, subtract);
					}
				};
			});
			jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, computed) {
				if (computed) return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
					return elem.getBoundingClientRect().left;
				})) + "px";
			});
			jQuery.each({
				margin: "",
				padding: "",
				border: "Width"
			}, function(prefix, suffix) {
				jQuery.cssHooks[prefix + suffix] = { expand: function(value) {
					var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
					for (; i < 4; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
					return expanded;
				} };
				if (prefix !== "margin") jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
			});
			jQuery.fn.extend({ css: function(name, value) {
				return access(this, function(elem, name, value) {
					var styles, len, map = {}, i = 0;
					if (Array.isArray(name)) {
						styles = getStyles(elem);
						len = name.length;
						for (; i < len; i++) map[name[i]] = jQuery.css(elem, name[i], false, styles);
						return map;
					}
					return value !== void 0 ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
				}, name, value, arguments.length > 1);
			} });
			function Tween(elem, options, prop, end, easing) {
				return new Tween.prototype.init(elem, options, prop, end, easing);
			}
			jQuery.Tween = Tween;
			Tween.prototype = {
				constructor: Tween,
				init: function(elem, options, prop, end, easing, unit) {
					this.elem = elem;
					this.prop = prop;
					this.easing = easing || jQuery.easing._default;
					this.options = options;
					this.start = this.now = this.cur();
					this.end = end;
					this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
				},
				cur: function() {
					var hooks = Tween.propHooks[this.prop];
					return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
				},
				run: function(percent) {
					var eased, hooks = Tween.propHooks[this.prop];
					if (this.options.duration) this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
					else this.pos = eased = percent;
					this.now = (this.end - this.start) * eased + this.start;
					if (this.options.step) this.options.step.call(this.elem, this.now, this);
					if (hooks && hooks.set) hooks.set(this);
					else Tween.propHooks._default.set(this);
					return this;
				}
			};
			Tween.prototype.init.prototype = Tween.prototype;
			Tween.propHooks = { _default: {
				get: function(tween) {
					var result;
					if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) return tween.elem[tween.prop];
					result = jQuery.css(tween.elem, tween.prop, "");
					return !result || result === "auto" ? 0 : result;
				},
				set: function(tween) {
					if (jQuery.fx.step[tween.prop]) jQuery.fx.step[tween.prop](tween);
					else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
					else tween.elem[tween.prop] = tween.now;
				}
			} };
			Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = { set: function(tween) {
				if (tween.elem.nodeType && tween.elem.parentNode) tween.elem[tween.prop] = tween.now;
			} };
			jQuery.easing = {
				linear: function(p) {
					return p;
				},
				swing: function(p) {
					return .5 - Math.cos(p * Math.PI) / 2;
				},
				_default: "swing"
			};
			jQuery.fx = Tween.prototype.init;
			jQuery.fx.step = {};
			var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
			function schedule() {
				if (inProgress) {
					if (document.hidden === false && window.requestAnimationFrame) window.requestAnimationFrame(schedule);
					else window.setTimeout(schedule, jQuery.fx.interval);
					jQuery.fx.tick();
				}
			}
			function createFxNow() {
				window.setTimeout(function() {
					fxNow = void 0;
				});
				return fxNow = Date.now();
			}
			function genFx(type, includeWidth) {
				var which, i = 0, attrs = { height: type };
				includeWidth = includeWidth ? 1 : 0;
				for (; i < 4; i += 2 - includeWidth) {
					which = cssExpand[i];
					attrs["margin" + which] = attrs["padding" + which] = type;
				}
				if (includeWidth) attrs.opacity = attrs.width = type;
				return attrs;
			}
			function createTween(value, prop, animation) {
				var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
				for (; index < length; index++) if (tween = collection[index].call(animation, prop, value)) return tween;
			}
			function defaultPrefilter(elem, props, opts) {
				var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
				if (!opts.queue) {
					hooks = jQuery._queueHooks(elem, "fx");
					if (hooks.unqueued == null) {
						hooks.unqueued = 0;
						oldfire = hooks.empty.fire;
						hooks.empty.fire = function() {
							if (!hooks.unqueued) oldfire();
						};
					}
					hooks.unqueued++;
					anim.always(function() {
						anim.always(function() {
							hooks.unqueued--;
							if (!jQuery.queue(elem, "fx").length) hooks.empty.fire();
						});
					});
				}
				for (prop in props) {
					value = props[prop];
					if (rfxtypes.test(value)) {
						delete props[prop];
						toggle = toggle || value === "toggle";
						if (value === (hidden ? "hide" : "show")) {
							if (value === "show" && dataShow && dataShow[prop] !== void 0) hidden = true;
							else continue;
						}
						orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
					}
				}
				propTween = !jQuery.isEmptyObject(props);
				if (!propTween && jQuery.isEmptyObject(orig)) return;
				if (isBox && elem.nodeType === 1) {
					opts.overflow = [
						style.overflow,
						style.overflowX,
						style.overflowY
					];
					restoreDisplay = dataShow && dataShow.display;
					if (restoreDisplay == null) restoreDisplay = dataPriv.get(elem, "display");
					display = jQuery.css(elem, "display");
					if (display === "none") {
						if (restoreDisplay) display = restoreDisplay;
						else {
							showHide([elem], true);
							restoreDisplay = elem.style.display || restoreDisplay;
							display = jQuery.css(elem, "display");
							showHide([elem]);
						}
					}
					if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
						if (jQuery.css(elem, "float") === "none") {
							if (!propTween) {
								anim.done(function() {
									style.display = restoreDisplay;
								});
								if (restoreDisplay == null) {
									display = style.display;
									restoreDisplay = display === "none" ? "" : display;
								}
							}
							style.display = "inline-block";
						}
					}
				}
				if (opts.overflow) {
					style.overflow = "hidden";
					anim.always(function() {
						style.overflow = opts.overflow[0];
						style.overflowX = opts.overflow[1];
						style.overflowY = opts.overflow[2];
					});
				}
				propTween = false;
				for (prop in orig) {
					if (!propTween) {
						if (dataShow) {
							if ("hidden" in dataShow) hidden = dataShow.hidden;
						} else dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
						if (toggle) dataShow.hidden = !hidden;
						if (hidden) showHide([elem], true);
						anim.done(function() {
							if (!hidden) showHide([elem]);
							dataPriv.remove(elem, "fxshow");
							for (prop in orig) jQuery.style(elem, prop, orig[prop]);
						});
					}
					propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
					if (!(prop in dataShow)) {
						dataShow[prop] = propTween.start;
						if (hidden) {
							propTween.end = propTween.start;
							propTween.start = 0;
						}
					}
				}
			}
			function propFilter(props, specialEasing) {
				var index, name, easing, value, hooks;
				for (index in props) {
					name = camelCase(index);
					easing = specialEasing[name];
					value = props[index];
					if (Array.isArray(value)) {
						easing = value[1];
						value = props[index] = value[0];
					}
					if (index !== name) {
						props[name] = value;
						delete props[index];
					}
					hooks = jQuery.cssHooks[name];
					if (hooks && "expand" in hooks) {
						value = hooks.expand(value);
						delete props[name];
						for (index in value) if (!(index in props)) {
							props[index] = value[index];
							specialEasing[index] = easing;
						}
					} else specialEasing[name] = easing;
				}
			}
			function Animation(elem, properties, options) {
				var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
					delete tick.elem;
				}), tick = function() {
					if (stopped) return false;
					var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index = 0, length = animation.tweens.length;
					for (; index < length; index++) animation.tweens[index].run(percent);
					deferred.notifyWith(elem, [
						animation,
						percent,
						remaining
					]);
					if (percent < 1 && length) return remaining;
					if (!length) deferred.notifyWith(elem, [
						animation,
						1,
						0
					]);
					deferred.resolveWith(elem, [animation]);
					return false;
				}, animation = deferred.promise({
					elem,
					props: jQuery.extend({}, properties),
					opts: jQuery.extend(true, {
						specialEasing: {},
						easing: jQuery.easing._default
					}, options),
					originalProperties: properties,
					originalOptions: options,
					startTime: fxNow || createFxNow(),
					duration: options.duration,
					tweens: [],
					createTween: function(prop, end) {
						var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
						animation.tweens.push(tween);
						return tween;
					},
					stop: function(gotoEnd) {
						var index = 0, length = gotoEnd ? animation.tweens.length : 0;
						if (stopped) return this;
						stopped = true;
						for (; index < length; index++) animation.tweens[index].run(1);
						if (gotoEnd) {
							deferred.notifyWith(elem, [
								animation,
								1,
								0
							]);
							deferred.resolveWith(elem, [animation, gotoEnd]);
						} else deferred.rejectWith(elem, [animation, gotoEnd]);
						return this;
					}
				}), props = animation.props;
				propFilter(props, animation.opts.specialEasing);
				for (; index < length; index++) {
					result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
					if (result) {
						if (isFunction(result.stop)) jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
						return result;
					}
				}
				jQuery.map(props, createTween, animation);
				if (isFunction(animation.opts.start)) animation.opts.start.call(elem, animation);
				animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
				jQuery.fx.timer(jQuery.extend(tick, {
					elem,
					anim: animation,
					queue: animation.opts.queue
				}));
				return animation;
			}
			jQuery.Animation = jQuery.extend(Animation, {
				tweeners: { "*": [function(prop, value) {
					var tween = this.createTween(prop, value);
					adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
					return tween;
				}] },
				tweener: function(props, callback) {
					if (isFunction(props)) {
						callback = props;
						props = ["*"];
					} else props = props.match(rnothtmlwhite);
					var prop, index = 0, length = props.length;
					for (; index < length; index++) {
						prop = props[index];
						Animation.tweeners[prop] = Animation.tweeners[prop] || [];
						Animation.tweeners[prop].unshift(callback);
					}
				},
				prefilters: [defaultPrefilter],
				prefilter: function(callback, prepend) {
					if (prepend) Animation.prefilters.unshift(callback);
					else Animation.prefilters.push(callback);
				}
			});
			jQuery.speed = function(speed, easing, fn) {
				var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
					complete: fn || !fn && easing || isFunction(speed) && speed,
					duration: speed,
					easing: fn && easing || easing && !isFunction(easing) && easing
				};
				if (jQuery.fx.off) opt.duration = 0;
				else if (typeof opt.duration !== "number") {
					if (opt.duration in jQuery.fx.speeds) opt.duration = jQuery.fx.speeds[opt.duration];
					else opt.duration = jQuery.fx.speeds._default;
				}
				if (opt.queue == null || opt.queue === true) opt.queue = "fx";
				opt.old = opt.complete;
				opt.complete = function() {
					if (isFunction(opt.old)) opt.old.call(this);
					if (opt.queue) jQuery.dequeue(this, opt.queue);
				};
				return opt;
			};
			jQuery.fn.extend({
				fadeTo: function(speed, to, easing, callback) {
					return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
				},
				animate: function(prop, speed, easing, callback) {
					var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
						var anim = Animation(this, jQuery.extend({}, prop), optall);
						if (empty || dataPriv.get(this, "finish")) anim.stop(true);
					};
					doAnimation.finish = doAnimation;
					return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
				},
				stop: function(type, clearQueue, gotoEnd) {
					var stopQueue = function(hooks) {
						var stop = hooks.stop;
						delete hooks.stop;
						stop(gotoEnd);
					};
					if (typeof type !== "string") {
						gotoEnd = clearQueue;
						clearQueue = type;
						type = void 0;
					}
					if (clearQueue) this.queue(type || "fx", []);
					return this.each(function() {
						var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
						if (index) {
							if (data[index] && data[index].stop) stopQueue(data[index]);
						} else for (index in data) if (data[index] && data[index].stop && rrun.test(index)) stopQueue(data[index]);
						for (index = timers.length; index--;) if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
							timers[index].anim.stop(gotoEnd);
							dequeue = false;
							timers.splice(index, 1);
						}
						if (dequeue || !gotoEnd) jQuery.dequeue(this, type);
					});
				},
				finish: function(type) {
					if (type !== false) type = type || "fx";
					return this.each(function() {
						var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
						data.finish = true;
						jQuery.queue(this, type, []);
						if (hooks && hooks.stop) hooks.stop.call(this, true);
						for (index = timers.length; index--;) if (timers[index].elem === this && timers[index].queue === type) {
							timers[index].anim.stop(true);
							timers.splice(index, 1);
						}
						for (index = 0; index < length; index++) if (queue[index] && queue[index].finish) queue[index].finish.call(this);
						delete data.finish;
					});
				}
			});
			jQuery.each([
				"toggle",
				"show",
				"hide"
			], function(_i, name) {
				var cssFn = jQuery.fn[name];
				jQuery.fn[name] = function(speed, easing, callback) {
					return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
				};
			});
			jQuery.each({
				slideDown: genFx("show"),
				slideUp: genFx("hide"),
				slideToggle: genFx("toggle"),
				fadeIn: { opacity: "show" },
				fadeOut: { opacity: "hide" },
				fadeToggle: { opacity: "toggle" }
			}, function(name, props) {
				jQuery.fn[name] = function(speed, easing, callback) {
					return this.animate(props, speed, easing, callback);
				};
			});
			jQuery.timers = [];
			jQuery.fx.tick = function() {
				var timer, i = 0, timers = jQuery.timers;
				fxNow = Date.now();
				for (; i < timers.length; i++) {
					timer = timers[i];
					if (!timer() && timers[i] === timer) timers.splice(i--, 1);
				}
				if (!timers.length) jQuery.fx.stop();
				fxNow = void 0;
			};
			jQuery.fx.timer = function(timer) {
				jQuery.timers.push(timer);
				jQuery.fx.start();
			};
			jQuery.fx.interval = 13;
			jQuery.fx.start = function() {
				if (inProgress) return;
				inProgress = true;
				schedule();
			};
			jQuery.fx.stop = function() {
				inProgress = null;
			};
			jQuery.fx.speeds = {
				slow: 600,
				fast: 200,
				_default: 400
			};
			jQuery.fn.delay = function(time, type) {
				time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
				type = type || "fx";
				return this.queue(type, function(next, hooks) {
					var timeout = window.setTimeout(next, time);
					hooks.stop = function() {
						window.clearTimeout(timeout);
					};
				});
			};
			(function() {
				var input = document.createElement("input"), opt = document.createElement("select").appendChild(document.createElement("option"));
				input.type = "checkbox";
				support.checkOn = input.value !== "";
				support.optSelected = opt.selected;
				input = document.createElement("input");
				input.value = "t";
				input.type = "radio";
				support.radioValue = input.value === "t";
			})();
			var boolHook, attrHandle = jQuery.expr.attrHandle;
			jQuery.fn.extend({
				attr: function(name, value) {
					return access(this, jQuery.attr, name, value, arguments.length > 1);
				},
				removeAttr: function(name) {
					return this.each(function() {
						jQuery.removeAttr(this, name);
					});
				}
			});
			jQuery.extend({
				attr: function(elem, name, value) {
					var ret, hooks, nType = elem.nodeType;
					if (nType === 3 || nType === 8 || nType === 2) return;
					if (typeof elem.getAttribute === "undefined") return jQuery.prop(elem, name, value);
					if (nType !== 1 || !jQuery.isXMLDoc(elem)) hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
					if (value !== void 0) {
						if (value === null) {
							jQuery.removeAttr(elem, name);
							return;
						}
						if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) return ret;
						elem.setAttribute(name, value + "");
						return value;
					}
					if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) return ret;
					ret = jQuery.find.attr(elem, name);
					return ret == null ? void 0 : ret;
				},
				attrHooks: { type: { set: function(elem, value) {
					if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) elem.value = val;
						return value;
					}
				} } },
				removeAttr: function(elem, value) {
					var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
					if (attrNames && elem.nodeType === 1) while (name = attrNames[i++]) elem.removeAttribute(name);
				}
			});
			boolHook = { set: function(elem, value, name) {
				if (value === false) jQuery.removeAttr(elem, name);
				else elem.setAttribute(name, name);
				return name;
			} };
			jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
				var getter = attrHandle[name] || jQuery.find.attr;
				attrHandle[name] = function(elem, name, isXML) {
					var ret, handle, lowercaseName = name.toLowerCase();
					if (!isXML) {
						handle = attrHandle[lowercaseName];
						attrHandle[lowercaseName] = ret;
						ret = getter(elem, name, isXML) != null ? lowercaseName : null;
						attrHandle[lowercaseName] = handle;
					}
					return ret;
				};
			});
			var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
			jQuery.fn.extend({
				prop: function(name, value) {
					return access(this, jQuery.prop, name, value, arguments.length > 1);
				},
				removeProp: function(name) {
					return this.each(function() {
						delete this[jQuery.propFix[name] || name];
					});
				}
			});
			jQuery.extend({
				prop: function(elem, name, value) {
					var ret, hooks, nType = elem.nodeType;
					if (nType === 3 || nType === 8 || nType === 2) return;
					if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
						name = jQuery.propFix[name] || name;
						hooks = jQuery.propHooks[name];
					}
					if (value !== void 0) {
						if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) return ret;
						return elem[name] = value;
					}
					if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) return ret;
					return elem[name];
				},
				propHooks: { tabIndex: { get: function(elem) {
					var tabindex = jQuery.find.attr(elem, "tabindex");
					if (tabindex) return parseInt(tabindex, 10);
					if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) return 0;
					return -1;
				} } },
				propFix: {
					"for": "htmlFor",
					"class": "className"
				}
			});
			if (!support.optSelected) jQuery.propHooks.selected = {
				get: function(elem) {
					var parent = elem.parentNode;
					if (parent && parent.parentNode) parent.parentNode.selectedIndex;
					return null;
				},
				set: function(elem) {
					var parent = elem.parentNode;
					if (parent) {
						parent.selectedIndex;
						if (parent.parentNode) parent.parentNode.selectedIndex;
					}
				}
			};
			jQuery.each([
				"tabIndex",
				"readOnly",
				"maxLength",
				"cellSpacing",
				"cellPadding",
				"rowSpan",
				"colSpan",
				"useMap",
				"frameBorder",
				"contentEditable"
			], function() {
				jQuery.propFix[this.toLowerCase()] = this;
			});
			function stripAndCollapse(value) {
				return (value.match(rnothtmlwhite) || []).join(" ");
			}
			function getClass(elem) {
				return elem.getAttribute && elem.getAttribute("class") || "";
			}
			function classesToArray(value) {
				if (Array.isArray(value)) return value;
				if (typeof value === "string") return value.match(rnothtmlwhite) || [];
				return [];
			}
			jQuery.fn.extend({
				addClass: function(value) {
					var classNames, cur, curValue, className, i, finalValue;
					if (isFunction(value)) return this.each(function(j) {
						jQuery(this).addClass(value.call(this, j, getClass(this)));
					});
					classNames = classesToArray(value);
					if (classNames.length) return this.each(function() {
						curValue = getClass(this);
						cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
						if (cur) {
							for (i = 0; i < classNames.length; i++) {
								className = classNames[i];
								if (cur.indexOf(" " + className + " ") < 0) cur += className + " ";
							}
							finalValue = stripAndCollapse(cur);
							if (curValue !== finalValue) this.setAttribute("class", finalValue);
						}
					});
					return this;
				},
				removeClass: function(value) {
					var classNames, cur, curValue, className, i, finalValue;
					if (isFunction(value)) return this.each(function(j) {
						jQuery(this).removeClass(value.call(this, j, getClass(this)));
					});
					if (!arguments.length) return this.attr("class", "");
					classNames = classesToArray(value);
					if (classNames.length) return this.each(function() {
						curValue = getClass(this);
						cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
						if (cur) {
							for (i = 0; i < classNames.length; i++) {
								className = classNames[i];
								while (cur.indexOf(" " + className + " ") > -1) cur = cur.replace(" " + className + " ", " ");
							}
							finalValue = stripAndCollapse(cur);
							if (curValue !== finalValue) this.setAttribute("class", finalValue);
						}
					});
					return this;
				},
				toggleClass: function(value, stateVal) {
					var classNames, className, i, self, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
					if (isFunction(value)) return this.each(function(i) {
						jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
					});
					if (typeof stateVal === "boolean" && isValidValue) return stateVal ? this.addClass(value) : this.removeClass(value);
					classNames = classesToArray(value);
					return this.each(function() {
						if (isValidValue) {
							self = jQuery(this);
							for (i = 0; i < classNames.length; i++) {
								className = classNames[i];
								if (self.hasClass(className)) self.removeClass(className);
								else self.addClass(className);
							}
						} else if (value === void 0 || type === "boolean") {
							className = getClass(this);
							if (className) dataPriv.set(this, "__className__", className);
							if (this.setAttribute) this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
						}
					});
				},
				hasClass: function(selector) {
					var className, elem, i = 0;
					className = " " + selector + " ";
					while (elem = this[i++]) if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) return true;
					return false;
				}
			});
			var rreturn = /\r/g;
			jQuery.fn.extend({ val: function(value) {
				var hooks, ret, valueIsFunction, elem = this[0];
				if (!arguments.length) {
					if (elem) {
						hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
						if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) return ret;
						ret = elem.value;
						if (typeof ret === "string") return ret.replace(rreturn, "");
						return ret == null ? "" : ret;
					}
					return;
				}
				valueIsFunction = isFunction(value);
				return this.each(function(i) {
					var val;
					if (this.nodeType !== 1) return;
					if (valueIsFunction) val = value.call(this, i, jQuery(this).val());
					else val = value;
					if (val == null) val = "";
					else if (typeof val === "number") val += "";
					else if (Array.isArray(val)) val = jQuery.map(val, function(value) {
						return value == null ? "" : value + "";
					});
					hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
					if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) this.value = val;
				});
			} });
			jQuery.extend({ valHooks: {
				option: { get: function(elem) {
					var val = jQuery.find.attr(elem, "value");
					return val != null ? val : stripAndCollapse(jQuery.text(elem));
				} },
				select: {
					get: function(elem) {
						var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
						if (index < 0) i = max;
						else i = one ? index : 0;
						for (; i < max; i++) {
							option = options[i];
							if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
								value = jQuery(option).val();
								if (one) return value;
								values.push(value);
							}
						}
						return values;
					},
					set: function(elem, value) {
						var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
						while (i--) {
							option = options[i];
							if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) optionSet = true;
						}
						if (!optionSet) elem.selectedIndex = -1;
						return values;
					}
				}
			} });
			jQuery.each(["radio", "checkbox"], function() {
				jQuery.valHooks[this] = { set: function(elem, value) {
					if (Array.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				} };
				if (!support.checkOn) jQuery.valHooks[this].get = function(elem) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				};
			});
			support.focusin = "onfocusin" in window;
			var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
				e.stopPropagation();
			};
			jQuery.extend(jQuery.event, {
				trigger: function(event, data, elem, onlyHandlers) {
					var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
					cur = lastElement = tmp = elem = elem || document;
					if (elem.nodeType === 3 || elem.nodeType === 8) return;
					if (rfocusMorph.test(type + jQuery.event.triggered)) return;
					if (type.indexOf(".") > -1) {
						namespaces = type.split(".");
						type = namespaces.shift();
						namespaces.sort();
					}
					ontype = type.indexOf(":") < 0 && "on" + type;
					event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
					event.isTrigger = onlyHandlers ? 2 : 3;
					event.namespace = namespaces.join(".");
					event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
					event.result = void 0;
					if (!event.target) event.target = elem;
					data = data == null ? [event] : jQuery.makeArray(data, [event]);
					special = jQuery.event.special[type] || {};
					if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) return;
					if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
						bubbleType = special.delegateType || type;
						if (!rfocusMorph.test(bubbleType + type)) cur = cur.parentNode;
						for (; cur; cur = cur.parentNode) {
							eventPath.push(cur);
							tmp = cur;
						}
						if (tmp === (elem.ownerDocument || document)) eventPath.push(tmp.defaultView || tmp.parentWindow || window);
					}
					i = 0;
					while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
						lastElement = cur;
						event.type = i > 1 ? bubbleType : special.bindType || type;
						handle = (dataPriv.get(cur, "events") || Object.create(null))[event.type] && dataPriv.get(cur, "handle");
						if (handle) handle.apply(cur, data);
						handle = ontype && cur[ontype];
						if (handle && handle.apply && acceptData(cur)) {
							event.result = handle.apply(cur, data);
							if (event.result === false) event.preventDefault();
						}
					}
					event.type = type;
					if (!onlyHandlers && !event.isDefaultPrevented()) {
						if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
							if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
								tmp = elem[ontype];
								if (tmp) elem[ontype] = null;
								jQuery.event.triggered = type;
								if (event.isPropagationStopped()) lastElement.addEventListener(type, stopPropagationCallback);
								elem[type]();
								if (event.isPropagationStopped()) lastElement.removeEventListener(type, stopPropagationCallback);
								jQuery.event.triggered = void 0;
								if (tmp) elem[ontype] = tmp;
							}
						}
					}
					return event.result;
				},
				simulate: function(type, elem, event) {
					var e = jQuery.extend(new jQuery.Event(), event, {
						type,
						isSimulated: true
					});
					jQuery.event.trigger(e, null, elem);
				}
			});
			jQuery.fn.extend({
				trigger: function(type, data) {
					return this.each(function() {
						jQuery.event.trigger(type, data, this);
					});
				},
				triggerHandler: function(type, data) {
					var elem = this[0];
					if (elem) return jQuery.event.trigger(type, data, elem, true);
				}
			});
			if (!support.focusin) jQuery.each({
				focus: "focusin",
				blur: "focusout"
			}, function(orig, fix) {
				var handler = function(event) {
					jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
				};
				jQuery.event.special[fix] = {
					setup: function() {
						var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix);
						if (!attaches) doc.addEventListener(orig, handler, true);
						dataPriv.access(doc, fix, (attaches || 0) + 1);
					},
					teardown: function() {
						var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix) - 1;
						if (!attaches) {
							doc.removeEventListener(orig, handler, true);
							dataPriv.remove(doc, fix);
						} else dataPriv.access(doc, fix, attaches);
					}
				};
			});
			var location = window.location;
			var nonce = { guid: Date.now() };
			var rquery = /\?/;
			jQuery.parseXML = function(data) {
				var xml, parserErrorElem;
				if (!data || typeof data !== "string") return null;
				try {
					xml = new window.DOMParser().parseFromString(data, "text/xml");
				} catch (e) {}
				parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
				if (!xml || parserErrorElem) jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
					return el.textContent;
				}).join("\n") : data));
				return xml;
			};
			var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
			function buildParams(prefix, obj, traditional, add) {
				var name;
				if (Array.isArray(obj)) jQuery.each(obj, function(i, v) {
					if (traditional || rbracket.test(prefix)) add(prefix, v);
					else buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
				});
				else if (!traditional && toType(obj) === "object") for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
				else add(prefix, obj);
			}
			jQuery.param = function(a, traditional) {
				var prefix, s = [], add = function(key, valueOrFunction) {
					var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
					s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
				};
				if (a == null) return "";
				if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
					add(this.name, this.value);
				});
				else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
				return s.join("&");
			};
			jQuery.fn.extend({
				serialize: function() {
					return jQuery.param(this.serializeArray());
				},
				serializeArray: function() {
					return this.map(function() {
						var elements = jQuery.prop(this, "elements");
						return elements ? jQuery.makeArray(elements) : this;
					}).filter(function() {
						var type = this.type;
						return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
					}).map(function(_i, elem) {
						var val = jQuery(this).val();
						if (val == null) return null;
						if (Array.isArray(val)) return jQuery.map(val, function(val) {
							return {
								name: elem.name,
								value: val.replace(rCRLF, "\r\n")
							};
						});
						return {
							name: elem.name,
							value: val.replace(rCRLF, "\r\n")
						};
					}).get();
				}
			});
			var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document.createElement("a");
			originAnchor.href = location.href;
			function addToPrefiltersOrTransports(structure) {
				return function(dataTypeExpression, func) {
					if (typeof dataTypeExpression !== "string") {
						func = dataTypeExpression;
						dataTypeExpression = "*";
					}
					var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
					if (isFunction(func)) while (dataType = dataTypes[i++]) if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);
					} else (structure[dataType] = structure[dataType] || []).push(func);
				};
			}
			function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
				var inspected = {}, seekingTransport = structure === transports;
				function inspect(dataType) {
					var selected;
					inspected[dataType] = true;
					jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
						var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
						if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
							options.dataTypes.unshift(dataTypeOrTransport);
							inspect(dataTypeOrTransport);
							return false;
						} else if (seekingTransport) return !(selected = dataTypeOrTransport);
					});
					return selected;
				}
				return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
			}
			function ajaxExtend(target, src) {
				var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
				for (key in src) if (src[key] !== void 0) (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
				if (deep) jQuery.extend(true, target, deep);
				return target;
			}
			function ajaxHandleResponses(s, jqXHR, responses) {
				var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
				while (dataTypes[0] === "*") {
					dataTypes.shift();
					if (ct === void 0) ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
				}
				if (ct) {
					for (type in contents) if (contents[type] && contents[type].test(ct)) {
						dataTypes.unshift(type);
						break;
					}
				}
				if (dataTypes[0] in responses) finalDataType = dataTypes[0];
				else {
					for (type in responses) {
						if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
							finalDataType = type;
							break;
						}
						if (!firstDataType) firstDataType = type;
					}
					finalDataType = finalDataType || firstDataType;
				}
				if (finalDataType) {
					if (finalDataType !== dataTypes[0]) dataTypes.unshift(finalDataType);
					return responses[finalDataType];
				}
			}
			function ajaxConvert(s, response, jqXHR, isSuccess) {
				var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
				if (dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
				current = dataTypes.shift();
				while (current) {
					if (s.responseFields[current]) jqXHR[s.responseFields[current]] = response;
					if (!prev && isSuccess && s.dataFilter) response = s.dataFilter(response, s.dataType);
					prev = current;
					current = dataTypes.shift();
					if (current) {
						if (current === "*") current = prev;
						else if (prev !== "*" && prev !== current) {
							conv = converters[prev + " " + current] || converters["* " + current];
							if (!conv) for (conv2 in converters) {
								tmp = conv2.split(" ");
								if (tmp[1] === current) {
									conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
									if (conv) {
										if (conv === true) conv = converters[conv2];
										else if (converters[conv2] !== true) {
											current = tmp[0];
											dataTypes.unshift(tmp[1]);
										}
										break;
									}
								}
							}
							if (conv !== true) {
								if (conv && s.throws) response = conv(response);
								else try {
									response = conv(response);
								} catch (e) {
									return {
										state: "parsererror",
										error: conv ? e : "No conversion from " + prev + " to " + current
									};
								}
							}
						}
					}
				}
				return {
					state: "success",
					data: response
				};
			}
			jQuery.extend({
				active: 0,
				lastModified: {},
				etag: {},
				ajaxSettings: {
					url: location.href,
					type: "GET",
					isLocal: rlocalProtocol.test(location.protocol),
					global: true,
					processData: true,
					async: true,
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					accepts: {
						"*": allTypes,
						text: "text/plain",
						html: "text/html",
						xml: "application/xml, text/xml",
						json: "application/json, text/javascript"
					},
					contents: {
						xml: /\bxml\b/,
						html: /\bhtml/,
						json: /\bjson\b/
					},
					responseFields: {
						xml: "responseXML",
						text: "responseText",
						json: "responseJSON"
					},
					converters: {
						"* text": String,
						"text html": true,
						"text json": JSON.parse,
						"text xml": jQuery.parseXML
					},
					flatOptions: {
						url: true,
						context: true
					}
				},
				ajaxSetup: function(target, settings) {
					return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
				},
				ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
				ajaxTransport: addToPrefiltersOrTransports(transports),
				ajax: function(url, options) {
					if (typeof url === "object") {
						options = url;
						url = void 0;
					}
					options = options || {};
					var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
						readyState: 0,
						getResponseHeader: function(key) {
							var match;
							if (completed) {
								if (!responseHeaders) {
									responseHeaders = {};
									while (match = rheaders.exec(responseHeadersString)) responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
								}
								match = responseHeaders[key.toLowerCase() + " "];
							}
							return match == null ? null : match.join(", ");
						},
						getAllResponseHeaders: function() {
							return completed ? responseHeadersString : null;
						},
						setRequestHeader: function(name, value) {
							if (completed == null) {
								name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
								requestHeaders[name] = value;
							}
							return this;
						},
						overrideMimeType: function(type) {
							if (completed == null) s.mimeType = type;
							return this;
						},
						statusCode: function(map) {
							var code;
							if (map) {
								if (completed) jqXHR.always(map[jqXHR.status]);
								else for (code in map) statusCode[code] = [statusCode[code], map[code]];
							}
							return this;
						},
						abort: function(statusText) {
							var finalText = statusText || strAbort;
							if (transport) transport.abort(finalText);
							done(0, finalText);
							return this;
						}
					};
					deferred.promise(jqXHR);
					s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
					s.type = options.method || options.type || s.method || s.type;
					s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
					if (s.crossDomain == null) {
						urlAnchor = document.createElement("a");
						try {
							urlAnchor.href = s.url;
							urlAnchor.href = urlAnchor.href;
							s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
						} catch (e) {
							s.crossDomain = true;
						}
					}
					if (s.data && s.processData && typeof s.data !== "string") s.data = jQuery.param(s.data, s.traditional);
					inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
					if (completed) return jqXHR;
					fireGlobals = jQuery.event && s.global;
					if (fireGlobals && jQuery.active++ === 0) jQuery.event.trigger("ajaxStart");
					s.type = s.type.toUpperCase();
					s.hasContent = !rnoContent.test(s.type);
					cacheURL = s.url.replace(rhash, "");
					if (!s.hasContent) {
						uncached = s.url.slice(cacheURL.length);
						if (s.data && (s.processData || typeof s.data === "string")) {
							cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
							delete s.data;
						}
						if (s.cache === false) {
							cacheURL = cacheURL.replace(rantiCache, "$1");
							uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
						}
						s.url = cacheURL + uncached;
					} else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) s.data = s.data.replace(r20, "+");
					if (s.ifModified) {
						if (jQuery.lastModified[cacheURL]) jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
						if (jQuery.etag[cacheURL]) jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
					}
					if (s.data && s.hasContent && s.contentType !== false || options.contentType) jqXHR.setRequestHeader("Content-Type", s.contentType);
					jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
					for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
					if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) return jqXHR.abort();
					strAbort = "abort";
					completeDeferred.add(s.complete);
					jqXHR.done(s.success);
					jqXHR.fail(s.error);
					transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
					if (!transport) done(-1, "No Transport");
					else {
						jqXHR.readyState = 1;
						if (fireGlobals) globalEventContext.trigger("ajaxSend", [jqXHR, s]);
						if (completed) return jqXHR;
						if (s.async && s.timeout > 0) timeoutTimer = window.setTimeout(function() {
							jqXHR.abort("timeout");
						}, s.timeout);
						try {
							completed = false;
							transport.send(requestHeaders, done);
						} catch (e) {
							if (completed) throw e;
							done(-1, e);
						}
					}
					function done(status, nativeStatusText, responses, headers) {
						var isSuccess, success, error, response, modified, statusText = nativeStatusText;
						if (completed) return;
						completed = true;
						if (timeoutTimer) window.clearTimeout(timeoutTimer);
						transport = void 0;
						responseHeadersString = headers || "";
						jqXHR.readyState = status > 0 ? 4 : 0;
						isSuccess = status >= 200 && status < 300 || status === 304;
						if (responses) response = ajaxHandleResponses(s, jqXHR, responses);
						if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) s.converters["text script"] = function() {};
						response = ajaxConvert(s, response, jqXHR, isSuccess);
						if (isSuccess) {
							if (s.ifModified) {
								modified = jqXHR.getResponseHeader("Last-Modified");
								if (modified) jQuery.lastModified[cacheURL] = modified;
								modified = jqXHR.getResponseHeader("etag");
								if (modified) jQuery.etag[cacheURL] = modified;
							}
							if (status === 204 || s.type === "HEAD") statusText = "nocontent";
							else if (status === 304) statusText = "notmodified";
							else {
								statusText = response.state;
								success = response.data;
								error = response.error;
								isSuccess = !error;
							}
						} else {
							error = statusText;
							if (status || !statusText) {
								statusText = "error";
								if (status < 0) status = 0;
							}
						}
						jqXHR.status = status;
						jqXHR.statusText = (nativeStatusText || statusText) + "";
						if (isSuccess) deferred.resolveWith(callbackContext, [
							success,
							statusText,
							jqXHR
						]);
						else deferred.rejectWith(callbackContext, [
							jqXHR,
							statusText,
							error
						]);
						jqXHR.statusCode(statusCode);
						statusCode = void 0;
						if (fireGlobals) globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [
							jqXHR,
							s,
							isSuccess ? success : error
						]);
						completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
						if (fireGlobals) {
							globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
							if (!--jQuery.active) jQuery.event.trigger("ajaxStop");
						}
					}
					return jqXHR;
				},
				getJSON: function(url, data, callback) {
					return jQuery.get(url, data, callback, "json");
				},
				getScript: function(url, callback) {
					return jQuery.get(url, void 0, callback, "script");
				}
			});
			jQuery.each(["get", "post"], function(_i, method) {
				jQuery[method] = function(url, data, callback, type) {
					if (isFunction(data)) {
						type = type || callback;
						callback = data;
						data = void 0;
					}
					return jQuery.ajax(jQuery.extend({
						url,
						type: method,
						dataType: type,
						data,
						success: callback
					}, jQuery.isPlainObject(url) && url));
				};
			});
			jQuery.ajaxPrefilter(function(s) {
				var i;
				for (i in s.headers) if (i.toLowerCase() === "content-type") s.contentType = s.headers[i] || "";
			});
			jQuery._evalUrl = function(url, options, doc) {
				return jQuery.ajax({
					url,
					type: "GET",
					dataType: "script",
					cache: true,
					async: false,
					global: false,
					converters: { "text script": function() {} },
					dataFilter: function(response) {
						jQuery.globalEval(response, options, doc);
					}
				});
			};
			jQuery.fn.extend({
				wrapAll: function(html) {
					var wrap;
					if (this[0]) {
						if (isFunction(html)) html = html.call(this[0]);
						wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
						if (this[0].parentNode) wrap.insertBefore(this[0]);
						wrap.map(function() {
							var elem = this;
							while (elem.firstElementChild) elem = elem.firstElementChild;
							return elem;
						}).append(this);
					}
					return this;
				},
				wrapInner: function(html) {
					if (isFunction(html)) return this.each(function(i) {
						jQuery(this).wrapInner(html.call(this, i));
					});
					return this.each(function() {
						var self = jQuery(this), contents = self.contents();
						if (contents.length) contents.wrapAll(html);
						else self.append(html);
					});
				},
				wrap: function(html) {
					var htmlIsFunction = isFunction(html);
					return this.each(function(i) {
						jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
					});
				},
				unwrap: function(selector) {
					this.parent(selector).not("body").each(function() {
						jQuery(this).replaceWith(this.childNodes);
					});
					return this;
				}
			});
			jQuery.expr.pseudos.hidden = function(elem) {
				return !jQuery.expr.pseudos.visible(elem);
			};
			jQuery.expr.pseudos.visible = function(elem) {
				return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
			};
			jQuery.ajaxSettings.xhr = function() {
				try {
					return new window.XMLHttpRequest();
				} catch (e) {}
			};
			var xhrSuccessStatus = {
				0: 200,
				1223: 204
			}, xhrSupported = jQuery.ajaxSettings.xhr();
			support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
			support.ajax = xhrSupported = !!xhrSupported;
			jQuery.ajaxTransport(function(options) {
				var callback, errorCallback;
				if (support.cors || xhrSupported && !options.crossDomain) return {
					send: function(headers, complete) {
						var i, xhr = options.xhr();
						xhr.open(options.type, options.url, options.async, options.username, options.password);
						if (options.xhrFields) for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
						if (options.mimeType && xhr.overrideMimeType) xhr.overrideMimeType(options.mimeType);
						if (!options.crossDomain && !headers["X-Requested-With"]) headers["X-Requested-With"] = "XMLHttpRequest";
						for (i in headers) xhr.setRequestHeader(i, headers[i]);
						callback = function(type) {
							return function() {
								if (callback) {
									callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
									if (type === "abort") xhr.abort();
									else if (type === "error") {
										if (typeof xhr.status !== "number") complete(0, "error");
										else complete(xhr.status, xhr.statusText);
									} else complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
								}
							};
						};
						xhr.onload = callback();
						errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
						if (xhr.onabort !== void 0) xhr.onabort = errorCallback;
						else xhr.onreadystatechange = function() {
							if (xhr.readyState === 4) window.setTimeout(function() {
								if (callback) errorCallback();
							});
						};
						callback = callback("abort");
						try {
							xhr.send(options.hasContent && options.data || null);
						} catch (e) {
							if (callback) throw e;
						}
					},
					abort: function() {
						if (callback) callback();
					}
				};
			});
			jQuery.ajaxPrefilter(function(s) {
				if (s.crossDomain) s.contents.script = false;
			});
			jQuery.ajaxSetup({
				accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" },
				contents: { script: /\b(?:java|ecma)script\b/ },
				converters: { "text script": function(text) {
					jQuery.globalEval(text);
					return text;
				} }
			});
			jQuery.ajaxPrefilter("script", function(s) {
				if (s.cache === void 0) s.cache = false;
				if (s.crossDomain) s.type = "GET";
			});
			jQuery.ajaxTransport("script", function(s) {
				if (s.crossDomain || s.scriptAttrs) {
					var script, callback;
					return {
						send: function(_, complete) {
							script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({
								charset: s.scriptCharset,
								src: s.url
							}).on("load error", callback = function(evt) {
								script.remove();
								callback = null;
								if (evt) complete(evt.type === "error" ? 404 : 200, evt.type);
							});
							document.head.appendChild(script[0]);
						},
						abort: function() {
							if (callback) callback();
						}
					};
				}
			});
			var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
			jQuery.ajaxSetup({
				jsonp: "callback",
				jsonpCallback: function() {
					var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
					this[callback] = true;
					return callback;
				}
			});
			jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
				var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
				if (jsonProp || s.dataTypes[0] === "jsonp") {
					callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
					if (jsonProp) s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
					else if (s.jsonp !== false) s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
					s.converters["script json"] = function() {
						if (!responseContainer) jQuery.error(callbackName + " was not called");
						return responseContainer[0];
					};
					s.dataTypes[0] = "json";
					overwritten = window[callbackName];
					window[callbackName] = function() {
						responseContainer = arguments;
					};
					jqXHR.always(function() {
						if (overwritten === void 0) jQuery(window).removeProp(callbackName);
						else window[callbackName] = overwritten;
						if (s[callbackName]) {
							s.jsonpCallback = originalSettings.jsonpCallback;
							oldCallbacks.push(callbackName);
						}
						if (responseContainer && isFunction(overwritten)) overwritten(responseContainer[0]);
						responseContainer = overwritten = void 0;
					});
					return "script";
				}
			});
			support.createHTMLDocument = (function() {
				var body = document.implementation.createHTMLDocument("").body;
				body.innerHTML = "<form></form><form></form>";
				return body.childNodes.length === 2;
			})();
			jQuery.parseHTML = function(data, context, keepScripts) {
				if (typeof data !== "string") return [];
				if (typeof context === "boolean") {
					keepScripts = context;
					context = false;
				}
				var base, parsed, scripts;
				if (!context) {
					if (support.createHTMLDocument) {
						context = document.implementation.createHTMLDocument("");
						base = context.createElement("base");
						base.href = document.location.href;
						context.head.appendChild(base);
					} else context = document;
				}
				parsed = rsingleTag.exec(data);
				scripts = !keepScripts && [];
				if (parsed) return [context.createElement(parsed[1])];
				parsed = buildFragment([data], context, scripts);
				if (scripts && scripts.length) jQuery(scripts).remove();
				return jQuery.merge([], parsed.childNodes);
			};
			/**
			* Load a url into a page
			*/
			jQuery.fn.load = function(url, params, callback) {
				var selector, type, response, self = this, off = url.indexOf(" ");
				if (off > -1) {
					selector = stripAndCollapse(url.slice(off));
					url = url.slice(0, off);
				}
				if (isFunction(params)) {
					callback = params;
					params = void 0;
				} else if (params && typeof params === "object") type = "POST";
				if (self.length > 0) jQuery.ajax({
					url,
					type: type || "GET",
					dataType: "html",
					data: params
				}).done(function(responseText) {
					response = arguments;
					self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
				}).always(callback && function(jqXHR, status) {
					self.each(function() {
						callback.apply(this, response || [
							jqXHR.responseText,
							status,
							jqXHR
						]);
					});
				});
				return this;
			};
			jQuery.expr.pseudos.animated = function(elem) {
				return jQuery.grep(jQuery.timers, function(fn) {
					return elem === fn.elem;
				}).length;
			};
			jQuery.offset = { setOffset: function(elem, options, i) {
				var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
				if (position === "static") elem.style.position = "relative";
				curOffset = curElem.offset();
				curCSSTop = jQuery.css(elem, "top");
				curCSSLeft = jQuery.css(elem, "left");
				calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
				if (calculatePosition) {
					curPosition = curElem.position();
					curTop = curPosition.top;
					curLeft = curPosition.left;
				} else {
					curTop = parseFloat(curCSSTop) || 0;
					curLeft = parseFloat(curCSSLeft) || 0;
				}
				if (isFunction(options)) options = options.call(elem, i, jQuery.extend({}, curOffset));
				if (options.top != null) props.top = options.top - curOffset.top + curTop;
				if (options.left != null) props.left = options.left - curOffset.left + curLeft;
				if ("using" in options) options.using.call(elem, props);
				else curElem.css(props);
			} };
			jQuery.fn.extend({
				offset: function(options) {
					if (arguments.length) return options === void 0 ? this : this.each(function(i) {
						jQuery.offset.setOffset(this, options, i);
					});
					var rect, win, elem = this[0];
					if (!elem) return;
					if (!elem.getClientRects().length) return {
						top: 0,
						left: 0
					};
					rect = elem.getBoundingClientRect();
					win = elem.ownerDocument.defaultView;
					return {
						top: rect.top + win.pageYOffset,
						left: rect.left + win.pageXOffset
					};
				},
				position: function() {
					if (!this[0]) return;
					var offsetParent, offset, doc, elem = this[0], parentOffset = {
						top: 0,
						left: 0
					};
					if (jQuery.css(elem, "position") === "fixed") offset = elem.getBoundingClientRect();
					else {
						offset = this.offset();
						doc = elem.ownerDocument;
						offsetParent = elem.offsetParent || doc.documentElement;
						while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") offsetParent = offsetParent.parentNode;
						if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
							parentOffset = jQuery(offsetParent).offset();
							parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
							parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
						}
					}
					return {
						top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
						left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
					};
				},
				offsetParent: function() {
					return this.map(function() {
						var offsetParent = this.offsetParent;
						while (offsetParent && jQuery.css(offsetParent, "position") === "static") offsetParent = offsetParent.offsetParent;
						return offsetParent || documentElement;
					});
				}
			});
			jQuery.each({
				scrollLeft: "pageXOffset",
				scrollTop: "pageYOffset"
			}, function(method, prop) {
				var top = "pageYOffset" === prop;
				jQuery.fn[method] = function(val) {
					return access(this, function(elem, method, val) {
						var win;
						if (isWindow(elem)) win = elem;
						else if (elem.nodeType === 9) win = elem.defaultView;
						if (val === void 0) return win ? win[prop] : elem[method];
						if (win) win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
						else elem[method] = val;
					}, method, val, arguments.length);
				};
			});
			jQuery.each(["top", "left"], function(_i, prop) {
				jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
					if (computed) {
						computed = curCSS(elem, prop);
						return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
					}
				});
			});
			jQuery.each({
				Height: "height",
				Width: "width"
			}, function(name, type) {
				jQuery.each({
					padding: "inner" + name,
					content: type,
					"": "outer" + name
				}, function(defaultExtra, funcName) {
					jQuery.fn[funcName] = function(margin, value) {
						var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
						return access(this, function(elem, type, value) {
							var doc;
							if (isWindow(elem)) return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
							if (elem.nodeType === 9) {
								doc = elem.documentElement;
								return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
							}
							return value === void 0 ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
						}, type, chainable ? margin : void 0, chainable);
					};
				});
			});
			jQuery.each([
				"ajaxStart",
				"ajaxStop",
				"ajaxComplete",
				"ajaxError",
				"ajaxSuccess",
				"ajaxSend"
			], function(_i, type) {
				jQuery.fn[type] = function(fn) {
					return this.on(type, fn);
				};
			});
			jQuery.fn.extend({
				bind: function(types, data, fn) {
					return this.on(types, null, data, fn);
				},
				unbind: function(types, fn) {
					return this.off(types, null, fn);
				},
				delegate: function(selector, types, data, fn) {
					return this.on(types, selector, data, fn);
				},
				undelegate: function(selector, types, fn) {
					return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
				},
				hover: function(fnOver, fnOut) {
					return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
				}
			});
			jQuery.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(_i, name) {
				jQuery.fn[name] = function(data, fn) {
					return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
				};
			});
			var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
			jQuery.proxy = function(fn, context) {
				var tmp, args, proxy;
				if (typeof context === "string") {
					tmp = fn[context];
					context = fn;
					fn = tmp;
				}
				if (!isFunction(fn)) return;
				args = slice.call(arguments, 2);
				proxy = function() {
					return fn.apply(context || this, args.concat(slice.call(arguments)));
				};
				proxy.guid = fn.guid = fn.guid || jQuery.guid++;
				return proxy;
			};
			jQuery.holdReady = function(hold) {
				if (hold) jQuery.readyWait++;
				else jQuery.ready(true);
			};
			jQuery.isArray = Array.isArray;
			jQuery.parseJSON = JSON.parse;
			jQuery.nodeName = nodeName;
			jQuery.isFunction = isFunction;
			jQuery.isWindow = isWindow;
			jQuery.camelCase = camelCase;
			jQuery.type = toType;
			jQuery.now = Date.now;
			jQuery.isNumeric = function(obj) {
				var type = jQuery.type(obj);
				return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
			};
			jQuery.trim = function(text) {
				return text == null ? "" : (text + "").replace(rtrim, "$1");
			};
			if (typeof define === "function" && define.amd) define("jquery", [], function() {
				return jQuery;
			});
			var _jQuery = window.jQuery, _$ = window.$;
			jQuery.noConflict = function(deep) {
				if (window.$ === jQuery) window.$ = _$;
				if (deep && window.jQuery === jQuery) window.jQuery = _jQuery;
				return jQuery;
			};
			if (typeof noGlobal === "undefined") window.jQuery = window.$ = jQuery;
			return jQuery;
		});
	}));

//#endregion
//#region ../../node_modules/.pnpm/webext-patterns@3.0.0/node_modules/webext-patterns/distribution/index.js
var import_jquery = /* @__PURE__ */ __toESM(require_jquery(), 1);
	const patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;
	const isFirefox = globalThis.navigator?.userAgent.includes("Firefox/");
	const allStarsRegex = isFirefox ? /^(https?|wss?):[/][/][^/]+([/].*)?$/ : /^https?:[/][/][^/]+([/].*)?$/;
	const allUrlsRegex = /^(https?|file|ftp):[/]+/;
	function assertValidPattern(matchPattern) {
		if (!isValidPattern(matchPattern)) throw new Error(matchPattern + " is an invalid pattern. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns for more info.");
	}
	function isValidPattern(matchPattern) {
		return matchPattern === "<all_urls>" || patternValidationRegex.test(matchPattern);
	}
	function getRawPatternRegex(matchPattern) {
		assertValidPattern(matchPattern);
		let [, protocol, host = "", pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);
		protocol = protocol.replace("*", isFirefox ? "(https?|wss?)" : "https?").replaceAll(/[/]/g, "[/]");
		if (host === "*") host = "[^/]+";
		host &&= host.replace(/^[*][.]/, "([^/]+.)*").replaceAll(/[.]/g, "[.]").replace(/[*]$/, "[^.]+");
		pathname = pathname.replaceAll(/[/]/g, "[/]").replaceAll(/[.]/g, "[.]").replaceAll(/[*]/g, ".*");
		return "^" + protocol + host + "(" + pathname + ")?$";
	}
	function patternToRegex(...matchPatterns) {
		if (matchPatterns.length === 0) return /$./;
		if (matchPatterns.includes("<all_urls>")) return allUrlsRegex;
		if (matchPatterns.includes("*://*/*")) return allStarsRegex;
		return new RegExp(matchPatterns.map((x) => getRawPatternRegex(x)).join("|"));
	}

//#endregion
//#region shared/v2ex-domains.ts
	var V2EX_DOMAINS;
	var init_v2ex_domains = __esmMin((() => {
		V2EX_DOMAINS = [
			"v2ex.com",
			"www.v2ex.com",
			"cn.v2ex.com",
			"jp.v2ex.com",
			"de.v2ex.com",
			"us.v2ex.com",
			"hk.v2ex.com",
			"global.v2ex.com",
			"fast.v2ex.com",
			"s.v2ex.com",
			"origin.v2ex.com",
			"edge.v2ex.com",
			"staging.v2ex.com",
			"global.v2ex.co"
		];
	}));

//#endregion
//#region src/constants.ts
	var EXTENSION_NAME, PendingOptionsMenuStorageKey, HOT_TOPICS_API_URL, emojiLinks, emoticons, MIN_TOPIC_PAGE_WIDTH, imgurClientIdPool, defaultOptions;
	var init_constants = __esmMin((() => {
		init_v2ex_domains();
		EXTENSION_NAME = "V2EX_Polish";
		PendingOptionsMenuStorageKey = "__v2p-pending-options-menu";
		HOT_TOPICS_API_URL = "https://v2ex-hot-topics.leokudev.workers.dev/hot-topics";
		emojiLinks = {
			["[脱单doge]"]: {
				ld: "https://i.imgur.com/L62ZP7V.png",
				hd: "https://i.imgur.com/3mPhudo.png"
			},
			["[doge]"]: {
				ld: "https://i.imgur.com/agAJ0Rd.png",
				hd: "https://i.imgur.com/HZL0hOa.png"
			},
			["[辣眼睛]"]: {
				ld: "https://i.imgur.com/n119Wvk.png",
				hd: "https://i.imgur.com/A5WXoZJ.png"
			},
			["[疑惑]"]: {
				ld: "https://i.imgur.com/U3hKhrT.png",
				hd: "https://i.imgur.com/3gCygBS.png"
			},
			["[捂脸]"]: {
				ld: "https://i.imgur.com/14cwgsI.png",
				hd: "https://i.imgur.com/fLp3t8s.png"
			},
			["[哦呼]"]: {
				ld: "https://i.imgur.com/km62MY2.png",
				hd: "https://i.imgur.com/CXXgF4E.png"
			},
			["[傲娇]"]: {
				ld: "https://i.imgur.com/TkdeN49.png",
				hd: "https://i.imgur.com/m7IlCrD.png"
			},
			["[思考]"]: {
				ld: "https://i.imgur.com/MAyk5GN.png",
				hd: "https://i.imgur.com/eRJTCx7.png"
			},
			["[吃瓜]"]: {
				ld: "https://i.imgur.com/Ug1iMq4.png",
				hd: "https://i.imgur.com/Gy3nwkC.png"
			},
			["[无语]"]: {
				ld: "https://i.imgur.com/e1q9ScT.png",
				hd: "https://i.imgur.com/wMfcBqD.png"
			},
			["[大哭]"]: {
				ld: "https://i.imgur.com/YGIx7lh.png",
				hd: "https://i.imgur.com/SNHJxtv.png"
			},
			["[酸了]"]: {
				ld: "https://i.imgur.com/5FDsp6L.png",
				hd: "https://i.imgur.com/wnQBodT.png"
			},
			["[打call]"]: {
				ld: "https://i.imgur.com/pmNOo2w.png",
				hd: "https://i.imgur.com/4GfTlV0.png"
			},
			["[歪嘴]"]: {
				ld: "https://i.imgur.com/XzEYBoY.png",
				hd: "https://i.imgur.com/84ycU43.png"
			},
			["[星星眼]"]: {
				ld: "https://i.imgur.com/2spsghH.png",
				hd: "https://i.imgur.com/oEIJRru.png"
			},
			["[OK]"]: {
				ld: "https://i.imgur.com/6DMydmQ.png",
				hd: "https://i.imgur.com/PE2dyjY.png"
			},
			["[跪了]"]: {
				ld: "https://i.imgur.com/TYtySHv.png",
				hd: "https://i.imgur.com/0pjsMf0.png"
			},
			["[响指]"]: {
				ld: "https://i.imgur.com/Ac88cMm.png",
				hd: "https://i.imgur.com/nkoevMu.png"
			},
			["[调皮]"]: {
				ld: "https://i.imgur.com/O6ZZSLk.png",
				hd: "https://i.imgur.com/ggHTLzH.png"
			},
			["[笑哭]"]: {
				ld: "https://i.imgur.com/NIvxivj.png",
				hd: "https://i.imgur.com/h8edr5G.png"
			},
			["[嗑瓜子]"]: {
				ld: "https://i.imgur.com/rjR4rdr.png",
				hd: "https://i.imgur.com/GMzq0tq.png"
			},
			["[喜极而泣]"]: {
				ld: "https://i.imgur.com/N9E3iZ2.png",
				hd: "https://i.imgur.com/L1N27tb.png"
			},
			["[惊讶]"]: {
				ld: "https://i.imgur.com/aptfuiN.png",
				hd: "https://i.imgur.com/cuzxGOI.png"
			},
			["[给心心]"]: {
				ld: "https://i.imgur.com/4aXVwxJ.png",
				hd: "https://i.imgur.com/q663Mor.png"
			},
			["[呆]"]: {
				ld: "https://i.imgur.com/c1Q76Cd.png",
				hd: "https://i.imgur.com/xMXlmxm.png"
			},
			["[哭惹R]"]: {
				ld: "https://i.imgur.com/HgxsUD2.png",
				hd: "https://i.imgur.com/0aOdQJd.png"
			},
			["[哇R]"]: {
				ld: "https://i.imgur.com/OZySWIG.png",
				hd: "https://i.imgur.com/ngoi2I6.png"
			},
			["[汗颜R]"]: {
				ld: "https://i.imgur.com/jrVZoLi.png",
				hd: "https://i.imgur.com/O8alqc1.png"
			},
			["[害羞R]"]: {
				ld: "https://i.imgur.com/OVQjxIr.png",
				hd: "https://i.imgur.com/1PeoVR5.png"
			},
			["[萌萌哒R]"]: {
				ld: "https://i.imgur.com/Ue1kikn.png",
				hd: "https://i.imgur.com/vOHzwus.png"
			},
			["[偷笑R]"]: {
				ld: "https://i.imgur.com/aF7QiE5.png",
				hd: "https://i.imgur.com/WneGpK9.png"
			},
			["[买爆R]"]: {
				ld: "https://i.imgur.com/2JhZFtb.png",
				hd: "https://i.imgur.com/za9t585.png"
			},
			["[色色R]"]: {
				ld: "https://i.imgur.com/ZA1jRv1.png",
				hd: "https://i.imgur.com/mEGRKJy.png"
			},
			["[抠鼻R]"]: {
				ld: "https://i.imgur.com/pYtTFnj.png",
				hd: "https://i.imgur.com/ErnQrMJ.png"
			},
			["[黑薯问号R]"]: {
				ld: "https://i.imgur.com/aCjmFLD.png",
				hd: "https://i.imgur.com/i4Wgtyv.png"
			},
			["[扶墙R]"]: {
				ld: "https://i.imgur.com/RV7y6tR.png",
				hd: "https://i.imgur.com/PjhjZsJ.png"
			},
			["[鄙视R]"]: {
				ld: "https://i.imgur.com/LaO5dh3.png",
				hd: "https://i.imgur.com/StrGaFx.png"
			},
			["[蹲R]"]: {
				ld: "https://i.imgur.com/t876WSv.png",
				hd: "https://i.imgur.com/jdTq0YI.png"
			},
			["[庆祝R]"]: {
				ld: "https://i.imgur.com/wQw2kD0.png",
				hd: "https://i.imgur.com/lx6jrkm.png"
			},
			["[六R]"]: {
				ld: "https://i.imgur.com/JqoC4L5.png",
				hd: "https://i.imgur.com/cUVWKc2.png"
			},
			["[可R]"]: {
				ld: "https://i.imgur.com/I70yy88.png",
				hd: "https://i.imgur.com/nRgXwUT.png"
			},
			["[加一R]"]: {
				ld: "https://i.imgur.com/hpVvbVh.png",
				hd: "https://i.imgur.com/abBCCK9.png"
			}
		};
		emoticons = [
			{
				title: "流行",
				list: [
					"[doge]",
					"[脱单doge]",
					"[打call]",
					"[星星眼]",
					"[吃瓜]",
					"[OK]",
					"[哦呼]",
					"[思考]",
					"[疑惑]",
					"[辣眼睛]",
					"[傲娇]",
					"[捂脸]",
					"[无语]",
					"[大哭]",
					"[酸了]",
					"[歪嘴]",
					"[调皮]",
					"[笑哭]",
					"[嗑瓜子]",
					"[喜极而泣]",
					"[惊讶]",
					"[给心心]",
					"[呆]",
					"[跪了]",
					"[响指]",
					"[哇R]",
					"[萌萌哒R]",
					"[害羞R]",
					"[偷笑R]",
					"[哭惹R]",
					"[汗颜R]",
					"[色色R]",
					"[抠鼻R]",
					"[鄙视R]",
					"[买爆R]",
					"[黑薯问号R]",
					"[扶墙R]",
					"[蹲R]",
					"[可R]",
					"[六R]",
					"[加一R]",
					"[庆祝R]"
				]
			},
			{
				title: "小黄脸",
				list: [
					"😀",
					"😁",
					"😂",
					"🤣",
					"😅",
					"😊",
					"😋",
					"😘",
					"🥰",
					"😗",
					"🤩",
					"🤔",
					"🤨",
					"😐",
					"😑",
					"🙄",
					"😏",
					"😪",
					"😫",
					"🥱",
					"😜",
					"😒",
					"😔",
					"😨",
					"😰",
					"😱",
					"🥵",
					"😡",
					"🥳",
					"🥺",
					"🤭",
					"🧐",
					"😎",
					"🤓",
					"😭",
					"🤑",
					"🤮"
				]
			},
			{
				title: "手势",
				list: [
					"🙋",
					"🙎",
					"🙅",
					"🙇",
					"🤷",
					"🤏",
					"👉",
					"✌️",
					"🤘",
					"🤙",
					"👌",
					"🤌",
					"👍",
					"👎",
					"👋",
					"🤝",
					"🙏",
					"👏"
				]
			},
			{
				title: "庆祝",
				list: [
					"✨",
					"🎉",
					"🎊"
				]
			},
			{
				title: "其他",
				list: [
					"👻",
					"🤡",
					"🐔",
					"👀",
					"💩",
					"🐴",
					"🦄",
					"🐧",
					"🐶",
					"🐒",
					"🙈",
					"🙉",
					"🙊",
					"🐵"
				]
			}
		];
		MIN_TOPIC_PAGE_WIDTH = 1200;
		imgurClientIdPool = [
			"3107b9ef8b316f3",
			"442b04f26eefc8a",
			"59cfebe717c09e4",
			"60605aad4a62882",
			"6c65ab1d3f5452a",
			"83e123737849aa9",
			"9311f6be1c10160",
			"c4a4a563f698595",
			"81be04b9e4a08ce"
		];
		defaultOptions = {
			topic: { openMode: "default" },
			autoCheckIn: { enabled: true },
			theme: { autoSwitch: false },
			reply: {
				preload: "auto",
				layout: "vertical"
			},
			replyContent: {
				autoFold: true,
				hideReplyTime: true,
				hideRefName: true,
				showImgInPage: true
			},
			nestedReply: {
				display: "indent",
				multipleInsideOne: "nested"
			},
			userTag: { display: "inline" },
			contextMenu: { enabled: true },
			font: { type: "system" },
			topicFilter: {
				version: 1,
				enabled: false,
				quick: {
					titleKeywords: [],
					nodes: []
				},
				advanced: {
					enabled: false,
					rules: []
				}
			}
		};
	}));

//#endregion
//#region src/contents/page-type.ts
/**
	* 页面类型的首帧标记。
	*
	* 部分布局规则必须在首帧就生效（例如窄窗口下主题页的右侧栏直接收起），
	* 而页面类型只能由脚本判断，因此由 theme-boot 在 document_start 阶段给
	* <html> 打上标记，样式与业务脚本都据此判断。
	*/
	/** 页面类型标记属性，对应样式中的 `:root[data-v2p-page='topic']`。 */
	const PAGE_ATTRIBUTE = "data-v2p-page";
	/** 判断路径是否为主题页。 */
	function isTopicPath(pathname) {
		return pathname.startsWith("/t/");
	}
	/** 标记页面类型，需在 document_start 阶段调用。 */
	function markPageType() {
		if (isTopicPath(window.location.pathname)) document.documentElement.setAttribute(PAGE_ATTRIBUTE, "topic");
	}

//#endregion
//#region src/contents/preview-frame.ts
/** 判断查询字符串是否表示本扩展的预览弹窗。 */
	function isPreviewSearch(search) {
		return new URLSearchParams(search).get(PREVIEW_QUERY) === "1";
	}
	/** 计算当前环境应使用的预览帧标记，普通页面返回 null。 */
	function resolvePreviewFrameMode({ embedded, search }) {
		if (isPreviewSearch(search)) return "1";
		return embedded ? "embed" : null;
	}
	/** 为预览帧打上标记，需在 document_start 阶段调用。 */
	function markPreviewFrame() {
		const mode = resolvePreviewFrameMode({
			embedded: window.top !== window,
			search: window.location.search
		});
		if (mode) document.documentElement.setAttribute(PREVIEW_ATTRIBUTE, mode);
	}
	var PREVIEW_QUERY, PREVIEW_ATTRIBUTE;
	var init_preview_frame = __esmMin((() => {
		PREVIEW_QUERY = "v2p-preview";
		PREVIEW_ATTRIBUTE = "data-v2p-preview";
	}));

//#endregion
//#region src/contents/boot-markers.ts
/**
	* document_start 阶段的首帧标记入口。
	*
	* 扩展（theme-boot）与用户脚本入口共用同一套标记，避免缺少某一个入口时
	* 页面在不同分发形态下出现不同的首帧布局。
	*/
	init_preview_frame();
	/** 应用全部首帧标记：预览帧与页面类型。 */
	function markBootState() {
		markPreviewFrame();
		markPageType();
	}

//#endregion
//#region src/utils/env.ts
/**
	* 获取用户的操作系统。
	*/
	function getOS() {
		const userAgent = window.navigator.userAgent.toLowerCase();
		const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
		const windowsPlatforms = /(win32|win64|windows|wince)/i;
		const iosPlatforms = /(iphone|ipad|ipod)/i;
		let os = null;
		if (macosPlatforms.test(userAgent)) os = "macos";
		else if (iosPlatforms.test(userAgent)) os = "ios";
		else if (windowsPlatforms.test(userAgent)) os = "windows";
		else if (userAgent.includes("android")) os = "android";
		else if (userAgent.includes("linux")) os = "linux";
		return os;
	}
	/**
	* 检查运行在哪个扩展中。
	*/
	function getRunEnv() {
		if (typeof chrome === "object" && (typeof chrome.extension !== "undefined" || typeof chrome.runtime?.id === "string")) return "chrome";
		if (typeof browser === "object" && (typeof browser.extension !== "undefined" || typeof browser.runtime?.id === "string")) return "web-ext";
		return null;
	}
	/**
	* 判断当前运行环境是否为浏览器扩展。
	*/
	function isBrowserExtension() {
		const runEnv = getRunEnv();
		return runEnv === "chrome" || runEnv === "web-ext";
	}
	/**
	* 判断当前是否为移动端
	* 通过检查 `#site-header` 元素是否存在来判断
	* @returns 是否为移动端
	*/
	function isMobileView() {
		return $("#site-header").length > 0;
	}
	var V2EX_ORIGIN;
	var init_env = __esmMin((() => {
		V2EX_ORIGIN = typeof window !== "undefined" && /v2ex\.(com|co)/.test(window.location.origin) ? window.location.origin : "https://www.v2ex.com";
	}));

//#endregion
//#region src/runtime/extension.ts
	function getArea(area) {
		return area === "sync" ? chrome.storage.sync : chrome.storage.local;
	}
	var storage$1, extensionRuntime;
	var init_extension = __esmMin((() => {
		init_constants();
		storage$1 = {
			get(area) {
				return getArea(area).get();
			},
			async set(area, items) {
				await getArea(area).set(items);
			},
			async remove(area, keys) {
				await getArea(area).remove(keys);
			},
			getBytesInUse(area, keys) {
				return getArea(area).getBytesInUse(keys);
			},
			subscribe(listener) {
				const handleChanges = (changes, area) => {
					if (area === "sync" || area === "local") listener(area, changes);
				};
				chrome.storage.onChanged.addListener(handleChanges);
				return () => {
					chrome.storage.onChanged.removeListener(handleChanges);
				};
			}
		};
		extensionRuntime = {
			kind: "extension",
			isBrowserExtension: true,
			storage: storage$1,
			ui: {
				openOptions(section) {
					if (section) chrome.storage.local.set({ [PendingOptionsMenuStorageKey]: section });
					chrome.runtime.sendMessage({ ["showOptions"]: true });
				},
				openControlCenter() {},
				openUrl(url, options = {}) {
					if (options.newTab === false) window.location.assign(url);
					else window.open(url, "_blank", options.active === false ? "noopener,noreferrer" : void 0);
				}
			},
			executeInPage(expression) {
				return new Function(`"use strict"; ${expression}`)();
			},
			registerMenuCommand() {}
		};
	}));

//#endregion
//#region src/runtime/userscript.ts
	function storageKey(area, key) {
		return `${STORAGE_PREFIX}:${area}:${key}`;
	}
	function parseStoredValue(raw) {
		if (raw === void 0 || raw === null || raw === "") return;
		if (typeof raw !== "string") return raw;
		try {
			return JSON.parse(raw);
		} catch {
			console.warn("[V2EX Polish] GM 存储中的 JSON 无法解析，已忽略该值。");
			return;
		}
	}
	function readValue(key) {
		if (typeof GM_getValue !== "function") return;
		return parseStoredValue(GM_getValue(key));
	}
	async function writeValue(key, value) {
		if (typeof GM_setValue !== "function") throw new Error("当前用户脚本管理器不支持 GM_setValue，无法保存设置");
		await GM_setValue(key, JSON.stringify(value));
	}
	function deleteValue(key) {
		if (typeof GM_deleteValue === "function") GM_deleteValue(key);
	}
	function emitStorageChanges(area, changes) {
		for (const subscriber of subscribers) subscriber(area, changes);
	}
	function ensureGMSubscription() {
		if (unsubscribeGM || typeof GM_addValueChangeListener !== "function") return;
		const listenerIds = [];
		for (const [area, keys] of STORAGE_AREA_ENTRIES) for (const key of keys) {
			const prefixedKey = storageKey(area, key);
			const listenerId = GM_addValueChangeListener(prefixedKey, (_name, oldValue, newValue) => {
				window.__V2P_StorageCache = void 0;
				emitStorageChanges(area, { [key]: {
					oldValue: parseStoredValue(oldValue),
					newValue: parseStoredValue(newValue)
				} });
			});
			if (typeof listenerId === "number") listenerIds.push(listenerId);
		}
		unsubscribeGM = () => {
			if (typeof GM_removeValueChangeListener !== "function") return;
			for (const listenerId of listenerIds) GM_removeValueChangeListener(listenerId);
		};
	}
	var STORAGE_PREFIX, STORAGE_AREA_KEYS, STORAGE_AREA_ENTRIES, AREA_BY_KEY, subscribers, unsubscribeGM, storage, userscriptRuntime;
	var init_userscript = __esmMin((() => {
		STORAGE_PREFIX = "v2p:v1";
		STORAGE_AREA_KEYS = {
			sync: [
				"settings-sync",
				"options",
				"reading-list"
			],
			local: [
				"api",
				"daily",
				"member-tag"
			]
		};
		STORAGE_AREA_ENTRIES = Object.entries(STORAGE_AREA_KEYS);
		AREA_BY_KEY = new Map(STORAGE_AREA_ENTRIES.flatMap(([area, keys]) => keys.map((key) => [key, area])));
		subscribers = /* @__PURE__ */ new Set();
		;
		storage = {
			get(area) {
				const items = {};
				for (const key of STORAGE_AREA_KEYS[area]) {
					const value = readValue(storageKey(area, key));
					if (value !== void 0) Object.assign(items, { [key]: value });
				}
				return Promise.resolve(items);
			},
			async set(area, items) {
				const entries = Object.entries(items);
				const changes = {};
				for (const [key, value] of entries) {
					const expectedArea = AREA_BY_KEY.get(key);
					if (expectedArea !== void 0 && expectedArea !== area) throw new Error(`存储键 ${key} 不属于 ${area} 存储区`);
					const prefixedKey = storageKey(area, key);
					const oldValue = readValue(prefixedKey);
					await writeValue(prefixedKey, value);
					changes[key] = {
						oldValue,
						newValue: value
					};
				}
				window.__V2P_StorageCache = void 0;
				emitStorageChanges(area, changes);
			},
			remove(area, keys) {
				const changes = {};
				for (const key of keys) {
					const prefixedKey = storageKey(area, key);
					const oldValue = readValue(prefixedKey);
					deleteValue(prefixedKey);
					changes[key] = {
						oldValue,
						newValue: void 0
					};
				}
				window.__V2P_StorageCache = void 0;
				emitStorageChanges(area, changes);
				return Promise.resolve();
			},
			getBytesInUse(area, keys = STORAGE_AREA_KEYS[area]) {
				let bytes = 0;
				for (const key of keys) {
					const value = readValue(storageKey(area, key));
					if (value !== void 0) bytes += new TextEncoder().encode(JSON.stringify(value)).byteLength;
				}
				return Promise.resolve(bytes);
			},
			subscribe(listener) {
				subscribers.add(listener);
				ensureGMSubscription();
				return () => {
					subscribers.delete(listener);
					if (subscribers.size === 0) {
						unsubscribeGM?.();
						unsubscribeGM = void 0;
					}
				};
			}
		};
		userscriptRuntime = {
			kind: "userscript",
			isBrowserExtension: false,
			storage,
			ui: {
				openOptions(section) {
					window.dispatchEvent(new CustomEvent("v2p:open-options", { detail: { section } }));
				},
				openControlCenter(tab) {
					window.dispatchEvent(new CustomEvent("v2p:open-control-center", { detail: { tab } }));
				},
				openUrl(url, options = {}) {
					if (options.newTab === false) window.location.assign(url);
					else window.open(url, "_blank", options.active === false ? "noopener,noreferrer" : void 0);
				}
			},
			executeInPage(expression) {
				const PageFunction = (typeof unsafeWindow === "undefined" ? window : unsafeWindow).Function;
				return new PageFunction(`"use strict"; ${expression}`)();
			},
			registerMenuCommand(label, callback) {
				if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand(label, callback);
			}
		};
	}));

//#endregion
//#region src/runtime/index.ts
	function setRuntime(nextRuntime) {
		runtime = nextRuntime;
	}
	function getRuntime() {
		runtime ??= isBrowserExtension() ? extensionRuntime : userscriptRuntime;
		return runtime;
	}
	var runtime;
	var init_runtime = __esmMin((() => {
		init_env();
		init_extension();
		init_userscript();
		;
	}));

//#endregion
//#region src/theme-state.ts
	function isThemeType(value) {
		return typeof value === "string" && THEME_TYPES.includes(value);
	}
	function isFontType(value) {
		return typeof value === "string" && FONT_TYPES.includes(value);
	}
	function isNestedDisplay(value) {
		return typeof value === "string" && NESTED_DISPLAYS.includes(value);
	}
	function normalizeSnapshot(value) {
		if (!value || typeof value !== "object") return null;
		const record = value;
		if (!isThemeType(record.themeType) || !isFontType(record.fontType)) return null;
		return {
			themeType: record.themeType,
			autoSwitch: record.autoSwitch === true,
			mode: record.mode === "compact" ? "compact" : "default",
			fontType: record.fontType,
			nestedDisplay: isNestedDisplay(record.nestedDisplay) ? record.nestedDisplay : "indent"
		};
	}
	/**
	* 从用户配置中提取首屏需要的最小快照。
	*/
	function getThemeBootSnapshot(options) {
		const theme = options?.theme;
		return {
			themeType: isThemeType(theme?.type) ? theme.type : "light-default",
			autoSwitch: theme?.autoSwitch === true,
			mode: theme?.mode === "compact" ? "compact" : "default",
			fontType: isFontType(options?.font?.type) ? options.font.type : "system",
			nestedDisplay: isNestedDisplay(options?.nestedReply?.display) ? options.nestedReply.display : "indent"
		};
	}
	/**
	* 读取首屏主题缓存。缓存不可用时返回 null，由 storage 或默认值兜底。
	*/
	function readThemeBootSnapshot() {
		try {
			const value = window.localStorage.getItem(THEME_BOOT_STORAGE_KEY);
			return value ? normalizeSnapshot(JSON.parse(value)) : null;
		} catch {
			return null;
		}
	}
	/**
	* 写入首屏主题缓存。
	*
	* 注意：options 页面运行在 `chrome-extension://` origin，不能直接写 V2EX
	* 页面的 localStorage。该函数只应在 V2EX 页面的 content script 中调用。
	*/
	function writeThemeBootSnapshot(snapshot) {
		try {
			const value = JSON.stringify(snapshot);
			if (window.localStorage.getItem(THEME_BOOT_STORAGE_KEY) === value) return;
			window.localStorage.setItem(THEME_BOOT_STORAGE_KEY, value);
		} catch {}
	}
	function writeThemeBootSnapshotFromOptions(options) {
		writeThemeBootSnapshot(getThemeBootSnapshot(options));
	}
	/**
	* 用页面加载时读取的权威配置校准楼中楼显示方式。
	*
	* 楼中楼的 DOM 结构只在加载时生成一次，之后的设置变更需刷新页面才会生效，
	* 因此只校准一次，避免样式与已生成的 DOM 结构不一致。
	*/
	function calibrateNestedDisplay(display) {
		if (nestedDisplayCalibrated) return;
		nestedDisplayCalibrated = true;
		setNestedDisplay(display);
	}
	/**
	* 从当前运行时存储读取一次首屏配置，并限制等待时间。
	*
	* 正常情况下缓存会命中；这里用于首次安装、缓存缺失或缓存过期的校准。
	*/
	async function readThemeBootOptions(timeoutMs = 120) {
		let timer;
		try {
			const options = await Promise.race([getRuntime().storage.get("sync").then((items) => {
				return items["options"];
			}), new Promise((resolve) => {
				timer = setTimeout(() => resolve(null), timeoutMs);
			})]);
			return options ? getThemeBootSnapshot(options) : null;
		} catch {
			return null;
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	/**
	* 将主题应用到 html 和 body。
	*
	* html 上的属性负责首帧颜色和背景，body 类保留给现有的布局规则。
	*/
	function setThemeType(type) {
		const root = document.documentElement;
		root.dataset[THEME_ATTRIBUTE] = type;
		root.style.colorScheme = type === "dark-default" ? "dark" : "light";
		if (!document.body) return;
		for (const className of [...document.body.classList]) if (className.startsWith(THEME_CLASS_PREFIX)) document.body.classList.remove(className);
		document.body.classList.add(`${THEME_CLASS_PREFIX}${type}`);
	}
	function setMode(mode) {
		document.documentElement.dataset[MODE_ATTRIBUTE] = mode;
		document.body?.classList.toggle(COMPACT_CLASS, mode === "compact");
	}
	/**
	* 将楼中楼显示方式暴露到 html 上（`data-v2p-nested="indent|align|off"`），
	* 样式据此只在插件接管楼中楼时生效；关闭时交给 V2EX 原生布局（包括站内树形缩进）。
	*/
	function setNestedDisplay(display) {
		document.documentElement.dataset[NESTED_ATTRIBUTE] = display;
	}
	function ensureFontStylesheet(id, href) {
		if (document.getElementById(id) || pendingFontStylesheets.has(id)) return;
		pendingFontStylesheets.add(id);
		const link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		/** 先以 print 媒体加载，避免自定义字体样式表阻塞首屏渲染。 */
		link.media = "print";
		link.href = href;
		link.addEventListener("load", () => {
			link.media = "all";
		}, { once: true });
		const append = () => {
			document.head?.appendChild(link);
		};
		if (document.head) {
			append();
			return;
		}
		const observer = new MutationObserver(() => {
			if (document.head) {
				observer.disconnect();
				append();
			}
		});
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true
		});
	}
	function setFontType(type) {
		document.documentElement.dataset[FONT_ATTRIBUTE] = type;
		document.body?.style.removeProperty("font-family");
		const stylesheet = FONT_STYLESHEETS[type];
		if (stylesheet) ensureFontStylesheet(stylesheet.id, stylesheet.href);
	}
	function getEffectiveThemeType(snapshot) {
		if (snapshot.autoSwitch && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark-default";
		return snapshot.themeType;
	}
	function applyBodyState() {
		if (!currentSnapshot || !document.body) return;
		setThemeType(getEffectiveThemeType(currentSnapshot));
		setMode(currentSnapshot.mode);
		syncViewportMode();
	}
	function syncViewportMode() {
		const isMobile = Boolean(document.getElementById("site-header"));
		document.body?.classList.toggle(MOBILE_CLASS, isMobile);
		if (isMobile) document.documentElement.dataset[MOBILE_ATTRIBUTE] = "true";
		else delete document.documentElement.dataset[MOBILE_ATTRIBUTE];
	}
	/**
	* 应用一份主题快照。设置 html 属性后，页面即可按正确主题显示。
	*/
	function applyThemeSnapshot(snapshot) {
		currentSnapshot = snapshot;
		setFontType(snapshot.fontType);
		setThemeType(getEffectiveThemeType(snapshot));
		setMode(snapshot.mode);
		if (!nestedDisplayCalibrated) setNestedDisplay(snapshot.nestedDisplay);
		try {
			performance.mark("v2p-theme-ready");
		} catch {}
		if (document.body) syncViewportMode();
	}
	function watchDocumentState() {
		if (document.readyState !== "loading") {
			applyBodyState();
			syncViewportMode();
			return;
		}
		const applyPendingState = () => {
			if (!bodyStateApplied && document.body) {
				applyBodyState();
				bodyStateApplied = true;
			}
			const hasMobileHeader = Boolean(document.getElementById("site-header"));
			if (!document.documentElement.dataset[MOBILE_ATTRIBUTE] && hasMobileHeader) syncViewportMode();
			if (bodyStateApplied && hasMobileHeader) {
				documentObserver?.disconnect();
				documentObserver = null;
			}
		};
		documentObserver?.disconnect();
		documentObserver = new MutationObserver(applyPendingState);
		documentObserver.observe(document.documentElement, {
			childList: true,
			subtree: true
		});
		document.addEventListener("DOMContentLoaded", () => {
			applyBodyState();
			syncViewportMode();
			documentObserver?.disconnect();
			documentObserver = null;
		}, { once: true });
	}
	function listenForColorSchemeChanges() {
		if (colorMediaListening) return;
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
			if (currentSnapshot?.autoSwitch) applyThemeSnapshot(currentSnapshot);
		});
		colorMediaListening = true;
	}
	/**
	* 首屏主题启动流程。
	*
	* 先用 localStorage 缓存立即上色；随后用短时间 storage 读取校准。
	* 缓存和 storage 都不可用时使用默认亮色主题，避免页面永久隐藏。
	*/
	async function initializeThemeBoot() {
		watchDocumentState();
		const cachedSnapshot = readThemeBootSnapshot();
		if (cachedSnapshot) applyThemeSnapshot(cachedSnapshot);
		const storedSnapshot = await readThemeBootOptions(cachedSnapshot ? 50 : 120);
		if (storedSnapshot) {
			applyThemeSnapshot(storedSnapshot);
			writeThemeBootSnapshot(storedSnapshot);
		} else if (!cachedSnapshot) applyThemeSnapshot(DEFAULT_THEME_BOOT_SNAPSHOT);
		listenForColorSchemeChanges();
	}
	var THEME_BOOT_STORAGE_KEY, THEME_ATTRIBUTE, MODE_ATTRIBUTE, FONT_ATTRIBUTE, MOBILE_ATTRIBUTE, NESTED_ATTRIBUTE, THEME_CLASS_PREFIX, COMPACT_CLASS, MOBILE_CLASS, THEME_TYPES, FONT_TYPES, NESTED_DISPLAYS, FONT_STYLESHEETS, pendingFontStylesheets, DEFAULT_THEME_BOOT_SNAPSHOT, currentSnapshot, documentObserver, bodyStateApplied, colorMediaListening, nestedDisplayCalibrated;
	var init_theme_state = __esmMin((() => {
		init_runtime();
		THEME_BOOT_STORAGE_KEY = "v2p:boot:v1";
		THEME_ATTRIBUTE = "v2pTheme";
		MODE_ATTRIBUTE = "v2pMode";
		FONT_ATTRIBUTE = "v2pFont";
		MOBILE_ATTRIBUTE = "v2pMobile";
		NESTED_ATTRIBUTE = "v2pNested";
		THEME_CLASS_PREFIX = "v2p-theme-";
		COMPACT_CLASS = "v2p-mode-compact";
		MOBILE_CLASS = "v2p-mobile";
		THEME_TYPES = [
			"light-default",
			"dark-default",
			"dawn",
			"minimalist"
		];
		FONT_TYPES = [
			"system",
			"vivoSans",
			"notoSans",
			"lxgwWenKai"
		];
		NESTED_DISPLAYS = [
			"indent",
			"align",
			"off"
		];
		FONT_STYLESHEETS = {
			notoSans: {
				id: "v2p-font-noto-sans",
				href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..900&display=swap"
			},
			lxgwWenKai: {
				id: "v2p-font-lxgw-wenkai",
				href: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css"
			}
		};
		pendingFontStylesheets = /* @__PURE__ */ new Set();
		DEFAULT_THEME_BOOT_SNAPSHOT = {
			themeType: "light-default",
			autoSwitch: false,
			mode: "default",
			fontType: "system",
			nestedDisplay: "indent"
		};
		currentSnapshot = null;
		documentObserver = null;
		bodyStateApplied = false;
		colorMediaListening = false;
		nestedDisplayCalibrated = false;
	}));

//#endregion
//#region src/user-scripts/style.ts
init_theme_state();
	const style = "@font-face{font-family:vivoSans;font-weight:400;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/vivoSans-Regular.woff2\") format(\"woff2\")}@font-face{font-family:vivoSans;font-weight:500;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/vivoSans-Medium.woff2\") format(\"woff2\")}@font-face{font-family:vivoSans;font-weight:600;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/vivoSans-SemiBold.woff2\") format(\"woff2\")}@font-face{font-family:vivoSans;font-weight:700;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/vivoSans-Bold.woff2\") format(\"woff2\")}@font-face{font-family:MapleMono;font-weight:400;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/MapleMonoNormalNL-Regular.woff2\") format(\"woff2\")}@font-face{font-family:MapleMono;font-weight:500;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/MapleMonoNormalNL-Medium.woff2\") format(\"woff2\")}@font-face{font-family:MapleMono;font-weight:600;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/MapleMonoNormalNL-SemiBold.woff2\") format(\"woff2\")}@font-face{font-family:MapleMono;font-weight:700;font-style:normal;font-display:swap;src:url(\"https://assets.leoku.dev/fonts/MapleMonoNormalNL-Bold.woff2\") format(\"woff2\")}:root{--zidx-search: 100;--zidx-tabs: 10;--zidx-tools-card: 10;--zidx-reply-box: 99;--zidx-modal-header: 50;--zidx-modal-mask: 888;--zidx-toast: 999;--zidx-tip: 999;--zidx-popup: 99;--zidx-expand-mask: 10;--zidx-expand-btn: 20;--zidx-rightbar: 99;--v2p-spacing-box: 12px;--v2p-spacing-cell: 10px;--v2p-underline-offset: 0.5ex;--v2p-layout-column-gap: 25px;--v2p-layout-row-gap: 20px;--v2p-nav-height: 55px;--v2p-tp-item-x: 20px;--v2p-tp-item-y: 10px;--v2p-tp-tabs-pd: 10px;--v2p-tp-nested-pd: 15px;--v2p-tp-preview-pd: 20px;--v2p-emoji-size: 21px;--v2p-box-radius: 10px;--v2p-input-radius: 6px;--v2p-button-radius: 6px;--v2p-popup-radius: 6px;--v2p-content-width: 1120px;--v2p-rightbar-width: 270px;--v2p-color-main-50: #f7f9fb;--v2p-color-main-100: #f1f5f9;--v2p-color-main-150: #eaeff5;--v2p-color-main-200: #e2e8f0;--v2p-color-main-300: #cbd5e1;--v2p-color-main-350: #94a3b8cc;--v2p-color-main-400: #94a3b8;--v2p-color-main-500: #64748b;--v2p-color-main-600: #475569;--v2p-color-main-700: #334155;--v2p-color-main-800: #1e293b;--v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);--v2p-color-accent-100: oklch(95% 0.052 163.051deg);--v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);--v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);--v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);--v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);--v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);--v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);--v2p-color-orange-50: #fff7ed;--v2p-color-orange-100: #ffedd5;--v2p-color-orange-400: #fb923c;--v2p-color-background: #f2f3f5;--v2p-color-foreground: var(--v2p-color-main-800);--v2p-color-selection-foreground: var(--v2p-color-main-100);--v2p-color-selection-background: var(--v2p-color-main-700);--v2p-color-selection-background-img: var(--v2p-color-main-500);--v2p-color-font-secondary: var(--v2p-color-main-600);--v2p-color-font-tertiary: var(--v2p-color-main-500);--v2p-color-font-quaternary: var(--v2p-color-main-400);--v2p-color-button-background: var(--v2p-color-main-100);--v2p-color-button-foreground: var(--v2p-color-main-500);--v2p-color-button-background-hover: var(--v2p-color-main-200);--v2p-color-button-foreground-hover: var(--v2p-color-main-600);--v2p-color-button-border: var(--v2p-color-main-300);--v2p-color-button-special-background: var(--v2p-color-accent-50);--v2p-color-button-special-foreground: var(--v2p-color-accent-700);--v2p-color-button-special-border: var(--v2p-color-accent-600);--v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);--v2p-color-bg-content: #fff;--v2p-color-bg-footer: var(--v2p-color-bg-content);--v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);--v2p-color-bg-subtle: rgb(236 253 245 / 90%);--v2p-color-bg-input: var(--v2p-color-main-50);--v2p-color-bg-search: var(--v2p-color-main-100);--v2p-color-bg-search-active: var(--v2p-color-main-150);--v2p-color-bg-widget: rgb(255 255 255 / 70%);--v2p-color-bg-reply: var(--v2p-color-main-100);--v2p-color-bg-tooltip: var(--v2p-color-bg-content);--v2p-color-bg-tabs: var(--v2p-color-main-100);--v2p-color-bg-tpr: var(--v2p-color-main-100);--v2p-color-bg-avatar: var(--v2p-color-main-300);--v2p-color-bg-block: var(--v2p-color-main-100);--v2p-color-bg-block-darker: var(--v2p-color-main-300);--v2p-color-bg-link: var(--v2p-color-main-100);--v2p-color-bg-link-hover: var(--v2p-color-main-200);--v2p-color-bg-error: #fee2e2;--v2p-color-tabs: var(--v2p-color-foreground);--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fee2e2;--v2p-color-mask: rgb(0 0 0 / 25%);--v2p-color-divider: var(--v2p-color-main-200);--v2p-color-border: var(--v2p-color-main-200);--v2p-color-input-border: var(--v2p-color-main-300);--v2p-color-input-border-focus: var(--v2p-color-main-400);--v2p-color-border-darker: var(--v2p-color-main-300);--v2p-color-link-visited: var(--v2p-color-main-400);--v2p-color-error: #ef4444;--v2p-color-cell-num: var(--v2p-color-main-350);--v2p-color-badge: var(--v2p-color-bg-content);--v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);--v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);--v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);--color-fade: var(--v2p-color-font-secondary);--color-gray: var(--v2p-color-font-secondary);--link-color: var(--v2p-color-foreground);--link-darker-color: var(--v2p-color-main-600);--link-hover-color: var(--v2p-color-foreground);--link-caution-color: var(--v2p-color-orange-400);--link-visited-color: currentColor;--box-border-color: var(--v2p-color-border);--box-foreground-color: var(--v2p-color-foreground);--box-background-color: var(--v2p-color-bg-content);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-200);--box-border-focus-color: var(--v2p-color-main-200);--box-border-radius: var(--v2p-box-radius);--button-background-color: var(--v2p-color-button-background);--button-foreground-color: var(--v2p-color-button-foreground);--button-hover-color: var(--v2p-color-button-background-hover);--button-background-hover-color: var(--v2p-color-button-background-hover);--button-foreground-hover-color: var(--v2p-color-button-foreground-hover);--button-border-color: var(--v2p-color-main-300);--button-border-hover-color: var(--v2p-color-main-400)}:root body{--v2p-color-main-50: #f7f9fb;--v2p-color-main-100: #f1f5f9;--v2p-color-main-150: #eaeff5;--v2p-color-main-200: #e2e8f0;--v2p-color-main-300: #cbd5e1;--v2p-color-main-350: #94a3b8cc;--v2p-color-main-400: #94a3b8;--v2p-color-main-500: #64748b;--v2p-color-main-600: #475569;--v2p-color-main-700: #334155;--v2p-color-main-800: #1e293b;--v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);--v2p-color-accent-100: oklch(95% 0.052 163.051deg);--v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);--v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);--v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);--v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);--v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);--v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);--v2p-color-orange-50: #fff7ed;--v2p-color-orange-100: #ffedd5;--v2p-color-orange-400: #fb923c;--v2p-color-background: #f2f3f5;--v2p-color-foreground: var(--v2p-color-main-800);--v2p-color-selection-foreground: var(--v2p-color-main-100);--v2p-color-selection-background: var(--v2p-color-main-700);--v2p-color-selection-background-img: var(--v2p-color-main-500);--v2p-color-font-secondary: var(--v2p-color-main-600);--v2p-color-font-tertiary: var(--v2p-color-main-500);--v2p-color-font-quaternary: var(--v2p-color-main-400);--v2p-color-button-background: var(--v2p-color-main-100);--v2p-color-button-foreground: var(--v2p-color-main-500);--v2p-color-button-background-hover: var(--v2p-color-main-200);--v2p-color-button-foreground-hover: var(--v2p-color-main-600);--v2p-color-button-border: var(--v2p-color-main-300);--v2p-color-button-special-background: var(--v2p-color-accent-50);--v2p-color-button-special-foreground: var(--v2p-color-accent-700);--v2p-color-button-special-border: var(--v2p-color-accent-600);--v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);--v2p-color-bg-content: #fff;--v2p-color-bg-footer: var(--v2p-color-bg-content);--v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);--v2p-color-bg-subtle: rgb(236 253 245 / 90%);--v2p-color-bg-input: var(--v2p-color-main-50);--v2p-color-bg-search: var(--v2p-color-main-100);--v2p-color-bg-search-active: var(--v2p-color-main-150);--v2p-color-bg-widget: rgb(255 255 255 / 70%);--v2p-color-bg-reply: var(--v2p-color-main-100);--v2p-color-bg-tooltip: var(--v2p-color-bg-content);--v2p-color-bg-tabs: var(--v2p-color-main-100);--v2p-color-bg-tpr: var(--v2p-color-main-100);--v2p-color-bg-avatar: var(--v2p-color-main-300);--v2p-color-bg-block: var(--v2p-color-main-100);--v2p-color-bg-block-darker: var(--v2p-color-main-300);--v2p-color-bg-link: var(--v2p-color-main-100);--v2p-color-bg-link-hover: var(--v2p-color-main-200);--v2p-color-bg-error: #fee2e2;--v2p-color-tabs: var(--v2p-color-foreground);--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fee2e2;--v2p-color-mask: rgb(0 0 0 / 25%);--v2p-color-divider: var(--v2p-color-main-200);--v2p-color-border: var(--v2p-color-main-200);--v2p-color-input-border: var(--v2p-color-main-300);--v2p-color-input-border-focus: var(--v2p-color-main-400);--v2p-color-border-darker: var(--v2p-color-main-300);--v2p-color-link-visited: var(--v2p-color-main-400);--v2p-color-error: #ef4444;--v2p-color-cell-num: var(--v2p-color-main-350);--v2p-color-badge: var(--v2p-color-bg-content);--v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);--v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);--v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);--color-fade: var(--v2p-color-font-secondary);--color-gray: var(--v2p-color-font-secondary);--link-color: var(--v2p-color-foreground);--link-darker-color: var(--v2p-color-main-600);--link-hover-color: var(--v2p-color-foreground);--link-caution-color: var(--v2p-color-orange-400);--link-visited-color: currentColor;--box-border-color: var(--v2p-color-border);--box-foreground-color: var(--v2p-color-foreground);--box-background-color: var(--v2p-color-bg-content);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-200);--box-border-focus-color: var(--v2p-color-main-200);--box-border-radius: var(--v2p-box-radius);--button-background-color: var(--v2p-color-button-background);--button-foreground-color: var(--v2p-color-button-foreground);--button-hover-color: var(--v2p-color-button-background-hover);--button-background-hover-color: var(--v2p-color-button-background-hover);--button-foreground-hover-color: var(--v2p-color-button-foreground-hover);--button-border-color: var(--v2p-color-main-300);--button-border-hover-color: var(--v2p-color-main-400);--code-font: MapleMono, 'Consolas', 'Panic Sans', 'Bitstream Vera Sans Mono', 'Menlo', 'Microsoft Yahei', monospace;font-family:system-ui,sans-serif;color:var(--v2p-color-foreground);text-autospace:normal;background-color:var(--v2p-color-background)}:root body.v2p-theme-light-default,:root body .v2p-theme-light-default{--v2p-color-main-50: #f7f9fb;--v2p-color-main-100: #f1f5f9;--v2p-color-main-150: #eaeff5;--v2p-color-main-200: #e2e8f0;--v2p-color-main-300: #cbd5e1;--v2p-color-main-350: #94a3b8cc;--v2p-color-main-400: #94a3b8;--v2p-color-main-500: #64748b;--v2p-color-main-600: #475569;--v2p-color-main-700: #334155;--v2p-color-main-800: #1e293b;--v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);--v2p-color-accent-100: oklch(95% 0.052 163.051deg);--v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);--v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);--v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);--v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);--v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);--v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);--v2p-color-orange-50: #fff7ed;--v2p-color-orange-100: #ffedd5;--v2p-color-orange-400: #fb923c;--v2p-color-background: #f2f3f5;--v2p-color-foreground: var(--v2p-color-main-800);--v2p-color-selection-foreground: var(--v2p-color-main-100);--v2p-color-selection-background: var(--v2p-color-main-700);--v2p-color-selection-background-img: var(--v2p-color-main-500);--v2p-color-font-secondary: var(--v2p-color-main-600);--v2p-color-font-tertiary: var(--v2p-color-main-500);--v2p-color-font-quaternary: var(--v2p-color-main-400);--v2p-color-button-background: var(--v2p-color-main-100);--v2p-color-button-foreground: var(--v2p-color-main-500);--v2p-color-button-background-hover: var(--v2p-color-main-200);--v2p-color-button-foreground-hover: var(--v2p-color-main-600);--v2p-color-button-border: var(--v2p-color-main-300);--v2p-color-button-special-background: var(--v2p-color-accent-50);--v2p-color-button-special-foreground: var(--v2p-color-accent-700);--v2p-color-button-special-border: var(--v2p-color-accent-600);--v2p-color-button-special-foreground-hover: var(--v2p-color-accent-700);--v2p-color-bg-content: #fff;--v2p-color-bg-footer: var(--v2p-color-bg-content);--v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);--v2p-color-bg-subtle: rgb(236 253 245 / 90%);--v2p-color-bg-input: var(--v2p-color-main-50);--v2p-color-bg-search: var(--v2p-color-main-100);--v2p-color-bg-search-active: var(--v2p-color-main-150);--v2p-color-bg-widget: rgb(255 255 255 / 70%);--v2p-color-bg-reply: var(--v2p-color-main-100);--v2p-color-bg-tooltip: var(--v2p-color-bg-content);--v2p-color-bg-tabs: var(--v2p-color-main-100);--v2p-color-bg-tpr: var(--v2p-color-main-100);--v2p-color-bg-avatar: var(--v2p-color-main-300);--v2p-color-bg-block: var(--v2p-color-main-100);--v2p-color-bg-block-darker: var(--v2p-color-main-300);--v2p-color-bg-link: var(--v2p-color-main-100);--v2p-color-bg-link-hover: var(--v2p-color-main-200);--v2p-color-bg-error: #fee2e2;--v2p-color-tabs: var(--v2p-color-foreground);--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fee2e2;--v2p-color-mask: rgb(0 0 0 / 25%);--v2p-color-divider: var(--v2p-color-main-200);--v2p-color-border: var(--v2p-color-main-200);--v2p-color-input-border: var(--v2p-color-main-300);--v2p-color-input-border-focus: var(--v2p-color-main-400);--v2p-color-border-darker: var(--v2p-color-main-300);--v2p-color-link-visited: var(--v2p-color-main-400);--v2p-color-error: #ef4444;--v2p-color-cell-num: var(--v2p-color-main-350);--v2p-color-badge: var(--v2p-color-bg-content);--v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);--v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);--v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);--color-fade: var(--v2p-color-font-secondary);--color-gray: var(--v2p-color-font-secondary);--link-color: var(--v2p-color-foreground);--link-darker-color: var(--v2p-color-main-600);--link-hover-color: var(--v2p-color-foreground);--link-caution-color: var(--v2p-color-orange-400);--link-visited-color: currentColor;--box-border-color: var(--v2p-color-border);--box-foreground-color: var(--v2p-color-foreground);--box-background-color: var(--v2p-color-bg-content);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-200);--box-border-focus-color: var(--v2p-color-main-200);--box-border-radius: var(--v2p-box-radius);--button-background-color: var(--v2p-color-button-background);--button-foreground-color: var(--v2p-color-button-foreground);--button-hover-color: var(--v2p-color-button-background-hover);--button-background-hover-color: var(--v2p-color-button-background-hover);--button-foreground-hover-color: var(--v2p-color-button-foreground-hover);--button-border-color: var(--v2p-color-main-300);--button-border-hover-color: var(--v2p-color-main-400)}:root body #Logo{background-image:url(\"https://www.v2ex.com/static/img/v2ex@2x.png\")}:root body ::selection{color:var(--v2p-color-selection-foreground);background-color:var(--v2p-color-selection-background)}:root body img::selection{background-color:var(--v2p-color-selection-background-img)}:root[data-v2p-font=vivoSans] body{font-family:vivoSans,system-ui,sans-serif}:root[data-v2p-font=notoSans] body{font-family:\"Noto Sans SC\",system-ui,sans-serif}:root[data-v2p-font=lxgwWenKai] body{font-family:\"LXGW WenKai\",system-ui,sans-serif}:root code,:root pre,:root table{text-autospace:no-autospace}\n:root{color-scheme:light;background-color:var(--v2p-color-background)}html,body{min-height:100vh}:root[data-v2p-theme] body{visibility:visible}@keyframes v2p-boot-reveal{to{visibility:visible}}body{scrollbar-gutter:stable;overflow:auto;visibility:hidden;animation:v2p-boot-reveal 0s 800ms forwards}body.v2p-theme-light-default{visibility:visible}body h1{font-weight:bold}body a{cursor:default;text-decoration:none}body a[href]{cursor:pointer}body a:hover{text-decoration:underline 1px;text-underline-offset:var(--v2p-underline-offset)}body pre{max-width:calc(var(--v2p-content-width) - var(--v2p-rightbar-width) - 2*var(--v2p-layout-column-gap) - 24px)}body #Top{height:var(--v2p-nav-height);border:none;background-color:var(--v2p-color-bg-content)}body #Bottom{border:none;color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-bg-footer)}body #Bottom .content{flex-direction:column}body #Wrapper{background-color:inherit;background-image:none}body #Wrapper.Night{background-color:inherit;background-image:none}body #Wrapper .content{display:flex;gap:var(--v2p-layout-column-gap);max-width:var(--v2p-content-width)}#Navcol .nav_item:hover{background-color:var(--box-background-hover-color)}#Navcol .nav_item:hover:active{box-shadow:none}#Navcol .nav_item_current:hover{color:var(--box-foreground-color);background-color:var(--v2p-color-bg-content)}#Navcol .nav_item_current:active{box-shadow:none}#Rightcol #page-outline-title{background-color:var(--v2p-color-button-background-hover)}#Rightcol .page-outline-item:hover{background-color:var(--box-background-hover-color)}body #Wrapper:has(#Singleton){padding:20px 0 0}body #Wrapper:has(#Singleton) #Singleton{overflow:hidden;box-shadow:var(--v2p-box-shadow)}body #Leftbar{float:none;order:1}body #Main{flex:1;order:2;max-width:clamp(400px,92vw,1200px);margin:0}body #Rightbar{float:none;order:3;width:var(--v2p-rightbar-width);margin-right:var(--v2p-layout-column-gap)}:root[data-v2p-preview]{--v2p-rightbar-toggle-display: flex}:root[data-v2p-preview] body{min-width:450px}:root[data-v2p-preview] #Wrapper .content{gap:0;min-width:450px}:root[data-v2p-preview] #Wrapper #Main{margin:auto}:root[data-v2p-preview] #Wrapper #Rightbar{position:fixed;z-index:var(--zidx-rightbar);top:var(--v2p-layout-column-gap);right:10px;overflow-y:auto;display:none;max-height:calc(100vh - 2*var(--v2p-layout-column-gap));margin:0;padding:10px;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-content);box-shadow:var(--v2p-widget-shadow)}:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible{display:block}:root[data-v2p-preview] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box{background-color:var(--v2p-color-background);box-shadow:none}:root[data-v2p-preview] #Wrapper #Rightbar .v2p-tool-box{border:1px solid var(--v2p-color-border)}:root[data-v2p-preview=\"1\"] #Top,:root[data-v2p-preview=\"1\"] #Bottom{display:none}@media(width < 900px){:root[data-v2p-page=topic]{--v2p-rightbar-toggle-display: flex}:root[data-v2p-page=topic] #Wrapper .content{gap:0}:root[data-v2p-page=topic] #Wrapper #Main{margin:auto}:root[data-v2p-page=topic] #Wrapper #Rightbar{position:fixed;z-index:var(--zidx-rightbar);top:var(--v2p-layout-column-gap);right:10px;overflow-y:auto;display:none;max-height:calc(100vh - 2*var(--v2p-layout-column-gap));margin:0;padding:10px;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-content);box-shadow:var(--v2p-widget-shadow)}:root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible{display:block}:root[data-v2p-page=topic] #Wrapper #Rightbar.v2p-layout-rightbar-visible .box{background-color:var(--v2p-color-background);box-shadow:none}:root[data-v2p-page=topic] #Wrapper #Rightbar .v2p-tool-box{border:1px solid var(--v2p-color-border)}}body #search-container{height:30px;margin:0 30px;border:none;border-radius:var(--v2p-input-radius);background-color:var(--v2p-color-bg-search)}body #search-container::before{top:0;left:4px;opacity:.6;background-size:14px 14px;filter:none}body #search-container.active{background-color:var(--v2p-color-bg-search-active)}body #search-container #search{font-size:14px;font-weight:500}body #search-container #search-result{z-index:var(--zidx-search);top:42px;border:1px solid var(--box-border-color);font-size:14px;color:var(--v2p-color-font-secondary);background:var(--v2p-color-bg-widget);backdrop-filter:blur(16px);box-shadow:var(--v2p-widget-shadow)}body #search-container #search-result .fade{color:var(--v2p-color-font-secondary)}body #search-container #search-result .search-item{border-radius:var(--v2p-button-radius);font-weight:bold;color:var(--v2p-color-foreground)}body #search-container #search-result .search-item.active{color:var(--v2p-color-foreground)}body #search-container #search-result .search-item.active.v2p-no-active{background-color:rgba(0,0,0,0)}body .box{border:none;border-radius:var(--box-border-radius);color:var(--box-foreground-color);background-color:var(--v2p-color-bg-content);box-shadow:var(--v2p-box-shadow)}body .box .header{font-weight:500}body .box .header>h1{font-size:22px;font-weight:bold}body .box .header .gray{color:var(--color-gray)}body .button{--button-hover-shadow: 0 1.8px 0 var(--button-border-color), 0 1.8px 0 var(--button-background-color)}body .button.normal,body .button.super,body .button.special{cursor:pointer;user-select:none;position:relative;display:inline-flex;gap:5px;align-items:center;height:28px;padding:0 12px;border:1px solid var(--v2p-color-button-border);border-radius:var(--v2p-button-radius);font-family:inherit;font-size:14px;font-weight:500;line-height:28px;color:var(--v2p-color-button-foreground);text-shadow:none;white-space:nowrap;background:var(--v2p-color-button-background);outline:none;box-shadow:0 1.8px 0 var(--box-background-hover-color),0 1.8px 0 var(--button-background-color);transition:color .25s,background-color .25s,box-shadow .25s}body .button.normal.special,body .button.super.special,body .button.special.special{border-color:var(--v2p-color-button-special-border);color:var(--v2p-color-button-special-foreground);background:var(--v2p-color-button-special-background)}body .button.normal.v2p-btn-small,body .button.super.v2p-btn-small,body .button.special.v2p-btn-small{height:24px;padding:0 10px;border-radius:var(--v2p-button-radius);font-size:12px}body .button.normal.v2p-btn-large,body .button.super.v2p-btn-large,body .button.special.v2p-btn-large{height:32px;padding:0 14px;border-radius:var(--v2p-box-radius);font-size:16px}body .button.normal:is(:hover:enabled,:active:enabled),body .button.super:is(:hover:enabled,:active:enabled),body .button.special:is(:hover:enabled,:active:enabled){border:1px solid var(--v2p-color-button-border);font-weight:500;color:var(--v2p-color-button-foreground-hover);text-shadow:none;background:var(--v2p-color-button-background-hover);box-shadow:var(--button-hover-shadow)}body .button.normal:is(:hover:enabled,:active:enabled).special,body .button.super:is(:hover:enabled,:active:enabled).special,body .button.special:is(:hover:enabled,:active:enabled).special{border-color:var(--v2p-color-button-special-border);color:var(--v2p-color-button-special-foreground-hover);background:var(--v2p-color-button-special-background)}body .button.normal:is(.hover_now,.disable_now),body .button.super:is(.hover_now,.disable_now),body .button.special:is(.hover_now,.disable_now){border:1px solid var(--v2p-color-button-border);color:var(--v2p-color-button-foreground) !important;text-shadow:none !important;background:var(--button-background-color) !important;box-shadow:0 1.8px 0 var(--box-background-hover-color) !important,0 1.8px 0 var(--button-background-color) !important}body .button.normal:is(.hover_now,.disable_now).special,body .button.super:is(.hover_now,.disable_now).special,body .button.special:is(.hover_now,.disable_now).special{border-color:var(--v2p-color-button-special-border)}body .button.normal:is(.disable_now,:disabled),body .button.super:is(.disable_now,:disabled),body .button.special:is(.disable_now,:disabled){pointer-events:none;cursor:default;font-weight:500;color:var(--v2p-color-button-foreground);text-shadow:none;opacity:.8;background:var(--button-background-color);box-shadow:0 1.8px 0 var(--box-background-hover-color),0 1.8px 0 var(--button-background-color)}body .button.normal kbd,body .button.super kbd,body .button.special kbd{position:relative;right:-4px;padding:0 3px;border:1px solid var(--button-border-color);border-radius:var(--v2p-button-radius);font-family:inherit;font-size:90%;line-height:initial}body .button.special{--button-hover-shadow: 0 1.8px 0 var(--v2p-color-accent-200), 0 1.8px 0 var(--v2p-color-accent-100);box-shadow:var(--button-hover-shadow)}body .button.special:hover,body .button.special:hover:enabled{color:var(--v2p-color-accent-600);box-shadow:var(--button-hover-shadow)}body .button a{color:inherit;text-decoration:none}body .badge{user-select:none;padding:2px 5px;border:1px solid var(--v2p-color-accent-400);font-weight:bold}body .badge:first-child{border:1px solid var(--v2p-color-accent-400);border-top-left-radius:var(--v2p-button-radius);border-bottom-left-radius:var(--v2p-button-radius)}body .badge:last-child{border:1px solid var(--v2p-color-accent-400);border-top-right-radius:var(--v2p-button-radius);border-bottom-right-radius:var(--v2p-button-radius)}body .badge.op{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-50)}body .badge.mod{color:var(--v2p-color-bg-content);background-color:var(--v2p-color-accent-400)}body .badge.you{border:1px solid var(--v2p-color-orange-400);color:var(--v2p-color-orange-400);background-color:var(--v2p-color-orange-50)}body .badge.mini{height:1.2em;padding:0 3px;font-size:12px;font-weight:normal;line-height:1}body a.node:is(:active,:link,:visited){padding:5px 6px;border-radius:var(--v2p-button-radius);font-size:13px;color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-bg-block)}body a.node:is(:active,:link,:visited):hover{color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-button-background-hover)}body .outdated{border-color:var(--v2p-color-border);border-bottom:none;font-size:12px}body :is(.page_normal,.page_current):is(:link,:visited){user-select:none;padding:6px 9px;border:none;border-radius:var(--v2p-button-radius);font-size:14px}body .page_normal:is(:link,:visited){font-weight:500;background-color:var(--v2p-color-bg-content);box-shadow:0 2px 2px var(--box-background-hover-color);transition:transform .25s}body .page_normal:is(:link,:visited):hover{transform:scale(1.1) translateY(-2px)}body .page_current:is(:link,:visited){pointer-events:none;font-weight:bold;background-color:var(--box-background-hover-color);box-shadow:none}body .page_input{display:none}body .dock_area{margin:12px 0;background:var(--v2p-color-bg-block)}body .member-activity-bar{background-color:var(--v2p-color-divider)}body .member-activity-bar .member-activity-start{background-color:var(--v2p-color-accent-200)}body .member-activity-bar .member-activity-fourth{background-color:var(--v2p-color-accent-400)}body .member-activity-bar .member-activity-half{background-color:var(--v2p-color-accent-500)}body .member-activity-bar .member-activity-almost{background-color:var(--v2p-color-accent-600)}body .member-activity-bar .member-activity-done{background-color:var(--v2p-color-orange-400)}body .online{user-select:none;padding:6px 8px;border-radius:var(--v2p-button-radius);font-size:13px;color:var(--v2p-color-bg-content);background:var(--v2p-color-accent-400)}body #topic_supplement{resize:none;overflow:hidden;height:unset;min-height:550px !important;max-height:800px !important;border:1px solid var(--button-border-color);border-radius:var(--v2p-input-radius);font-size:15px;color:currentColor;background-color:var(--v2p-color-bg-input);transition:opacity .25s;overflow-y:auto}body #topic_supplement::placeholder{font-size:15px;color:var(--v2p-color-font-tertiary)}body #topic_supplement:is(:focus,:focus-within){border-color:var(--button-border-hover-color);background-color:rgba(0,0,0,0);outline:none;box-shadow:none}body .item_hot_topic_title{--offset: 2.4px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.4;position:relative;padding:var(--offset) 0;text-shadow:none}body .item_hot_topic_title>a:hover{text-underline-offset:var(--offset)}body form textarea#topic_title{resize:none;overflow:hidden;height:unset;min-height:75px !important;max-height:800px !important;border:1px solid var(--button-border-color);border-radius:var(--v2p-input-radius);font-size:15px;color:currentColor;background-color:var(--v2p-color-bg-input);transition:opacity .25s}body form textarea#topic_title::placeholder{font-size:15px;color:var(--v2p-color-font-tertiary)}body form textarea#topic_title:is(:focus,:focus-within){border-color:var(--button-border-hover-color);background-color:rgba(0,0,0,0);outline:none;box-shadow:none}body form #topic_title{resize:none;overflow:hidden;height:unset;min-height:30px !important;max-height:800px !important;border:1px solid var(--button-border-color);border-radius:var(--v2p-input-radius);font-size:15px;color:currentColor;background-color:var(--v2p-color-bg-input);transition:opacity .25s}body form #topic_title::placeholder{font-size:15px;color:var(--v2p-color-font-tertiary)}body form #topic_title:is(:focus,:focus-within){border-color:var(--button-border-hover-color);background-color:rgba(0,0,0,0);outline:none;box-shadow:none}body form #topic_content{resize:none;overflow:hidden;height:unset;min-height:120px !important;max-height:800px !important;border:1px solid var(--button-border-color);border-radius:var(--v2p-input-radius);font-size:15px;color:currentColor;background-color:var(--v2p-color-bg-input);transition:opacity .25s}body form #topic_content::placeholder{font-size:15px;color:var(--v2p-color-font-tertiary)}body form #topic_content:is(:focus,:focus-within){border-color:var(--button-border-hover-color);background-color:rgba(0,0,0,0);outline:none;box-shadow:none}body form[action^=\"/notes\"] .cell{background-color:rgba(0,0,0,0) !important}body #syntax-selector .radio-group{padding:3px;border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-background);box-shadow:0 1px 2px var(--v2p-box-shadow) inset}body #syntax-selector .radio-group>input[type=radio]:checked+label{border-radius:var(--v2p-button-radius);color:var(--v2p-color-accent-600);background-color:var(--v2p-color-accent-100);box-shadow:1px 1px 2px var(--v2p-box-shadow)}body #syntax-selector .radio-group>input[type=radio]+label{cursor:pointer;font-size:13px}body #syntax-selector label{color:var(--v2p-color-foreground)}body .snow{color:var(--v2p-color-font-quaternary)}body .orange-dot{background:var(--v2p-color-orange-400)}body .alt{border:1px solid var(--button-border-color);background-color:var(--v2p-color-bg-input)}body a.btn_hero{border-color:var(--v2p-color-foreground)}body a.btn_hero:hover{background-color:var(--v2p-color-foreground)}body .cell_ops{background-color:rgba(0,0,0,0)}body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.com/t\"],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.com/t\"][href^=http],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.co/t\"],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.co/t\"][href^=http],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=\"/\"]{text-decoration:underline 1.5px;text-underline-offset:.46ex;color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-50)}body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.com/t\"]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.com/t\"][href^=http]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.co/t\"]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"v2ex.co/t\"][href^=http]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=\"/\"]:hover{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-50)}body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=http],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"/email-protection\"],body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=\"/member/\"]{text-decoration:underline 1.5px;text-underline-offset:.46ex;color:currentColor;background-color:var(--v2p-color-bg-link)}body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=http]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"/email-protection\"]:hover,body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=\"/member/\"]:hover{color:currentColor;background-color:var(--v2p-color-bg-link-hover)}body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=http]:has(>.embedded_image),body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href*=\"/email-protection\"]:has(>.embedded_image),body :is(.topic_content,.reply_content,.v2p-topic-preview-content,.v2p-topic-preview-addons,.v2p-reply-preview,.markdown_body) a[href^=\"/member/\"]:has(>.embedded_image){background-color:rgba(0,0,0,0)}body .CodeMirror{color:currentColor;background-color:var(--v2p-color-bg-input)}body .CodeMirror.CodeMirror-focused{background-color:var(--v2p-color-bg-content)}body .CodeMirror .CodeMirror-gutters{padding-right:5px;border-right:1px solid var(--v2p-color-border-darker);background-color:var(--v2p-color-bg-input)}body .CodeMirror .CodeMirror-linenumber{color:var(--v2p-color-font-quaternary)}body .CodeMirror .CodeMirror-cursors{background-color:var(--v2p-color-foreground)}body .cm-s-one-dark{background-color:var(--v2p-color-bg-input)}body #workspace{overflow:hidden;border:1px solid var(--button-border-color);border-radius:8px}body .select2-container{width:200px !important}body .select2-container .select2-selection{height:33px !important;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-input-radius) !important;background-color:var(--v2p-color-bg-content)}body .select2-container .select2-selection .select2-selection__rendered,body .select2-container .select2-selection .select2-selection__placeholder{display:inline-flex;align-items:center;height:100%;color:var(--v2p-color-foreground)}body .select2-container .select2-dropdown{border:1px solid var(--box-border-color);border-radius:var(--v2p-popup-radius);font-size:14px;background:var(--v2p-color-bg-widget);backdrop-filter:blur(16px);box-shadow:var(--v2p-widget-shadow);transform:translateY(5px)}body .select2-container .select2-dropdown .select2-search{padding:5px}body .select2-container .select2-dropdown .select2-search .select2-search__field{padding:6px 4px;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-input-radius);background-color:rgba(0,0,0,0)}body .select2-container .select2-dropdown .select2-search .select2-search__field:focus-visible{border-color:var(--v2p-color-font-quaternary);outline:none}body .select2-container .select2-dropdown .select2-results>.select2-results__options{padding:5px}body .select2-container .select2-dropdown .select2-container--default .select2-results__option--selected{color:currentColor;background-color:var(--v2p-color-accent-100)}body .select2-container .select2-results__option{border-radius:var(--v2p-popup-radius)}body .select2-container .select2-results__option--highlighted.select2-results__option--selectable{color:currentColor;background-color:var(--v2p-color-button-background-hover)}body .select2-container .select2-results__option--selected{color:currentColor !important;background-color:var(--v2p-color-accent-100) !important}body .problem{border-color:var(--v2p-color-orange-400);border-bottom:none;color:currentColor;color:var(--v2p-color-orange-400);background-color:var(--v2p-color-orange-50)}body .markdown_body table{border-top:1px solid var(--v2p-color-border-darker);box-shadow:none}body .markdown_body table tr th,body .markdown_body table tr td{border:1px solid var(--v2p-color-border-darker)}body .markdown_body table tr:nth-child(2n){background-color:var(--box-background-alt-color)}body .markdown_body blockquote{margin-inline:0;padding:0 1em;border-left:3px solid var(--v2p-color-border);color:var(--v2p-color-font-tertiary)}body .markdown_body pre,body .markdown_body pre>.hljs{line-height:1.5;color:var(--v2p-color-foreground);background-color:var(--v2p-color-bg-block)}body .social_label:is(:link,:visited,:active){border-radius:var(--box-border-radius);background-color:var(--v2p-color-button-background);box-shadow:none}body .social_label:is(:link,:visited,:active):hover{background-color:var(--v2p-color-button-background-hover)}body .green{color:var(--v2p-color-accent-500)}body .message{border:none;color:var(--v2p-color-orange-400);background-color:var(--v2p-color-orange-50)}body .balance_area,body a.balance_area:is(:link,:visited){display:inline-flex;gap:3px;align-items:center;font-weight:600;color:var(--v2p-color-foreground);text-shadow:none;background:var(--v2p-color-button-background)}body .balance_area:hover,body a.balance_area:is(:link,:visited):hover{background:var(--v2p-color-button-background-hover)}body :is(.subtle){border-left:3px solid var(--v2p-color-accent-200);background-color:var(--v2p-color-bg-subtle)}body :is(.subtle) .topic_content{font-size:15px}body .onoffswitch label .frame::before{color:#fff;background-color:var(--v2p-color-accent-400)}body .onoffswitch label .frame::after{color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-bg-search)}body select{padding:6px 8px;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-input-radius);color:var(--v2p-color-foreground);background-color:var(--v2p-color-background);cursor:pointer;border-radius:var(--v2p-input-radius);background-color:var(--v2p-color-bg-content)}body select:hover{border-color:var(--v2p-color-input-border-focus)}body select:focus{border-color:var(--v2p-color-border)}body .ml,body .mle,body .mll,body .sl,body .sll,body .sls{padding:7px 10.5px;border-color:var(--v2p-color-input-border);border-radius:var(--v2p-input-radius);color:var(--v2p-color-foreground);background-color:var(--v2p-color-bg-content)}body .ml::placeholder,body .mle::placeholder,body .mll::placeholder,body .sl::placeholder,body .sll::placeholder,body .sls::placeholder{color:var(--v2p-color-font-tertiary)}body .ml:focus,body .mle:focus,body .mll:focus,body .sl:focus,body .sll:focus,body .sls:focus{border-color:var(--v2p-color-input-border-focus)}body input,body select,body textarea{color:var(--v2p-color-foreground)}body .onoffswitch{width:90px;min-width:90px;max-width:90px}.box .tag::before{color:var(--v2p-color-font-secondary)}.box .tag:link,.box .tag:visited{border-radius:var(--v2p-button-radius);font-size:12px;color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-main-100)}.box .tag>li{opacity:.6}#Top .content{height:100%}#Top .site-nav{height:100%;padding:0}#Top .tools{display:flex;gap:8px 14px;align-items:center;justify-content:flex-end;font-size:14px;font-weight:400}#Top .tools .top{height:26px;padding:0 6px;border-radius:var(--v2p-button-radius);line-height:26px;color:var(--v2p-color-button-foreground);white-space:nowrap}#Top .tools .top:hover{color:var(--v2p-color-foreground)}#Top .tools .top:not(.v2p-hover-btn):hover{background-color:var(--v2p-color-button-background-hover)}#Top .tools *{margin-left:0}#Main .box{overflow:auto;padding:0 var(--v2p-spacing-box)}#Main .box.node-header>.cell{margin:0 calc(var(--v2p-spacing-box)*-1)}#Main .box .cell{background-image:none !important}#Main .box .cell:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])){padding:var(--v2p-tp-item-x) var(--v2p-tp-item-y)}#Main .box .cell_ops{padding:15px 5px}#Main .box:has(form[action=\"/write\"]) .cell:nth-child(1),#Main .box:has(form[action=\"/write\"]) .cell:nth-child(2){border:none}#Main .box:has(form[action=\"/write\"]) .cell:has(#syntax-selector){padding:8px 0 !important}#Main .box:has(form[action=\"/write\"]) .cell:has(#syntax-selector) .tab-alt-container{gap:0 8px}#Main .box:has(form[action=\"/write\"]) .cell:has(#syntax-selector) .tab-alt{padding:4px 2px;border-bottom-width:2px;transition:none}#Main .box:has(form[action=\"/write\"]) .cell:has(#syntax-selector) .tab-alt:not(.active):hover{border-color:rgba(0,0,0,0)}#Main .box:has(form[action=\"/write\"]) .cell#preview{padding:2px 5px}#Main .topic_buttons{display:flex;flex-wrap:wrap;column-gap:5px;align-items:center;padding:8px 0;background:none}#Main .topic_buttons .topic_stats{float:none;flex:1;order:99;margin-left:10px;padding:0 !important;font-size:12px;text-shadow:none;white-space:nowrap}#Main .topic_buttons .topic_thanked{font-size:12px}#Main .topic_buttons a.tb:link{display:flex;flex-direction:row-reverse;column-gap:5px;align-items:center;padding:5px;border-radius:var(--v2p-button-radius);text-shadow:none;white-space:nowrap;background:none}#Main .topic_buttons a.tb:link:not(.v2p-hover-btn){color:var(--v2p-color-font-secondary)}#Main .topic_buttons a.tb:link:hover:not(.v2p-hover-btn){color:currentColor;background:var(--v2p-color-bg-block)}#Main .vote:link{border-color:var(--v2p-color-border-darker);border-radius:var(--v2p-button-radius);color:var(--v2p-color-font-tertiary)}#Main .vote:link:hover{box-shadow:0 2px 2px var(--v2p-color-main-200)}#Main .cell .topic-link{color:var(--v2p-color-foreground);text-decoration:none}#Main .cell .topic-link:visited{color:var(--v2p-color-link-visited)}#Main .cell .topic_info{pointer-events:none;user-select:none;position:relative;display:flex;flex-wrap:wrap;align-items:center}#Main .cell .topic_info::after{content:\"\";position:absolute;z-index:1;inset:0 0 -6px;background-color:var(--v2p-color-bg-content)}#Main .cell .topic_info .votes,#Main .cell .topic_info .node,#Main .cell .topic_info .badges,#Main .cell .topic_info strong:first-of-type,#Main .cell .topic_info span:first-of-type,#Main .cell .topic_info .v2p-topic-actions{pointer-events:auto;position:relative;z-index:2}#Main .cell .topic_info a[href^=\"/member\"]{font-weight:500;color:var(--v2p-color-font-tertiary);background-color:rgba(0,0,0,0)}#Main .cell .count_livid{user-select:none;display:inline-block;padding:5px 10px;border-radius:var(--v2p-button-radius);font-size:12px;font-weight:400;white-space:nowrap;margin-right:0;color:var(--v2p-color-button-foreground);background-color:var(--v2p-color-bg-block)}#Main .cell .count_orange{user-select:none;display:inline-block;padding:5px 10px;border-radius:var(--v2p-button-radius);font-size:12px;font-weight:400;white-space:nowrap;font-weight:bold;color:var(--v2p-color-badge);background-color:var(--v2p-color-orange-400)}#Main .cell .item_title .topic-link{font-size:15px;font-weight:500}#Main .cell.item tr>td:nth-child(2){width:30px}#Main .box>.cell[id^=r]:not(:has(.cell[id^=r])):not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])) .reply_content,#Main .v2p-modal-content>.cell[id^=r]:not(:has(.cell[id^=r])):not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])) .reply_content{padding-bottom:0}#Main .cell[id^=r]{--bg-reply: var(--v2p-color-bg-content);background-color:var(--bg-reply)}#Main .cell[id^=r]:not(:has(+.cell[id^=r])){border-bottom:none}#Main .cell[id^=r]:hover>table td:last-of-type .fr a{opacity:1}#Main .cell[id^=r] .ago{font-size:12px;color:var(--v2p-color-font-quaternary);white-space:nowrap}#Main .cell[id^=r] .reply_content{line-height:1.5}#Main .cell[id^=r] .reply_content:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth] .reply_content)){padding-bottom:10px}#Main .cell[id^=r]:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth]))>table:first-of-type td:first-of-type{width:40px}#Main .cell[id^=r]:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth]))>table:first-of-type td:first-of-type .avatar{display:inline-block;aspect-ratio:1;width:40px !important;height:40px !important}#Main .cell[id^=r]>table:first-of-type td:first-of-type .avatar{border-radius:var(--v2p-button-radius);background-color:var(--v2p-color-bg-avatar)}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r]{--bg-reply: var(--v2p-color-bg-reply);position:relative;z-index:var(--zidx-expand-btn);padding:var(--v2p-tp-nested-pd) 0 0 var(--v2p-tp-nested-pd);border:none;border-radius:0;box-shadow:-2.4px 0 var(--v2p-color-border-darker)}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] .cell[id^=r]{padding:0;box-shadow:none}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] .cell[id^=r].v2p-indent{padding-left:var(--v2p-tp-nested-pd);border-left:1px solid var(--v2p-color-border-darker)}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] tr td:first-of-type{width:25px}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] tr td:first-of-type .avatar{width:25px !important;height:25px !important;border-radius:var(--v2p-button-radius)}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] tr td:nth-child(3) strong a{font-size:13px}:where(:root:not([data-v2p-nested=off])) #Main .cell[id^=r]>table~.cell[id^=r] .reply_content{padding-right:5px}#Main .cell[id^=r]>table td:nth-of-type(2){width:15px}#Main .cell[id^=r]>table td:last-of-type a.dark{color:var(--v2p-color-font-secondary);text-decoration:none}#Main .cell[id^=r]>table td:last-of-type a.dark:hover{text-decoration:none}#Main .cell[id^=r]>table td:last-of-type .fr{user-select:none;position:relative;top:-3px}#Main .cell[id^=r]>table td:last-of-type .fr a{opacity:0}#Main .cell[id^=r]>table td:last-of-type .fr+.sep3{height:0}#Main .cell[id^=r]:last-of-type{border:none}#Main .cell[id^=r] .no{user-select:none;position:relative;top:-4px;padding:5px 10px;border-radius:var(--v2p-button-radius);font-size:12px;font-variant-numeric:tabular-nums;color:var(--v2p-color-cell-num);background-color:rgba(0,0,0,0)}#Main #Tabs{user-select:none;position:sticky;z-index:var(--zidx-tabs);top:0;display:flex;flex-wrap:wrap;gap:4px 3px;align-items:center;padding:var(--v2p-tp-tabs-pd);border-bottom:1px solid var(--box-border-color);background-color:var(--v2p-color-bg-content)}#Main #Tabs .tab_current{margin-right:0}#Main #Tabs .tab{margin:0}#Main #Tabs .tab.v2p-hover-btn::before{inset:0}#Main #SecondaryTabs{padding:10px;border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-tabs)}#Main #SecondaryTabs a{color:var(--v2p-color-tabs)}#Main .topic_content,#Main .reply_content{font-size:15px;line-height:1.6;color:currentColor}#Main .topic_content a[href^=\"/member\"],#Main .reply_content a[href^=\"/member\"]{position:relative;bottom:1px;font-size:13px;color:var(--v2p-color-font-tertiary);text-decoration:underline;text-underline-offset:.4ex;background-color:rgba(0,0,0,0)}#Main .thank_area{font-size:12px}#Main .tab{user-select:none;border-radius:var(--v2p-button-radius);color:var(--v2p-color-foreground);background-color:rgba(0,0,0,0)}#Main .tab:not(.v2p-hover-btn):hover{background-color:var(--v2p-color-bg-block)}#Main .tab_current{user-select:none;border-radius:var(--v2p-button-radius);color:var(--v2p-color-bg-content);background-color:var(--v2p-color-foreground)}#Main #reply-box.reply-box-sticky{z-index:var(--zidx-reply-box);bottom:20px;overflow:visible;margin:0 -10px;padding:0 22px;border:none;border-radius:var(--box-border-radius);outline:2px solid var(--v2p-color-border)}#Main #reply-box .flex-one-row:last-of-type{flex-direction:row-reverse;gap:10px;justify-content:flex-start}#Main #reply-box .flex-one-row:last-of-type .gray{margin-right:auto}#Main #reply-box>.cell{font-size:12px}#Main #reply-box>.cell.flex-one-row{min-height:45px;padding:0 10px;border:none}#Main #reply-box>.cell.flex-row-end{padding:12px 10px;border:none}#Main #reply-box>.cell:has(form){padding-top:0}#Main #no-comments-yet{border-color:var(--color-gray);color:var(--color-gray)}#Main #notifications .cell[id^=n]:hover .node{opacity:1}#Main #notifications .cell[id^=n] .node{opacity:0}#Main #notifications .cell[id^=n] .payload{color:var(--v2p-color-foreground);background-color:var(--v2p-color-bg-block)}#Main #notifications .cell[id^=n] .payload:has(.embedded_video_wrapper){min-width:50%}#Main #notifications .cell[id^=n] .topic-link:visited{color:var(--v2p-color-font-quaternary)}#Main .cell_tabs .cell_tab_current{border-color:var(--v2p-color-foreground);font-weight:bold}#Main .cell_tabs .cell_tab{color:var(--v2p-color-foreground)}#Main .cell_tabs .cell_tab:hover{border-color:var(--v2p-color-border-darker)}#Main .settings.block .block-stat{padding:var(--v2p-spacing-box);background-color:rgba(0,0,0,0)}#Main .settings.privacy .privacy-settings-form>div:nth-of-type(2n){background-color:rgba(0,0,0,0)}#Rightbar .cell:has(.light-toggle){font-size:13px}#Rightbar .box .item_node{border-color:var(--v2p-color-border);border-radius:var(--v2p-button-radius);font-size:12px;color:var(--v2p-color-font-secondary)}#Rightbar .box .item_node:hover{box-shadow:var(--v2p-box-shadow)}#Rightbar a.dark:is(:link,:active,:visited,:hover){color:var(--v2p-color-font-tertiary)}#Rightbar a.dark:is(:link,:active,:visited,:hover):hover{color:var(--v2p-color-font-secondary)}#Bottom{position:sticky;top:100%}#Bottom a.dark{font-size:13px;font-weight:400}#Bottom a.dark:is(:link,:active,:visited,:hover){color:var(--v2p-color-font-tertiary)}.wwads-cn{border:none !important;box-shadow:none !important}.box:has(a[href^=\"/advertise\"]){overflow:hidden;border:none !important;box-shadow:none !important}.box:has(a[href^=\"/advertise\"]) .sidebar_compliance{background-color:var(--v2p-color-bg-block)}.ml[name=my_css]{font-family:var(--code-font)}\n:root[data-v2p-theme=dark-default],:root[data-darkreader-scheme=dark],:root:has(#Wrapper.Night){color-scheme:dark}:root[data-darkreader-scheme=dark],:root:has(#Wrapper.Night){--v2p-color-foreground: #adbac7}:root body.v2p-theme-dark-default,:root .v2p-theme-dark-default,:root[data-v2p-theme=dark-default],:root[data-v2p-theme=dark-default] body,:root[data-darkreader-scheme=dark] body,:root body:has(#Wrapper.Night){color-scheme:dark;--v2p-color-main-50: unset;--v2p-color-main-100: #2d333b;--v2p-color-main-150: #323a46;--v2p-color-main-200: #374151;--v2p-color-main-300: #374151;--v2p-color-main-350: #6b7280cc;--v2p-color-main-400: #6b7280;--v2p-color-main-500: #9ca3af;--v2p-color-main-600: #9ca3af;--v2p-color-main-700: #d1d5db;--v2p-color-main-800: #e5e7eb;--v2p-color-main-900: #111827;--v2p-color-main-950: #030712;--v2p-color-accent-50: #064e3b;--v2p-color-accent-100: #065f46;--v2p-color-accent-200: #047857;--v2p-color-accent-300: #059669;--v2p-color-accent-400: #10b981;--v2p-color-accent-500: #34d399;--v2p-color-accent-600: #6ee7b7;--v2p-color-orange-50: #593600;--v2p-color-orange-100: #9a3412;--v2p-color-orange-400: #fbe090;--v2p-color-background: #1c2128;--v2p-color-foreground: #adbac7;--v2p-color-font-secondary: var(--v2p-color-main-600);--v2p-color-button-background: #373e47;--v2p-color-button-foreground: var(--v2p-color-foreground);--v2p-color-button-background-hover: #444c56;--v2p-color-button-foreground-hover: var(--v2p-color-foreground);--v2p-color-button-special-background: var(--v2p-color-accent-100);--v2p-color-button-special-foreground: var(--v2p-color-accent-600);--v2p-color-button-special-border: var(--v2p-color-accent-300);--v2p-color-button-special-foreground-hover: var(--v2p-color-accent-500);--v2p-color-bg-content: #22272e;--v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);--v2p-color-bg-subtle: rgb(6 78 59 / 30%);--v2p-color-bg-input: var(--v2p-color-background);--v2p-color-bg-search: var(--v2p-color-main-100);--v2p-color-bg-search-active: var(--v2p-color-main-150);--v2p-color-bg-widget: var(--v2p-color-bg-content);--v2p-color-bg-reply: var(--v2p-color-main-100);--v2p-color-bg-tooltip: var(--v2p-color-main-100);--v2p-color-bg-avatar: var(--v2p-color-main-300);--v2p-color-bg-block: #373e47;--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fca5a5;--v2p-color-mask: rgb(99 110 123 / 40%);--v2p-color-border: #444c56;--v2p-color-input-border: #444c56;--v2p-color-border-darker: #444c56;--v2p-box-shadow: 0 0 0 1px var(--v2p-color-border);--v2p-toast-shadow: none;--link-color: var(--v2p-color-foreground);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-300);--button-hover-color: var(--button-background-hover-color);--button-border-color: var(--v2p-color-border);--button-border-hover-color: #768390}:root body.v2p-theme-dark-default #Logo,:root .v2p-theme-dark-default #Logo,:root[data-v2p-theme=dark-default] #Logo,:root[data-v2p-theme=dark-default] body #Logo,:root[data-darkreader-scheme=dark] body #Logo,:root body:has(#Wrapper.Night) #Logo{background-image:url(\"https://www.v2ex.com/static/img/v2ex-alt@2x.png\")}:root body.v2p-theme-dark-default ::selection,:root .v2p-theme-dark-default ::selection,:root[data-v2p-theme=dark-default] ::selection,:root[data-v2p-theme=dark-default] body ::selection,:root[data-darkreader-scheme=dark] body ::selection,:root body:has(#Wrapper.Night) ::selection{color:var(--v2p-color-background, #1c2128);background-color:var(--v2p-color-foreground, #adbac7)}:root body.v2p-theme-dark-default img::selection,:root .v2p-theme-dark-default img::selection,:root[data-v2p-theme=dark-default] img::selection,:root[data-v2p-theme=dark-default] body img::selection,:root[data-darkreader-scheme=dark] body img::selection,:root body:has(#Wrapper.Night) img::selection{background-color:var(--v2p-color-foreground, #adbac7)}:root body.v2p-theme-dark-default #Top,:root .v2p-theme-dark-default #Top,:root[data-v2p-theme=dark-default] #Top,:root[data-v2p-theme=dark-default] body #Top,:root[data-darkreader-scheme=dark] body #Top,:root body:has(#Wrapper.Night) #Top{background-color:rgba(0,0,0,0)}:root body.v2p-theme-dark-default #Main .cell .item_title .topic-link,:root .v2p-theme-dark-default #Main .cell .item_title .topic-link,:root[data-v2p-theme=dark-default] #Main .cell .item_title .topic-link,:root[data-v2p-theme=dark-default] body #Main .cell .item_title .topic-link,:root[data-darkreader-scheme=dark] body #Main .cell .item_title .topic-link,:root body:has(#Wrapper.Night) #Main .cell .item_title .topic-link{font-weight:normal}:root body.v2p-theme-dark-default #search-container::before,:root .v2p-theme-dark-default #search-container::before,:root[data-v2p-theme=dark-default] #search-container::before,:root[data-v2p-theme=dark-default] body #search-container::before,:root[data-darkreader-scheme=dark] body #search-container::before,:root body:has(#Wrapper.Night) #search-container::before{background-image:url(\"/static/img/search_icon_light.png\")}:root body.v2p-theme-dark-default{visibility:visible}@supports not selector(:has(*)){:root #Wrapper.Night{--v2p-color-main-50: unset;--v2p-color-main-100: #2d333b;--v2p-color-main-150: #323a46;--v2p-color-main-200: #374151;--v2p-color-main-300: #374151;--v2p-color-main-350: #6b7280cc;--v2p-color-main-400: #6b7280;--v2p-color-main-500: #9ca3af;--v2p-color-main-600: #9ca3af;--v2p-color-main-700: #d1d5db;--v2p-color-main-800: #e5e7eb;--v2p-color-main-900: #111827;--v2p-color-main-950: #030712;--v2p-color-accent-50: #064e3b;--v2p-color-accent-100: #065f46;--v2p-color-accent-200: #047857;--v2p-color-accent-300: #059669;--v2p-color-accent-400: #10b981;--v2p-color-accent-500: #34d399;--v2p-color-accent-600: #6ee7b7;--v2p-color-orange-50: #593600;--v2p-color-orange-100: #9a3412;--v2p-color-orange-400: #fbe090;--v2p-color-background: #1c2128;--v2p-color-foreground: #adbac7;--v2p-color-font-secondary: var(--v2p-color-main-600);--v2p-color-button-background: #373e47;--v2p-color-button-foreground: var(--v2p-color-foreground);--v2p-color-button-background-hover: #444c56;--v2p-color-button-foreground-hover: var(--v2p-color-foreground);--v2p-color-button-special-background: var(--v2p-color-accent-100);--v2p-color-button-special-foreground: var(--v2p-color-accent-600);--v2p-color-button-special-border: var(--v2p-color-accent-300);--v2p-color-button-special-foreground-hover: var(--v2p-color-accent-500);--v2p-color-bg-content: #22272e;--v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);--v2p-color-bg-subtle: rgb(6 78 59 / 30%);--v2p-color-bg-input: var(--v2p-color-background);--v2p-color-bg-search: var(--v2p-color-main-100);--v2p-color-bg-search-active: var(--v2p-color-main-150);--v2p-color-bg-widget: var(--v2p-color-bg-content);--v2p-color-bg-reply: var(--v2p-color-main-100);--v2p-color-bg-tooltip: var(--v2p-color-main-100);--v2p-color-bg-avatar: var(--v2p-color-main-300);--v2p-color-bg-block: #373e47;--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fca5a5;--v2p-color-mask: rgb(99 110 123 / 40%);--v2p-color-border: #444c56;--v2p-color-input-border: #444c56;--v2p-color-border-darker: #444c56;--v2p-box-shadow: 0 0 0 1px var(--v2p-color-border);--v2p-toast-shadow: none;--link-color: var(--v2p-color-foreground);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-300);--button-hover-color: var(--button-background-hover-color);--button-border-color: var(--v2p-color-border);--button-border-hover-color: #768390}:root #Wrapper.Night #Logo{background-image:url(\"https://www.v2ex.com/static/img/v2ex-alt@2x.png\")}:root #Wrapper.Night ::selection{color:var(--v2p-color-background, #1c2128);background-color:var(--v2p-color-foreground, #adbac7)}:root #Wrapper.Night img::selection{background-color:var(--v2p-color-foreground, #adbac7)}}\nbody.v2p-theme-dawn,.v2p-theme-dawn,:root[data-v2p-theme=dawn],:root[data-v2p-theme=dawn] body{--v2p-color-base: 32deg 57% 95%;--v2p-color-surface: 35deg 100% 98%;--v2p-color-overlay: 33deg 43% 91%;--v2p-color-muted: 257deg 9% 61%;--v2p-color-subtle: 248deg 12% 52%;--v2p-color-text: 248deg 19% 40%;--v2p-color-love: 343deg 35% 55%;--v2p-color-gold: 35deg 81% 56%;--v2p-color-rose: 3deg 53% 67%;--v2p-color-pine: 197deg 53% 34%;--v2p-color-foam: 189deg 30% 48%;--v2p-color-iris: 268deg 21% 57%;--v2p-color-accent-50: hsl(var(--v2p-color-foam) / 10%);--v2p-color-accent-100: hsl(var(--v2p-color-foam) / 20%);--v2p-color-accent-200: hsl(var(--v2p-color-foam) / 30%);--v2p-color-accent-300: hsl(var(--v2p-color-foam) / 40%);--v2p-color-accent-400: hsl(var(--v2p-color-foam) / 50%);--v2p-color-accent-500: hsl(var(--v2p-color-foam) / 65%);--v2p-color-accent-600: hsl(var(--v2p-color-foam) / 80%);--v2p-color-orange-50: hsl(var(--v2p-color-gold) / 10%);--v2p-color-orange-100: hsl(var(--v2p-color-gold) / 20%);--v2p-color-orange-400: hsl(var(--v2p-color-gold));--v2p-color-background: hsl(var(--v2p-color-base));--v2p-color-foreground: hsl(var(--v2p-color-text));--v2p-color-selection-foreground: var(--v2p-color-foreground);--v2p-color-selection-background: hsl(var(--v2p-color-muted) / 20%);--v2p-color-selection-background-img: hsl(var(--v2p-color-muted) / 60%);--v2p-color-font-secondary: hsl(var(--v2p-color-subtle));--v2p-color-font-tertiary: hsl(var(--v2p-color-subtle));--v2p-color-font-quaternary: hsl(var(--v2p-color-subtle));--v2p-color-button-background: hsl(var(--v2p-color-text) / 10%);--v2p-color-button-foreground: var(--v2p-color-foreground);--v2p-color-button-background-hover: hsl(var(--v2p-color-text) / 15%);--v2p-color-button-foreground-hover: var(--v2p-color-foreground);--v2p-color-bg-content: hsl(var(--v2p-color-surface));--v2p-color-bg-footer: var(--v2p-color-bg-content);--v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);--v2p-color-bg-subtle: hsl(var(--v2p-color-pine) / 10%);--v2p-color-bg-input: hsl(var(--v2p-color-overlay) / 40%);--v2p-color-bg-search: hsl(var(--v2p-color-overlay) / 60%);--v2p-color-bg-search-active: hsl(var(--v2p-color-overlay) / 90%);--v2p-color-bg-widget: rgb(255 255 255 / 70%);--v2p-color-bg-reply: #faf4ed;--v2p-color-bg-tooltip: var(--v2p-color-bg-content);--v2p-color-bg-tabs: hsl(var(--v2p-color-pine) / 10%);--v2p-color-bg-tpr: hsl(var(--v2p-color-text) / 10%);--v2p-color-bg-avatar: hsl(var(--v2p-color-overlay));--v2p-color-bg-block: hsl(var(--v2p-color-text) / 10%);--v2p-color-bg-block-darker: hsl(var(--v2p-color-text) / 25%);--v2p-color-bg-link: hsl(var(--v2p-color-text) / 10%);--v2p-color-bg-link-hover: hsl(var(--v2p-color-text) / 15%);--v2p-color-tabs: hsl(var(--v2p-color-pine));--v2p-color-heart: #eb6f92;--v2p-color-heart-fill: rgb(235 111 146 / 50%);--v2p-color-mask: rgb(0 0 0 / 25%);--v2p-color-divider: hsl(var(--v2p-color-muted) / 20%);--v2p-color-border: hsl(var(--v2p-color-muted) / 20%);--v2p-color-input-border: rgb(152 147 165 / 20%);--v2p-color-border-darker: hsl(var(--v2p-color-muted) / 40%);--v2p-color-link-visited: hsl(var(--v2p-color-subtle));--v2p-color-error: #eb6f92;--v2p-color-bg-error: #fee2e2;--v2p-color-cell-num: hsl(var(--v2p-color-subtle));--v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);--v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 /12%);--v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);--link-color: var(--v2p-color-foreground);--box-background-alt-color: var(--v2p-color-bg-block);--box-background-hover-color: var(--v2p-color-bg-link-hover);--button-hover-color: var(--v2p-color-button-background-hover);--button-border-color: var(--v2p-color-border);--button-border-hover-color: var(--v2p-color-border-darker);visibility:visible}body.v2p-theme-dawn .button.special:hover,body.v2p-theme-dawn .button.special:hover:enabled,.v2p-theme-dawn .button.special:hover,.v2p-theme-dawn .button.special:hover:enabled,:root[data-v2p-theme=dawn] .button.special:hover,:root[data-v2p-theme=dawn] .button.special:hover:enabled,:root[data-v2p-theme=dawn] body .button.special:hover,:root[data-v2p-theme=dawn] body .button.special:hover:enabled{text-shadow:none}body.v2p-theme-dawn .badge.op,.v2p-theme-dawn .badge.op,:root[data-v2p-theme=dawn] .badge.op,:root[data-v2p-theme=dawn] body .badge.op{border:1px solid var(--v2p-color-accent-500)}body.v2p-theme-dawn .badge.mod,.v2p-theme-dawn .badge.mod,:root[data-v2p-theme=dawn] .badge.mod,:root[data-v2p-theme=dawn] body .badge.mod{background-color:var(--v2p-color-accent-500)}\nbody.v2p-mode-compact,:root[data-v2p-mode=compact],:root[data-v2p-mode=compact] body{--v2p-nav-height: 45px;--v2p-layout-column-gap: 16px;--v2p-tp-item-x: 12px;--v2p-tp-item-y: 0px;--v2p-tp-tabs-pd: 6px;--v2p-tp-nested-pd: 10px;--v2p-tp-preview-pd: 18px;--v2p-box-radius: 6px;--v2p-emoji-size: 20px;visibility:visible}body.v2p-mode-compact #Wrapper,:root[data-v2p-mode=compact] #Wrapper,:root[data-v2p-mode=compact] body #Wrapper{--component-margin: var(--v2p-layout-column-gap)}body.v2p-mode-compact #Wrapper .sep20,:root[data-v2p-mode=compact] #Wrapper .sep20,:root[data-v2p-mode=compact] body #Wrapper .sep20{height:var(--component-margin)}body.v2p-mode-compact #Main .cell .item_title .topic-link,:root[data-v2p-mode=compact] #Main .cell .item_title .topic-link,:root[data-v2p-mode=compact] body #Main .cell .item_title .topic-link{font-size:14px;font-weight:500}body.v2p-mode-compact #Main .topic_content,:root[data-v2p-mode=compact] #Main .topic_content,:root[data-v2p-mode=compact] body #Main .topic_content{font-size:14.5px}body.v2p-mode-compact #Main .reply_content,:root[data-v2p-mode=compact] #Main .reply_content,:root[data-v2p-mode=compact] body #Main .reply_content{font-size:14px}body.v2p-mode-compact #Main .topic_buttons,:root[data-v2p-mode=compact] #Main .topic_buttons,:root[data-v2p-mode=compact] body #Main .topic_buttons{padding:4px 0}body.v2p-mode-compact #Rightbar .v2p-tool-box .v2p-tools,:root[data-v2p-mode=compact] #Rightbar .v2p-tool-box .v2p-tools,:root[data-v2p-mode=compact] body #Rightbar .v2p-tool-box .v2p-tools{gap:5px 10px}\nbody.v2p-theme-minimalist,.v2p-theme-minimalist,:root[data-v2p-theme=minimalist],:root[data-v2p-theme=minimalist] body{--v2p-color-accent-50: oklch(97.9% 0.021 166.113deg);--v2p-color-accent-100: oklch(95% 0.052 163.051deg);--v2p-color-accent-200: oklch(90.5% 0.093 164.15deg);--v2p-color-accent-300: oklch(84.5% 0.143 164.978deg);--v2p-color-accent-400: oklch(76.5% 0.177 163.223deg);--v2p-color-accent-500: oklch(69.6% 0.17 162.48deg);--v2p-color-accent-600: oklch(59.6% 0.145 163.225deg);--v2p-color-accent-700: oklch(50.8% 0.118 165.612deg);--v2p-color-orange-50: #fff7ed;--v2p-color-orange-100: #ffedd5;--v2p-color-orange-400: #fb923c;--v2p-color-background: oklch(97.6% 0.005 253deg);--v2p-color-foreground: oklch(28.2% 0.091 267.935deg);--v2p-color-selection-foreground: currentColor;--v2p-color-selection-background: oklch(93.2% 0.032 255.585deg);--v2p-color-selection-background-img: var(--v2p-color-selection-background);--v2p-color-font-secondary: oklch(from var(--v2p-color-foreground) l c h / 80%);--v2p-color-font-tertiary: oklch(from var(--v2p-color-foreground) l c h / 68%);--v2p-color-font-quaternary: oklch(from var(--v2p-color-foreground) l c h / 57%);--v2p-color-button-background: var(--v2p-color-background);--v2p-color-button-foreground: var(--v2p-color-foreground);--v2p-color-button-background-hover: oklch(from var(--v2p-color-foreground) l c h / 10%);--v2p-color-button-foreground-hover: var(--v2p-color-foreground);--v2p-color-button-special-background: var(--v2p-color-accent-50);--v2p-color-button-special-foreground: var(--v2p-color-accent-700);--v2p-color-button-special-border: var(--v2p-color-accent-600);--v2p-color-bg-content: #fff;--v2p-color-bg-footer: var(--v2p-color-background);--v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);--v2p-color-bg-subtle: oklch(from var(--v2p-color-foreground) l c h / 2%);--v2p-color-bg-input: var(--v2p-color-background);--v2p-color-bg-search: var(--v2p-color-bg-content);--v2p-color-bg-search-active: var(--v2p-color-bg-search);--v2p-color-bg-widget: var(--v2p-color-bg-content);--v2p-color-bg-reply: var(--v2p-color-background);--v2p-color-bg-tooltip: var(--v2p-color-background);--v2p-color-bg-tabs: var(--v2p-color-background);--v2p-color-bg-tpr: var(--v2p-color-background);--v2p-color-bg-avatar: var(--v2p-color-background);--v2p-color-bg-block: var(--v2p-color-background);--v2p-color-bg-block-darker: var(--v2p-color-background);--v2p-color-bg-link: transparent;--v2p-color-bg-link-hover: var(--v2p-color-background);--v2p-color-tabs: var(--v2p-color-foreground);--v2p-color-heart: #ef4444;--v2p-color-heart-fill: #fee2e2;--v2p-color-mask: rgb(0 0 0 / 25%);--v2p-color-divider: lab(30.7907% 22.35 -63.8417 / 20%);--v2p-color-border: var(--v2p-color-divider);--v2p-color-input-border: var(--v2p-color-border);--v2p-color-border-darker: lab(30.7907% 22.35 -63.8417 / 30%);--v2p-color-link-visited: var(--v2p-color-font-secondary);--v2p-color-error: #ef4444;--v2p-color-bg-error: #fee2e2;--v2p-color-cell-num: var(--v2p-color-font-secondary);--v2p-box-radius: 0;--v2p-input-radius: 4px;--v2p-button-radius: var(--v2p-input-radius);--v2p-popup-radius: var(--v2p-input-radius);--v2p-box-shadow: none;--v2p-widget-shadow: 0 2px 8px -2px lab(30.7907% 22.35 -63.8417 / 12%);--v2p-toast-shadow: 0 4px 12px -2px lab(30.7907% 22.35 -63.8417 / 15%);--link-color: var(--v2p-color-foreground);--box-background-alt-color: var(--v2p-color-bg-block);--box-background-hover-color: var(--v2p-color-bg-link-hover);--button-hover-color: var(--v2p-color-button-background-hover);--button-border-color: var(--v2p-color-border);--button-border-hover-color: var(--v2p-color-border-darker);position:relative;visibility:visible}body.v2p-theme-minimalist .v2p-modal-mask,.v2p-theme-minimalist .v2p-modal-mask,:root[data-v2p-theme=minimalist] .v2p-modal-mask,:root[data-v2p-theme=minimalist] body .v2p-modal-mask{background-color:oklch(from var(--v2p-color-bg-content) l c h/60%);background-image:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(30, 64, 175, 0.03) 2px, rgba(30, 64, 175, 0.03) 4px)}body.v2p-theme-minimalist #Top,.v2p-theme-minimalist #Top,:root[data-v2p-theme=minimalist] #Top,:root[data-v2p-theme=minimalist] body #Top{background-color:var(--v2p-color-background)}body.v2p-theme-minimalist #Wrapper #Main>.box:has(.topic_buttons),body.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),.v2p-theme-minimalist #Wrapper #Main>.box:has(.topic_buttons),.v2p-theme-minimalist #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),:root[data-v2p-theme=minimalist] #Wrapper #Main>.box:has(.topic_buttons),:root[data-v2p-theme=minimalist] #Wrapper #Main .v2p-left-group .box:has(.topic_buttons),:root[data-v2p-theme=minimalist] body #Wrapper #Main>.box:has(.topic_buttons),:root[data-v2p-theme=minimalist] body #Wrapper #Main .v2p-left-group .box:has(.topic_buttons){border-bottom:1px solid var(--v2p-color-border) !important}body.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,.v2p-theme-minimalist #Wrapper #Main #SecondaryTabs,:root[data-v2p-theme=minimalist] #Wrapper #Main #SecondaryTabs,:root[data-v2p-theme=minimalist] body #Wrapper #Main #SecondaryTabs{border-radius:0}body.v2p-theme-minimalist #Wrapper .box,.v2p-theme-minimalist #Wrapper .box,:root[data-v2p-theme=minimalist] #Wrapper .box,:root[data-v2p-theme=minimalist] body #Wrapper .box{border:1px solid var(--v2p-color-border)}body.v2p-theme-minimalist #Rightbar>.box:has(.member-activity-bar),.v2p-theme-minimalist #Rightbar>.box:has(.member-activity-bar),:root[data-v2p-theme=minimalist] #Rightbar>.box:has(.member-activity-bar),:root[data-v2p-theme=minimalist] body #Rightbar>.box:has(.member-activity-bar){background-image:linear-gradient(to top, transparent 0%, transparent 50%, lab(30.7907% 22.35 -63.8417 / 0.08) 100%)}body.v2p-theme-minimalist .fade,.v2p-theme-minimalist .fade,:root[data-v2p-theme=minimalist] .fade,:root[data-v2p-theme=minimalist] body .fade{color:var(--v2p-color-font-secondary)}body.v2p-theme-minimalist .button.special,.v2p-theme-minimalist .button.special,:root[data-v2p-theme=minimalist] .button.special,:root[data-v2p-theme=minimalist] body .button.special{--button-hover-shadow: 0 1.8px 0 var(--v2p-color-accent-100), 0 1.8px 0 var(--v2p-color-accent-50)}body.v2p-theme-minimalist .button.special:hover,body.v2p-theme-minimalist .button.special:hover:enabled,.v2p-theme-minimalist .button.special:hover,.v2p-theme-minimalist .button.special:hover:enabled,:root[data-v2p-theme=minimalist] .button.special:hover,:root[data-v2p-theme=minimalist] .button.special:hover:enabled,:root[data-v2p-theme=minimalist] body .button.special:hover,:root[data-v2p-theme=minimalist] body .button.special:hover:enabled{--button-hover-shadow: 0 1.8px 0 var(--v2p-color-accent-500), 0 1.8px 0 var(--v2p-color-button-special-border);text-shadow:none}body.v2p-theme-minimalist .badge.op,.v2p-theme-minimalist .badge.op,:root[data-v2p-theme=minimalist] .badge.op,:root[data-v2p-theme=minimalist] body .badge.op{border:1px solid var(--v2p-color-accent-100);color:var(--v2p-color-accent-600);background-color:var(--v2p-color-accent-100)}body.v2p-theme-minimalist .badge.mod,.v2p-theme-minimalist .badge.mod,:root[data-v2p-theme=minimalist] .badge.mod,:root[data-v2p-theme=minimalist] body .badge.mod{border:1px solid var(--v2p-color-accent-600);background-color:var(--v2p-color-accent-600)}body.v2p-theme-minimalist .badge.pro,.v2p-theme-minimalist .badge.pro,:root[data-v2p-theme=minimalist] .badge.pro,:root[data-v2p-theme=minimalist] body .badge.pro{border:1px solid var(--v2p-color-foreground);color:var(--v2p-color-bg-content);background-color:var(--v2p-color-foreground)}body.v2p-theme-minimalist .v2p-modal-main,.v2p-theme-minimalist .v2p-modal-main,:root[data-v2p-theme=minimalist] .v2p-modal-main,:root[data-v2p-theme=minimalist] body .v2p-modal-main{border:2px solid var(--v2p-color-border)}body.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,.v2p-theme-minimalist .v2p-modal-main .v2p-modal-header,:root[data-v2p-theme=minimalist] .v2p-modal-main .v2p-modal-header,:root[data-v2p-theme=minimalist] body .v2p-modal-main .v2p-modal-header{background-image:linear-gradient(to bottom, lab(30.7907% 22.35 -63.8417 / 0.03) 0%, transparent 100%)}body.v2p-theme-minimalist .v2p-control::after,.v2p-theme-minimalist .v2p-control::after,:root[data-v2p-theme=minimalist] .v2p-control::after,:root[data-v2p-theme=minimalist] body .v2p-control::after{background-color:var(--v2p-color-background)}body.v2p-theme-minimalist .green,.v2p-theme-minimalist .green,:root[data-v2p-theme=minimalist] .green,:root[data-v2p-theme=minimalist] body .green{color:var(--v2p-color-accent-500)}body.v2p-theme-minimalist .onoffswitch label .frame::before,.v2p-theme-minimalist .onoffswitch label .frame::before,:root[data-v2p-theme=minimalist] .onoffswitch label .frame::before,:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::before{background-color:var(--v2p-color-accent-500)}body.v2p-theme-minimalist .onoffswitch label .frame::after,.v2p-theme-minimalist .onoffswitch label .frame::after,:root[data-v2p-theme=minimalist] .onoffswitch label .frame::after,:root[data-v2p-theme=minimalist] body .onoffswitch label .frame::after{background-color:var(--v2p-color-bg-search)}body.v2p-theme-minimalist :is(.subtle),.v2p-theme-minimalist :is(.subtle),:root[data-v2p-theme=minimalist] :is(.subtle),:root[data-v2p-theme=minimalist] body :is(.subtle){border:none;background-color:rgba(0,0,0,0);background-image:linear-gradient(to right, lab(30.7907% 22.35 -63.8417 / 0.08) 0%, transparent 100%)}\nbody.v2p-mobile,:root[data-v2p-mobile=true],:root[data-v2p-mobile=true] body{--v2p-spacing-cell: 10px}body.v2p-mobile #site-header,:root[data-v2p-mobile=true] #site-header,:root[data-v2p-mobile=true] body #site-header{border-color:var(--v2p-color-border)}body.v2p-mobile #site-header #site-header-menu #menu-body,:root[data-v2p-mobile=true] #site-header #site-header-menu #menu-body,:root[data-v2p-mobile=true] body #site-header #site-header-menu #menu-body{right:5px;border:1px solid var(--v2p-color-border);border-radius:8px}body.v2p-mobile #Wrapper .content,:root[data-v2p-mobile=true] #Wrapper .content,:root[data-v2p-mobile=true] body #Wrapper .content{display:block;padding:0}body.v2p-mobile #Wrapper .content .flex-one-row:first-of-type,:root[data-v2p-mobile=true] #Wrapper .content .flex-one-row:first-of-type,:root[data-v2p-mobile=true] body #Wrapper .content .flex-one-row:first-of-type{padding:8px var(--v2p-spacing-cell) !important}body.v2p-mobile #Wrapper .content .header,:root[data-v2p-mobile=true] #Wrapper .content .header,:root[data-v2p-mobile=true] body #Wrapper .content .header{padding:10px var(--v2p-spacing-cell)}body.v2p-mobile .box,:root[data-v2p-mobile=true] .box,:root[data-v2p-mobile=true] body .box{border-radius:0}body.v2p-mobile .box .cell:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])),:root[data-v2p-mobile=true] .box .cell:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])),:root[data-v2p-mobile=true] body .box .cell:not(:where(:root[data-v2p-nested=off] .reply-threads-d>.cell[data-depth])){padding:var(--v2p-spacing-cell)}body.v2p-mobile .box .cell .item,:root[data-v2p-mobile=true] .box .cell .item,:root[data-v2p-mobile=true] body .box .cell .item{padding-right:8px}body.v2p-mobile .box .cell .item .item_title,:root[data-v2p-mobile=true] .box .cell .item .item_title,:root[data-v2p-mobile=true] body .box .cell .item .item_title{padding-top:4px}body.v2p-mobile .box .cell .item .item_title .topic-link:hover,:root[data-v2p-mobile=true] .box .cell .item .item_title .topic-link:hover,:root[data-v2p-mobile=true] body .box .cell .item .item_title .topic-link:hover{text-decoration:none}body.v2p-mobile .box .cell .item .count_livid,:root[data-v2p-mobile=true] .box .cell .item .count_livid,:root[data-v2p-mobile=true] body .box .cell .item .count_livid{user-select:none;display:inline-block;padding:5px 10px;border-radius:var(--v2p-button-radius);font-size:12px;font-weight:400;white-space:nowrap;margin-right:0;color:var(--v2p-color-button-foreground);background-color:var(--v2p-color-bg-block)}\n﻿body{position:relative}body.v2p-modal-open{overflow:hidden}body.v2p-img-preview-enabled .embedded_image{cursor:zoom-in}body.v2p-img-preview-enabled .embedded_image.v2p-emoji-img{cursor:default}body .button.v2p-prev-btn,body .button.v2p-next-btn{padding:0 15px}body .button.v2p-btn-loading{pointer-events:none}body #Top a:has(#Logo.v2p-logo){display:inline-flex;align-items:center}body #Logo.v2p-logo{flex-shrink:0;width:unset;height:25px;padding:0 8px;background-image:none !important}.v2p-hover-btn{cursor:pointer;user-select:none;position:relative;z-index:1;margin:0;text-decoration:none;white-space:nowrap;background:none;background-color:rgba(0,0,0,0);transition:color .2s}.v2p-hover-btn::before{content:\"\";position:absolute;z-index:-1;inset:0 -5px;transform:scale(0.65);border-radius:var(--v2p-button-radius);opacity:0;background-color:var(--v2p-color-bg-hover-btn);transition:background-color .15s,color .15s,transform .15s,opacity .15s}.v2p-hover-btn:hover{text-decoration:none}.v2p-hover-btn:hover::before{transform:scale(1);opacity:1}.v2p-hover-btn-disabled{pointer-events:none;opacity:.8}.v2p-icon-heart{display:inline-flex;width:16px;height:16px;color:var(--v2p-color-heart)}.v2p-icon-heart svg{fill:var(--v2p-color-heart-fill)}#Main .cell[id^=r] .v2p-auto-hide{overflow:hidden;display:inline-flex;width:0}#Main .cell[id^=r]:has(.v2p-topic-reply-ref) .v2p-member-ref{display:none}#Main #reply-box .v2p-reply-preview{font-size:15px;line-height:1.6}#Main .box .v2p-home-filter-hidden{display:none}#Main .box .v2p-home-filter-revealed{opacity:.35;transition:opacity .15s}#Main .box .v2p-home-filter-revealed:hover{opacity:1}#Main .box .v2p-filter-counter.cell{display:flex;align-items:center;justify-content:center;padding:4px 10px;font-size:13px;color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-bg-subtle)}#Main .box .v2p-filter-counter.cell .v2p-filter-show{cursor:pointer;color:var(--v2p-color-accent-500)}#Main .box .v2p-filter-counter.cell .v2p-filter-show:hover{text-decoration:underline}#Main .cell:hover .v2p-topic-preview-btn,#Main .cell:hover .v2p-topic-ignore-btn,#Rightbar .cell:hover .v2p-topic-preview-btn,#Rightbar .cell:hover .v2p-topic-ignore-btn{visibility:visible}.v2p-checkin-mission-panel{padding:12px 16px;border-top:1px solid var(--v2p-color-divider);font-size:13px;color:var(--v2p-color-foreground);background-color:var(--v2p-color-bg-content)}.v2p-checkin-mission-panel__content{display:flex;gap:10px;align-items:flex-start}.v2p-checkin-mission-panel__mark{display:inline-flex;flex:0 0 22px;align-items:center;justify-content:center;height:22px;border-radius:999px;font-size:13px;font-weight:700;color:var(--v2p-color-accent-700);background-color:var(--v2p-color-accent-100)}.v2p-checkin-mission-panel__copy{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.v2p-checkin-mission-panel__title{line-height:22px}.v2p-checkin-mission-panel__description{margin:0;line-height:1.55;color:var(--v2p-color-font-secondary)}.v2p-checkin-mission-panel__detail{font-size:12px;color:var(--v2p-color-font-tertiary)}.v2p-checkin-mission-panel__actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;margin-left:32px}.v2p-checkin-mission-panel__button{cursor:pointer;padding:3px 9px;border:1px solid var(--v2p-color-border);border-radius:var(--v2p-button-radius);font-size:12px;line-height:20px;color:var(--v2p-color-font-secondary);text-decoration:none;background-color:var(--v2p-color-bg-content)}.v2p-checkin-mission-panel__button:hover{color:var(--v2p-color-foreground);text-decoration:none;background-color:var(--v2p-color-bg-hover-btn)}.v2p-checkin-mission-panel__button:focus-visible{outline:2px solid var(--v2p-color-accent-500);outline-offset:2px}.v2p-checkin-mission-panel__button:disabled{cursor:default;opacity:.65}.v2p-checkin-mission-panel__button[data-action=retry]:disabled{cursor:wait}.v2p-checkin-mission-panel__button--primary{border-color:var(--v2p-color-accent-300);color:var(--v2p-color-accent-700);background-color:var(--v2p-color-accent-50)}.v2p-checkin-mission-panel--success{background-color:var(--v2p-color-accent-50)}.v2p-checkin-mission-panel--waiting .v2p-checkin-mission-panel__mark{color:var(--v2p-color-orange-400);background-color:var(--v2p-color-orange-100)}.v2p-checkin-mission-panel--error{background-color:var(--v2p-color-orange-50)}.v2p-checkin-mission-panel--error .v2p-checkin-mission-panel__mark{color:var(--v2p-color-error);background-color:var(--v2p-color-bg-content)}.v2p-checkin-mission-panel--muted .v2p-checkin-mission-panel__mark{color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-bg-block)}#Rightbar .v2p-info-row{display:block;font-size:12px;color:var(--v2p-color-accent-500);text-align:center}#Rightbar .v2p-info-row:hover{text-decoration:none;background-color:var(--v2p-color-accent-50)}#Rightbar .v2p-info-row.v2p-info-row-muted{color:var(--v2p-color-font-secondary)}#Rightbar .v2p-info-row.v2p-info-row-muted:hover{background-color:var(--v2p-color-bg-block)}#Rightbar .v2p-topic-preview-btn{position:absolute;top:0;right:0;bottom:0;display:inline-flex;align-items:center;justify-content:center;height:20px;font-size:12px;backdrop-filter:blur(8px);box-shadow:0 0 0 3px var(--v2p-color-bg-content)}.v2p-tool-box{position:sticky;z-index:var(--zidx-tools-card);top:var(--v2p-layout-row-gap)}.v2p-tool-box .v2p-tools{display:grid;grid-auto-rows:auto;grid-template-columns:repeat(3, 1fr);gap:8px 15px;align-items:center;justify-content:center;font-size:12px;color:var(--v2p-color-font-secondary)}.v2p-tool{display:inline-flex;gap:0 5px;align-items:center;padding:3px 0}.v2p-tool:hover{color:var(--v2p-color-button-foreground-hover)}.v2p-tool .v2p-tool-icon{width:16px;height:16px}#Rightbar .v2p-hot-filter-hidden{display:none}#Rightbar .v2p-hot-filter-revealed{opacity:.35;transition:opacity .15s}#Rightbar .v2p-hot-filter-revealed:hover{opacity:1}#Rightbar .v2p-hot-filter-counter{display:flex;align-items:center;justify-content:center;padding:6px 10px;font-size:12px;color:var(--v2p-color-font-tertiary)}#Rightbar .v2p-hot-filter-counter .v2p-filter-show{cursor:pointer;color:var(--v2p-color-accent-500)}#Rightbar .v2p-hot-filter-counter .v2p-filter-show:hover{text-decoration:underline}.v2p-toggle-rightbar-btn{cursor:pointer;position:fixed;z-index:9999;top:50%;right:0;transform:translateY(-50%);display:var(--v2p-rightbar-toggle-display, none);align-items:center;justify-content:center;width:24px;height:40px;border-radius:var(--v2p-button-radius) 0 0 var(--v2p-button-radius);background:var(--v2p-color-bg-content);box-shadow:var(--v2p-widget-shadow)}.v2p-toggle-rightbar-icon{width:16px;height:16px}.v2p-topic-actions{display:inline-flex;gap:2px 10px}.v2p-topic-preview-btn{cursor:pointer;border:1px solid var(--v2p-color-border-darker);border-radius:var(--v2p-button-radius);font-size:13px;color:var(--v2p-color-button-foreground);visibility:hidden;background-color:var(--v2p-color-button-background);outline:none;transition:color .25s}.v2p-topic-preview-btn:is(:hover,:focus){color:var(--v2p-color-button-foreground-hover);background-color:var(--v2p-color-button-background-hover)}.v2p-topic-preview-btn:active{transform:scale(0.95);box-shadow:inset 0 0 3px 1px var(--v2p-color-border-darker);transition:all .25s}.v2p-topic-ignore-btn{cursor:pointer;margin-left:8px;visibility:hidden}.v2p-topic-preview{font-size:15px;line-height:1.6;padding:var(--v2p-tp-preview-pd)}.v2p-tpr-loading{--tpr-h: 30px;--tpr-h-p: 22px;display:flex;flex-direction:column;gap:10px;padding:25px}.v2p-tpr-loading .v2p-tpr{border-radius:var(--v2p-button-radius);background-color:var(--v2p-color-bg-tpr)}.v2p-tpr-loading .v2p-tpr-info{display:flex;gap:15px;align-items:center}.v2p-tpr-info-avatar{width:var(--tpr-h);height:var(--tpr-h)}.v2p-tpr-info-text{width:50%;height:var(--tpr-h)}.v2p-tpr-loading .v2p-tpr-content{display:flex;flex-direction:column;gap:12px;padding:15px 0 20px}.v2p-tpr-loading .v2p-tpr-content .v2p-tpr-content-p{height:var(--tpr-h-p)}.v2p-tpr-loading .v2p-tpr-cmt{display:flex;gap:15px;padding-top:15px;border-top:1px solid var(--v2p-color-border)}.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-avatar{width:50px;height:50px}.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right{display:flex;flex:1;flex-direction:column;gap:10px}.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-header{width:50%;height:var(--tpr-h)}.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-p{height:var(--tpr-h-p)}.v2p-tp-info-bar{display:flex;gap:10px;align-items:center;margin-bottom:10px}.v2p-tp-info,.v2p-tp-read{overflow:hidden;display:inline-flex;gap:20px;align-items:center;padding:5px 10px;border-radius:var(--v2p-button-radius);font-size:13px;background-color:var(--v2p-color-button-background)}.v2p-tp-read{cursor:pointer;user-select:none;gap:4px}.v2p-tp-read:hover{background-color:var(--v2p-color-button-background-hover)}.v2p-tp-read-icon{width:16px;height:16px}.v2p-tp-member{display:inline-flex;gap:5px;align-items:center;font-weight:bold}.v2p-tp-avatar{width:20px;height:20px;border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-avatar)}.v2p-topic-preview-addons{margin-top:30px}#Main.v2p-topic-preview>.box{border:1px solid var(--v2p-color-border)}a.v2p-topic-preview-title-link:hover{text-decoration:underline 1.5px;text-underline-offset:.46ex}.v2p-dot{margin:0 8px;font-size:15px;font-weight:800}.v2p-paging{background:none !important}.v2p-paging.cell{border-bottom:none}.v2p-modal-mask{position:fixed;z-index:var(--zidx-modal-mask);inset:0;overflow:hidden;overflow-y:auto;padding:min(2vh,60px);background-color:var(--v2p-color-mask)}.v2p-popup{border:1px solid var(--box-border-color);border-radius:var(--v2p-popup-radius);font-size:14px;background:var(--v2p-color-bg-widget);backdrop-filter:blur(16px);box-shadow:var(--v2p-widget-shadow);position:absolute;z-index:var(--zidx-popup);top:0;left:0}.v2p-popup-content{overflow-y:auto;width:max-content}.v2p-toast{position:fixed;z-index:var(--zidx-toast);top:50px;left:50%;transform:translateX(-50%);padding:10px 15px;border-radius:var(--v2p-popup-radius);font-size:14px;color:var(--v2p-color-background);background:var(--v2p-color-foreground);box-shadow:var(--v2p-toast-shadow)}.v2p-modal-main{position:relative;overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;width:clamp(450px,100%,800px);height:100%;margin:0 auto;border-radius:var(--box-border-radius);background-color:var(--v2p-color-bg-content);outline:none}.v2p-modal-header{display:flex;gap:5px 15px;align-items:center;padding:15px;border-bottom:1px solid var(--box-border-color);background-color:var(--v2p-color-bg-content)}.v2p-modal-footer{display:flex;gap:5px 15px;align-items:center;justify-content:flex-end;padding:15px;border-top:1px solid var(--box-border-color);background-color:var(--v2p-color-bg-content)}.v2p-modal-title{overflow:hidden;padding:2px 0;font-size:16px;font-weight:bold;text-overflow:ellipsis;white-space:nowrap}.v2p-modal-actions{display:flex;gap:0 10px;align-items:center;margin-left:auto}.v2p-modal-content{position:relative;overflow-y:auto;overscroll-behavior-y:contain;flex:1;outline:none}.v2p-modal-content #Main.v2p-topic-preview>.box{border:none;box-shadow:none}.v2p-modal-comments{position:absolute;inset:0;overflow-y:auto;padding:0 20px;visibility:hidden}.v2p-modal-comments.v2p-tab-content-active{z-index:20;visibility:visible}.v2p-modal-comment-tabs{display:flex;gap:4px;align-items:center;padding:4px 5px;border-radius:var(--v2p-button-radius);font-size:14px;font-weight:normal;background-color:var(--button-background-color)}.v2p-modal-comment-tabs>[data-tab-key]{cursor:pointer;padding:4px 5px;border-radius:var(--v2p-button-radius)}.v2p-modal-comment-tabs>[data-tab-key]:hover{background-color:var(--v2p-color-button-background-hover)}.v2p-modal-comment-tabs>[data-tab-key].v2p-tab-active{color:var(--v2p-color-foreground);background-color:var(--v2p-color-accent-100)}.v2p-no-pat{padding:30px 20px;font-size:15px;text-align:center}.v2p-no-pat .v2p-no-pat-title{font-size:16px;font-weight:bold}.v2p-no-pat .v2p-no-pat-desc{display:flex;align-items:center;justify-content:center;margin-top:15px}.v2p-no-pat .v2p-no-pat-block{display:inline-flex;align-items:center;margin:0 5px;padding:2px 10px;border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-block)}.v2p-no-pat .v2p-no-pat-steps{display:flex;flex-wrap:wrap;gap:20px;max-width:800px;margin-top:20px;padding:20px;border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-bg-block)}.v2p-no-pat .v2p-no-pat-step{flex:1}.v2p-no-pat .v2p-no-pat-img{width:100%;border-radius:var(--v2p-box-radius);box-shadow:var(--v2p-widget-shadow)}.v2p-no-pat .v2p-icon-logo{width:15px;height:15px}.v2p-blocked-reply:not(.v2p-blocked-revealed)>table,.v2p-blocked-reply-empty:not(.v2p-blocked-revealed),.v2p-ignored-reply:not(.v2p-ignored-revealed)>table{display:none}.v2p-ignored-reply.v2p-ignored-revealed>.v2p-ignored-placeholder{display:none}.v2p-ignored-placeholder{padding:8px 10px;font-size:12px;color:var(--v2p-color-font-tertiary);text-align:center}.v2p-ignored-placeholder .v2p-ignored-toggle{cursor:pointer;color:var(--v2p-color-accent-500)}.v2p-ignored-placeholder .v2p-ignored-toggle:focus-visible{outline:2px solid var(--v2p-color-accent-500);outline-offset:2px}.v2p-blocked-notice{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;padding:6px 10px;font-size:12px;color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-bg-subtle)}.v2p-blocked-notice .v2p-blocked-toggle{cursor:pointer;color:var(--v2p-color-accent-500)}.v2p-blocked-notice .v2p-blocked-toggle:focus-visible{outline:2px solid var(--v2p-color-accent-500);outline-offset:2px}.v2p-likes-box{user-select:none;position:relative;top:3px;display:inline-flex;column-gap:5px;align-items:center}.v2p-likes-box.v2p-thanked{font-weight:bold;color:var(--v2p-color-heart);opacity:.8}.v2p-likes-box.v2p-thanked .v2p-icon-heart svg{fill:var(--v2p-color-heart)}@supports not selector(:has(*)){#Main .cell[id^=r]>table:hover .v2p-controls{opacity:1}}@supports selector(:has(*)){#Main .cell[id^=r]:not(:has(.cell:hover))>table:hover .v2p-auto-hide{width:auto}#Main .cell[id^=r]:not(:has(.cell:hover))>table:hover .v2p-controls{opacity:1}}.v2p-controls{display:inline-flex;column-gap:15px;align-items:center;margin-right:15px;font-size:12px;opacity:0}.v2p-controls>a{text-decoration:none}.v2p-control{position:relative;z-index:var(--zidx-popup);display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;padding:4px 0;color:var(--v2p-color-font-tertiary)}.v2p-control::after{pointer-events:none;z-index:var(--zidx-tip);overflow:hidden;width:max-content;min-width:30px;padding:2px 5px;border-radius:var(--v2p-popup-radius);font-size:12px;color:var(--v2p-color-foreground);text-align:center;white-space:nowrap;background-color:var(--v2p-color-bg-tooltip);box-shadow:var(--v2p-widget-shadow);position:absolute;z-index:var(--zidx-tip);top:-8px;transform:translateY(-100%);opacity:0;background-color:var(--v2p-color-bg-tooltip)}.v2p-control:hover{color:var(--v2p-color-font-secondary)}.v2p-control.v2p-thanked{cursor:default;color:var(--v2p-color-heart)}.v2p-control.v2p-thank-pending,.v2p-control.v2p-ignore-pending{cursor:wait;opacity:.6}.v2p-control:focus-visible{border-radius:2px;outline:2px solid var(--v2p-color-heart);outline-offset:2px}.v2p-control:hover::after{opacity:1}.v2p-control.v2p-control-hide::after{content:\"隐藏回复\"}.v2p-control.v2p-control-thank::after{content:\"感谢回复\"}.v2p-control.v2p-control-thank.v2p-thanked::after{content:\"已感谢\"}.v2p-control.v2p-control-reply::after{content:\"回复\"}@media(hover: none){.v2p-controls{opacity:1}}.topic_buttons .v2p-tb.v2p-hover-btn{color:var(--v2p-color-font-secondary)}.topic_buttons .v2p-tb.v2p-hover-btn::after{display:none}.topic_buttons .v2p-tb.v2p-hover-btn:hover{color:currentColor}.v2p-tb-icon{width:15px;height:15px}.v2p-emoji-container{overflow-y:auto;max-height:285px;padding:15px 18px;color:var(--v2p-color-font-secondary)}.v2p-member-card{--v2p-card-spacing: 10px;max-width:320px;max-height:420px;padding:12px;font-size:13px;text-align:left}.v2p-member-card .v2p-info{display:flex;gap:15px}.v2p-member-card .v2p-info-right{padding:2px 0}.v2p-member-card .v2p-avatar-box{overflow:hidden;display:inline-block;width:73px;height:73px;border-radius:var(--v2p-box-radius);background-color:var(--button-background-hover-color)}.v2p-member-card .v2p-avatar{width:100%;height:100%}.v2p-member-card .v2p-username{font-size:16px;font-weight:bold}.v2p-member-card .v2p-no{margin:5px 0}.v2p-member-card .v2p-no,.v2p-member-card .v2p-created-date{width:160px;height:16px}.v2p-member-card .v2p-loading{border-radius:var(--v2p-button-radius);background-color:var(--button-background-hover-color)}.v2p-member-card .v2p-bio{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-height:1.4;padding-top:var(--v2p-card-spacing)}.v2p-member-card-actions{display:flex;gap:6px;align-items:center;padding:var(--v2p-card-spacing) 0 0}.v2p-member-topics{margin-top:var(--v2p-card-spacing);padding-top:var(--v2p-card-spacing);border-top:1px solid var(--box-border-color)}.v2p-member-topics-header{margin-bottom:8px;font-size:12px;font-weight:500;color:var(--v2p-color-font-secondary)}.v2p-member-topics-list{display:flex;flex-direction:column;gap:4px}.v2p-member-topic-item-row{display:flex;gap:4px;align-items:center}.v2p-member-topic-item-row .v2p-topic-preview-btn{max-width:0;height:19px;max-height:0;padding:0 4px;font-size:12px;visibility:hidden}.v2p-member-topic-item-row:hover .v2p-topic-preview-btn{max-width:unset;max-height:unset;visibility:visible}.v2p-member-topic-item{overflow:hidden;flex:1;min-width:0;padding-left:2px;border-radius:var(--v2p-button-radius);font-size:13px;line-height:1.5;color:var(--v2p-color-font-primary);text-decoration:none;text-overflow:ellipsis;white-space:nowrap}.v2p-member-topic-item::before{content:\"▸\";margin-right:4px;color:var(--v2p-color-font-tertiary)}.v2p-member-topic-item:hover{text-decoration:none;background-color:var(--v2p-color-bg-link-hover)}.v2p-reply-tags{cursor:pointer;display:inline-flex;margin:0 0 2px;padding:0 3px;border-radius:var(--v2p-button-radius);font-size:12px;background-color:var(--button-background-hover-color)}.v2p-reply-tags-inline{overflow:hidden;max-width:300px;margin:0 5px 0 0;text-overflow:ellipsis;white-space:nowrap}.v2p-emoticons-box{font-size:15px}.v2p-emoji-group~.v2p-emoji-group{margin-top:10px}.v2p-emoji-title{margin:0 0 10px;font-size:14px;text-align:left}.v2p-emoji-list{display:grid;grid-template-columns:repeat(8, 1fr);gap:5px;font-size:20px}.v2p-emoji{cursor:pointer;height:20px;padding:3px;border-radius:var(--v2p-button-radius);line-height:20px}.v2p-emoji:hover{background-color:var(--box-background-hover-color)}.v2p-emoji>img{height:100%}.v2p-decode{cursor:copy;position:relative;padding:2px 4px;font-size:13px;color:var(--v2p-color-orange-400);text-decoration:none;background-color:var(--v2p-color-orange-50)}.v2p-decode::after{pointer-events:none;z-index:var(--zidx-tip);overflow:hidden;width:max-content;min-width:30px;padding:2px 5px;border-radius:var(--v2p-popup-radius);font-size:12px;color:var(--v2p-color-foreground);text-align:center;white-space:nowrap;background-color:var(--v2p-color-bg-tooltip);box-shadow:var(--v2p-widget-shadow);content:attr(data-title);position:absolute;top:-8px;left:50%;transform:translate(-50%, -100%);opacity:0;background-color:var(--v2p-color-bg-tooltip)}.v2p-decode:hover{color:var(--v2p-color-orange-400)}.v2p-decode:hover::after{opacity:1}.v2p-reply-content{position:relative}.v2p-reply-content .v2p-expand-btn.normal.button{position:absolute;z-index:var(--zidx-expand-btn);bottom:5px;left:50%;transform:translateX(-50%);font-size:12px;font-weight:400}.v2p-reply-content.v2p-collapsed{overflow:hidden;max-height:250px;padding-bottom:0}.v2p-reply-content.v2p-collapsed::before{pointer-events:none;content:\"\";position:absolute;z-index:var(--zidx-expand-mask);right:0;bottom:0;left:0;height:130px;background:linear-gradient(to top, var(--bg-reply) 10px, transparent)}.v2p-reply-content.v2p-collapsed .reply_content a,.v2p-reply-content.v2p-collapsed .reply_content .embedded_video{pointer-events:none}.v2p-reply-content.v2p-collapsed .v2p-expand-btn.normal.button{bottom:10px;transform:translateX(-50%)}.v2p-reply-content:not(.v2p-collapsed){overflow:auto;max-height:none;padding-bottom:40px}.cell[id^=r] .cell[id^=r] .v2p-reply-content .v2p-expand-btn.normal.button{color:var(--v2p-color-button-foreground);background:var(--v2p-color-button-background-hover);box-shadow:var(--button-hover-shadow)}.v2p-empty-content{display:flex;flex-direction:column;align-items:center;padding-top:20px;font-size:14px;color:var(--v2p-color-font-secondary)}.v2p-empty-content .v2p-text-emoji{font-size:20px}.v2p-topic-reply-ref{margin:0 -10px 15px;padding:5px 10px;border-radius:var(--v2p-box-radius);font-size:13px;color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-bg-block)}.v2p-topic-reply-box{margin-top:50px;padding:30px 0;border-top:1px solid var(--v2p-color-divider);font-size:14px;line-height:1.55;color:var(--v2p-color-font-secondary)}.v2p-topic-reply~.v2p-topic-reply{margin-top:15px}.v2p-topic-reply-member{display:inline;font-weight:bold;color:var(--v2p-color-main-700)}.v2p-topic-reply-avatar{position:relative;top:2px;overflow:hidden;width:15px;height:15px;margin-right:5px;border-radius:var(--v2p-box-radius);object-fit:cover;background-color:var(--v2p-color-bg-avatar)}.v2p-topic-reply-content{display:inline}.v2p-topic-reply-tip{margin-top:20px;font-size:13px;color:var(--v2p-color-font-quaternary);text-align:center}.v2p-reply-wrap{resize:none;overflow:hidden;height:unset;min-height:140px !important;max-height:800px !important;border:1px solid var(--button-border-color);border-radius:var(--v2p-input-radius);font-size:15px;color:currentColor;background-color:var(--v2p-color-bg-input);transition:opacity .25s}.v2p-reply-wrap::placeholder{font-size:15px;color:var(--v2p-color-font-tertiary)}.v2p-reply-wrap:is(:focus,:focus-within){border-color:var(--button-border-hover-color);background-color:rgba(0,0,0,0);outline:none;box-shadow:none}.v2p-reply-wrap #reply_content{border:none;background-color:rgba(0,0,0,0)}.v2p-reply-wrap #reply_content::placeholder{font-size:14px;color:var(--v2p-color-font-tertiary)}.v2p-reply-wrap #reply_content:focus{background-color:var(--v2p-color-bg-content);outline:none}.v2p-reply-upload-bar{cursor:pointer;padding:6px 10px;border-top:1px dashed var(--v2p-color-border-darker);font-size:12px;color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-bg-input)}.v2p-reply-upload-bar-disabled{pointer-events:none}.v2p-footer{position:relative;display:flex;align-items:center;justify-content:space-between;padding:35px 10px 20px;border-top:1px solid var(--v2p-color-divider);font-size:12px;color:var(--v2p-color-font-tertiary)}.v2p-footer a:hover{text-decoration:none}.v2p-footer-logo{--logo-size: 16px;position:absolute;top:calc(-1*(var(--logo-size) + 5px)/2);left:50%;transform:translateX(-50%);display:inline-flex;box-sizing:border-box;padding:3px 25px;background-color:var(--v2p-color-bg-footer)}.v2p-footer-logo svg{width:var(--logo-size)}.v2p-footer-text{display:inline-flex;align-items:center;justify-content:flex-start;width:240px;color:var(--v2p-color-font-secondary)}.v2p-footer-links{display:inline-flex;gap:0 8px;align-items:center}.v2p-footer-link{padding:4px 5px;color:currentColor}.v2p-footer-brand{display:inline-flex;gap:0 15px;align-items:center;justify-content:flex-end;width:240px}.v2p-footer-brand .v2p-github-ref{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;padding:2px 0}.v2p-color-mode-toggle{width:22px;height:22px;opacity:.8}.v2p-color-mode-toggle:hover{opacity:1}.v2p-reply-tabs{display:flex;gap:0 6px;align-items:center;font-size:14px}.v2p-reply-tabs .v2p-reply-tab{cursor:pointer;padding:2px 3px}.v2p-reply-tabs .v2p-reply-tab.active{text-decoration:underline;text-decoration-color:var(--v2p-color-font-tertiary);text-decoration-thickness:2px;text-underline-offset:4px}.v2p-select-dropdown{display:flex;flex-direction:column;gap:1px;padding:5px;border-radius:var(--v2p-popup-radius);font-size:12px;text-align:left}.v2p-select-item{cursor:pointer;padding:5px 10px;border-radius:var(--v2p-button-radius);white-space:nowrap}.v2p-select-item:hover{background-color:var(--v2p-color-button-background-hover)}.v2p-select-item.v2p-select-item-active{background-color:var(--v2p-color-accent-50)}.v2p-select-divider{pointer-events:none;height:1px;margin:5px 0;background-color:var(--v2p-color-border)}.v2p-preview-retry,.v2p-topic-preview-retry,a.v2p-preview-retry,a.v2p-topic-preview-retry,a:link.v2p-preview-retry,a:link.v2p-topic-preview-retry{text-decoration:underline 1px;text-underline-offset:var(--v2p-underline-offset);cursor:pointer}.v2p-indent .v2p-member-ref{display:none}.v2p-member-ref+br{display:none}.v2p-member-ref+br+b{display:none}.v2p-member-ref.v2p-member-ref-show{display:inline !important}.v2p-layout-toggle{display:inline-block;width:18px;height:18px;padding:4px 2px;color:var(--v2p-color-font-tertiary)}.v2p-content-layout.v2p-content-layout.content{--v2p-content-width: 2000px}.v2p-content-layout.v2p-content-layout.content #Main.v2p-horizontal-layout{display:flex;flex-wrap:wrap;gap:var(--v2p-layout-column-gap);max-width:unset}.v2p-left-side{flex:1;min-width:0}.v2p-left-side>.v2p-left-group{position:sticky;z-index:var(--zidx-reply-box);top:0;display:flex;flex-direction:column;max-height:calc(100vh - var(--v2p-nav-height) - var(--v2p-layout-row-gap))}.v2p-left-side>.v2p-left-group .sep,.v2p-left-side>.v2p-left-group .sep20,.v2p-left-side>.v2p-left-group>#topic-tip-box{flex-shrink:0}.v2p-left-side>.v2p-left-group>.box:has(.topic_buttons){display:flex;flex:1;flex-direction:column;min-height:0}.v2p-left-side>.v2p-left-group>.box:has(.topic_buttons)>.header{flex-shrink:0}.v2p-left-side .v2p-left-side-content{overflow:auto;flex:1;margin-right:calc(var(--v2p-spacing-box)*-1);padding-right:var(--v2p-spacing-box);border-bottom:1px solid var(--box-border-color)}.v2p-right-side{flex:1;min-width:0}.v2p-register-days{display:inline-flex;align-items:center;margin-left:2px;padding:0 2px;border-radius:var(--v2p-button-radius);color:var(--v2p-color-orange-400);background-color:var(--v2p-color-orange-100)}.v2p-register-days.v2p-register-days-large{display:inline-flex;margin-left:10px;padding:2px 5px;border-radius:var(--v2p-button-radius);font-size:16px;line-height:1.4}.v2p-topics-hot-loading{display:flex;align-items:center;justify-content:center;padding:50px 0;color:currentColor}.v2p-topics-hot-loading .v2p-icon-loading{width:40px}.v2p-topics-hot-empty{display:flex;align-items:center;justify-content:center;min-height:84px;margin:12px 10px 10px;padding:18px 16px;border:1px dashed var(--v2p-color-divider);border-radius:var(--v2p-input-radius);font-size:13px;line-height:1.6;color:var(--v2p-color-font-tertiary);text-align:center;background-color:var(--v2p-color-bg-subtle)}.v2p-topics-hot-header{display:flex;align-items:center}.v2p-topics-hot-picker{cursor:pointer;display:inline-flex;gap:4px;align-items:center;margin-left:auto;padding:1px 6px;border-radius:var(--v2p-button-radius);font-size:13px;background-color:var(--v2p-color-button-background)}.v2p-topics-hot-picker:hover{background-color:var(--v2p-color-button-background-hover)}.v2p-topics-hot-icon{position:relative;top:-2px;width:1em;height:1em}.v2p-tag-block{margin-bottom:10px}@supports(filter: blur(6px)){.v2p-hide-account{opacity:.5;filter:blur(6px)}}@supports not (filter: blur(6px)){.v2p-hide-account{opacity:0}}@supports(filter: blur(6px)){.v2p-hide-balance{opacity:.5;filter:blur(6px)}.v2p-hide-balance:hover{opacity:1;filter:none}}@supports not (filter: blur(6px)){.v2p-hide-balance{opacity:0}.v2p-hide-balance:hover{opacity:1}}.v2p-member-name{display:flex;align-items:center}.v2p-settings-header.page-content-header{gap:10px}.v2p-settings-header.page-content-header .v2p-settings-icon{width:40px;height:40px;margin:0}.v2p-settings-header.page-content-header .v2p-settings-title{padding:0;white-space:nowrap}.v2p-settings-header.page-content-header .v2p-settings-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end}.v2p-link-preview-btn{cursor:pointer;user-select:none;display:inline-flex;height:100%;margin-left:5px;padding:0 5px;border-radius:var(--v2p-button-radius);font-size:12px;color:var(--v2p-color-bg-content);background-color:var(--v2p-color-accent-500)}.v2p-link-preview-btn:hover{background-color:var(--v2p-color-accent-600)}#node_sidebar.v2p-node-sidebar-flamewar{border:1px solid var(--v2p-color-orange-400);border-radius:var(--v2p-box-radius);background-color:var(--v2p-color-orange-50)}.v2p-topic-preview-frame{width:100%;height:100%;border:none}.v2p-topic-preview-wrapper{overflow:hidden;width:100%;height:100%}.v2p-sync-dialog-main.v2p-modal-main{height:auto}.v2p-sync-dialog-main.v2p-modal-main .v2p-modal-content{padding:var(--v2p-spacing-box)}.v2p-sync-dialog-message{margin:0 0 var(--v2p-spacing-cell);font-size:15px;font-weight:500;line-height:1.6;color:var(--v2p-color-foreground)}.v2p-sync-dialog-message-sub{margin:0 0 calc(var(--v2p-spacing-cell)*.75);padding:calc(var(--v2p-spacing-cell)*.75) var(--v2p-spacing-cell);border-radius:var(--v2p-input-radius);font-size:14px;line-height:1.6;color:var(--v2p-color-font-secondary);background-color:var(--v2p-color-bg-input)}.v2p-sync-dialog-message-sub strong{font-weight:600;color:var(--v2p-color-foreground)}.v2p-sync-dialog-message-question{margin:calc(var(--v2p-spacing-cell)*1.25) 0 var(--v2p-spacing-cell);font-size:15px;font-weight:500;line-height:1.6;color:var(--v2p-color-foreground)}.v2p-sync-dialog-message-tip{margin:calc(var(--v2p-spacing-cell)*.5) 0 0;padding:calc(var(--v2p-spacing-cell)*.5) var(--v2p-spacing-cell);border-radius:var(--v2p-input-radius);font-size:13px;line-height:1.5;color:var(--v2p-color-font-tertiary);background-color:var(--v2p-color-bg-subtle)}.v2p-modal-footer .v2p-sync-skip-btn,.v2p-modal-footer .v2p-sync-confirm-btn{height:32px;padding:0 16px;font-size:14px}.v2p-modal-footer .v2p-sync-confirm-btn{font-weight:600}\n";

//#endregion
//#region src/utils/date.ts
/**
	* 将时间戳格式化为「年月日 时:分:秒」。
	*/
	function formatTimestamp(timestamp, { format = "YMD" } = {}) {
		const date = new Date(timestamp.toString().length === 10 ? timestamp * 1e3 : timestamp);
		const YMD = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
		if (format === "YMDHM") return `${YMD} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
		if (format === "YMDHMS") return `${YMD} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
		return YMD;
	}
	/**
	* 解析日期时间字符串并转换为指定格式
	*
	* @param dateTimeString - 日期时间字符串，支持多种格式如 "2024-10-18 08:57:40 +08:00"
	* @param options - 配置选项
	* @returns 解析结果对象
	*/
	function parseDateTime(dateTimeString, options = {}) {
		const { format = "YYYY-MM-DD HH:mm" } = options;
		try {
			const trimmedInput = dateTimeString.trim();
			if (!trimmedInput) return {
				success: false,
				error: "日期时间字符串不能为空"
			};
			let date;
			if (trimmedInput.includes("+") || trimmedInput.includes("Z")) date = new Date(trimmedInput);
			else if (trimmedInput.includes("T")) date = new Date(trimmedInput);
			else {
				const normalizedString = trimmedInput.replace(/\//g, "-");
				date = new Date(normalizedString);
			}
			if (isNaN(date.getTime())) return {
				success: false,
				error: "无效的日期时间格式"
			};
			let formatted;
			if (format === "timestamp") formatted = date.getTime();
			else {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, "0");
				const day = date.getDate().toString().padStart(2, "0");
				const hours = date.getHours().toString().padStart(2, "0");
				const minutes = date.getMinutes().toString().padStart(2, "0");
				const seconds = date.getSeconds().toString().padStart(2, "0");
				switch (format) {
					case "YYYY-MM-DD HH:mm":
						formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
						break;
					case "YYYY/MM/DD HH:mm":
						formatted = `${year}/${month}/${day} ${hours}:${minutes}`;
						break;
					case "YYYY-MM-DD HH:mm:ss":
						formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
						break;
					case "YYYY/MM/DD":
						formatted = `${year}/${month}/${day}`;
						break;
					case "MM/DD HH:mm":
						formatted = `${month}/${day} ${hours}:${minutes}`;
						break;
					case "HH:mm:ss":
						formatted = `${hours}:${minutes}:${seconds}`;
						break;
					default: formatted = `${year}/${month}/${day} ${hours}:${minutes}`;
				}
			}
			return {
				success: true,
				formatted,
				date
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "解析日期时间时发生未知错误"
			};
		}
	}
	/**
	* 从字符串中提取天数。
	*/
	function extractDays(str) {
		const match = str.match(/(\d+)\s*天前/);
		return match ? Number(match[1]) : null;
	}
	var init_date = __esmMin((() => {}));

//#endregion
//#region src/background/check-in-utils.ts
/** 判断页面是否已展示领取成功或已领取的提示。 */
	function hasClaimedReward(text) {
		return CLAIMED_MARKERS.some((marker) => text.includes(marker));
	}
	/**
	* 获取时间戳对应的 UTC 日期键，例如 `2026-10-22`。
	*
	* V2EX 的每日登录奖励按 UTC 日期计算，重置点为 UTC 00:00（北京时间 08:00），
	* 因此与奖励日相关的判断必须使用 UTC 日期。
	*/
	function getUtcDayKey(timestamp) {
		const date = new Date(timestamp);
		return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
	}
	/** 获取时间戳所在 UTC 日期的起点（UTC 00:00）。 */
	function getUtcDayStart(timestamp) {
		return Math.floor(timestamp / DAY_MS$1) * DAY_MS$1;
	}
	/**
	* 从签到页面 HTML 中提取领取入口。
	*
	* 同时兼容三种写法：单/双引号属性、内联脚本，以及新版表单入口，
	* 避免依赖页面的具体格式。
	*/
	function extractRedeemPath(html) {
		const matched = html.match(redeemPathPattern)?.[0];
		if (matched) return matched.replaceAll("&amp;", "&");
		const formHtml = html.match(redeemFormPattern)?.[0];
		if (!formHtml) return null;
		const value = (formHtml.match(redeemOnceInputPattern)?.[0])?.match(onceValuePattern)?.[1];
		return value ? `/mission/daily/redeem?once=${value}` : null;
	}
	/** 从签到页面文本中解析已连续登录天数。 */
	function parseCheckInDays(text) {
		const matchedArr = text.match(checkInDaysPattern);
		if (!matchedArr) return;
		const days = Number(matchedArr[1]);
		return Number.isNaN(days) ? void 0 : days;
	}
	/** 判断路径是否落在登录或注册页。 */
	function isSignInPath(path) {
		return path ? /^\/(signin|signup)\b/.test(path) : false;
	}
	/** 判断页面内容是否为人机验证/风控拦截页。 */
	function isChallengePage(html) {
		const content = html.toLowerCase();
		return challengeSignatures.some((signature) => content.includes(signature));
	}
	/**
	* 解析 /mission/daily 页面，判断接下来应该领取、已领取、未登录、被风控还是页面无法识别。
	*
	* 优先使用响应最终地址判断登录态：未登录时服务端会重定向到登录页，
	* 仅靠 HTML 里的登录链接容易因为页面变形而漏判。
	*/
	function parseCheckInPage(html, finalUrlPath) {
		if (isSignInPath(finalUrlPath)) return { type: "unauthenticated" };
		const redeemPath = extractRedeemPath(html);
		if (redeemPath) return {
			type: "redeem",
			path: redeemPath
		};
		if (hasClaimedReward(html)) return {
			type: "already",
			checkInDays: parseCheckInDays(html)
		};
		if (html.includes("/signin?next=")) return { type: "unauthenticated" };
		if (isChallengePage(html)) return { type: "challenge" };
		return { type: "unknown" };
	}
	/**
	* 判断本次是否需要发起签到请求，返回跳过原因。
	*/
	function getCheckInSkipReason(params) {
		const { now, lastCheckInTime, lastCheckInDay, nextActionAt } = params;
		const checkedInDay = lastCheckInDay ?? (lastCheckInTime ? getUtcDayKey(lastCheckInTime) : void 0);
		if (checkedInDay && checkedInDay === getUtcDayKey(now)) return "今日已签到";
		if (now - getUtcDayStart(now) < 3e5) return "等待 V2EX 奖励日重置";
		if (nextActionAt !== void 0 && now < nextActionAt) return "尚未到下次签到时间";
	}
	/** 获取失败分类对应的展示文案。 */
	function describeCheckInErrorCode(code) {
		return code ? errorCodeTextMap[code] : errorCodeTextMap.unknown;
	}
	/** 获取失败阶段的展示文案。 */
	function describeCheckInStage(stage) {
		return stage ? stageTextMap[stage] : "未知";
	}
	/** 获取触发来源的展示文案。 */
	function describeCheckInTrigger(trigger) {
		return trigger ? triggerTextMap[trigger] : "未知";
	}
	function getVerifiedStateMemberName(dailyInfo) {
		if (dailyInfo?.schemaVersion !== 3) return;
		return dailyInfo.memberName?.trim() || void 0;
	}
	/**
	* 汇总 popup 需要的签到展示状态。
	*
	* 只有当天真正发起过请求才返回 failed，避免把前一天的失败当成今天的失败；
	* 关闭自动签到但今日已签到时仍视为已签到。
	*/
	function resolveCheckInDisplayState(params) {
		const { now, dailyInfo, autoCheckInEnabled, currentMemberName } = params;
		const today = getUtcDayKey(now);
		const checkedInDay = dailyInfo?.lastCheckInDay ?? (dailyInfo?.lastCheckInTime ? getUtcDayKey(dailyInfo.lastCheckInTime) : void 0);
		const stateMemberName = getVerifiedStateMemberName(dailyInfo);
		const normalizedCurrentMemberName = currentMemberName?.trim() || void 0;
		const identityMatches = stateMemberName !== void 0 && (normalizedCurrentMemberName === void 0 || stateMemberName === normalizedCurrentMemberName);
		if (identityMatches && checkedInDay === today) return {
			type: "checked-in",
			checkInTime: dailyInfo?.lastCheckInTime ?? dailyInfo?.lastAttemptTime ?? now,
			checkInDays: dailyInfo?.checkInDays
		};
		if (!autoCheckInEnabled) return { type: "auto-disabled" };
		const lastAttemptTime = dailyInfo?.lastAttemptTime;
		if (identityMatches && dailyInfo?.lastResult === "failed" && lastAttemptTime && getUtcDayKey(lastAttemptTime) === today) return {
			type: "failed",
			attemptTime: lastAttemptTime,
			code: dailyInfo.lastErrorCode,
			reason: dailyInfo.lastError,
			httpStatus: dailyInfo.lastHttpStatus,
			retryAt: dailyInfo.nextActionAt,
			userMessage: dailyInfo.userMessage,
			needsAction: dailyInfo.phase === "needs-action"
		};
		return {
			type: "not-attempted",
			nextActionAt: identityMatches ? dailyInfo?.nextActionAt : void 0,
			skipReason: identityMatches ? getCheckInSkipReason({
				now,
				lastCheckInTime: dailyInfo?.lastCheckInTime,
				lastCheckInDay: dailyInfo?.lastCheckInDay,
				nextActionAt: dailyInfo?.nextActionAt
			}) : "账号签到状态待确认"
		};
	}
	/** 判断是否需要在主页提醒签到异常：同一天连续失败达到阈值。 */
	function shouldPromptCheckInFailure(state, failureCount) {
		return state.type === "failed" && (state.needsAction || (failureCount ?? 0) >= 2);
	}
	function formatTimezone(offsetMinutes) {
		const hours = -offsetMinutes / 60;
		if (!Number.isFinite(hours)) return "UTC";
		const sign = hours >= 0 ? "+" : "-";
		const abs = Math.abs(hours);
		return `UTC${sign}${Number.isInteger(abs) ? String(abs) : abs.toFixed(1)}`;
	}
	/**
	* 生成可直接粘贴到问题反馈中的签到诊断文本。
	*
	* 只包含签到状态与技术元数据，不含账号、Cookie 或页面原文。
	*/
	function buildCheckInDiagnostic(input) {
		const { now, dailyInfo, autoCheckInEnabled, extensionVersion, browser, timezoneOffsetMinutes } = input;
		const state = resolveCheckInDisplayState({
			now,
			dailyInfo,
			autoCheckInEnabled
		});
		const identityVerified = getVerifiedStateMemberName(dailyInfo) !== void 0;
		const stateText = {
			"checked-in": "今日已签到",
			failed: "签到失败",
			"not-attempted": "今日尚未签到",
			"auto-disabled": "自动签到已关闭"
		};
		const isChallenge = state.type === "failed" && state.code === "challenge";
		const lines = [
			"V2EX Polish 签到诊断",
			`生成时间：${formatTimestamp(now, { format: "YMDHMS" })}（${formatTimezone(timezoneOffsetMinutes)}）`,
			`扩展版本：${extensionVersion}`,
			`浏览器：${browser}`,
			`自动签到：${autoCheckInEnabled ? "已开启" : "已关闭"}`,
			`账号状态：${identityVerified ? "已确认" : "待确认"}`,
			`今日状态：${isChallenge ? "等待完成 V2EX 人机验证" : stateText[state.type]}`
		];
		if (state.type === "not-attempted" && state.skipReason) lines.push(`跳过原因：${state.skipReason}`);
		if (state.type === "failed") {
			lines.push(`失败分类：${state.code ?? "unknown"}（${describeCheckInErrorCode(state.code).title}）`, `失败阶段：${describeCheckInStage(dailyInfo?.lastErrorStage)}`);
			if (state.reason) lines.push(`失败原因：${state.reason}`);
			if (state.code === "challenge") lines.push("插件状态：运行正常", `处理建议：${CHECK_IN_CHALLENGE_COPY.advice}`);
		}
		if (state.type === "not-attempted" && state.nextActionAt) lines.push(`下次自动尝试：${formatTimestamp(state.nextActionAt, { format: "YMDHMS" })}`);
		if (dailyInfo?.nextActionAt) lines.push(`计划重试：${formatTimestamp(dailyInfo.nextActionAt, { format: "YMDHMS" })}`);
		if (dailyInfo?.retryCause) lines.push(`重试分类：${dailyInfo.retryCause}`);
		if (dailyInfo?.lastHttpStatus !== void 0) lines.push(`HTTP 状态：${dailyInfo.lastHttpStatus}`);
		if (dailyInfo?.lastFinalUrlPath) lines.push(`最终地址：${dailyInfo.lastFinalUrlPath}`);
		if (dailyInfo?.lastDurationMs !== void 0) lines.push(`请求耗时：${dailyInfo.lastDurationMs} ms`);
		if (dailyInfo?.lastTrigger) lines.push(`触发来源：${describeCheckInTrigger(dailyInfo.lastTrigger)}`);
		if (dailyInfo?.lastAttemptTime) lines.push(`最近尝试：${formatTimestamp(dailyInfo.lastAttemptTime, { format: "YMDHMS" })}`);
		if (dailyInfo?.lastCheckInTime) lines.push(`最近成功：${formatTimestamp(dailyInfo.lastCheckInTime, { format: "YMDHMS" })}`);
		if (dailyInfo?.checkInDays !== void 0) lines.push(`连续登录：${dailyInfo.checkInDays} 天`);
		const { memberName: _memberName, ...diagnosticDailyInfo } = dailyInfo ?? {};
		lines.push(`原始记录：${JSON.stringify(diagnosticDailyInfo)}`);
		return lines.join("\n");
	}
	var CLAIMED_MARKERS, RECLICK_TEXT, CHECK_IN_CHALLENGE_COPY, REWARD_RESET_GRACE_MS, CHECK_IN_FAILURE_PROMPT_THRESHOLD, DAY_MS$1, redeemPathPattern, redeemFormPattern, redeemOnceInputPattern, onceValuePattern, checkInDaysPattern, challengeSignatures, errorCodeTextMap, stageTextMap, triggerTextMap;
	var init_check_in_utils = __esmMin((() => {
		init_date();
		CLAIMED_MARKERS = ["已成功领取每日登录奖励", "登录奖励已领取"];
		RECLICK_TEXT = "请重新点击一次以领取每日登录奖励";
		CHECK_IN_CHALLENGE_COPY = {
			title: "V2EX 要求完成人机验证",
			message: "这是 V2EX 的安全验证，不是插件故障。自动签到已暂停，请打开签到页完成验证后领取每日奖励。",
			advice: "请打开签到页完成人机验证后领取每日奖励；自动签到已暂停，不会持续重试。",
			failureReason: "V2EX 要求完成人机验证，自动签到已暂停"
		};
		REWARD_RESET_GRACE_MS = 3e5;
		CHECK_IN_FAILURE_PROMPT_THRESHOLD = 2;
		DAY_MS$1 = 864e5;
		redeemPathPattern = /\/mission\/daily\/redeem\?once=[A-Za-z0-9_%.-]+/;
		redeemFormPattern = /<form\b[^>]*\baction=["']?[^"'\s>]*\/mission\/daily\/redeem[^>]*>[\s\S]*?<\/form>/i;
		redeemOnceInputPattern = /<input\b[^>]*\bname=["']?once["']?[^>]*>/i;
		onceValuePattern = /\bvalue=["']?([A-Za-z0-9_%.-]+)["']?/i;
		checkInDaysPattern = /已连续登录\s*(\d+)\s*天/;
		challengeSignatures = [
			"_cf_chl_opt",
			"cf-browser-verification",
			"checking your browser before accessing",
			"enable javascript and cookies to continue",
			"just a moment...",
			"attention required! | cloudflare",
			"verifying you are human",
			"正在验证您是否是真人",
			"请完成安全验证"
		];
		errorCodeTextMap = {
			timeout: {
				title: "签到请求超时",
				hint: "网络较慢或连接被拦截，点击重试"
			},
			network: {
				title: "网络异常",
				hint: "无法连接 V2EX，点击重试"
			},
			http: {
				title: "请求被 V2EX 拒绝",
				hint: "服务器返回异常状态，点击重试"
			},
			unauthenticated: {
				title: "登录状态已失效",
				hint: "请先登录 V2EX，再点击重试"
			},
			challenge: {
				title: CHECK_IN_CHALLENGE_COPY.title,
				hint: CHECK_IN_CHALLENGE_COPY.message
			},
			"unexpected-page": {
				title: "无法确认签到结果",
				hint: "V2EX 返回了异常页面，点击重新核对"
			},
			"redeem-failed": {
				title: "无法确认领取结果",
				hint: "领取后未看到成功提示，点击重新核对"
			},
			unknown: {
				title: "签到失败",
				hint: "点击重试"
			}
		};
		stageTextMap = {
			"request-page": "请求签到页",
			"parse-page": "解析签到页",
			redeem: "发起领取请求",
			"parse-redeem": "解析领取结果"
		};
		triggerTextMap = {
			alarm: "定时任务",
			startup: "浏览器启动",
			tab: "打开 V2EX 页面",
			refresh: "刷新 V2EX 页面",
			online: "网络恢复",
			popup: "打开扩展弹窗",
			manual: "手动点击"
		};
	}));

//#endregion
//#region src/utils/object.ts
/**
	* 判断是否为简单 JS 对象（不包括 Array）。
	*/
	function isPlainObject(value) {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	}
	/**
	* 深度合并两个对象。
	*/
	function deepMerge(target, source) {
		const result = {};
		for (const key in target) {
			const targetProp = target[key];
			const sourceProp = source[key];
			if (isPlainObject(targetProp) && isPlainObject(sourceProp)) result[key] = deepMerge(targetProp, sourceProp);
			else if (Reflect.has(source, key)) result[key] = sourceProp;
			else result[key] = targetProp;
		}
		for (const key in source) if (!Reflect.has(target, key)) result[key] = source[key];
		return result;
	}
	var init_object = __esmMin((() => {}));

//#endregion
//#region src/utils/api-error.ts
/**
	* 判断错误是否为请求取消错误
	*/
	function isAbortError(error) {
		return error instanceof Error && error.name === "AbortError";
	}
	/**
	* 包装 fetch 请求错误，提供用户友好的错误消息
	*
	* @param error - 原始错误
	* @param fallbackMessage - 默认的用户友好错误消息
	* @returns ApiError 实例
	*/
	function wrapApiError(error, fallbackMessage) {
		if (error instanceof ApiError) return error;
		if (isAbortError(error)) return new ApiError({
			message: "请求被取消",
			cause: error
		});
		if (error instanceof Error) return new ApiError({
			message: fallbackMessage,
			cause: error
		});
		return new ApiError({
			message: fallbackMessage,
			cause: error
		});
	}
	function extractErrorMessageFromPayload(payload) {
		if (!isPlainObject(payload)) return;
		const message = payload.message;
		if (typeof message === "string" && message.trim()) return message.trim();
		const error = payload.error;
		if (isPlainObject(error) && typeof error.message === "string" && error.message.trim()) return error.message.trim();
	}
	async function getResponseErrorMessage(response, fallbackMessage) {
		const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
		let detail = "";
		try {
			if (contentType.includes("application/json")) detail = extractErrorMessageFromPayload(await response.clone().json()) ?? "";
		} catch {}
		if (!detail) try {
			const text = (await response.clone().text()).replace(/\s+/g, " ").trim();
			if (text && !text.startsWith("<!DOCTYPE") && !text.startsWith("<html")) detail = text.slice(0, 200);
		} catch {}
		if (detail) {
			if (detail === fallbackMessage || detail.startsWith(`${fallbackMessage}：`) || detail.startsWith(`${fallbackMessage}:`)) return detail;
			return `${fallbackMessage}：${detail}`;
		}
		return response.status ? `${fallbackMessage}（HTTP ${response.status}）` : fallbackMessage;
	}
	/**
	* 从 HTTP 响应创建 API 错误
	*
	* @param response - fetch 响应对象
	* @param fallbackMessage - 默认的用户友好错误消息
	*/
	async function createApiErrorFromResponse(response, fallbackMessage) {
		const message = await getResponseErrorMessage(response, fallbackMessage);
		return new ApiError({
			message,
			statusCode: response.status,
			cause: /* @__PURE__ */ new Error(`${message} [HTTP ${response.status}: ${response.statusText}]`)
		});
	}
	var ApiError;
	var init_api_error = __esmMin((() => {
		init_object();
		ApiError = class extends Error {
			statusCode;
			constructor(options) {
				super(options.message, { cause: options.cause });
				this.name = "ApiError";
				this.statusCode = options.statusCode;
			}
		};
	}));

//#endregion
//#region src/utils/async.ts
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	/**
	* 创建一个串行任务队列。
	*
	* 任务按加入顺序依次执行；单个任务失败不会阻塞后续任务。
	*/
	function createSerialQueue() {
		let tail = Promise.resolve();
		return function enqueue(task) {
			const result = tail.then(task);
			tail = result.then(() => void 0, () => void 0);
			return result;
		};
	}
	var init_async = __esmMin((() => {}));

//#endregion
//#region src/utils/remote-backup.ts
/**
	* 合并两个 ReadingList，按 URL 去重，保留最新的添加时间。
	*/
	function mergeReadingList(local, remote) {
		if (!local) return remote ?? [];
		if (!remote) return local;
		const map = /* @__PURE__ */ new Map();
		for (const item of local) map.set(item.url, item);
		for (const item of remote) {
			const existing = map.get(item.url);
			if (!existing || item.addedTime > existing.addedTime) map.set(item.url, item);
		}
		return [...map.values()].sort((a, b) => b.addedTime - a.addedTime);
	}
	/**
	* 准备用于远程备份的数据。排除不应备份的设备特定字段。
	*
	* - API（个人 Token）和 Daily（签到数据）是设备/账户特定的，不参与远程备份。
	*/
	function prepareBackupData(storage) {
		const { ["api"]: _api, ["daily"]: _daily, ...backupData } = storage;
		return backupData;
	}
	/**
	* 将远程配置正确分发到 sync 和 local storage。
	*
	* - MemberTag → chrome.storage.local（合并策略：本地优先）
	* - ReadingList → chrome.storage.sync（合并策略：按 URL 去重合并）
	* - 其他配置 → chrome.storage.sync（与当前本地配置 deepMerge）
	* - 排除设备特定数据（API、Daily）不被远程覆盖
	*/
	async function applyRemoteSettings(remoteSettings, syncInfoOverride) {
		const remoteMemberTag = remoteSettings["member-tag"];
		if (remoteMemberTag) {
			const runtime = getRuntime();
			const localMemberTag = (await runtime.storage.get("local"))["member-tag"];
			const mergedMemberTag = localMemberTag ? {
				...remoteMemberTag,
				...localMemberTag
			} : remoteMemberTag;
			await runtime.storage.set("local", { ["member-tag"]: mergedMemberTag });
		}
		const { ["member-tag"]: _mt, ["api"]: _api, ["daily"]: _daily, ...syncableRemoteSettings } = remoteSettings;
		const remoteSyncInfo = remoteSettings["settings-sync"];
		if (remoteSyncInfo ?? syncInfoOverride) syncableRemoteSettings["settings-sync"] = {
			...remoteSyncInfo,
			...syncInfoOverride
		};
		const runtime = getRuntime();
		const { ["member-tag"]: _currentMt, ...currentSyncOnly } = await runtime.storage.get("sync");
		const remoteReadingList = syncableRemoteSettings["reading-list"];
		const localReadingList = currentSyncOnly["reading-list"];
		if (remoteReadingList?.data ?? localReadingList?.data) syncableRemoteSettings["reading-list"] = { data: mergeReadingList(localReadingList?.data, remoteReadingList?.data) };
		await runtime.storage.set("sync", deepMerge(currentSyncOnly, syncableRemoteSettings));
	}
	/**
	* 校验远程配置数据的基本结构是否有效。
	*
	* 不使用 zod 等库，仅做核心字段的结构性检查，
	* 确保数据不是随意对象（如被用户误编辑的记事本内容）。
	*/
	function isValidSettings(settings) {
		if (!settings || typeof settings !== "object") return false;
		if (!("options" in settings)) return false;
		const options = settings["options"];
		if (!options || typeof options !== "object") return false;
		const opts = options;
		return "theme" in opts && "nestedReply" in opts;
	}
	/**
	* 从 V2EX 记事本中获取插件配置的云端备份数据。
	*
	* @description
	* 该函数通过解析 V2EX 记事本页面，查找并读取插件配置的云端备份，
	* 实现插件配置在不同设备间的同步功能。
	*
	* @returns
	* - 成功时返回包含记事本 ID 和配置数据的对象
	* - 未找到有效配置或解析失败时返回 undefined
	*
	* @param signal - 可选的 AbortSignal，用于取消请求
	* @throws 网络请求失败时可能抛出错误
	*/
	async function getV2P_Settings(signal) {
		let noteId;
		{
			const res = await fetch(`${V2EX_ORIGIN}/notes`, { signal });
			if (!res.ok) {
				console.warn(`[${EXTENSION_NAME}] 获取记事本列表失败：HTTP ${res.status}`);
				return;
			}
			const htmlText = await res.text();
			$(htmlText).find(".note_item > .note_item_title > a[href^=\"/notes\"]").each((_, dom) => {
				const $dom = $(dom);
				if ($dom.text().startsWith(settingsMark)) {
					const href = $dom.attr("href");
					if (typeof href === "string") noteId = href.split("/").at(2);
					return false;
				}
			});
		}
		if (noteId) {
			const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, { signal });
			if (!res.ok) {
				console.warn(`[${EXTENSION_NAME}] 获取记事本内容失败：HTTP ${res.status}`);
				return;
			}
			const htmlText = await res.text();
			const value = $(htmlText).find("#note_content.note_editor").val();
			if (typeof value === "string") try {
				const syncSettings = JSON.parse(value.replace(settingsMark, ""));
				if (isValidSettings(syncSettings)) return {
					noteId,
					config: syncSettings
				};
			} catch {
				console.warn(`[${EXTENSION_NAME}] 解析远程配置数据失败，记事本内容可能已损坏`);
			}
		}
	}
	var settingsMark;
	var init_remote_backup = __esmMin((() => {
		init_constants();
		init_runtime();
		init_env();
		init_object();
		settingsMark = `${EXTENSION_NAME}_settings`;
	}));

//#endregion
//#region src/utils/storage.ts
/**
	* 将个人配置备份存储。
	*/
	async function setV2P_Settings(storageSettings, signal) {
		const data = await getV2P_Settings(signal);
		const updating = !!data;
		const formData = new FormData();
		const syncInfo = {
			version: (updating ? data.config["settings-sync"]?.version ?? 0 : 0) + 1,
			lastSyncTime: Date.now(),
			lastCheckTime: Date.now()
		};
		const backupData = prepareBackupData(storageSettings);
		formData.append("content", settingsMark + JSON.stringify({
			...backupData,
			["settings-sync"]: syncInfo
		}));
		formData.append("syntax", "0");
		if (updating) {
			const { noteId } = data;
			const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
				method: "POST",
				body: formData,
				signal
			});
			if (!res.ok) throw new Error(`备份配置失败：HTTP ${res.status}`);
		} else {
			formData.append("parent_id", "0");
			const res = await fetch(`${V2EX_ORIGIN}/notes/new`, {
				method: "POST",
				body: formData,
				signal
			});
			if (!res.ok) throw new Error(`创建备份记事本失败：HTTP ${res.status}`);
		}
		await setStorage("settings-sync", syncInfo);
		return syncInfo;
	}
	/**
	* 获取用户存储的应用数据。
	*
	* @description
	* 该方法会按以下顺序获取数据：
	* 1. 如果启用缓存且存在缓存数据，直接返回缓存
	* 2. 通过当前运行时读取同步区和设备本地数据
	* 3. 缺失字段使用默认配置补齐
	*
	* @param useCache - 是否使用缓存数据，默认为 true
	*/
	async function getStorage(useCache = true) {
		if (useCache && typeof window !== "undefined" && window.__V2P_StorageCache) return window.__V2P_StorageCache;
		try {
			const runtime = getRuntime();
			const [syncItems, localItems] = await Promise.all([runtime.storage.get("sync"), runtime.storage.get("local")]);
			const options = syncItems["options"];
			const mergedItems = {
				...syncItems,
				...localItems,
				["member-tag"]: localItems["member-tag"] ?? syncItems["member-tag"],
				["daily"]: localItems["daily"] ?? syncItems["daily"]
			};
			const mergedOptions = options ? deepMerge(defaultOptions, options) : defaultOptions;
			const legacyOptions = options;
			if (legacyOptions?.["openInNewTab"] === true && !legacyOptions["topic"]) mergedOptions.topic = { openMode: "newTab" };
			const data = {
				...mergedItems,
				["options"]: mergedOptions
			};
			if (typeof window !== "undefined") window.__V2P_StorageCache = data;
			return data;
		} catch (error) {
			throw new Error("获取扩展配置失败。", { cause: error });
		}
	}
	/**
	* 同步获取用户存储的应用数据。
	*/
	function getStorageSync() {
		const storage = window.__V2P_StorageCache;
		if (!storage) throw new Error(`${EXTENSION_NAME}: 无可用的 Storage 缓存数据`);
		return storage;
	}
	/**
	* 判断当前环境是否支持自动备份。
	*
	* 自动备份依赖 jQuery 解析 V2EX 页面 HTML（getV2P_Settings / setV2P_Settings），
	* 在 Service Worker（后台脚本）中 jQuery 不可用，因此仅在页面上下文中启用。
	*/
	function canAutoBackup() {
		return typeof $ === "function";
	}
	/**
	* 延迟调度自动备份。
	*
	* 连续配置变更会重置计时器，确保在最后一次变更后的 3 秒才触发备份，
	* 避免短时间内产生大量网络请求。
	*/
	function scheduleBackup() {
		if (backupTimer) clearTimeout(backupTimer);
		if (controller) controller.abort();
		backupTimer = setTimeout(() => {
			backupTimer = null;
			controller = new AbortController();
			const { signal } = controller;
			const timeoutId = setTimeout(() => {
				if (controller) controller.abort();
			}, 15e3);
			getStorage(false).then((settings) => setV2P_Settings(settings, signal)).catch((err) => {
				clearTimeout(timeoutId);
				if (err instanceof DOMException && err.name === "AbortError") return;
				console.warn(`[${EXTENSION_NAME}] 自动备份失败：`, err);
			});
		}, BACKUP_DEBOUNCE_MS);
	}
	async function setStorage(storageKey, storageItem) {
		const runtime = getRuntime();
		switch (storageKey) {
			case "member-tag":
			case "daily":
			case "api":
				try {
					await runtime.storage.set("local", { [storageKey]: storageItem });
					if (runtime.isBrowserExtension && storageKey !== "daily" && storageKey !== "api" && canAutoBackup()) scheduleBackup();
				} catch (err) {
					console.error(err);
					throw new Error(`❌ 无法设置：${storageKey}`, { cause: err });
				}
				break;
			case "options":
			case "settings-sync":
			case "reading-list":
				try {
					await runtime.storage.set("sync", { [storageKey]: storageItem });
					if (runtime.isBrowserExtension && storageKey !== "settings-sync" && canAutoBackup()) scheduleBackup();
				} catch (err) {
					if (String(err).includes("QUOTA_BYTES_PER_ITEM quota exceeded")) console.error(`${EXTENSION_NAME}: 无法设置 ${storageKey}， 单个 item 不能超出 8 KB，详情查看：https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas`);
					console.error(err);
					throw new Error(`❌ 无法设置：${storageKey}`, { cause: err });
				}
				break;
			default: throw new Error(`未知的 storageKey： ${storageKey}`);
		}
	}
	var controller, backupTimer, BACKUP_DEBOUNCE_MS;
	var init_storage = __esmMin((() => {
		init_constants();
		init_runtime();
		init_env();
		init_object();
		init_remote_backup();
		controller = null;
		backupTimer = null;
		BACKUP_DEBOUNCE_MS = 3e3;
	}));

//#endregion
//#region src/utils/check-in-diagnostic.ts
/** 生成当前签到诊断文本。 */
	async function createCheckInDiagnostic() {
		const storage = await getStorage(false);
		const browser = navigator.userAgent.includes("Firefox/") ? "Firefox" : "Chromium";
		return buildCheckInDiagnostic({
			now: Date.now(),
			dailyInfo: storage["daily"],
			autoCheckInEnabled: storage["options"].autoCheckIn.enabled,
			extensionVersion: getRuntime().isBrowserExtension ? chrome.runtime.getManifest().version : "userscript",
			browser: `${browser}（${navigator.userAgent}）`,
			timezoneOffsetMinutes: (/* @__PURE__ */ new Date()).getTimezoneOffset()
		});
	}
	async function copyText(text) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.append(textarea);
			textarea.select();
			try {
				return document.execCommand("copy");
			} catch {
				return false;
			} finally {
				textarea.remove();
			}
		}
	}
	/** 复制签到诊断文本，供 popup 与签到页共用。 */
	async function copyCheckInDiagnostic() {
		return copyText(await createCheckInDiagnostic());
	}
	var init_check_in_diagnostic = __esmMin((() => {
		init_check_in_utils();
		init_runtime();
		init_storage();
	}));

//#endregion
//#region src/utils/emoji.ts
/**
	* 判断图片是否为插件内置的表情图片（低清或高清链接）。
	*
	* 表情图片在 V2EX 中同样是 `img.embedded_image`，需要与普通内容图片区分开。
	*/
	function isEmojiImage($img) {
		const src = $img.attr("src");
		return typeof src === "string" && emojiImageSrcSet.has(src);
	}
	/**
	* 给表情图片添加标记类，便于在样式上与普通内容图片区分。
	*/
	function markEmojiImages($imgs) {
		$imgs.each((_, img) => {
			const $img = $(img);
			if (isEmojiImage($img)) $img.addClass(EMOJI_IMG_CLASS);
		});
	}
	/**
	* 将形如 [表情代码] 转换成表情图片的网络链接。
	*/
	function transformEmoji(textValue) {
		return textValue.replace(/\[[^\]]+\]/g, (x) => {
			if (Object.hasOwn(emojiLinks, x)) {
				const emojiLink = emojiLinks[x].ld;
				if (typeof emojiLink === "string") return `${emojiLink} `;
			}
			return x;
		});
	}
	/**
	* 将低清表情图片转换成高清表情图片。
	*/
	function replaceEmojiWithHD($emojiImgs) {
		if ($emojiImgs.length > 0) {
			markEmojiImages($emojiImgs);
			$emojiImgs.each((_, img) => {
				const $img = $(img);
				const src = $img.attr("src");
				if (typeof src === "string") {
					const hd = emojiSrcMap.get(src);
					if (typeof hd === "string") {
						$img.attr("src", hd);
						$img.css({
							width: "var(--v2p-emoji-size)",
							height: "var(--v2p-emoji-size)"
						});
					}
				}
			});
		}
	}
	var emojiSrcMap, emojiImageSrcSet, EMOJI_IMG_CLASS;
	var init_emoji$1 = __esmMin((() => {
		init_constants();
		emojiSrcMap = new Map(Object.values(emojiLinks).map(({ ld, hd }) => [ld, hd]));
		emojiImageSrcSet = /* @__PURE__ */ new Set([...emojiSrcMap.keys(), ...emojiSrcMap.values()]);
		EMOJI_IMG_CLASS = "v2p-emoji-img";
	}));

//#endregion
//#region src/utils/html.ts
/**
	* 转义 HTML 字符串中的特殊字符。
	*/
	function escapeHTML(htmlString) {
		return htmlString.replace(/[<>&"'']/g, (match) => {
			switch (match) {
				case "<": return "&lt;";
				case ">": return "&gt;";
				case "&": return "&amp;";
				case "\"": return "&quot;";
				case "'": return "&#39;";
				default: return match;
			}
		});
	}
	/**
	* 向 HTML body 下动态插入脚本。
	*/
	function injectScript(scriptSrc) {
		const script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", scriptSrc);
		document.body.appendChild(script);
	}
	var init_html = __esmMin((() => {}));

//#endregion
//#region src/components/button.ts
	function createButton$1(props) {
		const { children, className = "", type = "button", tag = "button", size = "default", variant = "normal" } = props;
		const sizeClass = size === "small" ? "v2p-btn-small" : size === "large" ? "v2p-btn-large" : "";
		const $button = $(`<${tag} class="normal button ${variant} ${sizeClass} ${className}">${children}</${tag}>`);
		if (tag === "button") $button.prop("type", type);
		return $button;
	}
	var init_button = __esmMin((() => {}));

//#endregion
//#region src/components/modal.ts
/**
	* 创建 modal 框。
	*/
	function createModal(props) {
		const { root, title, footer = false, onMount, onOpen, onClose } = props;
		const $mask = $("<div class=\"v2p-modal-mask\">");
		const $content = $("<div class=\"v2p-modal-content\">");
		const $closeBtn = createButton$1({
			children: "关闭<kbd>Esc</kbd>",
			className: "v2p-modal-close-btn"
		});
		const titleId = `v2p-modal-title-${Math.random().toString(36).slice(2)}`;
		const $title = $("<div class=\"v2p-modal-title\">").attr("id", titleId).text(title ?? "");
		const $actions = $("<div class=\"v2p-modal-actions\">").append($closeBtn);
		const $header = $("<div class=\"v2p-modal-header\">").append($title, $actions);
		const $footer = $("<div class=\"v2p-modal-footer\">");
		const $main = $("<div class=\"v2p-modal-main\" role=\"dialog\" aria-modal=\"true\" tabindex=\"-1\">").attr("aria-labelledby", titleId).append($header, $content, footer ? $footer : "<div></div>").on("click", (ev) => {
			ev.stopPropagation();
		});
		const $container = $mask.append($main).hide();
		const modalElements = {
			$mask,
			$main,
			$header,
			$footer,
			$container,
			$title,
			$actions,
			$content
		};
		let boundEvent = false;
		let destroyed = false;
		let previouslyFocusedElement = null;
		let mouseDownTarget;
		const mouseDownHandler = (ev) => {
			mouseDownTarget = ev.target;
		};
		const mouseUpHandler = (ev) => {
			if (mouseDownTarget === $mask.get(0) && ev.target === $mask.get(0) && ev.currentTarget === ev.target) handleModalClose();
		};
		const keyupHandler = (ev) => {
			if (ev.key === "Escape") handleModalClose();
		};
		const handleModalClose = () => {
			$mask.off("mousedown", mouseDownHandler);
			$mask.off("mouseup", mouseUpHandler);
			$(document).off("keydown", keyupHandler);
			boundEvent = false;
			$container.fadeOut("fast");
			document.body.classList.remove("v2p-modal-open");
			previouslyFocusedElement?.focus();
			previouslyFocusedElement = null;
			onClose?.(modalElements);
		};
		const handleModalOpen = () => {
			setTimeout(() => {
				if (!boundEvent) {
					$mask.on("mousedown", mouseDownHandler);
					$mask.on("mouseup", mouseUpHandler);
					$(document).on("keydown", keyupHandler);
					boundEvent = true;
				}
			});
			$container.fadeIn("fast");
			document.body.classList.add("v2p-modal-open");
			previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			$main.get(0)?.focus({ preventScroll: true });
			onOpen?.(modalElements);
		};
		$closeBtn.on("click", handleModalClose);
		onMount?.(modalElements);
		if (root) root.append($container);
		const handleDestroy = () => {
			if (destroyed) return;
			destroyed = true;
			$mask.off("mousedown", mouseDownHandler);
			$mask.off("mouseup", mouseUpHandler);
			$(document).off("keydown", keyupHandler);
			boundEvent = false;
			$container.remove();
			document.body.classList.remove("v2p-modal-open");
		};
		return {
			...modalElements,
			open: handleModalOpen,
			close: handleModalClose,
			destroy: handleDestroy
		};
	}
	var init_modal = __esmMin((() => {
		init_button();
	}));

//#endregion
//#region src/utils/sync-dialog.ts
/**
	* 计算配置复杂度（配置项数量）。
	*/
	function calculateConfigComplexity(settings) {
		return Object.keys(settings).filter((key) => key !== "settings-sync" && key !== "api" && key !== "daily" && settings[key] !== void 0).length;
	}
	/**
	* 显示远程配置同步确认对话框。
	*
	* @param settings - 远程配置数据
	* @param options - 对话框选项
	* @returns Promise<boolean> - 用户是否选择同步
	*/
	async function showRemoteSyncDialog(settings, options = {}) {
		const { type: explicitType, showDetails: explicitShowDetails } = options;
		const remoteSyncInfo = settings["settings-sync"];
		if (!remoteSyncInfo) return false;
		const configComplexity = calculateConfigComplexity(settings);
		const daysSinceBackup = (Date.now() - (remoteSyncInfo.lastSyncTime || remoteSyncInfo.lastCheckTime || 0)) / 864e5;
		let dialogType = explicitType || "confirm";
		let showDetails = explicitShowDetails ?? false;
		if (!explicitType) {
			if (configComplexity < 10 && daysSinceBackup < 7) dialogType = "gentle";
			else if (configComplexity >= 10 || daysSinceBackup >= 30) {
				dialogType = "confirm";
				showDetails = true;
			} else if (configComplexity <= 3 && daysSinceBackup < 7) dialogType = "gentle";
		}
		return new Promise((resolve) => {
			const lastSyncTime = formatTimestamp(remoteSyncInfo.lastSyncTime || remoteSyncInfo.lastCheckTime || 0, { format: "YMDHM" });
			let message = "";
			if (dialogType === "gentle") message = `
        <p class="v2p-sync-dialog-message">检测到您在其他设备上保存了插件配置备份</p>
        <p class="v2p-sync-dialog-message-sub">
          备份时间：<strong>${lastSyncTime}</strong>
          ${showDetails ? `<br>包含 <strong>${configComplexity}</strong> 项个性化设置` : ""}
        </p>
        <p class="v2p-sync-dialog-message-question">是否同步这些设置到当前设备？</p>
      `;
			else message = `
        <p class="v2p-sync-dialog-message">检测到远程插件配置备份（${daysSinceBackup < 1 ? "今天" : daysSinceBackup < 7 ? `${Math.floor(daysSinceBackup)} 天前` : `${Math.floor(daysSinceBackup / 7)} 周前`}创建）</p>
        ${showDetails ? `<p class="v2p-sync-dialog-message-sub">
          该备份包含 <strong>${configComplexity}</strong> 项设置，同步后将覆盖当前设备的插件默认配置
        </p>` : ""}
        <p class="v2p-sync-dialog-message-question">是否同步这些设置到当前设备？</p>
        <p class="v2p-sync-dialog-message-tip">
          你也可以稍后在插件设置中手动同步
        </p>
      `;
			const modal = createModal({
				root: $(document.body),
				title: "V2EX Polish - 发现远程配置备份",
				footer: true,
				onMount: (elements) => {
					const { $main, $content, $footer, $actions } = elements;
					$main.addClass("v2p-sync-dialog-main");
					$content.html(message);
					$actions.empty();
					const $skipBtn = createButton$1({
						children: "稍后同步",
						className: "v2p-sync-skip-btn"
					});
					$skipBtn.on("click", () => {
						modal.close();
						resolve(false);
					});
					const $syncBtn = createButton$1({
						children: "立即同步配置",
						className: "v2p-sync-confirm-btn super"
					});
					$syncBtn.on("click", () => {
						modal.close();
						resolve(true);
					});
					$footer.append($skipBtn, $syncBtn);
				},
				onClose: () => {
					resolve(false);
					modal.destroy();
				}
			});
			modal.open();
		});
	}
	var init_sync_dialog = __esmMin((() => {
		init_button();
		init_modal();
		init_date();
	}));

//#endregion
//#region src/utils/v2ex.ts
/**
	* 校验并标准化 once token。
	*
	* 接口可能返回数字或字符串，统一转成字符串，避免把非法值写回页面上下文。
	*/
	function normalizeOnce(value) {
		if (typeof value === "number") return Number.isSafeInteger(value) && value >= 0 ? String(value) : null;
		if (typeof value === "string" && ONCE_PATTERN.test(value)) return value;
		return null;
	}
	/**
	* 从页面 HTML 中提取最新的 once token。
	*/
	function extractOnceFromHtml(htmlText) {
		return normalizeOnce(htmlText.match(/once\s*=\s*"?(\d+)"?/)?.[1]);
	}
	/**
	* 从「Block」按钮的 onclick 属性中解析出屏蔽接口地址。
	*
	* 仅接受站内 `/block/{memberId}?once={once}` 形式，
	* 避免把页面中的任意地址用于请求。
	*/
	function parseBlockUrl(onclick) {
		if (!onclick) return null;
		const url = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/)?.[1];
		return url && BLOCK_URL_PATTERN.test(url) ? url : null;
	}
	/**
	* 从「屏蔽主题」按钮的 onclick 属性中解析出忽略主题接口地址。
	*/
	function parseIgnoreTopicUrl(onclick) {
		if (!onclick) return null;
		const url = onclick.match(/['"](\/ignore\/topic\/[^'"]+)['"]/)?.[1];
		if (!url) return null;
		const [urlWithoutHash] = url.split("#");
		const [path, query = ""] = (urlWithoutHash ?? "").split("?");
		if (!path || !IGNORE_TOPIC_PATH_PATTERN.test(path)) return null;
		const once = new URLSearchParams(query).get("once");
		return once && ONCE_PATTERN.test(once) ? url : null;
	}
	/**
	* 从「隐藏回复」链接中解析出忽略回复接口地址。
	*
	* 原生链接可能把地址放在 href 或 onclick 中。
	*/
	function parseIgnoreReplyUrl(href, onclick) {
		const source = `${href ?? ""} ${onclick ?? ""}`;
		if (!source.trim()) return null;
		const quoted = source.match(/['"](\/ignore\/reply\/\d+\?[^'"]+)['"]/);
		const direct = source.match(/(?:^|[\s'"=(])(\/ignore\/reply\/\d+\?[^'"\s]+)/);
		const url = quoted?.[1] ?? direct?.[1]?.replace(/[;)]+$/, "");
		if (!url) return null;
		const [urlWithoutHash] = url.split("#");
		const [path, query = ""] = (urlWithoutHash ?? "").split("?");
		if (!path || !IGNORE_REPLY_PATH_PATTERN.test(path)) return null;
		const once = new URLSearchParams(query).get("once");
		return once && ONCE_PATTERN.test(once) ? url : null;
	}
	/**
	* 解析回复的点赞数。
	*
	* 页面中的点赞数可能为空或包含异常文本，统一降级为 0。
	*/
	function parseLikesCount(raw) {
		if (!raw) return 0;
		const count = Number.parseInt(raw.trim(), 10);
		return Number.isFinite(count) && count > 0 ? count : 0;
	}
	var ONCE_PATTERN, BLOCK_URL_PATTERN, IGNORE_TOPIC_PATH_PATTERN, IGNORE_REPLY_PATH_PATTERN;
	var init_v2ex = __esmMin((() => {
		ONCE_PATTERN = /^\d+$/;
		BLOCK_URL_PATTERN = /^\/block\/\d+\?once=\d+$/;
		IGNORE_TOPIC_PATH_PATTERN = /^\/ignore\/topic\/\d+$/;
		IGNORE_REPLY_PATH_PATTERN = /^\/ignore\/reply\/\d+$/;
	}));

//#endregion
//#region src/utils/index.ts
	var init_utils = __esmMin((() => {
		init_api_error();
		init_async();
		init_check_in_diagnostic();
		init_date();
		init_emoji$1();
		init_env();
		init_html();
		init_object();
		init_remote_backup();
		init_storage();
		init_sync_dialog();
		init_v2ex();
	}));

//#endregion
//#region src/contents/member-name.ts
/** 从 V2EX 顶部导航读取当前登录用户名。 */
	function getCurrentMemberName() {
		return document.querySelector("#Top .tools > a[href^=\"/member\"]")?.textContent?.trim() || void 0;
	}
	var init_member_name = __esmMin((() => {}));

//#endregion
//#region src/contents/globals.ts
/** 当文档结构发生改变时，执行此方法以重新选择到最新的元素。 */
	function updateCommentCells() {
		$commentCells = $commentBox.find(".cell[id^=\"r_\"]");
		$commentTableRows = $commentCells.find("> table > tbody > tr");
	}
	var $body, $wrapper, $wrapperContent, $main, $topicList, $infoCard, $topicContentBox, $topicHeader, $commentBox, $commentCells, $commentTableRows, $replyBox, $replyForm, $replyTextArea, replyTextArea, loginName, topicOwnerName, pathTopicId;
	var init_globals = __esmMin((() => {
		init_member_name();
		$body = $(document.body);
		$wrapper = $("#Wrapper");
		$wrapperContent = $wrapper.find("> .content");
		$main = $("#Main");
		$topicList = $("#Main #Tabs ~ .cell.item, #Main #TopicsNode > .cell, #Main .cell.item:has(.item_title > .topic-link)");
		$infoCard = $("#Rightbar > .box:has(\"#member-activity\")");
		$topicContentBox = $("#Main .box:has(.topic_buttons), #Main .box:has(.topic_content)").first();
		$topicHeader = $topicContentBox.find(".header");
		$commentBox = $("#Main .box:has(.cell[id^=\"r_\"])");
		$commentCells = $commentBox.find(".cell[id^=\"r_\"]");
		$commentTableRows = $commentCells.find("> table > tbody > tr");
		$replyBox = $("#reply-box");
		$replyForm = $replyBox.find("form[action^=\"/t\"]");
		$replyTextArea = $("#reply_content");
		replyTextArea = document.querySelector("#reply_content");
		loginName = getCurrentMemberName() ?? "";
		topicOwnerName = $topicHeader.find("> small > a[href^=\"/member\"]").text();
		pathTopicId = window.location.pathname.match(/\/t\/(\d+)/)?.at(1);
	}));

//#endregion
//#region src/components/toast.ts
	function createToast(props) {
		const { message = "", html, duration = 3e3 } = props;
		const $existToast = $(".v2p-toast");
		if ($existToast.length > 0) $existToast.remove();
		const $toast = $("<div class=\"v2p-toast\" role=\"status\" aria-live=\"polite\"></div>").hide();
		if (html) $toast.html(html);
		else $toast.text(message);
		$("body").append($toast);
		$toast.fadeIn("fast");
		const timer = duration === 0 ? null : setTimeout(() => {
			$toast.fadeOut("fast", () => {
				$toast.remove();
			});
		}, duration);
		return { clear() {
			if (timer !== null) clearTimeout(timer);
			$toast.remove();
		} };
	}
	var init_toast = __esmMin((() => {}));

//#endregion
//#region src/contents/base64.ts
/**
	* 允许换行和制表符，拒绝 NUL、其他控制字符以及 DEL。
	*/
	function hasControlChar(text) {
		for (const char of text) {
			const codePoint = char.codePointAt(0) ?? 0;
			if (codePoint <= 8 || codePoint >= 11 && codePoint <= 31 || codePoint === 127) return true;
		}
		return false;
	}
	/**
	* 校验 Base64 结构并补齐 padding。
	*
	* 浏览器 `atob` 本身可以接受部分无填充数据，但现有逻辑在进入 `atob` 前就
	* 用 `length % 4` 把这类数据排除了。这里统一补齐，同时拒绝余数为 1 的非法长度。
	*/
	function normalizeBase64(text) {
		const candidate = text.trim();
		if (candidate.length < MIN_BASE64_LENGTH || !BASE64_ALPHABET_RE.test(candidate)) return null;
		const unpadded = candidate.replace(/=+$/, "");
		const paddingLength = candidate.length - unpadded.length;
		const expectedPadding = (4 - unpadded.length % 4) % 4;
		const hasInvalidPadding = paddingLength !== 0 && paddingLength !== expectedPadding;
		if (unpadded.length % 4 === 1 || hasInvalidPadding) return null;
		return {
			value: unpadded + "=".repeat(expectedPadding),
			hadPadding: paddingLength > 0
		};
	}
	/**
	* 将 `atob` 得到的 binary string（每个字符对应一个字节）按 UTF-8 解码为字符串。
	*/
	function decodeBinaryAsUtf8(binary) {
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	}
	/**
	* 兼容旧版先 URL 编码、再 Base64 的历史数据。
	*/
	function decodeLegacyPercentEncodedText(text) {
		if (!/%[0-9A-Fa-f]{2}/.test(text)) return text;
		try {
			return decodeURIComponent(text);
		} catch {
			return text;
		}
	}
	/**
	* 判断解码结果是否像正常文本。
	*
	* 这一步是替代维护“普通英文排除列表”的关键：
	* - 控制字符、替换字符和不可见格式字符直接拒绝；
	* - 标点/符号比例过高时拒绝，避免把 `n)bn)b` 这类误判显示出来；
	* - 短串要求使用常见文字体系，并额外检查无 padding 的 ASCII 结果；
	* - 长串因为本身已经很像 Base64，只做较宽松的可读性检查。
	*/
	function isPlausibleDecodedText(text, hadPadding) {
		const normalizedText = text.replace(/\r\n?/g, "\n");
		if (!normalizedText || hasControlChar(normalizedText) || INVISIBLE_CHAR_RE.test(normalizedText)) return false;
		const chars = Array.from(normalizedText);
		let letters = 0;
		let digits = 0;
		let punctuation = 0;
		let symbols = 0;
		let other = 0;
		for (const char of chars) {
			if (/\s/u.test(char)) continue;
			if (/\p{L}/u.test(char)) letters += 1;
			else if (/\p{N}/u.test(char)) digits += 1;
			else if (/\p{P}/u.test(char)) punctuation += 1;
			else if (/\p{S}/u.test(char)) symbols += 1;
			else other += 1;
		}
		if (other > 0 || letters + digits === 0) return false;
		if (/^https?:\/\/\S+$/iu.test(normalizedText)) return true;
		const hasCjk = CJK_RE.test(normalizedText);
		if ((punctuation + symbols) / chars.length > (hasCjk ? .35 : .2)) return false;
		if (chars.length > 8) return true;
		const hasAsciiLetter = /[A-Za-z]/.test(normalizedText);
		const hasNonAscii = chars.some((char) => (char.codePointAt(0) ?? 0) > 127);
		if (hasAsciiLetter && hasCjk) {
			const hasWhitespace = /\s/u.test(normalizedText);
			const hasNonLetterOrDigit = /[^A-Za-z0-9\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/u.test(normalizedText);
			if (!hadPadding || hasWhitespace || hasNonLetterOrDigit) return false;
			return true;
		}
		const firstChar = chars[0];
		if (!firstChar || /\p{P}/u.test(firstChar) || /\p{S}/u.test(firstChar)) return false;
		if (hasCjk) {
			const nonAsciiChars = chars.filter((char) => (char.codePointAt(0) ?? 0) > 127);
			const cjkChars = chars.filter((char) => CJK_RE.test(char)).length;
			const allNonAsciiAreCjk = nonAsciiChars.every((char) => CJK_RE.test(char) || CJK_PUNCTUATION_RE.test(char));
			if (cjkChars / chars.length <= .5 || !allNonAsciiAreCjk) return false;
		} else if (hasNonAscii) {
			if (!chars.filter((char) => (char.codePointAt(0) ?? 0) > 127).every((char) => LATIN_TEXT_RE.test(char))) return false;
		}
		if (!hadPadding && hasAsciiLetter && !hasCjk) {
			const vowelCount = normalizedText.match(/[aeiouAEIOU]/g)?.length ?? 0;
			if (!/^[A-Za-z0-9]+$/.test(normalizedText) || vowelCount < 2) return false;
		}
		return true;
	}
	/**
	* 尝试解码一个 Base64 候选。
	*/
	function decodeBase64Candidate(text) {
		const normalized = normalizeBase64(text);
		if (!normalized) return null;
		try {
			const decoded = decodeLegacyPercentEncodedText(decodeBinaryAsUtf8(atob(normalized.value)));
			return isPlausibleDecodedText(decoded, normalized.hadPadding) ? decoded : null;
		} catch {
			return null;
		}
	}
	/**
	* 当一整段字母数字串不是合法 Base64 时，尝试找出其中嵌入的候选。
	*
	* 例如 `prefix5L2g5aW9suffix` 这种与英文连在一起的内容，单靠最外层正则
	* 无法拆分。这里只扫描有限长度，避免对超长代码行做平方级遍历。
	*/
	function findEmbeddedCandidate(text, fromIndex) {
		if (text.length > MAX_EMBEDDED_RUN_LENGTH) return null;
		for (let start = fromIndex; start <= text.length - MIN_BASE64_LENGTH; start += 1) {
			const maxLength = Math.min(MAX_EMBEDDED_CANDIDATE_LENGTH, text.length - start);
			for (let length = maxLength; length >= MIN_BASE64_LENGTH; length -= 1) {
				if (length % 4 === 1) continue;
				const original = text.slice(start, start + length);
				const decoded = decodeBase64Candidate(original);
				if (decoded !== null) return {
					index: start,
					original,
					decoded
				};
			}
		}
		return null;
	}
	/**
	* 找出文本中所有值得展示的 Base64 候选，返回它们在原文中的位置。
	*/
	function findBase64Candidates(text) {
		const candidates = [];
		const base64RunRegex = new RegExp(BASE64_RUN_RE.source, "g");
		let match;
		while ((match = base64RunRegex.exec(text)) !== null) {
			const run = match[0];
			const wholeDecoded = decodeBase64Candidate(run);
			if (wholeDecoded !== null) {
				candidates.push({
					index: match.index,
					original: run,
					decoded: wholeDecoded
				});
				continue;
			}
			let fromIndex = 0;
			while (fromIndex < run.length) {
				const embedded = findEmbeddedCandidate(run, fromIndex);
				if (!embedded) break;
				candidates.push({
					index: match.index + embedded.index,
					original: embedded.original,
					decoded: embedded.decoded
				});
				fromIndex = embedded.index + embedded.original.length;
			}
		}
		return candidates;
	}
	var BASE64_ALPHABET_RE, BASE64_RUN_RE, MIN_BASE64_LENGTH, MAX_EMBEDDED_RUN_LENGTH, MAX_EMBEDDED_CANDIDATE_LENGTH, CJK_RE, CJK_PUNCTUATION_RE, LATIN_TEXT_RE, INVISIBLE_CHAR_RE;
	var init_base64$1 = __esmMin((() => {
		BASE64_ALPHABET_RE = /^[A-Za-z0-9+/]+={0,2}$/;
		BASE64_RUN_RE = /[A-Za-z0-9+/]+={0,2}/g;
		MIN_BASE64_LENGTH = 8;
		MAX_EMBEDDED_RUN_LENGTH = 256;
		MAX_EMBEDDED_CANDIDATE_LENGTH = 64;
		CJK_RE = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/u;
		CJK_PUNCTUATION_RE = /[\u3000-\u303F\uFF00-\uFFEF\u2000-\u206F]/u;
		LATIN_TEXT_RE = /[\u00C0-\u00FF\u2000-\u206F]/u;
		INVISIBLE_CHAR_RE = /[\uFFFD\uFEFF\u200B-\u200F\u202A-\u202E]/;
	}));

//#endregion
//#region src/contents/helpers/base64.ts
/**
	* 将 UTF-8 文本编码为 Base64。
	*/
	function encodeUtf8AsBase64(text) {
		const bytes = new TextEncoder().encode(text);
		let binary = "";
		for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
		return window.btoa(binary);
	}
	/**
	* 解析主题内容页面内所有可能的 Base64 字符串。
	*/
	function decodeBase64TopicPage() {
		const dataTitle = "点击复制";
		if (window.__V2P_DecodeStatus === "decodeed") createToast({ message: "已解析完本页所有的 Base64 字符串" });
		else {
			const $topicContentBox = $("#Main .box:has(.topic_content)");
			const $commentCells = $("#Main .box:has(.cell[id^=\"r_\"])").find(".cell[id^=\"r_\"]");
			let count = 0;
			/**
			* 使用 TreeWalker 遍历文本节点进行 Base64 解码，
			* 避免 innerHTML 替换导致的 DOM 结构重建和事件监听器丢失。
			*/
			const contentHandler = (_, content) => {
				const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
				const textNodes = [];
				let node = walker.nextNode();
				while (node) {
					textNodes.push(node);
					node = walker.nextNode();
				}
				for (const textNode of textNodes) {
					if (textNode.parentElement?.closest("a, img, .v2p-decode-block")) continue;
					const text = textNode.textContent ?? "";
					const candidates = findBase64Candidates(text);
					if (candidates.length === 0) continue;
					const parts = [];
					let lastIndex = 0;
					for (const candidate of candidates) {
						if (candidate.index < lastIndex) continue;
						if (candidate.index > lastIndex) parts.push(text.slice(lastIndex, candidate.index));
						parts.push({
							original: candidate.original,
							decoded: candidate.decoded
						});
						lastIndex = candidate.index + candidate.original.length;
						count += 1;
					}
					if (lastIndex < text.length) parts.push(text.slice(lastIndex));
					const fragment = document.createDocumentFragment();
					for (const part of parts) if (typeof part === "string") fragment.append(document.createTextNode(part));
					else {
						fragment.append(document.createTextNode(part.original));
						const span = document.createElement("span");
						span.className = "v2p-decode-block";
						const ins = document.createElement("ins");
						ins.className = "v2p-decode";
						ins.dataset.title = dataTitle;
						ins.textContent = part.decoded;
						span.append("(", ins, ")");
						fragment.append(span);
					}
					textNode.parentNode?.replaceChild(fragment, textNode);
				}
			};
			$commentCells.find(".reply_content").each(contentHandler);
			$topicContentBox.find(".topic_content").each(contentHandler);
			if (count === 0) createToast({ message: "本页未发现 Base64 字符串" });
			else {
				window.__V2P_DecodeStatus = "decodeed";
				createToast({ message: `✅ 已解析本页所有的 Base64 字符串，共 ${count} 条` });
			}
			$(".v2p-decode").on("click", (ev) => {
				const text = ev.target.innerText;
				navigator.clipboard.writeText(text).then(() => {
					ev.target.dataset.title = "✅ 已复制";
					setTimeout(() => {
						ev.target.dataset.title = dataTitle;
					}, 1e3);
				});
			});
		}
	}
	var init_base64 = __esmMin((() => {
		init_toast();
		init_base64$1();
	}));

//#endregion
//#region src/contents/helpers/emoji.ts
/**
	* 处理评论中的表情图片，将其转换为高清表情图片。
	*/
	function replaceCommentEmojiWithHD($cells = $commentCells) {
		const $embedImages = $cells.find(".reply_content .embedded_image, .payload .embedded_image");
		if ($embedImages.length > 0) replaceEmojiWithHD($embedImages);
	}
	var init_emoji = __esmMin((() => {
		init_emoji$1();
		init_globals();
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/defaultAttributes.mjs
	var defaultAttributes;
	var init_defaultAttributes = __esmMin((() => {
		defaultAttributes = {
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": 2,
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		};
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/createElement.mjs
	var createSVGElement, createElement;
	var init_createElement = __esmMin((() => {
		init_defaultAttributes();
		createSVGElement = ([tag, attrs, children]) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
			Object.keys(attrs).forEach((name) => {
				element.setAttribute(name, String(attrs[name]));
			});
			if (children?.length) children.forEach((child) => {
				const childElement = createSVGElement(child);
				element.appendChild(childElement);
			});
			return element;
		};
		createElement = (iconNode, customAttrs = {}) => {
			const tag = "svg";
			const attrs = {
				...defaultAttributes,
				...customAttrs
			};
			return createSVGElement([
				tag,
				attrs,
				iconNode
			]);
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/shared/src/utils/mergeClasses.mjs
	var mergeClasses;
	var init_mergeClasses = __esmMin((() => {
		mergeClasses = (...classes) => classes.filter((className, index, array) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
		}).join(" ").trim();
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/shared/src/utils/hasA11yProp.mjs
	var hasA11yProp;
	var init_hasA11yProp = __esmMin((() => {
		hasA11yProp = (props) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
			return false;
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/shared/src/utils/toCamelCase.mjs
	var toCamelCase;
	var init_toCamelCase = __esmMin((() => {
		toCamelCase = (string) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			let out = "";
			let upperNext = false;
			for (const ch of string) {
				if (ch === "-" || ch === "_" || ch <= " ") {
					upperNext = out.length > 0;
					continue;
				}
				if (out.length === 0) out += ch.toLowerCase();
				else out += upperNext ? ch.toUpperCase() : ch;
				upperNext = false;
			}
			return out;
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/shared/src/utils/toPascalCase.mjs
	var toPascalCase;
	var init_toPascalCase = __esmMin((() => {
		init_toCamelCase();
		toPascalCase = (string) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			const camelCase = toCamelCase(string);
			return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/replaceElement.mjs
	var getAttrs, getClassNames, replaceElement;
	var init_replaceElement = __esmMin((() => {
		init_createElement();
		init_defaultAttributes();
		init_mergeClasses();
		init_hasA11yProp();
		init_toPascalCase();
		getAttrs = (element) => Array.from(element.attributes).reduce((attrs, attr) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			attrs[attr.name] = attr.value;
			return attrs;
		}, {});
		getClassNames = (attrs) => {
			if (typeof attrs === "string") return attrs;
			if (!attrs || !attrs.class) return "";
			if (attrs.class && typeof attrs.class === "string") return attrs.class.split(" ");
			if (attrs.class && Array.isArray(attrs.class)) return attrs.class;
			return "";
		};
		replaceElement = (element, { nameAttr, icons, attrs }) => {
			const iconName = element.getAttribute(nameAttr);
			if (iconName == null) return;
			const iconNode = icons[toPascalCase(iconName)];
			if (!iconNode) return console.warn(`${element.outerHTML} icon name was not found in the provided icons object.`);
			const elementAttrs = getAttrs(element);
			const ariaProps = hasA11yProp(elementAttrs) ? {} : { "aria-hidden": "true" };
			const iconAttrs = {
				...defaultAttributes,
				"data-lucide": iconName,
				...ariaProps,
				...attrs,
				...elementAttrs
			};
			const elementClassNames = getClassNames(elementAttrs);
			const className = getClassNames(attrs);
			const classNames = mergeClasses("lucide", `lucide-${iconName}`, ...elementClassNames, ...className);
			if (classNames) Object.assign(iconAttrs, { class: classNames });
			const svgElement = createElement(iconNode, iconAttrs);
			return element.parentNode?.replaceChild(svgElement, element);
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/book-open-check.mjs
	var BookOpenCheck;
	var init_book_open_check = __esmMin((() => {
		BookOpenCheck = [
			["path", { d: "M12 5v16" }],
			["path", { d: "m16 12 2 2 4-4" }],
			["path", { d: "M22 6V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2h4.001A2 2 0 0022 17v-1.344" }]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/chevron-down.mjs
	var ChevronDown;
	var init_chevron_down = __esmMin((() => {
		ChevronDown = [["path", { d: "m6 9 6 6 6-6" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/chevron-left.mjs
	var ChevronLeft;
	var init_chevron_left = __esmMin((() => {
		ChevronLeft = [["path", { d: "m15 18-6-6 6-6" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/chevron-right.mjs
	var ChevronRight;
	var init_chevron_right = __esmMin((() => {
		ChevronRight = [["path", { d: "m9 18 6-6-6-6" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/chevrons-up.mjs
	var ChevronsUp;
	var init_chevrons_up = __esmMin((() => {
		ChevronsUp = [["path", { d: "m17 11-5-5-5 5" }], ["path", { d: "m17 18-5-5-5 5" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/eye-off.mjs
	var EyeOff;
	var init_eye_off = __esmMin((() => {
		EyeOff = [
			["path", { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }],
			["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
			["path", { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }],
			["path", { d: "m2 2 20 20" }]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/face-slightly-smiling.mjs
	var FaceSlightlySmiling;
	var init_face_slightly_smiling = __esmMin((() => {
		FaceSlightlySmiling = [
			["path", { d: "M15 10V9" }],
			["path", { d: "M16.472 15a6 6 0 01-8.943 0" }],
			["path", { d: "M9 10V9" }],
			["circle", {
				cx: "12",
				cy: "12",
				r: "10"
			}]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/heart.mjs
	var Heart;
	var init_heart = __esmMin((() => {
		Heart = [["path", { d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/house.mjs
	var House;
	var init_house = __esmMin((() => {
		House = [["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/message-square-plus.mjs
	var MessageSquarePlus;
	var init_message_square_plus = __esmMin((() => {
		MessageSquarePlus = [
			["path", { d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }],
			["path", { d: "M12 8v6" }],
			["path", { d: "M9 11h6" }]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/message-square.mjs
	var MessageSquare;
	var init_message_square = __esmMin((() => {
		MessageSquare = [["path", { d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/moon.mjs
	var Moon;
	var init_moon = __esmMin((() => {
		Moon = [["path", { d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/package-plus.mjs
	var PackagePlus;
	var init_package_plus = __esmMin((() => {
		PackagePlus = [
			["path", { d: "M12 22V12" }],
			["path", { d: "M16 17h6" }],
			["path", { d: "M19 14v6" }],
			["path", { d: "M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955" }],
			["path", { d: "M3.29 7 12 12l8.71-5" }],
			["path", { d: "m7.5 4.27 8.997 5.148" }]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/panel-right.mjs
	var PanelRight;
	var init_panel_right = __esmMin((() => {
		PanelRight = [["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2"
		}], ["path", { d: "M15 3v18" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/panel-top.mjs
	var PanelTop;
	var init_panel_top = __esmMin((() => {
		PanelTop = [["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2"
		}], ["path", { d: "M3 9h18" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/share-2.mjs
	var Share2;
	var init_share_2 = __esmMin((() => {
		Share2 = [
			["circle", {
				cx: "18",
				cy: "5",
				r: "3"
			}],
			["circle", {
				cx: "6",
				cy: "12",
				r: "3"
			}],
			["circle", {
				cx: "18",
				cy: "19",
				r: "3"
			}],
			["line", {
				x1: "8.59",
				x2: "15.42",
				y1: "13.51",
				y2: "17.49"
			}],
			["line", {
				x1: "15.41",
				x2: "8.59",
				y1: "6.51",
				y2: "10.49"
			}]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/square-arrow-up-right.mjs
	var SquareArrowUpRight;
	var init_square_arrow_up_right = __esmMin((() => {
		SquareArrowUpRight = [
			["path", { d: "M15 15V9H9" }],
			["path", { d: "m9 15 6-6" }],
			["rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/star.mjs
	var Star;
	var init_star = __esmMin((() => {
		Star = [["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/icons/sun.mjs
	var Sun;
	var init_sun = __esmMin((() => {
		Sun = [
			["circle", {
				cx: "12",
				cy: "12",
				r: "4"
			}],
			["path", { d: "M12 2v2" }],
			["path", { d: "M12 20v2" }],
			["path", { d: "m4.93 4.93 1.41 1.41" }],
			["path", { d: "m17.66 17.66 1.41 1.41" }],
			["path", { d: "M2 12h2" }],
			["path", { d: "M20 12h2" }],
			["path", { d: "m6.34 17.66-1.41 1.41" }],
			["path", { d: "m19.07 4.93-1.41 1.41" }]
		];
	}));
	/**
	* @license lucide v1.61.0 - ISC
	*
	* This source code is licensed under the ISC license.
	* See the LICENSE file in the root directory of this source tree.
	*/

//#endregion
//#region ../../node_modules/.pnpm/lucide@1.61.0/node_modules/lucide/dist/esm/lucide.mjs
	var createIcons;
	var init_lucide = __esmMin((() => {
		init_replaceElement();
		init_book_open_check();
		init_chevron_down();
		init_chevron_left();
		init_chevron_right();
		init_chevrons_up();
		init_eye_off();
		init_face_slightly_smiling();
		init_heart();
		init_house();
		init_message_square_plus();
		init_message_square();
		init_moon();
		init_package_plus();
		init_panel_right();
		init_panel_top();
		init_share_2();
		init_square_arrow_up_right();
		init_star();
		init_sun();
		init_createElement();
		createIcons = ({ icons = {}, nameAttr = "data-lucide", attrs = {}, root = document, inTemplates } = {}) => {
			/**
			* @license lucide v1.61.0 - ISC
			*
			* This source code is licensed under the ISC license.
			* See the LICENSE file in the root directory of this source tree.
			*/
			if (!Object.values(icons).length) throw new Error("Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`");
			if (typeof root === "undefined") throw new Error("`createIcons()` only works in a browser environment.");
			Array.from(root.querySelectorAll(`[${nameAttr}]`)).forEach((element) => replaceElement(element, {
				nameAttr,
				icons,
				attrs
			}));
			if (inTemplates) Array.from(root.querySelectorAll("template")).forEach((template) => createIcons({
				icons,
				nameAttr,
				attrs,
				root: template.content,
				inTemplates
			}));
			if (nameAttr === "data-lucide") {
				const deprecatedElements = root.querySelectorAll("[icon-name]");
				if (deprecatedElements.length > 0) {
					console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide");
					Array.from(deprecatedElements).forEach((element) => replaceElement(element, {
						nameAttr: "icon-name",
						icons,
						attrs
					}));
				}
			}
		};
	}));

//#endregion
//#region src/contents/helpers/icons.ts
/** 将指定容器中的扩展图标占位符替换为 Lucide SVG。 */
	function renderIcons(icons, root = document) {
		createIcons({
			attrs: {
				width: "100%",
				height: "100%"
			},
			nameAttr: iconAttribute,
			icons,
			root
		});
		root.querySelectorAll(`svg[${iconAttribute}]`).forEach((icon) => {
			icon.removeAttribute(iconAttribute);
		});
	}
	function loadIcons(root) {
		renderIcons({
			MessageSquarePlus,
			MessageSquare,
			BookOpenCheck,
			ChevronsUp,
			Heart,
			EyeOff,
			Sun,
			Moon,
			Smile: FaceSlightlySmiling,
			PackagePlus,
			Star,
			Share2,
			ChevronDown,
			ArrowUpRightSquare: SquareArrowUpRight,
			House
		}, root);
	}
	var iconAttribute;
	var init_icons$1 = __esmMin((() => {
		init_lucide();
		iconAttribute = "data-v2p-icon";
	}));

//#endregion
//#region src/contents/helpers/member.ts
	async function setMemberTags(params) {
		const { memberName, memberAvatar, tags } = params;
		const tagData = (await getStorage(false))["member-tag"];
		if (tags && tags.length > 0) {
			const newTagData = {
				...tagData,
				[memberName]: {
					tags,
					avatar: memberAvatar || tagData?.[memberName]?.avatar
				}
			};
			await setStorage("member-tag", newTagData);
		} else if (tagData && Reflect.has(tagData, memberName)) {
			delete tagData[memberName];
			await setStorage("member-tag", tagData);
		}
	}
	/**
	* 将用户标签数据转换为字符串。
	*/
	function getTagsText(tags) {
		return tags.join("，");
	}
	/**
	* 计算用户注册时间。
	*
	* @param created - 用户注册时间, 单位为秒。
	*/
	function getRegisterDays(created) {
		return Math.ceil((Date.now() / 1e3 - created) / 86400);
	}
	var init_member$1 = __esmMin((() => {
		init_utils();
	}));

//#endregion
//#region src/contents/helpers/reading-list.ts
/**
	* 将主题添加到稍后阅读清单。
	*/
	async function addToReadingList(params) {
		const { url, title, content } = params;
		if (!(typeof url === "string" || typeof title === "string" || typeof content === "string")) {
			const message = "无法识别将该主题的元数据";
			createToast({ message });
			throw new Error(message);
		}
		const currentData = (await getStorage())["reading-list"]?.data || [];
		if (currentData.findIndex((it) => it.url === url) !== -1) createToast({ message: "该主题已存在于稍后阅读" });
		else if (window.__V2P_AddingReading !== true) {
			window.__V2P_AddingReading = true;
			try {
				await setStorage("reading-list", { data: [{
					url,
					title: title.replace(" - V2EX", ""),
					content: content.length > 150 ? content.substring(0, 150) + "..." : content,
					addedTime: Date.now()
				}, ...currentData] });
				createToast({ message: "✅ 已添加进稍后阅读" });
				await sleep(500);
			} finally {
				window.__V2P_AddingReading = false;
			}
		}
	}
	var init_reading_list = __esmMin((() => {
		init_toast();
		init_constants();
		init_utils();
	}));

//#endregion
//#region src/contents/helpers/reply.ts
	function focusReplyInput() {
		if (replyTextArea instanceof HTMLTextAreaElement) replyTextArea.focus();
	}
	/**
	* 插入文本至回复输入框中，聚焦输入框，并更新光标位置。
	*/
	function insertTextToReplyInput(text) {
		if (replyTextArea instanceof HTMLTextAreaElement) {
			const startPos = replyTextArea.selectionStart;
			const endPos = replyTextArea.selectionEnd;
			const valueToStart = replyTextArea.value.substring(0, startPos);
			const valueFromEnd = replyTextArea.value.substring(endPos, replyTextArea.value.length);
			replyTextArea.value = `${valueToStart}${text}${valueFromEnd}`;
			focusReplyInput();
			replyTextArea.selectionStart = replyTextArea.selectionEnd = startPos + text.length;
		}
	}
	var init_reply$1 = __esmMin((() => {
		init_globals();
	}));

//#endregion
//#region src/contents/helpers/settings.ts
/**
	* 打开 V2EX Polish 的设置页面。
	*
	* 通过消息通道委托 background 打开，避免在 content script 里直接 `window.open`
	* 一个 `chrome-extension://` URL 被 Chrome 当作不可信导航屏蔽。
	*/
	function openV2PSettings() {
		getRuntime().ui.openOptions();
	}
	var init_settings$1 = __esmMin((() => {
		init_runtime();
	}));

//#endregion
//#region src/contents/helpers/theme.ts
	function setFont(type) {
		setFontType(type);
	}
	function setTheme(type) {
		setThemeType(type);
	}
	/**
	* 处理主题类型变更后如何切换主题。
	*/
	function toggleTheme({ $toggle, prefersDark, themeType = "light-default" }) {
		if (prefersDark !== $wrapper.hasClass("Night")) {
			const toggleThemeUrl = $toggle.attr("href");
			if (typeof toggleThemeUrl === "string") fetch(toggleThemeUrl);
			if (prefersDark) {
				$toggle.prop("title", "使用浅色主题");
				$toggle.html("<i data-v2p-icon=\"sun\"></i>");
			} else {
				$toggle.prop("title", "使用深色主题");
				$toggle.html("<i data-v2p-icon=\"moon\"></i>");
			}
		}
		if (prefersDark) {
			setTheme("dark-default");
			$wrapper.addClass("Night");
		} else {
			setTheme(themeType);
			$wrapper.removeClass("Night");
		}
		loadIcons($toggle[0]);
	}
	var init_theme = __esmMin((() => {
		init_globals();
		init_icons$1();
	}));

//#endregion
//#region src/contents/helpers/index.ts
	var init_helpers = __esmMin((() => {
		init_base64();
		init_emoji();
		init_icons$1();
		init_member$1();
		init_reading_list();
		init_reply$1();
		init_settings$1();
		init_theme();
	}));

//#endregion
//#region src/contents/topic-filter/matcher.ts
	function normalizeText(value) {
		return value.trim().toLowerCase();
	}
	function getFieldValue(condition, target) {
		let value = "";
		if (condition.field === "title") value = target.title;
		if (condition.field === "node") value = target.nodeName;
		return value;
	}
	function parseConditionValues(value) {
		return value.split(/[\n,，]/).map((item) => item.trim()).filter(Boolean);
	}
	function matchCondition(condition, target) {
		const expectedValues = parseConditionValues(condition.value);
		const fieldValue = getFieldValue(condition, target);
		if (expectedValues.length === 0) return false;
		return expectedValues.some((expectedValue) => {
			const normalized = normalizeText(expectedValue);
			if (condition.operator === "contains") return normalizeText(fieldValue).includes(normalized);
			if (condition.operator === "equals") return (condition.field === "node" ? normalizeText(fieldValue).split(/\s+/) : [normalizeText(fieldValue)]).some((part) => part === normalized);
			if (condition.operator === "regex") try {
				return new RegExp(expectedValue, "i").test(fieldValue);
			} catch {
				return false;
			}
			return false;
		});
	}
	function matchRule(rule, scope, target) {
		const conditions = rule.conditions.filter((condition) => condition.value.trim());
		let matched = false;
		if (rule.enabled && rule.scopes.includes(scope) && conditions.length > 0) {
			if (rule.logic === "any") matched = conditions.some((condition) => matchCondition(condition, target));
			if (rule.logic === "all") matched = conditions.every((condition) => matchCondition(condition, target));
		}
		return matched;
	}
	function matchQuickTitleKeywords(settings, target) {
		const normalizedTitle = normalizeText(target.title);
		let matched = false;
		if (normalizedTitle) matched = settings.quick.titleKeywords.some((keyword) => {
			return normalizedTitle.includes(normalizeText(keyword));
		});
		return matched;
	}
	function matchQuickNodes(settings, scope, target) {
		const nodeNameParts = normalizeText(target.nodeName).split(/\s+/);
		let matched = false;
		if (scope !== "hot" && nodeNameParts.length > 0 && nodeNameParts.some(Boolean)) matched = settings.quick.nodes.some((nodeName) => {
			const normalized = normalizeText(nodeName);
			return nodeNameParts.some((part) => part === normalized);
		});
		return matched;
	}
	function matchAdvancedRules(settings, scope, target) {
		let matched = false;
		if (settings.advanced.enabled) matched = settings.advanced.rules.some((rule) => matchRule(rule, scope, target));
		return matched;
	}
	function shouldHideTopic(settings, scope, target) {
		let matched = false;
		if (settings?.enabled) matched = matchQuickTitleKeywords(settings, target) || matchQuickNodes(settings, scope, target) || matchAdvancedRules(settings, scope, target);
		return matched;
	}
	var init_matcher = __esmMin((() => {}));

//#endregion
//#region src/contents/topic-filter/apply-topic-list-filter.ts
	function extractCurrentNodeName() {
		const match = window.location.pathname.match(/^\/go\/([^/]+)/);
		let nodeName = "";
		if (match?.[1]) nodeName = decodeURIComponent(match[1]);
		return nodeName;
	}
	function extractNodeName(topicItem) {
		const $nodeLink = $(topicItem).find(".topic_info a[href^=\"/go/\"]");
		const nodeHref = $nodeLink.attr("href");
		const nodeText = $nodeLink.text().trim();
		let nodeName = extractCurrentNodeName();
		if (nodeHref) {
			const match = nodeHref.match(/\/go\/(.+)/);
			if (match?.[1]) nodeName = decodeURIComponent(match[1]);
		}
		if (nodeText) nodeName = nodeName ? `${nodeName} ${nodeText}` : nodeText;
		return nodeName;
	}
	/**
	* 对首页 / 节点页的 DOM 主题列表应用主题屏蔽规则。
	* 返回被隐藏的主题数量。
	*/
	function applyTopicListFilter(scope) {
		const settings = getStorageSync()["options"]?.topicFilter;
		let hiddenCount = 0;
		if (settings?.enabled) {
			$(".v2p-filter-counter").remove();
			const $items = $topicList;
			$items.each((_, item) => {
				const $item = $(item);
				const nodeName = extractNodeName(item);
				const title = $item.find(".item_title .topic-link").text();
				if (shouldHideTopic(settings, scope, {
					title,
					nodeName
				})) {
					$item.addClass("v2p-home-filter-hidden");
					hiddenCount++;
				}
			});
			if (hiddenCount > 0) {
				const $hiddenItems = $(".v2p-home-filter-hidden");
				let showing = false;
				const $counter = $(`
        <div class="v2p-filter-counter cell">
          已隐藏 ${hiddenCount} 条主题
          &nbsp;·&nbsp;
          <a class="v2p-filter-show">显示</a>
        </div>
      `);
				$counter.find(".v2p-filter-show").on("click", (e) => {
					const $link = $(e.currentTarget);
					if (showing) {
						$hiddenItems.addClass("v2p-home-filter-hidden").removeClass("v2p-home-filter-revealed");
						$link.text("显示");
						showing = false;
					} else {
						$hiddenItems.removeClass("v2p-home-filter-hidden").addClass("v2p-home-filter-revealed");
						$link.text("隐藏");
						showing = true;
					}
				});
				$items.first().before($counter);
			}
		}
		return hiddenCount;
	}
	var init_apply_topic_list_filter = __esmMin((() => {
		init_utils();
		init_globals();
		init_matcher();
	}));

//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
	function clamp(start, value, end) {
		return max(start, min(value, end));
	}
	function evaluate(value, param) {
		return typeof value === "function" ? value(param) : value;
	}
	function getSide(placement) {
		return placement.split("-")[0];
	}
	function getAlignment(placement) {
		return placement.split("-")[1];
	}
	function getOppositeAxis(axis) {
		return axis === "x" ? "y" : "x";
	}
	function getAxisLength(axis) {
		return axis === "y" ? "height" : "width";
	}
	function getSideAxis(placement) {
		const firstChar = placement[0];
		return firstChar === "t" || firstChar === "b" ? "y" : "x";
	}
	function getAlignmentAxis(placement) {
		return getOppositeAxis(getSideAxis(placement));
	}
	function getAlignmentSides(placement, rects, rtl) {
		if (rtl === void 0) rtl = false;
		const alignment = getAlignment(placement);
		const alignmentAxis = getAlignmentAxis(placement);
		const length = getAxisLength(alignmentAxis);
		let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
		if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
		return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
	}
	function getExpandedPlacements(placement) {
		const oppositePlacement = getOppositePlacement(placement);
		return [
			getOppositeAlignmentPlacement(placement),
			oppositePlacement,
			getOppositeAlignmentPlacement(oppositePlacement)
		];
	}
	function getOppositeAlignmentPlacement(placement) {
		return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
	}
	function getSideList(side, isStart, rtl) {
		switch (side) {
			case "top":
			case "bottom":
				if (rtl) return isStart ? rlPlacement : lrPlacement;
				return isStart ? lrPlacement : rlPlacement;
			case "left":
			case "right": return isStart ? tbPlacement : btPlacement;
			default: return [];
		}
	}
	function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
		const alignment = getAlignment(placement);
		let list = getSideList(getSide(placement), direction === "start", rtl);
		if (alignment) {
			list = list.map((side) => side + "-" + alignment);
			if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
		}
		return list;
	}
	function getOppositePlacement(placement) {
		const side = getSide(placement);
		return oppositeSideMap[side] + placement.slice(side.length);
	}
	function expandPaddingObject(padding) {
		var _padding$top, _padding$right, _padding$bottom, _padding$left;
		return {
			top: (_padding$top = padding.top) != null ? _padding$top : 0,
			right: (_padding$right = padding.right) != null ? _padding$right : 0,
			bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
			left: (_padding$left = padding.left) != null ? _padding$left : 0
		};
	}
	function getPaddingObject(padding) {
		return typeof padding !== "number" ? expandPaddingObject(padding) : {
			top: padding,
			right: padding,
			bottom: padding,
			left: padding
		};
	}
	function rectToClientRect(rect) {
		const { x, y, width, height } = rect;
		return {
			width,
			height,
			top: y,
			left: x,
			right: x + width,
			bottom: y + height,
			x,
			y
		};
	}
	var min, max, round, createCoords, oppositeSideMap, lrPlacement, rlPlacement, tbPlacement, btPlacement;
	var init_floating_ui_utils = __esmMin((() => {
		min = Math.min;
		max = Math.max;
		round = Math.round;
		createCoords = (v) => ({
			x: v,
			y: v
		});
		oppositeSideMap = {
			left: "right",
			right: "left",
			bottom: "top",
			top: "bottom"
		};
		lrPlacement = ["left", "right"];
		rlPlacement = ["right", "left"];
		tbPlacement = ["top", "bottom"];
		btPlacement = ["bottom", "top"];
	}));

//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
	function computeCoordsFromPlacement(_ref, placement, rtl) {
		let { reference, floating } = _ref;
		const sideAxis = getSideAxis(placement);
		const alignmentAxis = getAlignmentAxis(placement);
		const alignLength = getAxisLength(alignmentAxis);
		const side = getSide(placement);
		const isVertical = sideAxis === "y";
		const commonX = reference.x + reference.width / 2 - floating.width / 2;
		const commonY = reference.y + reference.height / 2 - floating.height / 2;
		const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
		let coords;
		switch (side) {
			case "top":
				coords = {
					x: commonX,
					y: reference.y - floating.height
				};
				break;
			case "bottom":
				coords = {
					x: commonX,
					y: reference.y + reference.height
				};
				break;
			case "right":
				coords = {
					x: reference.x + reference.width,
					y: commonY
				};
				break;
			case "left":
				coords = {
					x: reference.x - floating.width,
					y: commonY
				};
				break;
			default: coords = {
				x: reference.x,
				y: reference.y
			};
		}
		const alignment = getAlignment(placement);
		if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
		return coords;
	}
	/**
	* Resolves with an object of overflow side offsets that determine how much the
	* element is overflowing a given clipping boundary on each side.
	* - positive = overflowing the boundary by that number of pixels
	* - negative = how many pixels left before it will overflow
	* - 0 = lies flush with the boundary
	* @see https://floating-ui.com/docs/detectOverflow
	*/
	async function detectOverflow(state, options) {
		var _await$platform$isEle;
		if (options === void 0) options = {};
		const { x, y, platform, rects, elements, strategy } = state;
		const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
		const paddingObject = getPaddingObject(padding);
		const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
		const clippingClientRect = rectToClientRect(await platform.getClippingRect({
			element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
			boundary,
			rootBoundary,
			strategy
		}));
		const rect = elementContext === "floating" ? {
			x,
			y,
			width: rects.floating.width,
			height: rects.floating.height
		} : rects.reference;
		const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
		const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
			x: 1,
			y: 1
		};
		const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
			elements,
			rect,
			offsetParent,
			strategy
		}) : rect);
		return {
			top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
			bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
			left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
			right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
		};
	}
	async function convertValueToCoords(state, options) {
		const { placement, platform, elements } = state;
		const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
		const side = getSide(placement);
		const alignment = getAlignment(placement);
		const isVertical = getSideAxis(placement) === "y";
		const mainAxisMulti = originSides.has(side) ? -1 : 1;
		const crossAxisMulti = rtl && isVertical ? -1 : 1;
		const rawValue = evaluate(options, state);
		let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
			mainAxis: rawValue,
			crossAxis: 0,
			alignmentAxis: null
		} : {
			mainAxis: rawValue.mainAxis || 0,
			crossAxis: rawValue.crossAxis || 0,
			alignmentAxis: rawValue.alignmentAxis
		};
		if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
		return isVertical ? {
			x: crossAxis * crossAxisMulti,
			y: mainAxis * mainAxisMulti
		} : {
			x: mainAxis * mainAxisMulti,
			y: crossAxis * crossAxisMulti
		};
	}
	var MAX_RESET_COUNT, computePosition$1, flip$1, originSides, offset$1, shift$1;
	var init_floating_ui_core = __esmMin((() => {
		init_floating_ui_utils();
		MAX_RESET_COUNT = 50;
		computePosition$1 = async (reference, floating, config) => {
			const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
			const platformWithDetectOverflow = platform.detectOverflow ? platform : {
				...platform,
				detectOverflow
			};
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
			let rects = await platform.getElementRects({
				reference,
				floating,
				strategy
			});
			let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
			let statefulPlacement = placement;
			let resetCount = 0;
			const middlewareData = {};
			for (let i = 0; i < middleware.length; i++) {
				const currentMiddleware = middleware[i];
				if (!currentMiddleware) continue;
				const { name, fn } = currentMiddleware;
				const { x: nextX, y: nextY, data, reset } = await fn({
					x,
					y,
					initialPlacement: placement,
					placement: statefulPlacement,
					strategy,
					middlewareData,
					rects,
					platform: platformWithDetectOverflow,
					elements: {
						reference,
						floating
					}
				});
				x = nextX != null ? nextX : x;
				y = nextY != null ? nextY : y;
				middlewareData[name] = {
					...middlewareData[name],
					...data
				};
				if (reset && resetCount < MAX_RESET_COUNT) {
					resetCount++;
					if (typeof reset === "object") {
						if (reset.placement) statefulPlacement = reset.placement;
						if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
							reference,
							floating,
							strategy
						}) : reset.rects;
						({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
					}
					i = -1;
				}
			}
			return {
				x,
				y,
				placement: statefulPlacement,
				strategy,
				middlewareData
			};
		};
		flip$1 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "flip",
				options,
				async fn(state) {
					var _middlewareData$arrow, _middlewareData$flip;
					const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
					const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
					if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
					const side = getSide(placement);
					const initialSideAxis = getSideAxis(initialPlacement);
					const isBasePlacement = getSide(initialPlacement) === initialPlacement;
					const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
					const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
					const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
					if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
					const placements = [initialPlacement, ...fallbackPlacements];
					const overflow = await platform.detectOverflow(state, detectOverflowOptions);
					const overflows = [];
					let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
					if (checkMainAxis) overflows.push(overflow[side]);
					if (checkCrossAxis) {
						const sides = getAlignmentSides(placement, rects, rtl);
						overflows.push(overflow[sides[0]], overflow[sides[1]]);
					}
					overflowsData = [...overflowsData, {
						placement,
						overflows
					}];
					if (!overflows.every((side) => side <= 0)) {
						var _middlewareData$flip2, _overflowsData$filter;
						const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
						const nextPlacement = placements[nextIndex];
						if (nextPlacement) {
							if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
								data: {
									index: nextIndex,
									overflows: overflowsData
								},
								reset: { placement: nextPlacement }
							};
						}
						let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
						if (!resetPlacement) switch (fallbackStrategy) {
							case "bestFit": {
								var _overflowsData$filter2;
								const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
									if (hasFallbackAxisSideDirection) {
										const currentSideAxis = getSideAxis(d.placement);
										return currentSideAxis === initialSideAxis || currentSideAxis === "y";
									}
									return true;
								}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
								if (placement) resetPlacement = placement;
								break;
							}
							case "initialPlacement": resetPlacement = initialPlacement;
						}
						if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
					}
					return {};
				}
			};
		};
		originSides = /*#__PURE__*/ new Set(["left", "top"]);
		offset$1 = function(options) {
			if (options === void 0) options = 0;
			return {
				name: "offset",
				options,
				async fn(state) {
					var _middlewareData$offse, _middlewareData$arrow;
					const { x, y, placement, middlewareData } = state;
					const diffCoords = await convertValueToCoords(state, options);
					if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
					return {
						x: x + diffCoords.x,
						y: y + diffCoords.y,
						data: {
							...diffCoords,
							placement
						}
					};
				}
			};
		};
		shift$1 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "shift",
				options,
				async fn(state) {
					const { x, y, placement, platform } = state;
					const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
						let { x, y } = _ref;
						return {
							x,
							y
						};
					} }, ...detectOverflowOptions } = evaluate(options, state);
					const coords = {
						x,
						y
					};
					const overflow = await platform.detectOverflow(state, detectOverflowOptions);
					const crossAxis = getSideAxis(placement);
					const mainAxis = getOppositeAxis(crossAxis);
					let mainAxisCoord = coords[mainAxis];
					let crossAxisCoord = coords[crossAxis];
					const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
					if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
					if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
					const limitedCoords = limiter.fn({
						...state,
						[mainAxis]: mainAxisCoord,
						[crossAxis]: crossAxisCoord
					});
					return {
						...limitedCoords,
						data: {
							x: limitedCoords.x - x,
							y: limitedCoords.y - y,
							enabled: {
								[mainAxis]: checkMainAxis,
								[crossAxis]: checkCrossAxis
							}
						}
					};
				}
			};
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
	function hasWindow() {
		return typeof window !== "undefined";
	}
	function getNodeName(node) {
		if (isNode(node)) return (node.nodeName || "").toLowerCase();
		return "#document";
	}
	function getWindow(node) {
		var _node$ownerDocument;
		return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
	}
	function getDocumentElement(node) {
		var _ref;
		return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
	}
	function isNode(value) {
		if (!hasWindow()) return false;
		return value instanceof Node || value instanceof getWindow(value).Node;
	}
	function isElement(value) {
		if (!hasWindow()) return false;
		return value instanceof Element || value instanceof getWindow(value).Element;
	}
	function isHTMLElement(value) {
		if (!hasWindow()) return false;
		return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
	}
	function isShadowRoot(value) {
		if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
		return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
	}
	function isOverflowElement(element) {
		const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
		return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
	}
	function isTableElement(element) {
		return /^(table|td|th)$/.test(getNodeName(element));
	}
	function isTopLayer(element) {
		try {
			if (element.matches(":popover-open")) return true;
		} catch (_e) {}
		try {
			return element.matches(":modal");
		} catch (_e) {
			return false;
		}
	}
	function isContainingBlock(elementOrCss) {
		const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
		return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
	}
	function getContainingBlock(element) {
		let currentNode = getParentNode(element);
		while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
			if (isContainingBlock(currentNode)) return currentNode;
			else if (isTopLayer(currentNode)) return null;
			currentNode = getParentNode(currentNode);
		}
		return null;
	}
	function isWebKit() {
		if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
		return isWebKitValue;
	}
	function isLastTraversableNode(node) {
		return /^(html|body|#document)$/.test(getNodeName(node));
	}
	function getComputedStyle$1(element) {
		return getWindow(element).getComputedStyle(element);
	}
	function getNodeScroll(element) {
		if (isElement(element)) return {
			scrollLeft: element.scrollLeft,
			scrollTop: element.scrollTop
		};
		return {
			scrollLeft: element.scrollX,
			scrollTop: element.scrollY
		};
	}
	function getParentNode(node) {
		if (getNodeName(node) === "html") return node;
		const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
		return isShadowRoot(result) ? result.host : result;
	}
	function getNearestOverflowAncestor(node) {
		const parentNode = getParentNode(node);
		if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
		if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
		return getNearestOverflowAncestor(parentNode);
	}
	function getOverflowAncestors(node, list, traverseIframes) {
		var _node$ownerDocument2;
		if (list === void 0) list = [];
		if (traverseIframes === void 0) traverseIframes = true;
		const scrollableAncestor = getNearestOverflowAncestor(node);
		const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
		const win = getWindow(scrollableAncestor);
		if (isBody) {
			const frameElement = getFrameElement(win);
			return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
		} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
	}
	function getFrameElement(win) {
		return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
	}
	var willChangeRe, containRe, isNotNone, isWebKitValue;
	var init_floating_ui_utils_dom = __esmMin((() => {
		willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
		containRe = /paint|layout|strict|content/;
		isNotNone = (value) => !!value && value !== "none";
		;
	}));

//#endregion
//#region ../../node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
	function getCssDimensions(element) {
		const css = getComputedStyle$1(element);
		let width = parseFloat(css.width) || 0;
		let height = parseFloat(css.height) || 0;
		const hasOffset = isHTMLElement(element);
		const offsetWidth = hasOffset ? element.offsetWidth : width;
		const offsetHeight = hasOffset ? element.offsetHeight : height;
		const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
		if (shouldFallback) {
			width = offsetWidth;
			height = offsetHeight;
		}
		return {
			width,
			height,
			$: shouldFallback
		};
	}
	function unwrapElement(element) {
		return !isElement(element) ? element.contextElement : element;
	}
	function getScale(element) {
		const domElement = unwrapElement(element);
		if (!isHTMLElement(domElement)) return createCoords(1);
		const rect = domElement.getBoundingClientRect();
		const { width, height, $ } = getCssDimensions(domElement);
		let x = ($ ? round(rect.width) : rect.width) / width;
		let y = ($ ? round(rect.height) : rect.height) / height;
		if (!x || !Number.isFinite(x)) x = 1;
		if (!y || !Number.isFinite(y)) y = 1;
		return {
			x,
			y
		};
	}
	function getVisualOffsets(element) {
		const win = getWindow(element);
		if (!isWebKit() || !win.visualViewport) return noOffsets;
		return {
			x: win.visualViewport.offsetLeft,
			y: win.visualViewport.offsetTop
		};
	}
	function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
		if (isFixed === void 0) isFixed = false;
		return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
	}
	function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
		if (includeScale === void 0) includeScale = false;
		if (isFixedStrategy === void 0) isFixedStrategy = false;
		const clientRect = element.getBoundingClientRect();
		const domElement = unwrapElement(element);
		let scale = createCoords(1);
		if (includeScale) {
			if (offsetParent) {
				if (isElement(offsetParent)) scale = getScale(offsetParent);
			} else scale = getScale(element);
		}
		const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
		let x = (clientRect.left + visualOffsets.x) / scale.x;
		let y = (clientRect.top + visualOffsets.y) / scale.y;
		let width = clientRect.width / scale.x;
		let height = clientRect.height / scale.y;
		if (domElement && offsetParent) {
			const win = getWindow(domElement);
			const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
			let currentWin = win;
			let currentIFrame = getFrameElement(currentWin);
			while (currentIFrame && offsetWin !== currentWin) {
				const iframeScale = getScale(currentIFrame);
				const iframeRect = currentIFrame.getBoundingClientRect();
				const css = getComputedStyle$1(currentIFrame);
				const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
				const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
				x *= iframeScale.x;
				y *= iframeScale.y;
				width *= iframeScale.x;
				height *= iframeScale.y;
				x += left;
				y += top;
				currentWin = getWindow(currentIFrame);
				currentIFrame = getFrameElement(currentWin);
			}
		}
		return rectToClientRect({
			width,
			height,
			x,
			y
		});
	}
	function getWindowScrollBarX(element, rect) {
		const leftScroll = getNodeScroll(element).scrollLeft;
		if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
		return rect.left + leftScroll;
	}
	function getHTMLOffset(documentElement, scroll) {
		const htmlRect = documentElement.getBoundingClientRect();
		return {
			x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
			y: htmlRect.top + scroll.scrollTop
		};
	}
	function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
		let { elements, rect, offsetParent, strategy } = _ref;
		const isFixed = strategy === "fixed";
		const documentElement = getDocumentElement(offsetParent);
		const topLayer = elements ? isTopLayer(elements.floating) : false;
		if (offsetParent === documentElement || topLayer && isFixed) return rect;
		let scroll = {
			scrollLeft: 0,
			scrollTop: 0
		};
		let scale = createCoords(1);
		const offsets = createCoords(0);
		const isOffsetParentAnElement = isHTMLElement(offsetParent);
		if (isOffsetParentAnElement || !isFixed) {
			if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
			if (isOffsetParentAnElement) {
				const offsetRect = getBoundingClientRect(offsetParent);
				scale = getScale(offsetParent);
				offsets.x = offsetRect.x + offsetParent.clientLeft;
				offsets.y = offsetRect.y + offsetParent.clientTop;
			}
		}
		const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
		return {
			width: rect.width * scale.x,
			height: rect.height * scale.y,
			x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
			y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
		};
	}
	function getClientRects(element) {
		return element.getClientRects ? Array.from(element.getClientRects()) : [];
	}
	function getDocumentRect(html) {
		const scroll = getNodeScroll(html);
		const body = html.ownerDocument.body;
		const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
		const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
		let x = -scroll.scrollLeft + getWindowScrollBarX(html);
		const y = -scroll.scrollTop;
		if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
		return {
			width,
			height,
			x,
			y
		};
	}
	function getViewportRect(element, strategy, rootBoundary) {
		if (rootBoundary === void 0) rootBoundary = "viewport";
		const isLayoutViewport = rootBoundary === "layoutViewport";
		const win = getWindow(element);
		const html = getDocumentElement(element);
		const visualViewport = win.visualViewport;
		let width = html.clientWidth;
		let height = html.clientHeight;
		let x = 0;
		let y = 0;
		if (visualViewport) {
			const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
			if (isLayoutViewport) {
				if (!layoutRelativeClientCoords) {
					x = -visualViewport.offsetLeft;
					y = -visualViewport.offsetTop;
				}
			} else {
				width = visualViewport.width;
				height = visualViewport.height;
				if (layoutRelativeClientCoords) {
					x = visualViewport.offsetLeft;
					y = visualViewport.offsetTop;
				}
			}
		}
		if (getWindowScrollBarX(html) <= 0) {
			const doc = html.ownerDocument;
			const body = doc.body;
			const bodyStyles = getComputedStyle(body);
			const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
			const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
			const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
			if (gutter <= SCROLLBAR_MAX) width -= gutter;
		}
		return {
			width,
			height,
			x,
			y
		};
	}
	function getInnerBoundingClientRect(element, strategy) {
		const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
		const top = clientRect.top + element.clientTop;
		const left = clientRect.left + element.clientLeft;
		const scale = getScale(element);
		return {
			width: element.clientWidth * scale.x,
			height: element.clientHeight * scale.y,
			x: left * scale.x,
			y: top * scale.y
		};
	}
	function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
		let rect;
		if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
		else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
		else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
		else {
			const visualOffsets = getVisualOffsets(element);
			rect = {
				x: clippingAncestor.x - visualOffsets.x,
				y: clippingAncestor.y - visualOffsets.y,
				width: clippingAncestor.width,
				height: clippingAncestor.height
			};
		}
		return rectToClientRect(rect);
	}
	function getClippingElementAncestors(element, cache) {
		const cachedResult = cache.get(element);
		if (cachedResult) return cachedResult;
		let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
		let lastKeptComputedStyle = null;
		const elementIsFixed = getComputedStyle$1(element).position === "fixed";
		let currentNode = elementIsFixed ? getParentNode(element) : element;
		while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
			const computedStyle = getComputedStyle$1(currentNode);
			const currentNodeIsContaining = isContainingBlock(currentNode);
			const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
			if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
			else lastKeptComputedStyle = computedStyle;
			currentNode = getParentNode(currentNode);
		}
		cache.set(element, result);
		return result;
	}
	function getClippingRect(_ref) {
		let { element, boundary, rootBoundary, strategy } = _ref;
		const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
		const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
		let top = firstRect.top;
		let right = firstRect.right;
		let bottom = firstRect.bottom;
		let left = firstRect.left;
		for (let i = 1; i < clippingAncestors.length; i++) {
			const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
			top = max(rect.top, top);
			right = min(rect.right, right);
			bottom = min(rect.bottom, bottom);
			left = max(rect.left, left);
		}
		return {
			width: right - left,
			height: bottom - top,
			x: left,
			y: top
		};
	}
	function getDimensions(element) {
		const { width, height } = getCssDimensions(element);
		return {
			width,
			height
		};
	}
	function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
		const isOffsetParentAnElement = isHTMLElement(offsetParent);
		const documentElement = getDocumentElement(offsetParent);
		const isFixed = strategy === "fixed";
		const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
		let scroll = {
			scrollLeft: 0,
			scrollTop: 0
		};
		const offsets = createCoords(0);
		if (isOffsetParentAnElement || !isFixed) {
			if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
			if (isOffsetParentAnElement) {
				const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
				offsets.x = offsetRect.x + offsetParent.clientLeft;
				offsets.y = offsetRect.y + offsetParent.clientTop;
			}
		}
		if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
		const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
		return {
			x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
			y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
			width: rect.width,
			height: rect.height
		};
	}
	function isStaticPositioned(element) {
		return getComputedStyle$1(element).position === "static";
	}
	function getTrueOffsetParent(element, polyfill) {
		if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
		if (polyfill) return polyfill(element);
		let rawOffsetParent = element.offsetParent;
		if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
		return rawOffsetParent;
	}
	function getOffsetParent(element, polyfill) {
		const win = getWindow(element);
		if (isTopLayer(element)) return win;
		if (!isHTMLElement(element)) {
			let svgOffsetParent = getParentNode(element);
			while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
				if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
				svgOffsetParent = getParentNode(svgOffsetParent);
			}
			return win;
		}
		let offsetParent = getTrueOffsetParent(element, polyfill);
		while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
		if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
		return offsetParent || getContainingBlock(element) || win;
	}
	function isRTL(element) {
		return getComputedStyle$1(element).direction === "rtl";
	}
	var noOffsets, SCROLLBAR_MAX, getElementRects, platform, offset, shift, flip, computePosition;
	var init_floating_ui_dom = __esmMin((() => {
		init_floating_ui_core();
		init_floating_ui_utils();
		init_floating_ui_utils_dom();
		noOffsets = /*#__PURE__*/ createCoords(0);
		SCROLLBAR_MAX = 25;
		getElementRects = async function(data) {
			const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
			const getDimensionsFn = this.getDimensions;
			const floatingDimensions = await getDimensionsFn(data.floating);
			return {
				reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
				floating: {
					x: 0,
					y: 0,
					width: floatingDimensions.width,
					height: floatingDimensions.height
				}
			};
		};
		platform = {
			convertOffsetParentRelativeRectToViewportRelativeRect,
			getDocumentElement,
			getClippingRect,
			getOffsetParent,
			getElementRects,
			getClientRects,
			getDimensions,
			getScale,
			isElement,
			isRTL
		};
		offset = offset$1;
		shift = shift$1;
		flip = flip$1;
		computePosition = (reference, floating, options) => {
			const cache = /* @__PURE__ */ new Map();
			const mergedOptions = options != null ? options : {};
			const platformWithCache = {
				...platform,
				...mergedOptions.platform,
				_c: cache
			};
			return computePosition$1(reference, floating, {
				...mergedOptions,
				platform: platformWithCache
			});
		};
	}));

//#endregion
//#region src/components/floating-popup.ts
/**
	* 创建 Popup 框。
	*/
	function createPopup(props) {
		const { root, trigger, triggerType = "click", content, options, onOpen, onClose, placement = "bottom-start", offsetOptions = {
			mainAxis: 5,
			crossAxis: 5
		} } = props;
		const $popupContent = $("<div class=\"v2p-popup-content\">");
		const $popup = $("<div class=\"v2p-popup\" tabindex=\"0\">").css("visibility", "hidden").append($popupContent);
		root.append($popup);
		if (content) $popup.append(content);
		const popup = $popup.get(0);
		const handleClickOutside = (ev) => {
			if ($(ev.target).closest(popup).length === 0) handlePopupClose();
		};
		const handlePopupClose = () => {
			$popup.css("visibility", "hidden");
			$(document).off("click", handleClickOutside);
			onClose?.();
			popupControl.onClose?.();
		};
		const handlePopupOpen = ($reference) => {
			if (!$reference) return;
			setTimeout(() => {
				$(document).on("click", handleClickOutside);
			});
			const referenceElement = $reference.get(0);
			computePosition(referenceElement, popup, {
				placement,
				middleware: [
					offset(offsetOptions),
					flip(),
					shift({ padding: 8 })
				],
				...options
			}).then(({ x, y }) => {
				Object.assign(popup.style, {
					left: `${x}px`,
					top: `${y}px`
				});
				$popup.css("visibility", "visible");
			}).catch(() => {
				handlePopupClose();
				createToast({ message: "❌ Popup 渲染失败" });
			});
			onOpen?.();
		};
		const popupControl = {
			$content: $popupContent,
			isOver: false,
			open: (reference) => {
				handlePopupOpen(reference);
			},
			close: handlePopupClose
		};
		if (triggerType === "hover") $popup.on("mouseover", () => {
			if (!popupControl.isOver) {
				popupControl.isOver = true;
				$popup.off("mouseleave").on("mouseleave", () => {
					popupControl.isOver = false;
					setTimeout(() => {
						if (!popupControl.isOver) popupControl.close();
					}, 350);
				});
			}
		});
		trigger?.on("click", () => {
			if (popup.style.visibility !== "hidden") handlePopupClose();
			else handlePopupOpen(trigger);
		});
		return popupControl;
	}
	var hoverDelay;
	var init_floating_popup = __esmMin((() => {
		init_floating_ui_dom();
		init_toast();
		hoverDelay = 350;
	}));

//#endregion
//#region src/icons.ts
	var iconLoading, iconLogo, iconGitHub;
	var init_icons = __esmMin((() => {
		iconLoading = `
<svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
  <circle fill="currentcolor" stroke="none" cx="6" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.1"/>    
  </circle>
  <circle fill="currentcolor" stroke="none" cx="26" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.2"/>       
  </circle>
  <circle fill="currentcolor" stroke="none" cx="46" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.3"/>     
  </circle>
</svg>
`;
		iconLogo = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 88 88"><g style="mix-blend-mode:passthrough"><path d="M87.92 86.098v-.052a.592.592 0 0 0 0-.07L44.978.72l-.059-.105c-.16-.3-.415-.511-.705-.586a.961.961 0 0 0-.841.19 1.315 1.315 0 0 0-.336.378l-.058.115a2571.004 2571.004 0 0 1-8.695 17.172c-.59 1.024-.59 2.382 0 3.406 3.856 7.57 7.7 15.142 11.532 22.718.641 1.108.641 2.58 0 3.688C39.5 60.23 32.826 73.406 26.45 85.993c-.291.661-.086 1.482.46 1.84.16.104.341.158.525.158h18.52c.415.003.797-.272.992-.713l.635-1.285 8.585-17.023c.142-.317.383-.552.67-.653a.949.949 0 0 1 .855.116c.156.1.289.245.386.423l8.506 16.723.787 1.558c.199.433.575.702.985.704h.518c.087.009.175.009.263 0h17.74c.617 0 1.119-.601 1.123-1.347a1.615 1.615 0 0 0-.08-.396Z" fill="currentColor" style="mix-blend-mode:passthrough"/><path d="m38.551 48.541.62-1.232a3.095 3.095 0 0 0 0-3.02l-3.807-7.446-4.377-8.511c-.155-.308-.406-.527-.697-.61a.957.957 0 0 0-.85.17 1.252 1.252 0 0 0-.4.502L.132 86.002c-.29.658-.085 1.477.46 1.83.161.113.345.17.532.168h16.981c.41 0 .788-.27.985-.705l.65-1.302c.029-.048.055-.098.08-.15l.729-1.408c6.047-12.103 11.839-23.66 17.9-35.7.038-.062.072-.127.102-.194Z" fill="currentColor" style="mix-blend-mode:passthrough"/></g></svg>
`;
		iconGitHub = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path fill="currentColor" clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path>
</svg>
`;
	}));

//#endregion
//#region src/post-task.ts
/**
	* 发送任务脚本到原 Web 页中执行，并返回执行结果。
	*
	* 此函数用于在浏览器扩展的内容脚本中执行需要访问页面原始上下文的代码。
	* - 在非扩展环境中，直接使用 Function 构造函数执行表达式
	* - 在扩展环境中，通过 postMessage 将任务发送到 web_accessible_resources 脚本执行
	*
	* @param expression - 要执行的 JavaScript 表达式字符串
	* @param callback - 可选的回调函数，接收执行结果
	*/
	function postTask(expression, callback) {
		if (!isBrowserExtension()) {
			const result = getRuntime().executeInPage(expression);
			callback?.(result);
		} else {
			if (callback) {
				if (window.__V2P_Tasks) window.__V2P_Tasks.set(Date.now(), callback);
				else window.__V2P_Tasks = /* @__PURE__ */ new Map([[Date.now(), callback]]);
			}
			const messageData = {
				from: 0,
				payload: { task: {
					id: Date.now(),
					expression
				} }
			};
			window.postMessage(messageData);
		}
	}
	var init_post_task = __esmMin((() => {
		init_runtime();
		init_utils();
	}));

//#endregion
//#region src/once.ts
/**
	* 将最新的 once 同步到页面上下文和隔离世界。
	*/
	function syncOnce(value) {
		const once = normalizeOnce(value);
		if (!once) return null;
		window.once = once;
		postTask(`window.once = "${once}"`);
		return once;
	}
	/**
	* 从 HTML 中提取最新的 once 并同步。
	*/
	function syncOnceFromHtml(htmlText) {
		return syncOnce(extractOnceFromHtml(htmlText));
	}
	/**
	* 读取当前隔离世界里的 once。
	*/
	function getOnce() {
		return normalizeOnce(window.once);
	}
	/**
	* 重新抓取页面并同步最新的 once。
	*/
	async function refreshOnceFromPage(path = window.location.pathname) {
		try {
			const res = await fetch(`${V2EX_ORIGIN}${path}`, { cache: "no-store" });
			if (!res.ok) return null;
			return syncOnceFromHtml(await res.text());
		} catch {
			return null;
		}
	}
	/**
	* 串行执行写操作。
	*/
	function runSerialized(task) {
		return enqueue(task);
	}
	/**
	* 串行执行需要 once 的写操作；缺少 once 时先尝试从当前页面刷新。
	*/
	function runOnceTask(task) {
		return runSerialized(async () => {
			const once = getOnce() ?? await refreshOnceFromPage();
			if (!once) throw new ApiError({ message: "登录状态已失效，请刷新页面后重试" });
			return task(once);
		});
	}
	/**
	* 从写操作的响应 HTML 中同步 once；响应里没有时回退到重新抓取页面。
	*/
	async function syncOnceFromResponse(res) {
		try {
			const once = syncOnceFromHtml(await res.text());
			if (once) return once;
		} catch {}
		return refreshOnceFromPage();
	}
	var enqueue;
	var init_once = __esmMin((() => {
		init_post_task();
		init_utils();
		enqueue = createSerialQueue();
	}));

//#endregion
//#region src/services.ts
/**
	* V2EX API v1
	*
	* 相关的接口文档参考：https://www.v2ex.com/p/7v9TEc53
	*/
	async function legacyRequest(url, options) {
		const { timeout: timeoutValue, ...restOptions } = options ?? {};
		const res = await fetchWithTimeout(url, timeoutValue ?? FETCH_TIMEOUT.DEFAULT, restOptions);
		if (res.ok) return res.json();
		throw await createApiErrorFromResponse(res, "调用 V2EX API v1 出错");
	}
	async function fetchUserInfo(memberName, options) {
		try {
			return await legacyRequest(`${V2EX_LEGACY_API}/members/show.json?username=${memberName}`, options);
		} catch (err) {
			if (isAbortError(err)) throw new ApiError({
				message: "请求被取消",
				cause: err
			});
			if (err instanceof ApiError && err.statusCode === 404) throw new ApiError({
				message: "查无此用户，疑似已被封禁",
				cause: err,
				statusCode: 404
			});
			throw wrapApiError(err, "获取用户信息失败");
		}
	}
	function fetchLatestTopics(options) {
		return legacyRequest(`${V2EX_LEGACY_API}/topics/latest.json?r=${Date.now()}`, options);
	}
	async function request(url, options) {
		const PAT = (await getStorage())["api"]?.pat;
		const { timeout: timeoutValue, ...restOptions } = options ?? {};
		const res = await fetchWithTimeout(url, timeoutValue ?? FETCH_TIMEOUT.DEFAULT, {
			...restOptions,
			headers: {
				Authorization: PAT ? `Bearer ${PAT}` : "",
				...restOptions?.headers
			}
		});
		{
			const limit = res.headers.get("X-Rate-Limit-Limit");
			const reset = res.headers.get("X-Rate-Limit-Reset");
			const remaining = res.headers.get("X-Rate-Limit-Remaining");
			const api = {
				pat: PAT,
				limit: limit ? Number(limit) : void 0,
				reset: reset ? Number(reset) : void 0,
				remaining: remaining ? Number(remaining) : void 0
			};
			setStorage("api", api);
		}
		const resultData = await res.json();
		if (typeof resultData.success === "boolean" && !resultData.success) throw new Error(resultData.message, { cause: resultData });
		return resultData;
	}
	function fetchTopic(topicId, options) {
		return request(`${V2EX_API}/topics/${topicId}`, {
			method: "GET",
			...options
		});
	}
	function fetchNotifications(page = 1) {
		return request(`${V2EX_API}/notifications?p=${page}`, { method: "GET" });
	}
	/**
	* Imgur 文件上传规则：
	*
	* - File size limits:
	* 非动画图像（比如 JPG、PNG 等）的最大文件大小为 20MB。超过 5MB 的 PNG 文件将被转换为 JPEG。
	* 动画图像（比如 GIF）和视频的最大文件大小为 200MB。视频上传不能超过 60 秒。超过 2MB 的 GIF 和视频文件将被转换为 GIFV。
	* 对于非动画图片，匿名用户上传的文件超过 1MB，账号主上传的文件超过 5MB，将会进行有损压缩。
	*
	* - Upload limits:
	* 每小时上传限额为 50 张图片，但账号没有总的上传限额。
	*
	* 使用详情参考 https://help.imgur.com/hc/en-us/articles/26511665959579-What-files-can-I-upload-Is-there-a-size-limit。
	*/
	async function uploadImage(file) {
		const formData = new FormData();
		formData.append("image", file);
		const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length);
		const clidenId = imgurClientIdPool[randomIndex];
		const res = await fetchWithTimeout("https://api.imgur.com/3/upload", FETCH_TIMEOUT.UPLOAD, {
			method: "POST",
			headers: { Authorization: `Client-ID ${clidenId}` },
			body: formData
		});
		if (res.ok) {
			const resData = await res.json();
			if (resData.success) return resData.data.link;
		}
		throw await createApiErrorFromResponse(res, "上传失败");
	}
	/**
	* 获取最新的金币，返回 HTML 字符串。
	*/
	async function refreshMoney() {
		const data = await (await fetch("/ajax/money", { method: "POST" })).text();
		$("#money").html(data);
	}
	async function thankReply(params) {
		try {
			return await runOnceTask(async (once) => {
				const res = await fetchWithTimeout(`/thank/reply/${encodeURIComponent(params.replyId)}?once=${once}`, FETCH_TIMEOUT.DEFAULT, { method: "POST" });
				if (!res.ok) return {
					success: false,
					message: `❌ 感谢回复失败（HTTP ${res.status}）`
				};
				const data = await res.json();
				if (!syncOnce(data.once)) await refreshOnceFromPage();
				if (data.success !== true) return {
					success: false,
					message: `❌ ${data.message ?? "感谢回复失败"}`
				};
				try {
					await refreshMoney();
				} catch {}
				return { success: true };
			});
		} catch (error) {
			if (error instanceof ApiError) return {
				success: false,
				message: `❌ ${error.message}`
			};
			return {
				success: false,
				message: "❌ 感谢回复失败，请稍后重试"
			};
		}
	}
	/**
	* 爬取主题内容页，返回 HTML 纯文本。
	*/
	async function crawlTopicPage(path, page = "1", options) {
		return await (await fetchWithTimeout(`${V2EX_ORIGIN}${path}?p=${page}`, FETCH_TIMEOUT.CRAWL, options)).text();
	}
	/**
	* 爬取用户内容页，返回 HTML 纯文本。
	*/
	async function crawlUserPage(username, options) {
		return await (await fetchWithTimeout(`${V2EX_ORIGIN}/member/${username}`, FETCH_TIMEOUT.CRAWL, options)).text();
	}
	/**
	* 带超时的 fetch 请求
	*
	* @param url - 请求 URL
	* @param timeout - 超时时间（毫秒），默认为 10 秒
	* @param options - fetch 选项
	* @returns Promise<Response>
	*/
	async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT.DEFAULT, options) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);
		const externalSignal = options?.signal;
		const abortWithExternalSignal = () => controller.abort();
		if (externalSignal) {
			if (externalSignal.aborted) controller.abort();
			else externalSignal.addEventListener("abort", abortWithExternalSignal, { once: true });
		}
		try {
			return await fetch(url, {
				...options,
				signal: controller.signal
			});
		} finally {
			clearTimeout(timeoutId);
			externalSignal?.removeEventListener("abort", abortWithExternalSignal);
		}
	}
	/**
	* 爬取标签页面，返回 HTML 纯文本。
	*/
	async function crawlTagPage(tag) {
		const url = `${V2EX_ORIGIN}/tag/${encodeURIComponent(tag)}`;
		const res = await fetchWithTimeout(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} for ${url}`);
		return await res.text();
	}
	/**
	* 从用户页面 HTML 中解析发帖记录列表。
	*
	* @param htmlText - 用户页面的 HTML 文本
	* @param limit - 最多返回的记录数量，默认为 5
	* @returns 发帖记录数组，解析失败时返回空数组
	*/
	function parseUserTopics(htmlText, limit = 5) {
		try {
			const $topicItems = $(htmlText).find(".cell.item");
			const topics = [];
			$topicItems.each((index, item) => {
				if (index >= limit) return false;
				const $item = $(item);
				const $topicLink = $item.find(".item_title .topic-link");
				const $nodeLink = $item.find(".node");
				const title = $topicLink.text().trim();
				const url = $topicLink.attr("href");
				if (title && url) {
					const topic = {
						title,
						url
					};
					const nodeName = $nodeLink.text().trim();
					const nodeUrl = $nodeLink.attr("href");
					if (nodeName && nodeUrl) topic.node = {
						name: nodeName,
						url: nodeUrl
					};
					topics.push(topic);
				}
			});
			return topics;
		} catch {
			return [];
		}
	}
	/**
	* 屏蔽用户。
	*
	* @param username - 要屏蔽的用户名
	* @returns 屏蔽是否成功
	*/
	async function blockUser(username) {
		try {
			return await runSerialized(async () => {
				const htmlText = await crawlUserPage(username, { cache: "no-store" });
				const $blockBtn = $(htmlText).find("input[type=\"button\"][value=\"Block\"]");
				if ($blockBtn.length === 0) return {
					success: false,
					message: "未找到 Block 按钮，该用户可能已被屏蔽或登录状态已失效"
				};
				const blockUrl = parseBlockUrl($blockBtn.attr("onclick"));
				if (!blockUrl) return {
					success: false,
					message: "无法解析屏蔽链接"
				};
				const res = await fetchWithTimeout(`${V2EX_ORIGIN}${blockUrl}`, FETCH_TIMEOUT.DEFAULT);
				if (!res.ok) return {
					success: false,
					message: `屏蔽操作失败（HTTP ${res.status}），请稍后重试`
				};
				const finalPath = new URL(res.url, V2EX_ORIGIN).pathname;
				if (finalPath.startsWith("/signin") || finalPath.startsWith("/signup")) return {
					success: false,
					message: "登录状态已失效，请重新登录后再试"
				};
				await syncOnceFromResponse(res);
				let verified = true;
				try {
					const verifiedHtml = await crawlUserPage(username, { cache: "no-store" });
					syncOnceFromHtml(verifiedHtml);
					verified = $(verifiedHtml).find("input[type=\"button\"][value=\"Block\"]").length === 0;
				} catch {}
				if (!verified) return {
					success: true,
					message: "⚠️ 屏蔽请求已发送，但未能确认结果，请刷新页面检查"
				};
				return {
					success: true,
					message: "✅ 已屏蔽该用户，刷新页面后生效"
				};
			});
		} catch (error) {
			console.error("屏蔽用户失败:", error);
			return {
				success: false,
				message: "屏蔽操作出错，请稍后重试"
			};
		}
	}
	/**
	* 忽略（屏蔽）主题。
	*/
	function ignoreTopic(topicId) {
		return runSerialized(async () => {
			const pageText = await crawlTopicPage(`/t/${topicId}`, "0", { cache: "no-store" });
			const $ignoreBtn = $(pageText).find(".topic_buttons a:nth-of-type(3)");
			const ignoreUrl = parseIgnoreTopicUrl($ignoreBtn.attr("onclick"));
			if (!ignoreUrl) throw new ApiError({ message: "无法解析屏蔽链接" });
			const res = await fetchWithTimeout(`${V2EX_ORIGIN}${ignoreUrl}`, FETCH_TIMEOUT.DEFAULT);
			if (!res.ok) throw new ApiError({ message: `屏蔽失败（HTTP ${res.status}）` });
			const finalPath = new URL(res.url, V2EX_ORIGIN).pathname;
			if (finalPath.startsWith("/signin") || finalPath.startsWith("/signup")) throw new ApiError({ message: "登录状态已失效，请重新登录后再试" });
			await syncOnceFromResponse(res);
		});
	}
	/**
	* 忽略（隐藏）单条回复。
	*/
	async function ignoreReply(url) {
		try {
			return await runOnceTask(async (once) => {
				const target = new URL(url, V2EX_ORIGIN);
				target.searchParams.set("once", once);
				const res = await fetchWithTimeout(target.toString(), FETCH_TIMEOUT.DEFAULT);
				if (!res.ok) return {
					success: false,
					message: `❌ 隐藏回复失败（HTTP ${res.status}）`
				};
				const finalPath = new URL(res.url, V2EX_ORIGIN).pathname;
				if (finalPath.startsWith("/signin") || finalPath.startsWith("/signup")) return {
					success: false,
					message: "❌ 登录状态已失效，请重新登录后再试"
				};
				await syncOnceFromResponse(res);
				return {
					success: true,
					message: "✅ 已隐藏该回复"
				};
			});
		} catch (error) {
			if (error instanceof ApiError) return {
				success: false,
				message: `❌ ${error.message}`
			};
			return {
				success: false,
				message: "❌ 隐藏回复失败，请稍后重试"
			};
		}
	}
	/**
	* 获取回复的预览渲染内容。
	*/
	async function getCommentPreview(params) {
		const formData = new FormData();
		formData.append("text", params.text);
		const res = await fetch(`${V2EX_ORIGIN}/preview/${params.syntax}`, {
			method: "POST",
			body: formData
		});
		if (res.ok) return await res.text();
		throw await createApiErrorFromResponse(res, "预览失败");
	}
	function resolveHotTopicsApi() {
		if ("https://v2ex-hot-topics.leokudev.workers.dev/hot-topics".includes("<your-subdomain>")) throw new ApiError({ message: "未配置热议主题接口地址，请替换 HOT_TOPICS_API 中的占位符" });
		return new URL(HOT_TOPICS_API_URL);
	}
	async function fetchHotTopicsDirect(params) {
		const { range, limits, expand, signal } = params;
		try {
			const url = resolveHotTopicsApi();
			url.searchParams.set("range", String(range));
			if (expand !== void 0) url.searchParams.set("expand", String(expand));
			if (limits !== void 0) url.searchParams.set("limits", String(limits));
			const res = await fetchWithTimeout(url.toString(), FETCH_TIMEOUT.DEFAULT, {
				method: "GET",
				signal
			});
			if (!res.ok) throw await createApiErrorFromResponse(res, "获取热议主题失败");
			const data = await res.json();
			if (!data.success) throw new ApiError({ message: data.message ? `获取热议主题失败：${data.message}` : "获取热议主题失败" });
			return data;
		} catch (err) {
			if (isAbortError(err) || err instanceof ApiError) throw err;
			if (err instanceof Error) throw new ApiError({
				message: `获取热议主题失败：${err.message}`,
				cause: err
			});
			throw new ApiError({
				message: "获取热议主题失败",
				cause: err
			});
		}
	}
	/**
	* 获取近期热议主题。
	*/
	async function getHotTopics(params) {
		const { range, limits, expand, signal } = params;
		return fetchHotTopicsDirect({
			range,
			limits,
			expand,
			signal
		});
	}
	var V2EX_LEGACY_API, V2EX_API, FETCH_TIMEOUT;
	var init_services = __esmMin((() => {
		init_constants();
		init_once();
		init_utils();
		V2EX_LEGACY_API = `${V2EX_ORIGIN}/api`;
		V2EX_API = `${V2EX_ORIGIN}/api/v2`;
		FETCH_TIMEOUT = {
			DEFAULT: 1e4,
			CRAWL: 8e3,
			UPLOAD: 6e4,
			BACKGROUND: 2e4
		};
	}));

//#endregion
//#region src/contents/reply-dom.ts
/** 返回元素中匹配选择器的直接子元素。 */
	function getDirectChild(element, selector) {
		return Array.from(element.children).find((child) => child.matches(selector)) ?? null;
	}
	/** 从回复行中读取作者主页链接，兼容旧版与新 Flexbox 结构。 */
	function getReplyAuthorLinkFromRow(row) {
		const cell = getDirectChild(row, "td:nth-child(3)");
		if (!cell) return null;
		const directAuthor = getDirectChild(cell, "strong");
		if (directAuthor) return getDirectChild(directAuthor, "a");
		const headerRow = getDirectChild(cell, ".flex-one-row");
		if (!headerRow) return null;
		return (getDirectChild(headerRow, ".flex-one-row") ?? headerRow).querySelector("strong > a");
	}
	/** 从回复 cell 中读取作者主页链接。 */
	function getReplyAuthorLinkFromCell(cell) {
		const table = getDirectChild(cell, "table");
		const tbody = table && getDirectChild(table, "tbody");
		const row = tbody && getDirectChild(tbody, "tr");
		return row ? getReplyAuthorLinkFromRow(row) : null;
	}
	/** 从回复 cell 中读取操作栏，兼容旧版 .fr 与新版 Flexbox 行。 */
	function getReplyActionsFromCell(cell) {
		const table = getDirectChild(cell, "table");
		const tbody = table && getDirectChild(table, "tbody");
		const row = tbody && getDirectChild(tbody, "tr");
		const contentCell = row && getDirectChild(row, "td:last-of-type");
		if (!contentCell) return null;
		const legacyActions = getDirectChild(contentCell, ".fr");
		if (legacyActions) return legacyActions;
		return Array.from(contentCell.querySelectorAll(".flex-one-row")).filter((element) => Boolean(getDirectChild(element, ".no"))).at(-1) ?? null;
	}
	/** 从操作栏中读取真正的回复链接，避免误选感谢区里的最后一个链接。 */
	function getReplyLinkFromActions(actions) {
		return Array.from(actions.querySelectorAll("a")).find((link) => {
			return Array.from(link.children).some((child) => child.matches("img[alt=\"Reply\"]"));
		}) ?? null;
	}
	/** 移除回复 cell 的原生操作按钮，只保留楼层号。 */
	function removeReplyActionsFromCell(cell) {
		const actions = getReplyActionsFromCell(cell);
		if (!actions) return;
		for (const child of Array.from(actions.children)) if (!child.matches(".no")) child.remove();
	}
	var init_reply_dom = __esmMin((() => {}));

//#endregion
//#region src/contents/dom.ts
	function getCommentDataList({ options, $commentTableRows, $commentCells }) {
		return $commentTableRows.map((idx, tr) => {
			const id = $commentCells[idx].id;
			const $tr = $(tr);
			const $td = $tr.find("> td:nth-child(3)");
			const thanked = $tr.find(".thank_area").hasClass("thanked");
			const memberLinkElement = getReplyAuthorLinkFromRow(tr);
			const memberName = memberLinkElement?.textContent?.trim() ?? "";
			const memberLink = memberLinkElement?.getAttribute("href") ?? "";
			const memberAvatar = $tr.find(".avatar").prop("src");
			const $content = $td.find("> .reply_content");
			const content = $content.text();
			const likes = parseLikesCount($td.find(".small.fade").text());
			const floor = $td.find("span.no").text();
			const memberNameMatches = Array.from(content.matchAll(/@([a-zA-Z0-9_]+)/g));
			const refMemberNames = memberNameMatches.length > 0 ? memberNameMatches.map(([, name]) => {
				return name;
			}) : void 0;
			const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g));
			const refFloors = floorNumberMatches.length > 0 ? floorNumberMatches.map(([, floor]) => {
				return floor;
			}) : void 0;
			let contentHtml = void 0;
			if (refMemberNames) {
				if (options.nestedReply.display === "indent" && !!options.replyContent.hideRefName) {
					if (refMemberNames.length === 1) {
						contentHtml = $content.html();
						contentHtml = contentHtml.replace(/(@<a href="\/member\/\w+">[\w\s]+<\/a>)\s+/g, "<span class=\"v2p-member-ref\">$1</span> ");
						$content.html(contentHtml);
					}
				}
			}
			return {
				id,
				memberName,
				memberLink,
				memberAvatar,
				content,
				contentHtml,
				likes,
				floor,
				index: idx,
				refMemberNames,
				refFloors,
				thanked
			};
		}).get();
	}
	/**
	* 处理嵌套回复。
	*/
	function handleNestedComment({ options, $commentCells, commentDataList }) {
		const display = options.nestedReply.display;
		if (display !== "off") {
			const cellList = $commentCells.get();
			const commentById = /* @__PURE__ */ new Map();
			const floorMemberToIndex = /* @__PURE__ */ new Map();
			const lastSeenByMember = /* @__PURE__ */ new Map();
			for (let i = 0; i < commentDataList.length; i++) {
				const data = commentDataList[i];
				commentById.set(data.id, data);
				if (data.memberName && data.floor) floorMemberToIndex.set(`${data.memberName}:${data.floor}`, i);
			}
			const commentContainer = cellList[0]?.parentElement;
			if (commentContainer) commentContainer.style.visibility = "hidden";
			for (let i = 0; i < cellList.length; i++) {
				const cellDom = cellList[i];
				if (!cellDom || !(cellDom instanceof HTMLElement)) continue;
				const currentComment = commentById.get(cellDom.id);
				if (currentComment) {
					const refMemberNames = currentComment.refMemberNames;
					const refFloors = currentComment.refFloors;
					let canNest = true;
					if (!refMemberNames || refMemberNames.length === 0) canNest = false;
					const moreThanOneRefMember = !!refMemberNames && refMemberNames.length > 1;
					if (canNest) {
						if (options.nestedReply.multipleInsideOne === "off" && moreThanOneRefMember) canNest = false;
					}
					if (canNest && refMemberNames) {
						const refNamesInOrder = moreThanOneRefMember ? refMemberNames.toReversed() : refMemberNames;
						const desiredFloor = (moreThanOneRefMember ? refFloors?.toReversed() : refFloors)?.at(0);
						let refCommentIdx;
						for (const refName of refNamesInOrder) {
							refCommentIdx = -1;
							if (desiredFloor) {
								const idxByFloor = floorMemberToIndex.get(`${refName}:${desiredFloor}`);
								if (typeof idxByFloor === "number" && idxByFloor < i) refCommentIdx = idxByFloor;
							}
							if (refCommentIdx < 0) {
								const idxByLastSeen = lastSeenByMember.get(refName);
								if (typeof idxByLastSeen === "number") refCommentIdx = idxByLastSeen;
							}
							if (refCommentIdx >= 0) {
								if (display === "indent") cellDom.classList.add("v2p-indent");
								cellList[refCommentIdx].append(cellDom);
								break;
							}
						}
					}
					lastSeenByMember.set(currentComment.memberName, i);
				}
			}
			if (commentContainer) commentContainer.style.visibility = "";
		}
	}
	var init_dom = __esmMin((() => {
		init_utils();
		init_reply_dom();
	}));

//#endregion
//#region src/components/image-preview.ts
/** 创建控制栏 */
	function createControlBar(controller) {
		const $controls = $("<div class=\"v2p-img-preview-controls\">").css({
			position: "fixed",
			bottom: "20px",
			left: "50%",
			transform: "translateX(-50%)",
			display: "flex",
			gap: "10px",
			zIndex: 1001,
			pointerEvents: "auto",
			padding: "6px 10px",
			background: "var(--v2p-color-bg-widget)",
			border: "1px solid var(--v2p-color-border)",
			borderRadius: "8px",
			boxShadow: "var(--v2p-widget-shadow)",
			backdropFilter: "blur(12px)"
		});
		const $zoomInBtn = createButton$1({
			children: "放大",
			size: "small",
			variant: "special"
		});
		const $zoomOutBtn = createButton$1({
			children: "缩小",
			size: "small",
			variant: "special"
		});
		const $resetBtn = createButton$1({
			children: "复位",
			size: "small"
		});
		$zoomInBtn.on("click", (e) => {
			e.stopPropagation();
			controller.zoomIn();
		});
		$zoomOutBtn.on("click", (e) => {
			e.stopPropagation();
			controller.zoomOut();
		});
		$resetBtn.on("click", (e) => {
			e.stopPropagation();
			controller.reset();
		});
		$controls.append($zoomInBtn, $zoomOutBtn, $resetBtn);
		return $controls;
	}
	/** 为预览图片绑定事件 */
	function bindPreviewEvents($img, controller) {
		$img.on("mousedown", (e) => {
			if (controller.startDrag(e.clientX, e.clientY)) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
		$(document).on("mousemove.imgPreview", (e) => {
			if (controller.isDragging()) {
				e.preventDefault();
				controller.updateDrag(e.clientX, e.clientY);
			}
		});
		$(document).on("mouseup.imgPreview", () => {
			controller.endDrag();
		});
		$img.on("dblclick", (e) => {
			e.stopPropagation();
			controller.reset();
		});
		$img.on("wheel", (e) => {
			e.preventDefault();
			e.stopPropagation();
			const deltaY = e.originalEvent instanceof WheelEvent ? e.originalEvent.deltaY : 0;
			controller.zoomByWheel(deltaY);
		});
		return () => {
			$(document).off("mousemove.imgPreview");
			$(document).off("mouseup.imgPreview");
		};
	}
	/** 创建预览图片元素 */
	function createPreviewImage($sourceImg) {
		return $sourceImg.clone().css({
			cursor: "grab",
			pointerEvents: "auto",
			transition: "transform 0.2s ease",
			display: "block",
			margin: "0 auto",
			transform: "scale(1) translate(0px, 0px)",
			maxWidth: "90vw",
			maxHeight: "90vh",
			objectFit: "contain",
			userSelect: "none",
			boxShadow: "var(--v2p-widget-shadow)"
		}).attr("draggable", "false");
	}
	/**
	* 创建图片预览组件
	*/
	function createImagePreview() {
		let cleanupFn = null;
		let modal = null;
		const getModal = () => {
			if (!modal) {
				modal = createModal({
					root: $("body"),
					onMount: ({ $main, $header, $content }) => {
						$main.css({
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							backgroundColor: "transparent",
							pointerEvents: "none",
							border: "none"
						});
						$header.remove();
						$content.css({
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							pointerEvents: "auto"
						});
					},
					onOpen: ({ $content }) => {
						$content.empty();
					},
					onClose: ({ $content }) => {
						$content.empty();
						cleanupFn?.();
						cleanupFn = null;
					}
				});
				modal.$content.on("click", (ev) => {
					if (ev.target === modal.$content.get(0)) modal.close();
				});
			}
			return modal;
		};
		const open = ($sourceImg) => {
			const m = getModal();
			const $previewImg = createPreviewImage($sourceImg);
			const controller = new ImageTransformController($previewImg);
			const $controls = createControlBar(controller);
			cleanupFn = bindPreviewEvents($previewImg, controller);
			m.open();
			m.$content.append($previewImg, $controls);
		};
		const close = () => {
			modal?.close();
		};
		let attached = false;
		const isModifiedClick = (ev) => ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey;
		const handleImageClick = (ev) => {
			if (isModifiedClick(ev)) return;
			if ($(ev.target).closest(".v2p-modal-mask").length > 0) return;
			const $img = $(ev.currentTarget);
			if (!($img.get(0) instanceof HTMLImageElement)) return;
			ev.preventDefault();
			ev.stopPropagation();
			if (isEmojiImage($img)) return;
			open($img);
		};
		const attach = () => {
			if (attached) return;
			attached = true;
			document.body.classList.add("v2p-img-preview-enabled");
			markEmojiImages($(".embedded_image"));
			$(document).on("click.v2pImgPreview", ".embedded_image", handleImageClick);
		};
		return {
			open,
			close,
			attach
		};
	}
	var DEFAULT_ZOOM_CONFIG, ImageTransformController;
	var init_image_preview = __esmMin((() => {
		init_emoji$1();
		init_button();
		init_modal();
		DEFAULT_ZOOM_CONFIG = {
			step: .5,
			min: .5,
			max: 3
		};
		ImageTransformController = class {
			$img;
			transform;
			drag;
			config;
			constructor($img, config = DEFAULT_ZOOM_CONFIG) {
				this.$img = $img;
				this.config = config;
				this.transform = {
					scale: 1,
					translateX: 0,
					translateY: 0
				};
				this.drag = {
					isDragging: false,
					startX: 0,
					startY: 0,
					startTranslateX: 0,
					startTranslateY: 0
				};
			}
			/** 应用变换到图片 */
			applyTransform(smooth = true) {
				const { scale, translateX, translateY } = this.transform;
				this.$img.css({
					transition: smooth ? "transform 0.2s ease" : "none",
					transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`
				});
			}
			/** 重置变换状态 */
			reset() {
				this.transform = {
					scale: 1,
					translateX: 0,
					translateY: 0
				};
				this.applyTransform();
			}
			/** 放大 */
			zoomIn() {
				if (this.transform.scale < this.config.max) {
					this.transform.scale += this.config.step;
					this.applyTransform();
				}
			}
			/** 缩小 */
			zoomOut() {
				if (this.transform.scale > this.config.min) {
					this.transform.scale -= this.config.step;
					this.resetTranslateIfNeeded();
					this.applyTransform();
				}
			}
			/** 通过滚轮缩放 */
			zoomByWheel(deltaY) {
				const direction = deltaY > 0 ? -1 : 1;
				const nextScale = this.transform.scale + direction * this.config.step;
				this.transform.scale = Math.max(this.config.min, Math.min(this.config.max, nextScale));
				this.resetTranslateIfNeeded();
				this.applyTransform();
			}
			/** 开始拖拽 */
			startDrag(clientX, clientY) {
				if (this.transform.scale <= 1) return false;
				this.drag = {
					isDragging: true,
					startX: clientX,
					startY: clientY,
					startTranslateX: this.transform.translateX,
					startTranslateY: this.transform.translateY
				};
				this.$img.css({ cursor: "grabbing" });
				return true;
			}
			/** 更新拖拽位置 */
			updateDrag(clientX, clientY) {
				if (!this.drag.isDragging) return;
				const deltaX = clientX - this.drag.startX;
				const deltaY = clientY - this.drag.startY;
				this.transform.translateX = this.drag.startTranslateX + deltaX / this.transform.scale;
				this.transform.translateY = this.drag.startTranslateY + deltaY / this.transform.scale;
				this.applyTransform(false);
			}
			/** 结束拖拽 */
			endDrag() {
				if (this.drag.isDragging) {
					this.drag.isDragging = false;
					this.$img.css({ cursor: "grab" });
				}
			}
			/** 是否正在拖拽 */
			isDragging() {
				return this.drag.isDragging;
			}
			/** 缩小到原始尺寸时重置位移 */
			resetTranslateIfNeeded() {
				if (this.transform.scale <= 1) {
					this.transform.translateX = 0;
					this.transform.translateY = 0;
				}
			}
		};
	}));

//#endregion
//#region src/components/tag-input-modal.ts
/**
	* 打开标签输入框，并在输入法组合输入期间忽略 Enter 确认。
	*/
	function openTagInputModal(props) {
		const { root, title, memberName, hint, placeholder, initialValue, confirmText = "确认", rows = 4 } = props;
		const safeMemberName = escapeHTML(memberName);
		const safeHint = escapeHTML(hint);
		return new Promise((resolve) => {
			let $input;
			let isComposing = false;
			let settled = false;
			const settle = (value) => {
				if (settled) return;
				settled = true;
				resolve(value);
			};
			const modal = createModal({
				root,
				title,
				footer: true,
				onMount: ({ $mask, $main, $content, $footer, $actions }) => {
					$mask.css({
						display: "flex",
						"justify-content": "center",
						"align-items": "center"
					});
					$main.css({ height: "auto" });
					const $inputWrapper = $("<div class=\"v2p-tag-input-wrapper\">").css({
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						gap: "15px"
					});
					const $hint = $(`<div class="v2p-tag-hint">对 <b>@${safeMemberName}</b> ${safeHint}</div>`).css({
						fontSize: "14px",
						color: "var(--v2p-color-font-secondary)"
					});
					$input = $("<textarea type=\"text\" class=\"sl\" name=\"tags\" />").attr({
						placeholder,
						rows: String(rows)
					}).val(initialValue ?? "").css({ width: "100%" });
					$inputWrapper.append($hint, $input);
					$content.append($inputWrapper);
					const $confirmBtn = createButton$1({
						children: confirmText,
						className: "special"
					});
					const $viewAllTagsBtn = createButton$1({ children: "查看全部标签" });
					const $closeBtn = $actions.find(".v2p-modal-close-btn").clone(true);
					const $leftActions = $("<div>").css({
						display: "flex",
						alignItems: "center"
					});
					const $rightActions = $("<div>").css({
						display: "flex",
						alignItems: "center",
						gap: "15px"
					});
					$footer.css({ justifyContent: "space-between" });
					$leftActions.append($viewAllTagsBtn);
					$rightActions.append($closeBtn, $confirmBtn);
					$footer.append($leftActions, $rightActions);
					$actions.remove();
					const handleConfirm = () => {
						settle($input.val() ?? "");
						modal.close();
					};
					const handleOpenAllTags = () => {
						getRuntime().ui.openOptions("tags");
						modal.close();
					};
					$confirmBtn.on("click", handleConfirm);
					$viewAllTagsBtn.on("click", () => {
						handleOpenAllTags();
					});
					$input.on("compositionstart", () => {
						isComposing = true;
					}).on("compositionend", () => {
						isComposing = false;
					}).on("keydown", (ev) => {
						if (ev.key !== "Enter") return;
						const nativeEvent = ev.originalEvent;
						const isImeSelecting = nativeEvent instanceof KeyboardEvent && (nativeEvent.isComposing || nativeEvent.keyCode === 229);
						if (isComposing || isImeSelecting) return;
						ev.preventDefault();
						handleConfirm();
					});
				},
				onOpen: () => {
					setTimeout(() => {
						$input?.trigger("focus");
						const inputElement = $input?.get(0);
						if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) {
							const length = (inputElement.value || "").length;
							inputElement.setSelectionRange(length, length);
						}
					}, 100);
				},
				onClose: () => {
					settle(null);
					modal.destroy();
				}
			});
			modal.open();
		});
	}
	var init_tag_input_modal = __esmMin((() => {
		init_runtime();
		init_utils();
		init_button();
		init_modal();
	}));

//#endregion
//#region src/contents/topic/content.ts
/**
	* 对主题内容中过高的图片进行折叠处理。
	*/
	function handleTopicImgHeight(autoFold) {
		if (autoFold) $topicContentBox.find(".topic_content .embedded_image").each((_, img) => {
			const $img = $(img);
			if (($img.height() ?? 0) > 600) {
				const collapsedCSS = {
					maxHeight: `${250}px`,
					overflow: "hidden",
					paddingBottom: "0",
					"--bg-reply": "var(--v2p-color-bg-content)"
				};
				const $contentBox = $("<div class=\"v2p-reply-content v2p-collapsed\">").css(collapsedCSS);
				const $expandBtn = createButton$1({
					children: "展开图片",
					className: "v2p-expand-btn"
				});
				const toggleContent = () => {
					const collapsed = $contentBox.hasClass("v2p-collapsed");
					$contentBox.toggleClass("v2p-collapsed").css(collapsed ? {
						maxHeight: "none",
						overflow: "auto",
						paddingBottom: "40px"
					} : collapsedCSS);
					$expandBtn.html(collapsed ? "收起图片" : "展开图片");
				};
				$expandBtn.on("click", (ev) => {
					ev.preventDefault();
					toggleContent();
				});
				$contentBox.insertBefore($img);
				$contentBox.append($img);
				$contentBox.append($expandBtn);
			}
		});
	}
	/**
	* 处理主题的正文内容。
	*/
	function handleContent() {
		const options = getStorageSync()["options"];
		if (options.topic.openMode !== "default") $topicContentBox.find(".topic_content a[href]").prop("target", "_blank").prop("rel", "noopener noreferrer");
		if (options.replyContent.showImgInPage) window.requestIdleCallback(() => {
			handleTopicImg();
		});
		{
			const $topicContents = $topicContentBox.find(".subtle > .topic_content");
			const textLength = $topicContents.text().length;
			if (textLength >= 200) $topicContents.each((_, topicContent) => {
				if (textLength >= 400) topicContent.style.fontSize = "14px";
				topicContent.style.fontSize = "14.5px";
			});
			const $topicTime = $topicHeader.find("small.gray > span[title]");
			$topicTime.addClass("v2p-topic-time");
			const topicRelativeTime = $topicTime.text();
			const daysAgo = extractDays(topicRelativeTime);
			if (typeof daysAgo === "number" && daysAgo > 60) {
				const topicAbsoluteTime = $topicTime.prop("title");
				if (typeof topicAbsoluteTime === "string") {
					const parseResult = parseDateTime(topicAbsoluteTime);
					if (parseResult.success) {
						if (parseResult.formatted) $topicTime.text(`${parseResult.formatted}（${topicRelativeTime}）`);
					}
				}
			}
		}
		{
			const $topicBtns = $(".topic_buttons");
			const $topicBtn = $topicBtns.find(".tb").addClass("v2p-tb v2p-hover-btn");
			$topicBtn.eq(0).append("<span class=\"v2p-tb-icon\"><i data-v2p-icon=\"star\"></i></span>");
			$topicBtn.eq(1).append("<span class=\"v2p-tb-icon\"><i data-v2p-icon=\"share-2\"></i></span>");
			$topicBtn.eq(2).append("<span class=\"v2p-tb-icon\"><i data-v2p-icon=\"eye-off\"></i></span>");
			$topicBtn.eq(3).append("<span class=\"v2p-tb-icon\"><i data-v2p-icon=\"heart\"></i></span>");
			if (pathTopicId) $topicBtns.append(` &nbsp;<a href="${"https://v2p.leoku.dev/share"}/${pathTopicId}" target="_blank" class="tb v2p-tb v2p-hover-btn">分享<span class="v2p-tb-icon"><i data-v2p-icon="arrow-up-right-square"></i></span></a>`);
			loadIcons($topicBtns[0]);
		}
		window.requestIdleCallback(() => {
			handleTopicImgHeight(options.replyContent.autoFold);
		});
	}
	/**
	* 处理回复内容：
	*  - 过长内容会被折叠。
	*  - 对同一个元素重复执行此方法时，效果不会叠加。
	*/
	function processReplyContent($cellDom) {
		if ($cellDom.find(".v2p-reply-content").length === 0) {
			const $replyContent = $cellDom.find(".reply_content");
			const replyContentEl = $replyContent.get(0);
			if (replyContentEl) {
				const textLength = ($replyContent.text() ?? "").length;
				const hasHeavyNodes = $replyContent.find("img, pre, blockquote, ul, ol, table").length > 0;
				if (textLength >= 300 || hasHeavyNodes) {
					if (($replyContent.height() ?? 0) + 250 >= 550) {
						const contentBox = document.createElement("div");
						contentBox.className = "v2p-reply-content v2p-collapsed";
						replyContentEl.parentNode?.insertBefore(contentBox, replyContentEl);
						contentBox.append(replyContentEl);
						const $expandBtn = createButton$1({
							children: "展开回复",
							className: "v2p-expand-btn"
						});
						const handleToggle = () => {
							const collapsed = contentBox.classList.contains("v2p-collapsed");
							contentBox.classList.toggle("v2p-collapsed");
							$expandBtn.html(collapsed ? "收起回复" : "展开回复");
						};
						$expandBtn.on("click", (ev) => {
							ev.preventDefault();
							handleToggle();
						});
						$(contentBox).append($expandBtn);
					}
				}
			}
		}
	}
	/**
	* 根据用户的昵称设置用户标签，会把标签插入到 cells 中。
	*/
	function updateMemberTag(params) {
		const { memberName, memberAvatar, tags, options, ...callbacks } = params;
		const $v2pTags = $(`.v2p-tags-${memberName}`);
		const tagsText = tags ? getTagsText(tags) : void 0;
		if ($v2pTags.length > 0) {
			if (tagsText) $v2pTags.html(`<b>#</b>&nbsp;${escapeHTML(tagsText)}`);
			else {
				$v2pTags.remove();
				callbacks.onRemoveExistingTagBlock?.();
			}
		} else if (tagsText) {
			const $tags = $(`<div class="v2p-reply-tags v2p-tags-${escapeHTML(memberName)}" title="${escapeHTML(tagsText)}"><b>#</b>&nbsp;${escapeHTML(tagsText)}</div>`);
			$tags.on("click", () => {
				openTagsSetter({
					memberName,
					memberAvatar,
					...callbacks
				});
			});
			if (callbacks.onInsertNewTagBlock) callbacks.onInsertNewTagBlock({ $tags });
			else {
				const $memberCells = $commentCells.filter((_, cellDom) => {
					return getReplyAuthorLinkFromCell(cellDom)?.getAttribute("href") === `/member/${memberName}`;
				});
				if (memberName === topicOwnerName) $topicHeader.append($tags.clone(true));
				if (options.userTag.display === "inline") $tags.addClass("v2p-reply-tags-inline").insertBefore($memberCells.find("> table .badges"));
				else $tags.insertBefore($memberCells.find("> table .reply_content"));
			}
		}
	}
	/**
	* 打开模态框，让用户编辑用户标签。
	*/
	function openTagsSetter(params) {
		const { memberName, memberAvatar, ...callbacks } = params;
		(async () => {
			const storage = await getStorage(false);
			const latestTagsData = storage["member-tag"];
			const options = storage["options"];
			const memberTagData = latestTagsData?.[memberName];
			const tagsValue = memberTagData ? Reflect.has(latestTagsData, memberName) ? memberTagData.tags ? getTagsText(memberTagData.tags) : void 0 : void 0 : void 0;
			const newTagsValue = await openTagInputModal({
				root: $body,
				title: "设置用户标签",
				memberName,
				hint: "设置标签（用于个性化标记、筛选和快速检索），多个标签以逗号（，）分隔。",
				placeholder: "请输入标签，多个标签以逗号分隔",
				initialValue: tagsValue ?? "",
				confirmText: "确认设置",
				rows: 4
			});
			if (newTagsValue !== null) {
				const tags = newTagsValue.trim().length > 0 ? newTagsValue.split(/,|，/g).map((it) => it.trim()).filter((it) => it.length > 0) : void 0;
				await setMemberTags({
					memberName,
					memberAvatar: memberTagData?.avatar || memberAvatar,
					tags
				});
				updateMemberTag({
					memberName,
					memberAvatar,
					tags,
					options,
					...callbacks
				});
			}
		})();
	}
	/**
	* 启用主题页面的图片预览：点击图片在页内预览，不再跳转到新页签。
	* 幂等，可重复调用。
	*/
	function handleTopicImg() {
		topicImgPreview ??= createImagePreview();
		topicImgPreview.attach();
	}
	/**
	* 处理主题内容中的主题链接，点击链接时会弹出预览。
	*/
	function handleLinkPreview() {
		const $topicLinks = $(".topic_content a[href*=\"v2ex.com/t/\"], .reply_content a[href*=\"v2ex.com/t/\"], .topic_content a[href*=\"v2ex.co/t/\"], .reply_content a[href*=\"v2ex.co/t/\"], .topic_content a[href^=\"/t/\"], .reply_content a[href^=\"/t/\"]");
		const { handlePreview } = createTopicPreview();
		const $previewBtn = $("<span class=\"v2p-link-preview-btn\">预览</span>");
		$topicLinks.each((_, link) => {
			const $link = $(link);
			const $cloned = $previewBtn.clone(true);
			$cloned.on("click", (ev) => {
				ev.preventDefault();
				const linkHref = $link.attr("href");
				const topicId = (linkHref?.match(/\/t\/(\d+)/))?.at(1);
				handlePreview({
					topicId,
					linkHref
				});
			});
			const $previewBtnInLink = $link.find(".v2p-link-preview-btn");
			if ($previewBtnInLink.length > 0) $previewBtnInLink.replaceWith($cloned);
			else $link.append($cloned);
		});
	}
	var topicImgPreview;
	var init_content = __esmMin((() => {
		init_button();
		init_image_preview();
		init_tag_input_modal();
		init_constants();
		init_utils();
		init_globals();
		init_helpers();
		init_reply_dom();
		init_preview();
		topicImgPreview = null;
	}));

//#endregion
//#region src/contents/topic/preview.ts
	function createTopicPreview() {
		if (singletonInstance) return singletonInstance;
		const storage = getStorageSync();
		const options = storage["options"];
		let PAT = storage["api"]?.pat;
		getRuntime().storage.subscribe((area, changes) => {
			if (area === "local" && changes["api"]) PAT = (changes["api"]?.newValue)?.pat;
		});
		let abortController = null;
		const $detailBtn = createButton$1({
			children: "进入主题",
			variant: "special",
			tag: "a"
		});
		if (options.topic?.openMode !== "default") $detailBtn.prop("target", "_blank");
		let modal = null;
		const getModal = () => {
			if (!modal) {
				modal = createModal({
					root: $body,
					onMount: ({ $actions }) => {
						$actions.prepend($detailBtn);
					},
					onClose: ({ $title, $content }) => {
						$title.empty();
						$content.empty();
						abortController?.abort();
					}
				});
				modal.$content.on("click", ".v2p-no-pat-settings", () => {
					getRuntime().ui.openOptions("token");
				});
			}
			return modal;
		};
		const handlePreview = (params) => {
			const { topicId, topicTitle = "", linkHref } = params;
			const safeTitle = escapeHTML(topicTitle);
			const safeHref = escapeHTML(linkHref || "");
			if (topicId) {
				const modal = getModal();
				modal.open();
				$detailBtn.prop("href", linkHref);
				const $titleLink = $(`
        <a class="v2p-topic-preview-title-link" title="${safeTitle}" href="${safeHref}">
          ${safeTitle}
        </a>
      `);
				if (options.topic?.openMode !== "default") $titleLink.prop("target", "_blank");
				modal.$title.empty().append($titleLink);
				if (linkHref) {
					const previewFrame = $("<iframe class=\"v2p-topic-preview-frame\">");
					try {
						const urlPath = linkHref.startsWith("http") ? new URL(linkHref).pathname + new URL(linkHref).search : linkHref;
						const url = new URL(urlPath, window.location.origin);
						url.searchParams.append(PREVIEW_QUERY, "1");
						previewFrame.prop("src", url.toString());
					} catch (error) {
						console.error("Invalid URL:", error);
						previewFrame.prop("src", "about:blank");
					}
					const $wrapper = $("<div class=\"v2p-topic-preview-wrapper\">");
					$wrapper.append(previewFrame);
					modal.$content.append($wrapper);
				} else if (PAT) {
					const load = async () => {
						let cacheData = topicDataCache.get(topicId);
						if (!cacheData || Date.now() - cacheData.cacheTime > 6e5) {
							abortController = new AbortController();
							modal.$content.empty().append(`
                <div class="v2p-tpr-loading">
                  <div class="v2p-tpr-info">
                    <div class="v2p-tpr v2p-tpr-info-avatar"></div>
                    <div class="v2p-tpr v2p-tpr-info-text"></div>
                  </div>
  
                  <div class="v2p-tpr-content">
                    <div class="v2p-tpr v2p-tpr-content-p"></div>
                    <div class="v2p-tpr v2p-tpr-content-p"></div>
                    <div class="v2p-tpr v2p-tpr-content-p" style="width: 70%;"></div>
                  </div>
  
                  <div class="v2p-tpr-cmt">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
  
                  <div class="v2p-tpr-cmt" style="opacity: 0.8;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
  
                  <div class="v2p-tpr-cmt" style="opacity: 0.6;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
                  <div class="v2p-tpr-cmt" style="opacity: 0.4;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
                </div>
              `);
							const promises = [fetchTopic(topicId, { signal: abortController.signal }), crawlTopicPage(`/t/${topicId}`)];
							try {
								const [{ result: topic }, topicPageText] = await Promise.all(promises);
								const data = {
									topic,
									cacheTime: Date.now(),
									topicPageText
								};
								topicDataCache.set(topicId, data);
								cacheData = data;
							} catch (err) {
								const $errorTip = $("<div style=\"padding: 20px; text-align: center;\">");
								if (err instanceof Error) {
									if (tokenErrorMessages.includes(err.message)) $errorTip.html(invalidTemplate("您的 Token 已失效，请<a class=\"v2p-topic-preview-retry\" href=\"https://www.v2ex.com/settings/tokens\" target=\"_blank\">重新设置</a>。"));
								} else {
									$errorTip.html("加载主题失败，<a class=\"v2p-topic-preview-retry\">点击重试</a>。");
									$errorTip.find(".v2p-topic-preview-retry").on("click", () => {
										load();
									});
								}
								modal.$content.empty().append($errorTip);
							}
						}
						if (cacheData) {
							const { topic, topicPageText } = cacheData;
							if (!topicTitle) {
								$titleLink.attr("title", topic.title);
								$titleLink.text(topic.title);
							}
							const $page = $(topicPageText);
							const $topicPreview = $("<div id=\"Main\" class=\"v2p-topic-preview\">");
							const $infoBar = $(`
                <div class="v2p-tp-info-bar">
                  <div class="v2p-tp-info">
                    <a class="v2p-tp-member" href="${escapeHTML(topic.member.url)}">
                      <img class="v2p-tp-avatar" src="${escapeHTML(topic.member.avatar)}">
                      <span>${escapeHTML(topic.member.username)}</span>
                    </a>
  
                    <span>
                      ${formatTimestamp(topic.created, { format: "YMDHM" })}
                    </span>
  
                    <span>${topic.replies} 条回复</span>
                  </div>
                </div>
              `);
							const iconBook = createElement(BookOpenCheck);
							iconBook.setAttribute("width", "100%");
							iconBook.setAttribute("height", "100%");
							const $readingBtn = $("<div class=\"v2p-tp-read\"><span class=\"v2p-tp-read-icon\"></span>稍后阅读</div>");
							$readingBtn.find(".v2p-tp-read-icon").append(iconBook);
							$readingBtn.on("click", () => {
								addToReadingList({
									url: topic.url,
									title: topic.title,
									content: topic.content
								});
							}).appendTo($infoBar);
							$topicPreview.append($infoBar);
							const $topicMain = $page.find("#Main");
							const $topicContent = $topicMain.find("> .box > .cell > .topic_content");
							const $topicSubtle = $topicMain.find("> .box >.subtle");
							if ($topicContent.length <= 0) $topicPreview.append(`
                  <div class="v2p-empty-content">
                    <div class="v2p-text-emoji">¯\\_(ツ)_/¯</div>
                    <p>该主题没有正文内容</p>
                  </div>
                `);
							else {
								$topicPreview.append($topicContent);
								$topicContent.wrap("<div class=\"cell\">");
							}
							$topicPreview.append($topicSubtle);
							const $topicReplyBox = $topicMain.find(".box:has(.cell[id^=\"r_\"])");
							if ($topicReplyBox.length > 0) {
								$topicReplyBox.css({
									"margin-top": "20px",
									padding: "0"
								});
								const $commentCells = $topicReplyBox.find(".cell[id^=\"r_\"]");
								const $commentTableRows = $commentCells.find("> table > tbody > tr");
								const commentDataList = getCommentDataList({
									options,
									$commentTableRows,
									$commentCells
								});
								$commentCells.each((i, cellDom) => {
									const currentComment = commentDataList.at(i);
									if (currentComment?.id !== cellDom.id) return;
									const $cellDom = $(cellDom);
									const { memberName, thanked } = currentComment;
									if (memberName === loginName && !options.hideAccount) $cellDom.find(".badges").append(`<div class="badge ${memberName === topic.member.username ? "mod" : "you"}">Me</div>`);
									const $likesBox = $cellDom.find(".small.fade").addClass("v2p-likes-box");
									$likesBox.find("img[alt=\"❤️\"]").replaceWith("<span class=\"v2p-icon-heart\"><i data-v2p-icon=\"heart\"></i></span>");
									if (thanked) $likesBox.addClass("v2p-thanked");
								});
								setTimeout(() => {
									handleNestedComment({
										options,
										$commentCells,
										commentDataList
									});
								}, 0);
								$commentCells.each((_, cellDom) => {
									removeReplyActionsFromCell(cellDom);
								});
								$topicPreview.append($topicReplyBox);
								if (topic.replies > 100) {
									$topicReplyBox.find(".cell.ps_container").remove();
									$topicPreview.append(`
                    <div class="v2p-topic-reply-tip">
                      <a
                        href="${safeHref}"
                        style="color: currentColor;"
                      >
                          在主题内查看完整评论...
                      </a>
                    </div>
                  `);
								}
								replaceCommentEmojiWithHD($commentCells);
							}
							if (options.topic?.openMode !== "default") $topicPreview.find("a").prop("target", "_blank");
							modal.$content.empty().append($topicPreview);
							handleLinkPreview();
							modal.$content.attr("tabindex", "0");
							modal.$content.trigger("focus");
							loadIcons(modal.$content[0]);
						}
					};
					load();
				} else modal.$content.empty().append(invalidTemplate("你需要先设置 PAT 才能获取预览内容。"));
			}
		};
		singletonInstance = { handlePreview };
		return singletonInstance;
	}
	var tokenErrorMessages, invalidTemplate, topicDataCache, singletonInstance;
	var init_preview = __esmMin((() => {
		init_lucide();
		init_button();
		init_modal();
		init_icons();
		init_runtime();
		init_services();
		init_utils();
		init_dom();
		init_globals();
		init_helpers();
		init_preview_frame();
		init_reply_dom();
		init_content();
		tokenErrorMessages = ["Invalid token", "Token expired"];
		invalidTemplate = (tip) => {
			if (getRuntime().isBrowserExtension) return `
<div class="v2p-no-pat">
  <div class="v2p-no-pat-title">${tip}</div>
  <div class="v2p-no-pat-desc">
    请前往<span class="v2p-no-pat-block"><span class="v2p-icon-logo">${iconLogo}</span> <span style="margin: 0 5px;">></span> 设置</span> 进行设置。
  </div>

  <div class="v2p-no-pat-steps">
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">1. 在扩展程序列表中找到并点击「V2EX Polish」。</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/UfNkuTF.png">
    </div>
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">2. 在弹出的小窗口中找到「⚙️ 按钮」，输入 PAT。</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/O6hP86A.png">
    </div>
  </div>
</div>
`;
			return `
<div class="v2p-no-pat">
  <div class="v2p-no-pat-title">${tip}</div>
  <div class="v2p-no-pat-desc">
    请打开设置，在「API Token」中填写 PAT。
  </div>

  <div class="v2p-no-pat-steps">
    <div class="v2p-no-pat-step">
      <a class="super normal button v2p-no-pat-settings" href="javascript:void(0)">打开设置</a>
      <div style="margin-top:12px;font-size:13px;">也可以在脚本管理器（如 Tampermonkey）菜单中选择「V2EX Polish 设置」。</div>
    </div>
  </div>
</div>
`;
		};
		topicDataCache = /* @__PURE__ */ new Map();
		singletonInstance = null;
	}));

//#endregion
//#region src/contents/home/hot-topics.ts
	function isRangeAlias(value) {
		return value in rangeByAlias;
	}
	/**
	* 历史热议主题。
	*/
	function handleHotTopics() {
		const $hotHeader = $("#TopicsHot").find("> .cell:first-of-type").addClass("v2p-topics-hot-header");
		$hotHeader.find(".fade").text("热议主题");
		$hotHeader.nextAll(".cell").wrapAll("<div class=\"v2p-topics-hot\">");
		const $listWrapper = $(".v2p-topics-hot");
		let $todayCells = $listWrapper.find("> .cell");
		const options = getStorageSync()["options"];
		let showing = false;
		let $filterCounter = null;
		const createFilterCounter = (hiddenCount) => {
			const $items = $listWrapper.find("> .cell.v2p-hot-filter-hidden");
			const $counter = $(`
      <div class="v2p-hot-filter-counter">
        已隐藏 ${hiddenCount} 条主题
        &nbsp;·&nbsp;
        <a class="v2p-filter-show">显示</a>
      </div>
    `);
			$counter.find(".v2p-filter-show").on("click", () => {
				if (showing) {
					$items.addClass("v2p-hot-filter-hidden").removeClass("v2p-hot-filter-revealed");
					$counter.find(".v2p-filter-show").text("显示");
					showing = false;
				} else {
					$items.removeClass("v2p-hot-filter-hidden").addClass("v2p-hot-filter-revealed");
					$counter.find(".v2p-filter-show").text("隐藏");
					showing = true;
				}
			});
			return $counter;
		};
		if (options?.topicFilter?.enabled) {
			let hiddenCount = 0;
			$listWrapper.find("> .cell").each((_, cell) => {
				const title = $(cell).find(".item_hot_topic_title > a").text();
				if (shouldHideTopic(options.topicFilter, "hot", {
					title,
					nodeName: ""
				})) {
					$(cell).addClass("v2p-hot-filter-hidden");
					hiddenCount++;
				}
			});
			if (hiddenCount > 0) {
				$filterCounter = createFilterCounter(hiddenCount);
				$listWrapper.before($filterCounter);
			}
		}
		const $cell = $todayCells.eq($todayCells.length > 1 ? 1 : 0).clone();
		$cell.find(".v2p-topic-preview-btn").remove();
		$cell.removeClass("v2p-hot-filter-hidden");
		if ($cell.length === 0) return;
		const isPreviewMode = options?.topic?.openMode === "preview";
		const topicPreview = createTopicPreview();
		const $previewBtn = $("<button class=\"v2p-topic-preview-btn\">预览</button>");
		const $text = $("<span class=\"v2p-topics-hot-picker-text\">今日</span>");
		const $trigger = $("<div class=\"v2p-topics-hot-picker\"><span class=\"v2p-topics-hot-icon\"><i data-v2p-icon=\"chevron-down\"></i></span></div>").prepend($text).appendTo($hotHeader);
		const $dropdownContent = $(`
    <div class="v2p-select-dropdown">
      <div class="v2p-select-item v2p-select-item-active" data-alias="今日">今日</div>
      <div class="v2p-select-item" data-alias="近三日">近三日</div>
      <div class="v2p-select-item" data-alias="3~7 天前">3~7 天前</div>
      <div class="v2p-select-item" data-alias="7~30 天前">7~30 天前</div>
    </div>
  `);
		const popupControl = createPopup({
			root: $wrapper,
			trigger: $trigger,
			content: $dropdownContent,
			offsetOptions: {
				mainAxis: 5,
				crossAxis: -5
			}
		});
		let abortController = null;
		/** 缓存 TTL（毫秒），与 cron 最小触发间隔（15 分钟）对齐，避免在数据更新前重复请求。 */
		const CACHE_TTL = 9e5;
		const cache = /* @__PURE__ */ new Map();
		const getCacheKey = (alias, expand) => `${alias}-${expand}`;
		const getCachedData = (key) => {
			const entry = cache.get(key);
			if (entry && Date.now() - entry.timestamp < CACHE_TTL) return {
				data: entry.data,
				hasMore: entry.hasMore
			};
			cache.delete(key);
			return null;
		};
		/** 当前远程档位及其展开状态。展开状态不跨档位记忆。 */
		let currentAlias = null;
		let expanded = false;
		let hasMore = false;
		const renderExpandToggle = () => {
			$(".v2p-hot-expand-toggle").remove();
			if (!currentAlias) return;
			if (!expanded && !hasMore) return;
			const $toggle = $("<div class=\"v2p-hot-expand-toggle\">").text(expanded ? "收起" : "展开更多");
			$toggle.on("click", () => {
				expanded = !expanded;
				fetchAndRender(currentAlias, expanded ? 1 : 0);
			});
			$listWrapper.after($toggle);
		};
		const renderNewTopicList = (result, nextHasMore) => {
			hasMore = nextHasMore;
			$filterCounter?.remove();
			$filterCounter = null;
			showing = false;
			$listWrapper.empty();
			if (result.length === 0) {
				$listWrapper.append("<div class=\"v2p-topics-hot-empty\">暂无热议主题</div>");
				return;
			}
			let hiddenCount = 0;
			result.forEach((it) => {
				const $clonedCell = $cell.clone();
				if (options?.topicFilter?.enabled && shouldHideTopic(options.topicFilter, "hot", {
					title: it.title,
					nodeName: ""
				})) {
					$clonedCell.addClass("v2p-hot-filter-hidden");
					hiddenCount++;
				}
				const $user = $clonedCell.find("a[href^=\"/member\"]");
				$user.attr("href", `/member/${it.member.username}`);
				$user.find("> img").attr("src", it.member.avatar_mini);
				const linkHref = `/t/${it.id}`;
				const topicId = String(it.id);
				const $titleLink = $clonedCell.find(".item_hot_topic_title > a");
				$titleLink.text(it.title).attr("href", linkHref);
				const $titleContainer = $clonedCell.find(".item_hot_topic_title");
				$("<span class=\"v2p-hot-replies\">").text(String(it.replies)).appendTo($titleContainer);
				if (topicPreview) {
					if (isPreviewMode) $titleLink.on("click", (ev) => {
						ev.preventDefault();
						topicPreview.handlePreview({
							topicId,
							topicTitle: it.title,
							linkHref
						});
					});
					$previewBtn.clone().on("click", () => {
						topicPreview.handlePreview({
							topicId,
							topicTitle: it.title,
							linkHref
						});
					}).appendTo($titleContainer);
				}
				$listWrapper.append($clonedCell);
			});
			if (hiddenCount > 0) {
				$filterCounter = createFilterCounter(hiddenCount);
				$listWrapper.before($filterCounter);
			}
			renderExpandToggle();
		};
		const renderError = () => {
			$listWrapper.empty().append("<div class=\"v2p-topics-hot-empty\">加载失败，请稍后再试</div>");
			$(".v2p-hot-expand-toggle").remove();
		};
		const showLoading = () => {
			$listWrapper.empty().append(`
    <div class="v2p-topics-hot-loading">
      <div class="v2p-icon-loading">${iconLoading}</div>
    </div>
    `);
			$(".v2p-hot-expand-toggle").remove();
		};
		/** 恢复「今日」列表。 */
		const restoreToday = () => {
			currentAlias = null;
			expanded = false;
			hasMore = false;
			$filterCounter?.remove();
			$filterCounter = null;
			$(".v2p-hot-expand-toggle").remove();
			$listWrapper.empty().append($todayCells);
			const $hiddenCells = $todayCells.filter(".v2p-hot-filter-hidden");
			if ($hiddenCells.length > 0) {
				$filterCounter = createFilterCounter($hiddenCells.length);
				$listWrapper.before($filterCounter);
				if (showing) {
					$hiddenCells.removeClass("v2p-hot-filter-hidden").addClass("v2p-hot-filter-revealed");
					$filterCounter.find(".v2p-filter-show").text("隐藏");
				}
			}
		};
		const fetchAndRender = (alias, expand) => {
			const cacheKey = getCacheKey(alias, expand);
			const cachedData = getCachedData(cacheKey);
			if (cachedData) {
				renderNewTopicList(cachedData.data, cachedData.hasMore);
				return;
			}
			showLoading();
			abortController = new AbortController();
			getHotTopics({
				range: rangeByAlias[alias],
				expand,
				signal: abortController.signal
			}).then(({ result, hasMore: nextHasMore }) => {
				const resolvedHasMore = nextHasMore ?? false;
				cache.set(cacheKey, {
					data: result,
					hasMore: resolvedHasMore,
					timestamp: Date.now()
				});
				renderNewTopicList(result, resolvedHasMore);
			}).catch((err) => {
				if (err instanceof Error && err.name === "AbortError") return;
				console.error("获取热议主题失败:", err);
				renderError();
			});
		};
		$dropdownContent.find(".v2p-select-item").on("click", (ev) => {
			popupControl.close();
			const $target = $(ev.currentTarget);
			if ($target.hasClass("v2p-select-item-active")) return;
			abortController?.abort();
			const alias = $target.data("alias");
			if (typeof alias !== "string") return;
			$target.addClass("v2p-select-item-active").siblings().removeClass("v2p-select-item-active");
			$text.text(alias);
			if (alias === "今日") {
				restoreToday();
				return;
			}
			if (isRangeAlias(alias)) {
				$todayCells = $todayCells.detach();
				currentAlias = alias;
				expanded = false;
				fetchAndRender(alias, 0);
				return;
			}
			restoreToday();
		});
	}
	var rangeByAlias;
	var init_hot_topics = __esmMin((() => {
		init_floating_popup();
		init_icons();
		init_services();
		init_utils();
		init_globals();
		init_preview();
		init_matcher();
		rangeByAlias = {
			近三日: "3d",
			"3~7 天前": "7d",
			"7~30 天前": "30d"
		};
	}));

//#endregion
//#region src/contents/home/topic-list.ts
	function handleTopicList$1() {
		const isPreviewMode = getStorageSync()["options"].topic?.openMode === "preview";
		const { handlePreview } = createTopicPreview();
		const $previewBtn = $("<button class=\"v2p-topic-preview-btn\">预览</button>");
		const $ignoreBtn = $("<span class=\"v2p-topic-ignore-btn\">屏蔽</span>");
		const $topicActions = $("<span class=\"v2p-topic-actions\" />");
		$topicList.each((_, topicItem) => {
			const $topicItem = $(topicItem);
			const $itemTitle = $topicItem.find(".item_title");
			const $topicInfo = $topicItem.find(".topic_info");
			const topicTitle = $itemTitle.find(".topic-link").text();
			const linkHref = $topicItem.find(".topic-link").attr("href");
			const topicId = (linkHref?.match(/\/t\/(\d+)/))?.at(1);
			const $lastChild = $topicInfo.find("> span:first-of-type");
			const $clonedTopicActions = $topicActions.clone();
			$clonedTopicActions.insertAfter($lastChild);
			if (isPreviewMode) $itemTitle.find(".topic-link").on("click", (ev) => {
				ev.preventDefault();
				handlePreview({
					topicId,
					topicTitle,
					linkHref
				});
			});
			$ignoreBtn.clone().on("click", () => {
				if (confirm(`确定屏蔽主题 ⌈${topicTitle}⌋？`)) {
					if (typeof topicId === "string") (async () => {
						const toast = createToast({
							message: `正在屏蔽主题 ⌈${topicTitle}⌋`,
							duration: 0
						});
						try {
							await ignoreTopic(topicId);
							createToast({ message: "✅ 已屏蔽" });
							$topicItem.remove();
						} catch (err) {
							createToast({ message: err instanceof Error ? `❌ ${err.message}` : "❌ 屏蔽失败，请稍后重试" });
						} finally {
							toast.clear();
						}
					})();
				}
			}).appendTo($clonedTopicActions);
			$previewBtn.clone().on("click", () => {
				handlePreview({
					topicId,
					topicTitle,
					linkHref
				});
			}).appendTo($clonedTopicActions);
		});
		$("#TopicsHot,#my-recent-topics").find(".cell .item_hot_topic_title").each((_, topicTitle) => {
			const $topicItem = $(topicTitle);
			const $link = $topicItem.find("> a");
			const linkHref = $link.attr("href");
			const topicId = (linkHref?.match(/\/t\/(\d+)/))?.at(1);
			const hotTopicTitle = $link.text();
			if (isPreviewMode) $link.on("click", (ev) => {
				ev.preventDefault();
				handlePreview({
					topicId,
					topicTitle: hotTopicTitle,
					linkHref
				});
			});
			$previewBtn.clone().on("click", () => {
				handlePreview({
					topicId,
					topicTitle: hotTopicTitle,
					linkHref
				});
			}).appendTo($topicItem);
		});
	}
	var init_topic_list$1 = __esmMin((() => {
		init_toast();
		init_services();
		init_utils();
		init_globals();
		init_preview();
	}));

//#endregion
//#region src/contents/home/index.ts
	var home_exports = /* @__PURE__ */ __exportAll({});
	var currentMemberName$2;
	var init_home = __esmMin((() => {
		init_check_in_utils();
		init_runtime();
		init_utils();
		init_globals();
		init_helpers();
		init_member_name();
		init_apply_topic_list_filter();
		init_hot_topics();
		init_topic_list$1();
		currentMemberName$2 = getCurrentMemberName();
		(async () => {
			const storage = await getStorage();
			const options = storage["options"];
			$("#Main .tab").addClass("v2p-hover-btn");
			if (options.topic?.openMode !== "default") $("#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href=\"/write\"]").prop("target", "_blank");
			handleTopicList$1();
			applyTopicListFilter("home");
			function renderCheckInInfoRow(dailyInfo) {
				$infoCard.find(".v2p-check-in-status").remove();
				const state = resolveCheckInDisplayState({
					now: Date.now(),
					dailyInfo,
					autoCheckInEnabled: options.autoCheckIn.enabled,
					currentMemberName: currentMemberName$2
				});
				function appendInfoRow(text, muted = false) {
					const className = muted ? "cell v2p-info-row v2p-info-row-muted v2p-check-in-status" : "cell v2p-info-row v2p-check-in-status";
					$infoCard.append(`
        <a class="${className}" href="/mission/daily">
          ${text}
        </a>
      `);
				}
				if (state.type === "checked-in") appendInfoRow("今日已自动签到");
				else if (state.type === "failed" && state.code === "challenge") appendInfoRow("V2EX 要求人机验证，点击处理", true);
				else if (shouldPromptCheckInFailure(state, dailyInfo?.failureCount)) appendInfoRow("今日签到未完成，查看详情", true);
			}
			renderCheckInInfoRow(storage["daily"]);
			getRuntime().storage.subscribe((areaName, changes) => {
				if (areaName === "local" && changes["daily"]) renderCheckInInfoRow(changes["daily"].newValue);
			});
			handleHotTopics();
			loadIcons();
		})();
	}));

//#endregion
//#region src/contents/topic/blocked.ts
/** 从回复 cell 中读取回复者昵称。 */
	function getReplyMemberName(cellDom) {
		return getReplyAuthorLinkFromCell(cellDom)?.textContent?.trim() ?? "";
	}
	/**
	* 更新回复列表顶部的已屏蔽提示。
	*/
	function renderNotice($box) {
		const $blockedCells = $box.find(".cell[id^=\"r_\"].v2p-blocked-reply");
		let $notice = $box.find("> .v2p-blocked-notice");
		if ($blockedCells.length === 0) {
			$notice.remove();
			return;
		}
		if ($notice.length === 0) {
			$notice = $(`
      <div class="v2p-blocked-notice">
        <span class="v2p-blocked-notice-text"></span>
        <a class="v2p-blocked-toggle" role="button" tabindex="0">显示</a>
      </div>
    `);
			$notice.find(".v2p-blocked-toggle").on("click", (ev) => {
				const $toggle = $(ev.currentTarget);
				const reveal = $toggle.text() === "显示";
				$box.find(".v2p-blocked-reply").toggleClass("v2p-blocked-revealed", reveal);
				$toggle.text(reveal ? "隐藏" : "显示");
			}).on("keydown", (ev) => {
				if (ev.key === "Enter" || ev.key === " ") {
					ev.preventDefault();
					$(ev.currentTarget).trigger("click");
				}
			});
		}
		const firstBlockedCell = $blockedCells.get(0);
		let $noticeAnchor = firstBlockedCell ? $(firstBlockedCell) : $();
		const $outerCells = $noticeAnchor.parents(".cell[id^=\"r_\"]");
		if ($outerCells.length > 0) $noticeAnchor = $outerCells.last();
		if ($noticeAnchor.length > 0) $notice.detach().insertBefore($noticeAnchor);
		else if ($notice.parent().length === 0) $box.prepend($notice);
		const names = Array.from(new Set($blockedCells.toArray().map((cell) => getReplyMemberName(cell)).filter(Boolean)));
		const nameText = names.length > 0 ? names.map((name) => `@${name}`).join("、") : "该用户";
		const isRevealed = $blockedCells.filter(".v2p-blocked-revealed").length > 0;
		$notice.find(".v2p-blocked-notice-text").text(`已屏蔽 ${nameText}，当前页 ${$blockedCells.length} 条回复已折叠`);
		$notice.find(".v2p-blocked-toggle").text(isRevealed ? "隐藏" : "显示");
	}
	/**
	* 在当前页折叠指定用户的回复。
	*
	* 屏蔽是账号级操作，刷新后由 V2EX 服务端接管；
	* 这里只负责让当前页立即给出反馈。
	*/
	function foldBlockedMemberReplies(memberName) {
		const $box = $commentBox.first();
		if (!memberName || $box.length === 0) return 0;
		$box.find(".cell[id^=\"r_\"]").each((_, cellDom) => {
			if (getReplyMemberName(cellDom) !== memberName) return;
			const $cell = $(cellDom);
			$cell.addClass("v2p-blocked-reply");
			if ($cell.find("> .cell[id^=\"r_\"]").length === 0) $cell.addClass("v2p-blocked-reply-empty");
		});
		$box.find(".v2p-blocked-reply").removeClass("v2p-blocked-revealed");
		renderNotice($box);
		return $box.find(".v2p-blocked-reply").length;
	}
	var init_blocked = __esmMin((() => {
		init_globals();
		init_reply_dom();
	}));

//#endregion
//#region src/contents/topic/avatar.ts
/**
	* 处理用户头像元素：
	*  - 鼠标悬浮头像会展示该用户的信息。
	*/
	function processAvatar(params) {
		const { $trigger, popupControl, commentData, shouldWrap = true, openInNewTab = false, onSetTagsClick } = params;
		const { memberName, memberAvatar, memberLink } = commentData;
		const safeMemberName = escapeHTML(memberName);
		const safeMemberLink = escapeHTML(memberLink);
		const safeMemberAvatar = escapeHTML(memberAvatar);
		const topicPreview = createTopicPreview();
		let abortController = null;
		const handleOver = () => {
			popupControl.close();
			popupControl.open($trigger);
			const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <a class="v2p-avatar-box" href="${safeMemberLink}" target="${openInNewTab ? "_blank" : "_self"}">
              <img class="v2p-avatar" src="${safeMemberAvatar}">
            </a>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username">
              <a href="${safeMemberLink}" target="${openInNewTab ? "_blank" : "_self"}">${safeMemberName}</a>
            </div>
            <div class="v2p-no v2p-loading"></div>
            <div class="v2p-created-date v2p-loading"></div>
          </div>

          </div>

          <div class="v2p-bio" style="disply:none;"></div>

          <div class="v2p-member-card-actions"></div>
      </div>
    `);
			popupControl.$content.empty().append($content);
			createButton$1({
				children: "添加用户标签",
				size: "small"
			}).on("click", () => {
				popupControl.close();
				openTagsSetter({
					memberName,
					memberAvatar
				});
				onSetTagsClick?.();
			}).appendTo($(".v2p-member-card-actions"));
			createButton$1({
				children: "屏蔽该用户",
				size: "small"
			}).on("click", (event) => {
				const $btn = $(event.currentTarget);
				if ($btn.hasClass("v2p-btn-loading")) return;
				if (!confirm(`确定要屏蔽用户 ${memberName} 吗？`)) return;
				$btn.addClass("v2p-btn-loading").text("屏蔽中...");
				blockUser(memberName).then((result) => {
					if (result.success) {
						let foldedCount = 0;
						try {
							foldedCount = foldBlockedMemberReplies(memberName);
						} catch (error) {
							console.error("折叠已屏蔽用户的回复失败:", error);
						}
						createToast({ message: foldedCount > 0 ? `✅ 已屏蔽该用户，当前页 ${foldedCount} 条回复已折叠` : result.message });
						popupControl.close();
					} else {
						createToast({ message: result.message });
						$btn.removeClass("v2p-btn-loading").text("屏蔽该用户");
					}
				});
			}).appendTo($(".v2p-member-card-actions"));
			const openMode = getStorageSync()["options"].topic?.openMode ?? "default";
			/**
			* 渲染用户发帖记录列表。
			* 只有在成功获取到数据且有发帖记录时才插入 DOM。
			*/
			const renderTopics = (topics) => {
				if (topics.length > 0) {
					const topicItemsHtml = topics.map((topic) => {
						const topicId = topic.url.match(/\/t\/(\d+)/)?.at(1) ?? "";
						let linkTarget = "_self";
						if (openMode === "newTab") linkTarget = "_blank";
						const safeTitle = escapeHTML(topic.title);
						const safeUrl = escapeHTML(topic.url);
						const previewBtnHtml = topicPreview ? `<button class="v2p-topic-preview-btn" data-topic-id="${topicId}" data-url="${safeUrl}" data-title="${safeTitle}">预览</button>` : "";
						return `
              <div class="v2p-member-topic-item-row" data-topic-id="${topicId}" data-url="${safeUrl}" data-title="${safeTitle}">
                <a class="v2p-member-topic-item" href="${safeUrl}" target="${linkTarget}" title="${safeTitle}">${safeTitle}</a>
                ${previewBtnHtml}
              </div>
            `;
					}).join("");
					const $topicsSection = $(`
          <div class="v2p-member-topics">
            <div class="v2p-member-topics-header">最近发帖</div>
            <div class="v2p-member-topics-list">${topicItemsHtml}</div>
          </div>
        `);
					if (openMode === "preview" && topicPreview) $topicsSection.on("click", ".v2p-member-topic-item", function(ev) {
						ev.preventDefault();
						const $row = $(this).closest(".v2p-member-topic-item-row");
						topicPreview.handlePreview({
							topicId: $row.data("topic-id"),
							topicTitle: $row.data("title"),
							linkHref: $row.data("url")
						});
					});
					if (topicPreview) $topicsSection.on("click", ".v2p-topic-preview-btn", function() {
						const $btn = $(this);
						topicPreview.handlePreview({
							topicId: $btn.data("topic-id"),
							topicTitle: $btn.data("title"),
							linkHref: $btn.data("url")
						});
					});
					$content.find(".v2p-member-card-actions").before($topicsSection);
				}
			};
			(async () => {
				if (!memberDataCache.has(memberName)) {
					abortController = new AbortController();
					popupControl.onClose = () => {
						abortController?.abort();
					};
					try {
						const [memberData, userPageHtml] = await Promise.all([fetchUserInfo(memberName, { signal: abortController.signal }), crawlUserPage(memberName).catch(() => "")]);
						let topics = [];
						try {
							topics = parseUserTopics(userPageHtml, 5);
						} catch {}
						memberDataCache.set(memberName, {
							...memberData,
							registerDays: getRegisterDays(memberData.created),
							topics
						});
					} catch (err) {
						if (err instanceof Error) {
							$content.empty().append($("<span>").text(err.message));
							if (err.cause === 404) memberDataCache.set(memberName, banned);
						}
						return null;
					}
				}
				const data = memberDataCache.get(memberName);
				if (typeof data === "object") {
					$content.find(".v2p-no").removeClass("v2p-loading").text(`V2EX 第 ${data.id} 号会员`);
					$content.find(".v2p-created-date").removeClass("v2p-loading").text(`加入于 ${formatTimestamp(data.created)}`);
					if (data.registerDays <= 30) $content.find(".v2p-info-right").append(`<div class="v2p-register-days" style="margin: 5px 0;">${data.registerDays <= 15 ? "15" : "30"} 天内注册</div>`);
					if (data.bio && data.bio.trim().length > 0) $content.find(".v2p-bio").css("disply", "block").text(data.bio);
					else $content.find(".v2p-bio").remove();
					if (data.topics && data.topics.length > 0) renderTopics(data.topics);
				} else if (typeof data === "symbol" && data === banned) $content.html("<span>查无此用户，疑似已被封禁</span>");
			})();
		};
		let isOver = false;
		$trigger.on("mouseover", () => {
			isOver = true;
			setTimeout(() => {
				if (isOver) handleOver();
			}, 350);
		}).on("mouseleave", () => {
			isOver = false;
			setTimeout(() => {
				if (!popupControl.isOver && !isOver) popupControl.close();
			}, 350);
		});
		if (shouldWrap) $trigger.wrap(`<a href="/member/${commentData.memberName}" target="_blank" style="cursor: pointer;">`);
	}
	var banned, memberDataCache;
	var init_avatar = __esmMin((() => {
		init_button();
		init_floating_popup();
		init_toast();
		init_services();
		init_utils();
		init_helpers();
		init_blocked();
		init_content();
		init_preview();
		banned = Symbol();
		memberDataCache = /* @__PURE__ */ new Map();
	}));

//#endregion
//#region src/contents/topic/comment.ts
/**
	* 生成回复引用的 HTML 模板
	*/
	function generateReplyRefHTML(replyMember) {
		return `
    <div class="v2p-topic-reply-ref">
      <div class="v2p-topic-reply">
        <div class="v2p-topic-reply-member">
          <a href="${replyMember.memberLink}" target="_blank">
            <img class="v2p-topic-reply-avatar" src="${replyMember.memberAvatar}">
            <span>${replyMember.memberName}</span>
          </a>：
        </div>
        <div class="v2p-topic-reply-content">${escapeHTML(replyMember.content)}</div>
      </div>
    </div>
  `;
	}
	/**
	* 分批执行任务，避免主线程长时间阻塞。
	*/
	function scheduleInChunks(items, chunkSize, handler) {
		let index = 0;
		const runChunk = () => {
			const end = Math.min(index + chunkSize, items.length);
			for (; index < end; index++) handler(items[index]);
			if (index < items.length) {
				if ("requestIdleCallback" in window) window.requestIdleCallback(runChunk);
				else window.requestAnimationFrame(runChunk);
			}
		};
		if ("requestIdleCallback" in window) window.requestIdleCallback(runChunk);
		else window.requestAnimationFrame(runChunk);
	}
	/**
	* 为回复的「感谢」按钮绑定事件。
	*
	* 模态框中的回复是克隆出来的，不会继承原始 DOM 上的事件，需要重新绑定。
	*/
	function bindThankActions($scope) {
		$scope.find(".v2p-control-thank").off("click.v2pThank keydown.v2pThank").on("click.v2pThank", (ev) => {
			ev.stopPropagation();
			const $thankIcon = $(ev.currentTarget);
			if ($thankIcon.hasClass("v2p-thanked") || $thankIcon.hasClass("v2p-thank-pending")) return;
			const id = ev.currentTarget.dataset.id;
			const memberName = ev.currentTarget.dataset.memberName;
			if (typeof id !== "string" || typeof memberName !== "string") return;
			const replyId = id.split("_").at(1);
			if (!replyId) return;
			const cost = ev.currentTarget.dataset.thankCost ?? "10";
			if (!confirm(`确认花费 ${cost} 个铜币向 @${memberName} 的这条回复发送感谢？`)) return;
			$thankIcon.addClass("v2p-thank-pending");
			(async () => {
				const result = await thankReply({ replyId });
				$thankIcon.removeClass("v2p-thank-pending");
				if (!result.success) {
					createToast({ message: result.message ?? "❌ 感谢回复失败" });
					return;
				}
				const $cell = $(`.cell[id="r_${replyId}"]`);
				const $tableInCell = $cell.find("> table");
				const $likesBox = $tableInCell.find(".v2p-likes-box");
				const $firstLikesBox = $likesBox.eq(0);
				const likes = parseLikesCount($firstLikesBox.text());
				const $clonedIconHeart = $firstLikesBox.find(".v2p-icon-heart").clone();
				if (likes > 0) $likesBox.addClass("v2p-thanked").empty().append($clonedIconHeart, ` ${likes + 1}`);
				else {
					$(`
              <span class="small v2p-likes-box v2p-thanked" style="position:relative;top:-1px;">
                &nbsp;&nbsp;<span class="v2p-icon-heart"><i data-v2p-icon="heart"></i></span>1
              </span>
              `).insertAfter($tableInCell.find(".ago"));
					$cell.each((_, cell) => {
						loadIcons(cell);
					});
				}
				$tableInCell.find(".v2p-control-thank").removeClass("v2p-thank-pending").addClass("v2p-thanked").removeAttr("tabindex").attr({
					"aria-label": "已感谢",
					"aria-disabled": "true"
				}).off("click.v2pThank keydown.v2pThank");
			})();
		}).on("keydown.v2pThank", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				$(ev.currentTarget).trigger("click");
			}
		});
	}
	/**
	* 将回复标记为已隐藏，并插入可展开的占位提示。
	*/
	function applyIgnoredReply($cellDom) {
		if ($cellDom.hasClass("v2p-ignored-reply")) return;
		$cellDom.addClass("v2p-ignored-reply");
		const $placeholder = $(`
    <div class="v2p-ignored-placeholder">
      此回复已隐藏 ·
      <a class="v2p-ignored-toggle" role="button" tabindex="0">显示</a>
    </div>
  `);
		$placeholder.find(".v2p-ignored-toggle").on("click", (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			const $toggle = $(ev.currentTarget);
			const reveal = $toggle.text() === "显示";
			$cellDom.toggleClass("v2p-ignored-revealed", reveal);
			$toggle.text(reveal ? "隐藏" : "显示");
		}).on("keydown", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				$(ev.currentTarget).trigger("click");
			}
		});
		$cellDom.prepend($placeholder);
	}
	/**
	* 为回复的「隐藏」按钮绑定事件。
	*
	* 与感谢按钮一样，模态框中的克隆节点需要重新绑定事件。
	*/
	function bindIgnoreActions($scope) {
		$scope.find(".v2p-control-hide").closest("a").filter((_, element) => Boolean($(element).attr("data-ignore-url"))).off("click.v2pIgnore keydown.v2pIgnore").on("click.v2pIgnore", (ev) => {
			const $hide = $(ev.currentTarget);
			const ignoreUrl = $hide.attr("data-ignore-url");
			if (!ignoreUrl || $hide.hasClass("v2p-ignore-pending")) return;
			ev.preventDefault();
			ev.stopPropagation();
			if (!confirm("确定要隐藏这条回复吗？")) return;
			$hide.addClass("v2p-ignore-pending");
			(async () => {
				const result = await ignoreReply(ignoreUrl);
				$hide.removeClass("v2p-ignore-pending");
				if (!result.success) {
					createToast({ message: result.message });
					window.location.href = ignoreUrl;
					return;
				}
				const cellId = $hide.closest(".cell[id^=\"r_\"]").attr("id");
				(cellId ? $(`.cell[id="${cellId}"]`) : $hide.closest(".cell[id^=\"r_\"]")).each((_, cellDom) => {
					applyIgnoredReply($(cellDom));
				});
				createToast({ message: result.message });
			})();
		}).on("keydown.v2pIgnore", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				$(ev.currentTarget).trigger("click");
			}
		});
	}
	/**
	* 设置经过筛选后的回复。
	*/
	function handleFilteredComments() {
		const iconHeart = createElement(Heart);
		iconHeart.setAttribute("width", "100%");
		iconHeart.setAttribute("height", "100%");
		const $commentsBtn = $("<span class=\"v2p-tool v2p-hover-btn\"><span class=\"v2p-tool-icon\"></span>热门回复</span>");
		$commentsBtn.find(".v2p-tool-icon").append(iconHeart);
		$(".v2p-tools").prepend($commentsBtn);
		const popularCommentData = commentDataList.filter(({ likes }) => likes > 0).sort((a, b) => b.likes - a.likes);
		const popularCount = popularCommentData.length;
		const cloneReplyCell = (index) => {
			const $clonedCell = $commentCells.eq(index).clone();
			$clonedCell.find(".v2p-controls > a:has(.v2p-control-reply)").remove();
			$clonedCell.find(".no").css("pointer-events", "none");
			return $clonedCell;
		};
		let modal = null;
		let contentBuilt = false;
		$commentsBtn.on("click", () => {
			if (!modal) modal = createModal({
				root: $main,
				onOpen: ({ $mask, $title, $content }) => {
					if (!contentBuilt) {
						const $template = $("<div class=\"v2p-modal-comments\">");
						const $t1 = $template.clone().attr("data-tab-key", "hot").addClass("v2p-tab-content-active");
						const $t2 = $template.clone().attr("data-tab-key", "recent");
						const $t3 = $template.clone().attr("data-tab-key", "op");
						if (popularCount > 0) popularCommentData.forEach(({ index, refMemberNames }) => {
							const $clonedCell = cloneReplyCell(index);
							const firstRefMember = refMemberNames?.at(0);
							if (firstRefMember) {
								const replyMember = commentDataList.findLast((it, idx) => idx < index && it.memberName === firstRefMember);
								if (replyMember) $clonedCell.prepend(generateReplyRefHTML(replyMember));
							}
							$t1.append($clonedCell);
						});
						else $t1.append($("<div>暂无热门回复</div>").css({
							padding: "20px",
							textAlign: "center"
						}));
						$content.append($t1);
						{
							const len = commentDataList.length;
							const displayNum = len < 10 ? len : len <= 10 ? 5 : len <= 30 ? 10 : len <= 60 ? 20 : len <= 100 ? 40 : len <= 200 ? 60 : 90;
							if (displayNum > 0) commentDataList.slice(-1 * displayNum).reverse().forEach(({ index, refMemberNames }) => {
								const $clonedCell = cloneReplyCell(index);
								const firstRefMember = refMemberNames?.at(0);
								if (firstRefMember) {
									const replyMember = commentDataList.findLast((it, idx) => idx < index && it.memberName === firstRefMember);
									if (replyMember) $clonedCell.prepend(generateReplyRefHTML(replyMember));
								}
								$t2.append($clonedCell);
							});
							else $t2.append($("<div>暂无最近回复</div>").css({
								padding: "20px",
								textAlign: "center"
							}));
							$content.append($t2);
						}
						{
							const opCommentData = commentDataList.filter(({ memberName }) => memberName === topicOwnerName);
							if (opCommentData.length > 0) opCommentData.forEach(({ index, refMemberNames }) => {
								const $clonedCell = cloneReplyCell(index);
								const firstRefMember = refMemberNames?.at(0);
								if (firstRefMember) {
									const replyMember = commentDataList.findLast((it, idx) => idx < index && it.memberName === firstRefMember);
									if (replyMember) $clonedCell.prepend(generateReplyRefHTML(replyMember));
								}
								$t3.append($clonedCell);
							});
							else $t3.append($("<div>暂无题主回复</div>").css({
								padding: "20px",
								textAlign: "center"
							}));
							$content.append($t3);
						}
						const $tabs = $(`
              <div class="v2p-modal-comment-tabs">
                <div data-tab-key="hot" class="v2p-tab-active">热门回复</div>
                <div data-tab-key="recent">最新回复</div>
                <div data-tab-key="op">题主回复</div>
              </div>
            `);
						$title.append($tabs);
						$tabs.find("[data-tab-key]").on("click", (ev) => {
							const $target = $(ev.currentTarget);
							const { tabKey } = $target.data();
							if (typeof tabKey === "string") {
								$target.addClass("v2p-tab-active").siblings().removeClass("v2p-tab-active");
								$(`.v2p-modal-comments[data-tab-key="${tabKey}"]`).addClass("v2p-tab-content-active").siblings().removeClass("v2p-tab-content-active");
							}
						});
						{
							const modalPopupControl = createPopup({
								root: $mask,
								triggerType: "hover",
								placement: "right-start",
								offsetOptions: {
									mainAxis: 8,
									crossAxis: -4
								}
							});
							const options = getStorageSync()["options"];
							$content.find(".cell[id^=\"r_\"]").each((_, cellDom) => {
								const commentData = commentDataList.find((c) => c.id === cellDom.id);
								if (commentData) {
									const $cellDom = $(cellDom);
									processAvatar({
										$trigger: $cellDom.find(".avatar, .dark"),
										popupControl: modalPopupControl,
										commentData,
										shouldWrap: false,
										openInNewTab: options.topic.openMode !== "default"
									});
								}
							});
						}
						bindThankActions($content);
						bindIgnoreActions($content);
						replaceCommentEmojiWithHD($content.find(".cell[id^=\"r_\"]"));
						contentBuilt = true;
					}
					if (getStorageSync()["options"].replyContent.autoFold) {
						$content.find(".v2p-reply-content").each((_, contentBox) => {
							const $expandBtn = $(contentBox).children(".v2p-expand-btn");
							if ($expandBtn.length > 0) $expandBtn.off("click").on("click", (ev) => {
								ev.preventDefault();
								contentBox.classList.toggle("v2p-collapsed");
								$expandBtn.html(contentBox.classList.contains("v2p-collapsed") ? "展开回复" : "收起回复");
							});
						});
						$content.find(".cell[id^=\"r_\"]").each((_, cellDom) => {
							processReplyContent($(cellDom));
						});
					}
					handleLinkPreview();
				}
			});
			modal.open();
		});
		{
			const $commentBoxCount = $commentBox.find(".cell:first-of-type > span.gray");
			const countText = $commentBoxCount.text();
			const countTextSpan = `<span class="count-text">${countText.substring(0, countText.indexOf("回复") + 2)}</span><span class="v2p-dot">·</span>${popularCount} 条热门回复`;
			$commentBoxCount.empty().append(countTextSpan);
		}
	}
	/**
	* 设置回复的操作。
	*/
	function processActions($cellDom, data) {
		const cellDom = $cellDom.get(0);
		const actionContainer = cellDom ? getReplyActionsFromCell(cellDom) : null;
		if (!actionContainer) return;
		const $actions = $(actionContainer);
		const $controls = $("<span class=\"v2p-controls\">");
		const thankArea = $actions.find(".thank_area");
		const thanked = thankArea.hasClass("thanked");
		const thankEle = thankArea.find("> .thank");
		const $ignoreLink = $actions.find("a[href*=\"/ignore/reply/\"], a[onclick*=\"/ignore/reply/\"]").first();
		const $positionalHide = thankEle.length >= 2 ? thankEle.eq(0) : $();
		const $hide = ($ignoreLink.length > 0 ? $ignoreLink : $positionalHide).removeClass("thank");
		const $thank = thankEle.not($hide).first().removeClass("thank");
		if ($hide.length > 0) {
			const ignoreUrl = parseIgnoreReplyUrl($hide.attr("href"), $hide.attr("onclick"));
			$hide.attr("aria-label", "隐藏回复").html("<span class=\"v2p-control v2p-hover-btn v2p-control-hide\"><i data-v2p-icon=\"eye-off\"></i></span>");
			if (ignoreUrl) $hide.attr("data-ignore-url", ignoreUrl).removeAttr("onclick").attr("href", "javascript:void(0)");
			$controls.append($hide);
		}
		if (thanked) {
			const $thankedIcon = $(`<span
        class="v2p-control v2p-control-thank v2p-thanked"
        data-id="${data.id}"
        data-member-name="${data.memberName}"
        aria-label="已感谢"
        aria-disabled="true"
      >
        <i data-v2p-icon="heart"></i>
      </span>`);
			$controls.append($("<a>").append($thankedIcon));
		} else if ($thank.length > 0) {
			const thankCost = `${$thank.attr("href") ?? ""} ${$thank.attr("onclick") ?? ""}`.match(/花费\s*(\d+)\s*个铜币/)?.[1] ?? "10";
			const $thankIcon = $(`<span
        class="v2p-control v2p-control-thank v2p-hover-btn"
        data-id="${data.id}"
        data-member-name="${data.memberName}"
        data-thank-cost="${thankCost}"
        role="button"
        tabindex="0"
        aria-label="感谢回复"
      >
        <i data-v2p-icon="heart"></i>
      </span>`);
			$thankIcon.replaceAll($thank);
			$controls.append($thankIcon);
		}
		const replyLink = getReplyLinkFromActions(actionContainer);
		const $reply = replyLink ? $(replyLink) : $();
		const $replyIcons = $reply.find("> img[alt=\"Reply\"]");
		$reply.attr("aria-label", "回复");
		if ($replyIcons.length > 0) {
			$replyIcons.slice(1).remove();
			$replyIcons.first().replaceWith("<span class=\"v2p-control v2p-hover-btn v2p-control-reply\"><i data-v2p-icon=\"message-square\"></i></span>");
		}
		$controls.append($reply);
		thankArea.remove();
		const floorNum = $actions.find(".no").clone();
		$reply.on("click", () => {
			const replyVal = $replyTextArea.val();
			if (typeof replyVal === "string" && replyVal.length > 0) {
				const floor = floorNum.text();
				const replyComment = commentDataList.find((it) => it.floor === floor);
				if (replyComment) {
					const replyMemberName = replyComment.memberName;
					if (commentDataList.findIndex((it) => it.memberName === replyMemberName && it.floor !== floor) !== -1) insertTextToReplyInput(`#${floor} `);
					else {
						const $page = $(".v2p-paging").eq(0).find(".page_normal, .page_current");
						if ($page.length > 1) {
							if (!$page.last().hasClass("page_current")) insertTextToReplyInput(`#${floor} `);
						}
					}
				}
			}
		});
		$actions.empty().append($controls, floorNum);
	}
	async function handleComments() {
		const storage = getStorageSync();
		const tagData = storage["member-tag"];
		const options = storage["options"];
		if (options.reply.preload !== "off") {
			const $paging = $(".v2p-paging");
			if ($paging.length > 0) {
				const $pagingTop = $paging.eq(0);
				const $pagingBottom = $paging.eq(1);
				const $pageNormal = $paging.find(".page_normal");
				const $pagingTopNormal = $pagingTop.find(".page_normal");
				const toastControl = createToast({
					message: "正在预加载回复，请稍候...",
					duration: 0
				});
				try {
					const $pagingBottomNormal = $pagingBottom.find(".page_normal");
					if ($pagingTop.find(".page_current").text() === "1") {
						const pages = [];
						$pagingTopNormal.each((i, ele) => {
							if (i <= 1) {
								if (ele.textContent) {
									ele.classList.add("page_current");
									ele.classList.remove("page_normal");
									$pagingBottomNormal.eq(i).addClass("page_current").removeClass("page_normal");
									pages.push(ele.textContent);
								}
							}
						});
						if (pages.length > 0) {
							const pagesText = await Promise.all(pages.map((p) => crawlTopicPage(window.location.pathname, p)));
							const fragment = document.createDocumentFragment();
							for (const htmlText of pagesText) {
								const cells = new DOMParser().parseFromString(htmlText, "text/html").querySelectorAll(".cell[id^=\"r_\"]");
								for (const cell of cells) if (cell instanceof HTMLElement) fragment.append(document.importNode(cell, true));
							}
							{
								const latestOnce = extractOnceFromHtml(pagesText.at(-1) ?? "");
								if (latestOnce) {
									window.once = latestOnce;
									postTask(`window.once = "${latestOnce}"`);
								}
							}
							const pagingBottomEl = $pagingBottom.get(0);
							if (pagingBottomEl?.parentNode) pagingBottomEl.parentNode.insertBefore(fragment, pagingBottomEl);
						}
						updateCommentCells();
					}
					toastControl.clear();
				} catch (err) {
					if (err instanceof Error) console.error(`加载多页回复出错：${err.message}`);
					createToast({ message: "❌ 加载多页回复失败" });
					$pageNormal.removeClass("page_current").addClass("page_normal");
				}
			}
		}
		const $commentTime = $(".cell .ago");
		if (options.replyContent.hideReplyTime) $commentTime.addClass("v2p-auto-hide");
		const canHideRefName = options.nestedReply.display === "indent" && !!options.replyContent.hideRefName;
		commentDataList = getCommentDataList({
			options,
			$commentTableRows,
			$commentCells
		});
		{
			const memberNames = /* @__PURE__ */ new Set([topicOwnerName]);
			$commentCells.each((i, cellDom) => {
				const currentComment = commentDataList.at(i);
				if (currentComment?.id !== cellDom.id) return;
				const $cellDom = $(cellDom);
				const { memberName, thanked } = currentComment;
				memberNames.add(memberName);
				processAvatar({
					$trigger: $cellDom.find(".avatar, .dark"),
					popupControl,
					commentData: currentComment,
					openInNewTab: options.topic.openMode !== "default"
				});
				if (memberName === loginName && !options.hideAccount) $cellDom.find(".badges").append(`<div class="badge ${memberName === topicOwnerName ? "mod" : "you"}">Me</div>`);
				const $likesBox = $cellDom.find(".small.fade").addClass("v2p-likes-box");
				$likesBox.find("img[alt=\"❤️\"]").replaceWith("<span class=\"v2p-icon-heart\"><i data-v2p-icon=\"heart\"></i></span>");
				if (thanked) $likesBox.addClass("v2p-thanked");
				processActions($cellDom, currentComment);
				if (canHideRefName) {
					if (currentComment.contentHtml) $cellDom.find(".reply_content").html(currentComment.contentHtml);
				}
			});
			if (tagData) Object.entries(tagData).forEach(([memberName, { tags, avatar }]) => {
				if (memberNames.has(memberName)) updateMemberTag({
					memberName,
					memberAvatar: avatar,
					tags,
					options
				});
			});
			updateCommentCells();
			handleFilteredComments();
			bindThankActions($commentCells);
			bindIgnoreActions($commentCells);
		}
		handleNestedComment({
			options,
			$commentCells,
			commentDataList
		});
		if (options.replyContent.autoFold) scheduleInChunks($commentCells.get(), 30, (cell) => {
			processReplyContent($(cell));
		});
		{
			const $opAvatar = $topicHeader.find(".avatar");
			const $opName = $topicHeader.find(".gray a[href^=\"/member\"]");
			const memberName = $opAvatar.prop("alt");
			const memberAvatar = $opAvatar.prop("src");
			const memberLink = $topicHeader.find(".fr > a").prop("href");
			if (typeof memberName === "string" && typeof memberAvatar === "string" && typeof memberLink === "string") {
				processAvatar({
					$trigger: $opAvatar,
					popupControl,
					commentData: {
						memberName,
						memberAvatar,
						memberLink
					},
					openInNewTab: options.topic.openMode !== "default"
				});
				processAvatar({
					$trigger: $opName,
					popupControl,
					commentData: {
						memberName,
						memberAvatar,
						memberLink
					},
					shouldWrap: false,
					openInNewTab: options.topic.openMode !== "default"
				});
				fetchUserInfo(memberName).then((memberData) => {
					const registerDays = getRegisterDays(memberData.created);
					memberDataCache.set(memberName, {
						...memberData,
						registerDays
					});
					if (registerDays <= 30) $opName.append(`<span class="v2p-register-days">${registerDays <= 15 ? "15" : "30"} 天内注册</span>`);
				});
			}
		}
		window.requestIdleCallback(() => {
			replaceCommentEmojiWithHD();
			handleLinkPreview();
			$commentTime.each((_, el) => {
				const $el = $(el);
				const time = $el.text();
				const daysAgo = extractDays(time);
				if (typeof daysAgo === "number" && daysAgo > 60) {
					const absoluteTime = $el.prop("title");
					if (typeof absoluteTime === "string") {
						const parseResult = parseDateTime(absoluteTime);
						if (parseResult.success) {
							if (parseResult.formatted) $el.text(`${parseResult.formatted}`);
						}
					}
				}
			});
		});
	}
	var commentDataList, popupControl;
	var init_comment = __esmMin((() => {
		init_lucide();
		init_floating_popup();
		init_modal();
		init_toast();
		init_post_task();
		init_services();
		init_utils();
		init_dom();
		init_globals();
		init_helpers();
		init_reply_dom();
		init_avatar();
		init_content();
		commentDataList = [];
		popupControl = createPopup({
			root: $wrapper,
			triggerType: "hover",
			placement: "right-start",
			offsetOptions: {
				mainAxis: 8,
				crossAxis: -4
			}
		});
	}));

//#endregion
//#region src/contents/topic/layout-split.ts
/**
	* 计算主题页水平布局所需的左右分组。
	*
	* V2EX 新版用 `#topic-replies` 包住回复区，分栏边界必须落在 `#Main` 的
	* 直接子元素上，不能再用回复区自身的 `.prev('.sep20')` 作为分界。
	* 返回 `null` 表示当前结构无法安全分栏，调用方应保持垂直布局。
	*/
	function getHorizontalLayoutGroups(main, target) {
		if (!main || !target) return null;
		const children = Array.from(main.children);
		if (children.some((el) => el.matches(".v2p-left-side, .v2p-left-group, .v2p-right-side"))) return null;
		const anchor = children.find((el) => el === target || el.contains(target));
		if (!anchor) return null;
		const anchorIndex = children.indexOf(anchor);
		const startIndex = children[anchorIndex - 1]?.classList.contains("sep20") ? anchorIndex - 1 : anchorIndex;
		const left = children.slice(0, startIndex);
		const right = children.slice(startIndex);
		if (left.length === 0 || right.length === 0) return null;
		return {
			left,
			right
		};
	}
	var init_layout_split = __esmMin((() => {}));

//#endregion
//#region src/contents/topic/layout.ts
	function toggleTopicLayout() {
		if ($wrapperContent.hasClass("v2p-content-layout")) switchToVerticalLayout();
		else switchToHorizontalLayout();
	}
	/**
	* 控制主题布局水平分屏显示。
	*/
	function handleLayout() {
		const $rightbar = $("#Rightbar");
		$toggleRightbarBtn.insertAfter($rightbar);
		$(".v2p-toggle-rightbar-icon").html(iconChevronLeft);
		$toggleRightbarBtn.on("click", () => {
			if ($rightbar.hasClass("v2p-layout-rightbar-visible")) {
				$rightbar.removeClass("v2p-layout-rightbar-visible");
				$(".v2p-toggle-rightbar-icon").html(iconChevronLeft);
			} else {
				$rightbar.addClass("v2p-layout-rightbar-visible");
				$(".v2p-toggle-rightbar-icon").html(iconChevronRight);
			}
		});
		const handleResize = () => {
			if (window.innerWidth < 1200) switchToVerticalLayout();
			else {
				const options = getStorageSync()["options"];
				if (options.reply.layout === "auto") {
					if (($topicContentBox.height() || 0) >= 600) switchToHorizontalLayout();
					else switchToVerticalLayout();
				} else if (options.reply.layout === "horizontal") switchToHorizontalLayout();
			}
		};
		$layoutToggle.html(iconLayoutH);
		$layoutToggle.attr("title", "切换为水平布局");
		handleResize();
		window.addEventListener("resize", handleResize);
		$layoutToggle.on("click", () => {
			toggleTopicLayout();
		});
		$(".tools").prepend($layoutToggle);
	}
	var $layoutToggle, iconLayoutV, iconLayoutH, $toggleRightbarBtn, iconChevronLeft, iconChevronRight, updateLayoutToggle, switchToHorizontalLayout, switchToVerticalLayout;
	var init_layout = __esmMin((() => {
		init_lucide();
		init_constants();
		init_utils();
		init_globals();
		init_layout_split();
		$layoutToggle = $("<span class=\"v2p-layout-toggle v2p-hover-btn\">");
		iconLayoutV = createElement(PanelTop);
		iconLayoutV.setAttribute("width", "100%");
		iconLayoutV.setAttribute("height", "100%");
		iconLayoutH = createElement(PanelRight);
		iconLayoutH.setAttribute("width", "100%");
		iconLayoutH.setAttribute("height", "100%");
		$toggleRightbarBtn = $(`
  <div class="v2p-toggle-rightbar-btn">
    <span class="v2p-toggle-rightbar-icon"></span>
  </div>
`);
		iconChevronLeft = createElement(ChevronLeft);
		iconChevronLeft.setAttribute("width", "100%");
		iconChevronLeft.setAttribute("height", "100%");
		iconChevronRight = createElement(ChevronRight);
		iconChevronRight.setAttribute("width", "100%");
		iconChevronRight.setAttribute("height", "100%");
		updateLayoutToggle = () => {
			const isHorizontal = $wrapperContent.hasClass("v2p-content-layout");
			$layoutToggle.html(isHorizontal ? iconLayoutV : iconLayoutH);
			$layoutToggle.attr("title", isHorizontal ? "切换为垂直布局" : "切换为水平布局");
			$(".v2p-reply-tool-layout").text(isHorizontal ? "切换为垂直布局" : "切换为水平布局");
		};
		switchToHorizontalLayout = () => {
			if (!$wrapperContent.hasClass("v2p-content-layout")) {
				const $target = $commentBox.length > 0 ? $commentBox : $("#no-comments-yet").get().length > 0 ? $("#no-comments-yet") : $replyBox;
				const groups = getHorizontalLayoutGroups($main[0], $target[0]);
				if (groups) {
					const $leftGroup = $(groups.left);
					const $rightGroup = $(groups.right);
					const $rightSide = $("<div class=\"v2p-right-side\">");
					$rightGroup.wrapAll($rightSide);
					const $leftSide = $("<div class=\"v2p-left-side\">");
					const $leftGroupWrapper = $("<div class=\"v2p-left-group\">");
					$leftGroup.wrapAll($leftGroupWrapper);
					$(".v2p-left-group").wrapAll($leftSide);
					const $leftSideContent = $("<div class=\"v2p-left-side-content\">");
					const $topicContent = $leftGroup.find("> .cell");
					$topicContent.add($topicContent.nextAll(".subtle")).wrapAll($leftSideContent);
					$wrapperContent.addClass("v2p-content-layout");
					$main.addClass("v2p-horizontal-layout");
				}
			}
			updateLayoutToggle();
		};
		switchToVerticalLayout = () => {
			if ($wrapperContent.hasClass("v2p-content-layout")) {
				$wrapperContent.removeClass("v2p-content-layout");
				$main.removeClass("v2p-horizontal-layout");
				$(".v2p-left-side-content").children().unwrap();
				$(".v2p-left-side > .v2p-left-group").children().unwrap();
				$(".v2p-left-side").children().unwrap();
				$(".v2p-right-side").children().unwrap();
			}
			updateLayoutToggle();
		};
	}));

//#endregion
//#region src/contents/topic/paging.ts
/**
	* 处理主题分页。
	*/
	function handlePaging() {
		const $notCommentCells = $commentBox.find("> .cell:not([id^=\"r_\"])");
		if ($notCommentCells.length <= 1) return;
		const pageBtns = $notCommentCells.slice(1).addClass("v2p-paging").find(".super.button");
		pageBtns.eq(0).addClass("v2p-prev-btn");
		pageBtns.eq(1).addClass("v2p-next-btn");
	}
	var init_paging = __esmMin((() => {
		init_globals();
	}));

//#endregion
//#region src/contents/topic/related-topics.ts
/**
	* 从当前主题页面提取标签关键词
	*/
	function extractTopicTags() {
		const $tags = $(".cell .fr a.tag");
		const tags = [];
		$tags.each((index, el) => {
			if (index >= MAX_TAGS) return false;
			const tagText = $(el).text().trim();
			if (tagText) tags.push(tagText);
		});
		return tags;
	}
	/**
	* 从标签页面 HTML 中解析主题列表
	*/
	function parseTagPageTopics(htmlText) {
		try {
			const $topicItems = $(htmlText).find(".cell.item");
			const topics = [];
			$topicItems.each((_, item) => {
				const $item = $(item);
				const $topicLink = $item.find(".item_title .topic-link");
				const $replyCount = $item.find(REPLY_COUNT_SELECTOR);
				const title = $topicLink.text().trim();
				const url = $topicLink.attr("href");
				const replies = parseInt($replyCount.text().trim(), 10) || 0;
				if (title && url) {
					const id = url.match(/\/t\/(\d+)/)?.at(1);
					if (id) topics.push({
						id,
						title,
						url,
						replies
					});
				}
			});
			return topics;
		} catch (error) {
			console.error("[RelatedTopics] 解析标签页面失败:", error);
			return [];
		}
	}
	/**
	* 根据标签获取相关主题列表
	*/
	async function fetchRelatedTopics(tag) {
		try {
			return parseTagPageTopics(await crawlTagPage(tag));
		} catch (error) {
			console.error(`[RelatedTopics] 获取标签 "${tag}" 失败:`, error);
			return [];
		}
	}
	/**
	* 渲染相关主题列表到右侧栏
	*/
	function renderRelatedTopics(topics) {
		const $rightbar = $("#Rightbar");
		if ($rightbar.length === 0) return;
		const topicPreview = createTopicPreview();
		const itemsHtml = topics.map((topic) => {
			const previewBtnHtml = topicPreview ? `<button class="v2p-topic-preview-btn" data-topic-id="${topic.id}" data-url="${escapeHTML(topic.url)}" data-title="${escapeHTML(topic.title)}">预览</button>` : "";
			return `
      <div class="cell">
        <div class="item_hot_topic_title">
          <a href="${escapeHTML(topic.url)}" target="_blank">${escapeHTML(topic.title)}</a>
          ${previewBtnHtml}
        </div>
      </div>
    `;
		}).join("");
		const $relatedBox = $(`
    <div class="box">
      <div class="cell">
        <span class="fade">相关主题</span>
      </div>
      ${itemsHtml}
    </div>
  `);
		if (topicPreview) $relatedBox.on("click", ".v2p-topic-preview-btn", function() {
			const $btn = $(this);
			topicPreview.handlePreview({
				topicId: $btn.data("topic-id"),
				topicTitle: $btn.data("title"),
				linkHref: $btn.data("url")
			});
		});
		$rightbar.append($relatedBox);
	}
	/**
	* 处理相关主题推荐功能
	*/
	async function handleRelatedTopics() {
		if (!pathTopicId) {
			console.warn("[RelatedTopics] 无法获取当前主题 ID，跳过相关主题推荐");
			return;
		}
		try {
			const tags = extractTopicTags();
			if (tags.length === 0) {
				console.warn("[RelatedTopics] 当前主题没有标签，跳过相关主题推荐");
				return;
			}
			const topicsArrays = await Promise.all(tags.map(fetchRelatedTopics));
			const seenIds = /* @__PURE__ */ new Set();
			const candidateTopics = [];
			for (const topics of topicsArrays) for (const topic of topics) if (topic.id !== pathTopicId && !seenIds.has(topic.id)) {
				seenIds.add(topic.id);
				candidateTopics.push(topic);
			}
			const finalTopics = candidateTopics.sort((a, b) => b.replies - a.replies).slice(0, MAX_RELATED_TOPICS);
			if (finalTopics.length === 0) {
				console.warn("[RelatedTopics] 未找到相关主题");
				return;
			}
			renderRelatedTopics(finalTopics);
			console.warn(`[RelatedTopics] 成功渲染 ${finalTopics.length} 个相关主题`);
		} catch (error) {
			console.error("[RelatedTopics] 获取相关主题失败:", error);
		}
	}
	var MAX_RELATED_TOPICS, MAX_TAGS, REPLY_COUNT_SELECTOR;
	var init_related_topics = __esmMin((() => {
		init_services();
		init_utils();
		init_globals();
		init_preview();
		MAX_RELATED_TOPICS = 10;
		MAX_TAGS = 3;
		REPLY_COUNT_SELECTOR = ".count_livid, .count_orange";
	}));

//#endregion
//#region src/components/image-upload.ts
	function bindImageUpload(props) {
		const { $wrapper, $input, insertText, replaceText } = props;
		const $uploadBar = $(`<div class="v2p-reply-upload-bar">${uploadTip}</div>`);
		const handleUploadImage = (file) => {
			const placeholder = "[上传图片中...]";
			insertText(` ${placeholder} `);
			$uploadBar.addClass("v2p-reply-upload-bar-disabled").text("正在上传图片...");
			uploadImage(file).then((imgLink) => {
				replaceText(placeholder, imgLink);
			}).catch(() => {
				replaceText(placeholder, "");
				window.alert("❌ 上传图片失败，请打开控制台查看原因");
			}).finally(() => {
				$uploadBar.removeClass("v2p-reply-upload-bar-disabled").text(uploadTip);
			});
		};
		const handleClickUploadImage = () => {
			const imgInput = document.createElement("input");
			imgInput.style.display = "none";
			imgInput.type = "file";
			imgInput.accept = "image/*";
			imgInput.addEventListener("change", () => {
				const selectedFile = imgInput.files?.[0];
				if (selectedFile) handleUploadImage(selectedFile);
			});
			imgInput.click();
		};
		document.addEventListener("paste", (ev) => {
			if (!(ev instanceof ClipboardEvent)) return;
			if ($input && !$input.get(0)?.matches(":focus")) return;
			const items = ev.clipboardData?.items;
			if (!items) return;
			const imageItem = Array.from(items).find((item) => item.type.includes("image"));
			if (imageItem) {
				const file = imageItem.getAsFile();
				if (file) handleUploadImage(file);
			}
		});
		$wrapper.get(0)?.addEventListener("drop", (ev) => {
			ev.preventDefault();
			if (!(ev instanceof DragEvent)) return;
			const file = ev.dataTransfer?.files[0];
			if (file) handleUploadImage(file);
		});
		$(".flex-one-row:last-of-type > .gray").text("");
		$uploadBar.on("click", () => {
			if (!$uploadBar.hasClass("v2p-reply-upload-bar-disabled")) handleClickUploadImage();
		});
		$wrapper.append($uploadBar);
		return { uploadBar: $uploadBar };
	}
	var uploadTip;
	var init_image_upload = __esmMin((() => {
		init_services();
		uploadTip = "选择、粘贴、拖放上传图片。";
	}));

//#endregion
//#region src/contents/topic/reply.ts
	function handleReplyActions() {
		const replyBtnText = `回复<kbd>${getOS() === "macos" ? "⌘" : "Ctrl"}+Enter</kbd>`;
		const $replyBtn = createButton$1({
			children: replyBtnText,
			type: "submit"
		}).replaceAll($replyBox.find("input[type=\"submit\"]"));
		$replyForm.on("submit", () => {
			const replyVal = $replyTextArea.val();
			if (typeof replyVal === "string") $replyTextArea.val(transformEmoji(replyVal));
			$replyBtn.text("提交回复中...").prop("disabled", true);
			setTimeout(() => {
				$replyBtn.html(replyBtnText).prop("disabled", false);
			}, 5e3);
		});
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
				ev.preventDefault();
				$replyForm.trigger("submit");
			}
		});
		{
			const emoticonGroup = $("<div class=\"v2p-emoji-group\">");
			const emoticonList = $("<div class=\"v2p-emoji-list\">");
			const emoticonSpan = $("<span class=\"v2p-emoji\">");
			const groups = emoticons.map((emojiGroup) => {
				const group = emoticonGroup.clone();
				const list = emoticonList.clone();
				group.append(`<div class="v2p-emoji-title">${emojiGroup.title}</div>`);
				list.append(emojiGroup.list.map((emoji) => {
					const emoticon = emoticonSpan.clone();
					if (emojiGroup.title === "流行") {
						const emojiLink = emojiLinks[emoji].hd;
						emoticon.html(`<img src="${emojiLink}" />`).prop("title", emoji);
					} else emoticon.text(emoji);
					emoticon.on("click", () => {
						insertTextToReplyInput(emoji);
					});
					return emoticon;
				}));
				group.append(list);
				return group;
			});
			const emoticonsBox = $("<div class=\"v2p-emoticons-box\">").append(groups);
			const $emojiBtn = createButton$1({ children: "<span style=\"width:18px; height:18px;\"><i data-v2p-icon=\"smile\"></i></span>" }).insertAfter($replyBtn);
			const $emojiContent = $("<div class=\"v2p-emoji-container\">").append(emoticonsBox).appendTo($replyBox).on("click", () => {
				focusReplyInput();
			});
			const keyupHandler = (ev) => {
				if (ev.key === "Escape") {
					ev.preventDefault();
					emojiPopup.close();
				}
			};
			$emojiBtn.on("click", () => {
				focusReplyInput();
			});
			const emojiPopup = createPopup({
				root: $replyBox,
				trigger: $emojiBtn,
				content: $emojiContent,
				options: { placement: "right-end" },
				onOpen: () => {
					$body.on("keydown", keyupHandler);
				},
				onClose: () => {
					$body.off("keydown", keyupHandler);
				}
			});
		}
		$replyBox.find("#undock-button, #undock-button + a").addClass("v2p-hover-btn").css("padding", "5px 4px");
	}
	/**
	* 处理主题回复功能。
	*/
	function handleReply() {
		$replyTextArea.attr("placeholder", "留下对他人有帮助的回复").wrap("<div class=\"v2p-reply-wrap\">");
		const $replyWrap = $(".v2p-reply-wrap");
		const $replyPreview = $("<div class=\"v2p-reply-preview\">");
		$replyPreview.hide().insertAfter($replyWrap);
		bindImageUpload({
			$wrapper: $replyWrap,
			$input: $replyTextArea,
			insertText: (text) => {
				insertTextToReplyInput(text);
			},
			replaceText: (find, replace) => {
				const val = $replyTextArea.val();
				if (typeof val === "string") {
					const newVal = val.replace(find, replace);
					$replyTextArea.val(newVal).trigger("focus");
				}
			}
		});
		{
			const $replyTabs = $("<div class=\"v2p-reply-tabs\">");
			const $replyTabEdit = $("<div class=\"v2p-reply-tab active\">编辑</div>");
			const $replyTabPreview = $("<div class=\"v2p-reply-tab\">预览</div>");
			$replyTabEdit.on("click", () => {
				$replyTabEdit.addClass("active");
				$replyTabPreview.removeClass("active");
				$replyWrap.show();
				$replyPreview.hide();
			}).appendTo($replyTabs);
			let lastPreviewText = null;
			$replyTabPreview.on("click", () => {
				if (!$replyTabPreview.hasClass("active")) {
					$replyTabPreview.addClass("active");
					$replyTabEdit.removeClass("active");
					const replyText = $replyTextArea.val();
					if (typeof replyText === "string") {
						$replyWrap.hide();
						$replyPreview.show();
						if (replyText.trim() === "") $replyPreview.html("没有可预览的内容");
						else {
							const textToPreview = transformEmoji(replyText);
							const handlePreview = async () => {
								$replyPreview.html("正在加载预览...");
								try {
									const renderedContent = await getCommentPreview({
										text: textToPreview,
										syntax: "default"
									});
									$replyPreview.html(renderedContent);
									replaceEmojiWithHD($replyPreview.find(".embedded_image"));
									lastPreviewText = textToPreview;
								} catch {
									$replyPreview.html("预览失败，<a class=\"v2p-preview-retry\">点击重试</a>。");
									$replyPreview.find(".v2p-preview-retry").on("click", () => {
										handlePreview();
									});
								}
							};
							if (replyText !== lastPreviewText) handlePreview();
						}
					}
				}
			}).appendTo($replyTabs);
			$replyBox.find("> .cell:first-of-type > div:first-of-type").replaceWith($replyTabs);
		}
		$(".flex-one-row:last-of-type > .gray").text("");
		handleReplyActions();
	}
	var init_reply = __esmMin((() => {
		init_button();
		init_floating_popup();
		init_image_upload();
		init_constants();
		init_services();
		init_utils();
		init_globals();
		init_helpers();
	}));

//#endregion
//#region src/contents/topic/tool.ts
/**
	* 右侧用户信息卡片中的工具栏。
	*/
	function handleTools() {
		const options = getStorageSync()["options"];
		const $tools = $(`
    <div class="cell v2p-tools">
      <span class="v2p-tool v2p-hover-btn v2p-tool-reply">
        <span class="v2p-tool-icon"><i data-v2p-icon="message-square-plus"></i></span>回复主题
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-reading">
        <span class="v2p-tool-icon"><i data-v2p-icon="book-open-check"></i></span>稍后阅读
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-scroll-top">
        <span class="v2p-tool-icon"><i data-v2p-icon="chevrons-up"></i></span>回到顶部
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-more">
        <span class="v2p-tool-icon"><i data-v2p-icon="package-plus"></i></span>更多功能
      </span>
    </div>
  `);
		$tools.find(".v2p-tool-reply").on("click", () => {
			$replyTextArea.trigger("focus");
		});
		$tools.find(".v2p-tool-reading").on("click", () => {
			addToReadingList({
				url: window.location.href,
				title: document.title.replace(" - V2EX", ""),
				content: String($("head meta[property=\"og:description\"]").prop("content"))
			});
		});
		$tools.find(".v2p-tool-scroll-top").on("click", () => {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		});
		{
			const $moreTool = $tools.find(".v2p-tool-more");
			const $toolContent = $(`
      <div class="v2p-select-dropdown">
        <div class="v2p-select-item v2p-reply-tool-share">生成分享图片</div>
        <div class="v2p-select-divider"></div>
        <div class="v2p-select-item v2p-reply-tool-decode">解析本页 Base64</div>
        <div class="v2p-select-item v2p-reply-tool-encode">文本转 Base64</div>
      </div>
    `);
			const toolsPopup = createPopup({
				root: $replyBox,
				trigger: $moreTool,
				content: $toolContent,
				offsetOptions: {
					mainAxis: 5,
					crossAxis: -5
				}
			});
			$toolContent.find(".v2p-reply-tool-decode").on("click", () => {
				decodeBase64TopicPage();
			});
			$toolContent.find(".v2p-reply-tool-encode").on("click", () => {
				focusReplyInput();
				setTimeout(() => {
					const inputText = window.prompt("输入要加密的字符串，完成后将填写到回复框中：");
					if (inputText) {
						let encodedText;
						try {
							encodedText = encodeUtf8AsBase64(inputText);
						} catch (err) {
							const errorTip = "该文本无法编码为 Base64";
							console.error(err, `${errorTip}，可能的错误原因：文本包含中文。`);
							createToast({ message: errorTip });
						}
						if (encodedText) insertTextToReplyInput(encodedText);
					}
				});
			});
			$toolContent.find(".v2p-reply-tool-share").on("click", () => {
				if (pathTopicId) window.open(`${"https://v2p.leoku.dev"}/share/${pathTopicId}`, "_blank");
			});
			if (options.nestedReply.display === "indent" && !!options.replyContent.hideRefName) {
				let isHidden = options.replyContent.hideRefName;
				const $toolToggleDisplay = $("<div class=\"v2p-select-item\">显示 @ 用户名</div>");
				$toolToggleDisplay.on("click", () => {
					if (isHidden) {
						isHidden = false;
						$toolToggleDisplay.text("隐藏 @ 用户名");
						$(".v2p-member-ref").addClass("v2p-member-ref-show");
					} else {
						isHidden = true;
						$toolToggleDisplay.text("显示 @ 用户名");
						$(".v2p-member-ref").removeClass("v2p-member-ref-show");
					}
				});
				$toolContent.prepend($toolToggleDisplay);
			}
			const $toolToggleLayout = $(`
      <div class="v2p-select-item v2p-reply-tool-layout">
        ${options.reply.layout === "horizontal" ? "切换为垂直布局" : "切换为水平布局"}
      </div>
      `);
			$toolToggleLayout.on("click", () => {
				toggleTopicLayout();
			});
			$toolContent.prepend($toolToggleLayout);
			$toolContent.find(".v2p-select-item").on("click", () => {
				toolsPopup.close();
			});
		}
		$infoCard.addClass("v2p-tool-box").append($tools);
		loadIcons($tools[0]);
	}
	var init_tool = __esmMin((() => {
		init_floating_popup();
		init_toast();
		init_utils();
		init_globals();
		init_helpers();
		init_layout();
	}));

//#endregion
//#region src/contents/topic/index.ts
	var topic_exports = /* @__PURE__ */ __exportAll({});
	var init_topic = __esmMin((() => {
		init_utils();
		init_globals();
		init_helpers();
		init_reply_dom();
		init_comment();
		init_content();
		init_layout();
		init_paging();
		init_related_topics();
		init_reply();
		init_tool();
		(async () => {
			const options = (await getStorage())["options"];
			if (!isMobileView()) {
				$body.css("min-width", "450px");
				$(".content").css("min-width", "450px");
			}
			handleLayout();
			if (options.topic?.openMode !== "default") {
				$topicHeader.find("a[href^=\"/member/\"]").prop("target", "_blank");
				$commentTableRows.each((_, row) => {
					const authorLink = getReplyAuthorLinkFromRow(row);
					if (authorLink) $(authorLink).prop("target", "_blank");
				});
			}
			handleTools();
			$(document).on("keydown", (ev) => {
				if (!ev.isDefaultPrevented()) {
					if (ev.key === "Escape") {
						const $replyContent = $("#reply_content");
						if ($replyBox.hasClass("reply-box-sticky")) {
							$replyBox.removeClass("reply-box-sticky");
							$("#undock-button").css("display", "none");
						}
						$replyContent.trigger("blur");
					}
				}
			});
			handleContent();
			if (document.referrer !== "") {
				if (document.referrer.includes(document.location.pathname)) {
					const page = new URL(document.location.href).searchParams.get("p");
					if (page && page !== "1") document.querySelector(".topic_buttons")?.scrollIntoView({ behavior: "smooth" });
				}
			}
			handlePaging();
			await handleComments();
			handleReply();
			loadIcons();
			handleRelatedTopics();
			if ($topicHeader.find("a[href^=\"/go\"]").attr("href")?.endsWith("/flamewar")) $("#node_sidebar").addClass("v2p-node-sidebar-flamewar");
		})();
	}));

//#endregion
//#region src/contents/write/write.ts
	function handleWrite() {
		bindImageUpload({
			$wrapper: $("#workspace"),
			insertText: (text) => {
				postTask(`editor.getDoc().replaceRange("${text}", editor.getCursor())`);
			},
			replaceText: (find, replace) => {
				if (replace) {
					if ($("input[name=syntax]:checked").val() === "markdown") replace = `![](${replace})`;
				}
				postTask(`
      editor.setValue(editor.getValue().replace("${find}", "${replace}"));
      const doc = editor.getDoc(); 
      const lastLine = doc.lastLine(); 
      const lastChar = doc.getLine(lastLine).length; 
      doc.setCursor({ line: doc.lastLine(), ch: lastChar });
      `);
			}
		});
	}
	var init_write$1 = __esmMin((() => {
		init_image_upload();
		init_post_task();
	}));

//#endregion
//#region src/contents/write/index.ts
	var write_exports = /* @__PURE__ */ __exportAll({});
	var init_write = __esmMin((() => {
		init_helpers();
		init_write$1();
		handleWrite();
		loadIcons();
	}));

//#endregion
//#region src/contents/member/topic-list.ts
	function handleTopicList(params) {
		const { isOwner } = params;
		const isPreviewMode = getStorageSync()["options"].topic?.openMode === "preview";
		const { handlePreview } = createTopicPreview();
		const $previewBtn = $("<button class=\"v2p-topic-preview-btn\">预览</button>");
		const $ignoreBtn = $("<span class=\"v2p-topic-ignore-btn\">屏蔽</span>");
		const $topicActions = $("<span class=\"v2p-topic-actions\" />");
		$topicList.each((_, topicItem) => {
			const $topicItem = $(topicItem);
			const $itemTitle = $topicItem.find(".item_title");
			const $topicInfo = $topicItem.find(".topic_info");
			const topicTitle = $itemTitle.find(".topic-link").text();
			const linkHref = $topicItem.find(".topic-link").attr("href");
			const topicId = (linkHref?.match(/\/t\/(\d+)/))?.at(1);
			const $lastChild = $topicInfo.find("> span:first-of-type");
			const $clonedTopicActions = $topicActions.clone();
			$clonedTopicActions.insertAfter($lastChild);
			if (isPreviewMode) $itemTitle.find(".topic-link").on("click", (ev) => {
				ev.preventDefault();
				handlePreview({
					topicId,
					topicTitle,
					linkHref
				});
			});
			if (!isOwner) $ignoreBtn.clone().on("click", () => {
				if (confirm(`确定屏蔽主题 ⌈${topicTitle}⌋？`)) {
					if (typeof topicId === "string") (async () => {
						const toast = createToast({
							message: `正在屏蔽主题 ⌈${topicTitle}⌋`,
							duration: 0
						});
						try {
							await ignoreTopic(topicId);
							createToast({ message: "✅ 已屏蔽" });
						} catch (err) {
							createToast({ message: err instanceof Error ? `❌ ${err.message}` : "❌ 屏蔽失败，请稍后重试" });
						} finally {
							toast.clear();
						}
					})();
				}
			}).appendTo($clonedTopicActions);
			$previewBtn.clone().on("click", () => {
				handlePreview({
					topicId,
					topicTitle,
					linkHref
				});
			}).appendTo($clonedTopicActions);
		});
	}
	var init_topic_list = __esmMin((() => {
		init_toast();
		init_services();
		init_utils();
		init_globals();
		init_preview();
	}));

//#endregion
//#region src/contents/member/index.ts
	var member_exports = /* @__PURE__ */ __exportAll({});
	var init_member = __esmMin((() => {
		init_button();
		init_services();
		init_utils();
		init_globals();
		init_helpers();
		init_content();
		init_topic_list();
		(async () => {
			const storage = await getStorage();
			const $memberName = $("#Main h1").addClass("v2p-member-name");
			const memberName = $memberName.text();
			const isOwner = memberName === loginName;
			if (!isOwner) {
				const memberAvatar = $(".avatar").prop("src");
				const tagData = storage["member-tag"];
				const $tagBlock = $("<div class=\"v2p-tag-block\">");
				let $addTagBtn;
				const callbacks = {
					onRemoveExistingTagBlock: () => {
						insertAddBtn();
					},
					onInsertNewTagBlock: ({ $tags }) => {
						$tagBlock.append($tags);
						$addTagBtn?.remove();
					}
				};
				const insertAddBtn = () => {
					$addTagBtn = createButton$1({ children: "添加用户标签" }).on("click", () => {
						openTagsSetter({
							memberName,
							memberAvatar,
							...callbacks
						});
					}).appendTo($tagBlock);
				};
				if (tagData && Reflect.has(tagData, memberName)) {
					const tags = tagData[memberName].tags;
					const tagsText = tags ? getTagsText(tags) : void 0;
					if (tagsText) {
						const $tags = $(`<div class="v2p-reply-tags v2p-tags-${escapeHTML(memberName)}" style="margin-right: 5px;" title="${escapeHTML(tagsText)}"><b>#</b>&nbsp;${escapeHTML(tagsText)}</div>`);
						$tags.on("click", () => {
							openTagsSetter({
								memberName,
								memberAvatar,
								...callbacks
							});
						});
						$tagBlock.append($tags);
					} else insertAddBtn();
				} else insertAddBtn();
				$tagBlock.insertAfter($memberName);
			}
			handleTopicList({ isOwner });
			fetchUserInfo(memberName).then((memberData) => {
				const registerDays = getRegisterDays(memberData.created);
				if (registerDays <= 30) $memberName.append(`<span class="v2p-register-days v2p-register-days-large">${registerDays <= 15 ? "15" : "30"} 天内注册</span>`);
			});
			window.requestIdleCallback(() => {
				replaceCommentEmojiWithHD($("#Main .box .inner"));
			});
		})();
	}));

//#endregion
//#region src/contents/settings/index.ts
	var settings_exports = /* @__PURE__ */ __exportAll({});
	var $settingsHeader, $settingsIcon, $settingsTitle, $openSettingsBtn, $actionsArea;
	var init_settings = __esmMin((() => {
		init_button();
		init_helpers();
		$settingsHeader = $(".page-content-header");
		$settingsIcon = $settingsHeader.find("> img[src^=\"/static/img\"]");
		$settingsTitle = $settingsHeader.find("> h2");
		$settingsHeader.addClass("v2p-settings-header");
		$settingsIcon.addClass("v2p-settings-icon");
		$settingsTitle.addClass("v2p-settings-title");
		$openSettingsBtn = createButton$1({ children: "更改 V2EX Polish 设置" });
		$openSettingsBtn.on("click", () => {
			openV2PSettings();
		});
		$actionsArea = $("<div class=\"v2p-settings-actions\" />");
		$actionsArea.append($openSettingsBtn);
		$settingsHeader.append($actionsArea);
	}));

//#endregion
//#region src/contents/notifications/index.ts
	var notifications_exports = /* @__PURE__ */ __exportAll({});
	var init_notifications = __esmMin((() => {
		init_helpers();
		replaceCommentEmojiWithHD($("#notifications").find(".cell[id^=\"n_\"]"));
	}));

//#endregion
//#region src/background/check-in-page-fetch.ts
	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	function isTrustedTab(tab) {
		if (!tab.url) return false;
		try {
			return trustedHosts.has(new URL(tab.url).hostname);
		} catch {
			return false;
		}
	}
	function isUsableTab(tab) {
		return tab.id !== void 0 && !tab.discarded && isTrustedTab(tab);
	}
	/** 签到页的标签页优先，其次是其他 V2EX 页面。 */
	function getTabPriority(tab) {
		return tab.url?.includes("/mission/daily") ? 0 : 1;
	}
	function isCheckInPageFetchResponse(value) {
		if (typeof value !== "object" || value === null) return false;
		const result = value;
		if (result.ok === true) return typeof result.response === "object" && result.response !== null;
		return result.ok === false && typeof result.message === "string";
	}
	/** 页面还没加载完时，消息会因为「接收方不存在」而失败。 */
	function isNoReceiverError(error) {
		return error instanceof Error && /Receiving end does not exist|Could not establish connection/i.test(error.message);
	}
	/** 标签页是否仍然存在（用户可能在中途手动关闭）。 */
	async function doesTabExist(tabId) {
		try {
			await chrome.tabs.get(tabId);
			return true;
		} catch {
			return false;
		}
	}
	async function withTimeout(promise, ms) {
		let timeoutId;
		const timeout = new Promise((resolve) => {
			timeoutId = setTimeout(() => resolve(void 0), ms);
		});
		try {
			return await Promise.race([promise, timeout]);
		} finally {
			clearTimeout(timeoutId);
		}
	}
	/**
	* 打开一次签到使用的页面请求通道。
	*
	* 只复用已打开的正式站点标签页；没有可用标签页时返回 undefined，
	* 由调用方先走后台请求，确认不了结果再调用 `openCheckInTemporaryTabSession`。
	*/
	async function openCheckInPageSession() {
		if (typeof chrome === "undefined" || !chrome.tabs?.query) return;
		let tabs;
		try {
			tabs = await chrome.tabs.query({});
		} catch {
			return;
		}
		const candidates = tabs.filter(isUsableTab).sort((a, b) => {
			return getTabPriority(a) - getTabPriority(b);
		});
		if (candidates.length === 0) return;
		return createExistingTabSession(candidates);
	}
	/**
	* 把发送结果转换为页面请求结果。
	*
	* 返回 undefined 表示消息未送达，可以换标签页或回退后台请求；
	* 已送达但没有结果时返回超时失败，避免重复提交。
	*/
	function toPageFetchResponse(result) {
		if (result.kind === "response") return result.value;
		if (result.kind === "no-response") return {
			ok: false,
			code: "timeout",
			message: "页面未响应签到请求"
		};
	}
	/**
	* 复用已打开的标签页。
	*
	* 一个标签页没送达就换下一个；一旦送达但没有结果，直接按失败处理，
	* 避免同一个领取请求被重复提交。
	*/
	function createExistingTabSession(tabs) {
		return {
			async fetch(path) {
				for (const tab of tabs) {
					const response = toPageFetchResponse(await sendFetchMessage(tab.id, path, false));
					if (response) return response;
				}
			},
			async close() {}
		};
	}
	/**
	* 临时打开一个后台标签页作为最后的兜底通道，签到结束后关闭。
	*
	* 只在没有可用标签页、且后台请求无法确认领取结果时使用，尽量减少可见打扰。
	*/
	async function openCheckInTemporaryTabSession() {
		if (typeof chrome === "undefined" || !chrome.tabs?.create) return;
		let tabId;
		try {
			tabId = (await chrome.tabs.create({
				url: missionUrl,
				active: false
			})).id;
		} catch {
			return;
		}
		if (tabId === void 0) return;
		const openedTabId = tabId;
		return {
			async fetch(path) {
				return toPageFetchResponse(await sendFetchMessage(openedTabId, path, true)) ?? {
					ok: false,
					code: "network",
					message: "签到页未就绪"
				};
			},
			async close() {
				try {
					if (!(await chrome.tabs.get(openedTabId)).active) await chrome.tabs.remove(openedTabId);
				} catch {}
			}
		};
	}
	/** 向单个标签页发消息；页面未就绪时可等待注册完成后重试。 */
	async function sendFetchMessage(tabId, path, waitForReady) {
		const deadline = Date.now() + (waitForReady ? tabReadyTimeout : 0);
		while (true) {
			let response;
			try {
				response = await withTimeout(chrome.tabs.sendMessage(tabId, { ["checkInPageFetch"]: { path } }), pageFetchTimeout);
			} catch (error) {
				if (!isNoReceiverError(error)) return { kind: "no-response" };
				if (!waitForReady || Date.now() >= deadline) return { kind: "unavailable" };
				if (!await doesTabExist(tabId)) return { kind: "unavailable" };
				await delay(tabReadyRetryDelay);
				continue;
			}
			if (response === void 0) return { kind: "no-response" };
			return isCheckInPageFetchResponse(response) ? {
				kind: "response",
				value: response
			} : { kind: "no-response" };
		}
	}
	var pageFetchTimeout, tabReadyTimeout, tabReadyRetryDelay, missionUrl, trustedHosts;
	var init_check_in_page_fetch$1 = __esmMin((() => {
		pageFetchTimeout = 2e4;
		tabReadyTimeout = 15e3;
		tabReadyRetryDelay = 300;
		missionUrl = `${"https://www.v2ex.com"}/mission/daily`;
		trustedHosts = /* @__PURE__ */ new Set(["v2ex.com", "www.v2ex.com"]);
	}));

//#endregion
//#region src/background/check-in-scheduler.ts
	function isFailureResult(result) {
		return result.status === "failed" && result.code !== void 0;
	}
	function getDelay(delays, failureCount) {
		return delays[Math.min(Math.max(failureCount - 1, 0), delays.length - 1)];
	}
	function createTargetAt(now, jitterMs) {
		const normalizedJitter = Math.max(0, Math.min(Number.isFinite(jitterMs) ? jitterMs : 0, CHECK_IN_TARGET_JITTER_MAX_MS));
		return getUtcDayStart(now) + CHECK_IN_TARGET_GRACE_MS + normalizedJitter;
	}
	function isValidTimestamp(value) {
		return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= MAX_JAVASCRIPT_TIMESTAMP;
	}
	function normalizeDayKey(value) {
		return typeof value === "string" && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value) ? value : void 0;
	}
	function sanitizeDailyInfo(state) {
		let next = state;
		for (const field of TIMESTAMP_FIELDS) {
			const value = state[field];
			if (value !== void 0 && !isValidTimestamp(value)) next = {
				...next,
				[field]: void 0
			};
		}
		const memberName = normalizeMemberName(state.memberName);
		if (state.memberName !== void 0 && state.memberName !== memberName) next = {
			...next,
			memberName
		};
		const lastCheckInDay = normalizeDayKey(state.lastCheckInDay);
		if (state.lastCheckInDay !== lastCheckInDay) next = {
			...next,
			lastCheckInDay
		};
		if (next.retryCause === "challenge") next = {
			...next,
			nudgeEligibleAt: void 0
		};
		return next;
	}
	/** 规范化 V2EX 用户名；空值表示当前页面没有可用的账号身份。 */
	function normalizeMemberName(value) {
		if (typeof value !== "string") return;
		return value.trim() || void 0;
	}
	/**
	* 判断两份签到状态是否语义相同。
	*
	* storage 序列化可能省略值为 undefined 的字段，因此这里按字段并集比较，
	* 不能依赖对象引用、字段数量或序列化后的文本。
	*/
	function isSameCheckInState(left, right) {
		if (left === right) return true;
		if (!left || !right) return false;
		const keys = /* @__PURE__ */ new Set([...Object.keys(left), ...Object.keys(right)]);
		for (const key of keys) if (left[key] !== right[key]) return false;
		return true;
	}
	/** 判断持久化状态是否明确属于某个 V2EX 用户。 */
	function isCheckInStateForMember(state, memberName) {
		const normalizedMemberName = normalizeMemberName(memberName);
		return !!normalizedMemberName && state?.schemaVersion === 3 && state.memberName === normalizedMemberName;
	}
	/** 判断异步签到结果是否仍可写回发起请求时的账号。 */
	function isCheckInAttemptStillCurrent(params) {
		const { startedAccountRevision, currentAccountRevision, startedState, latestState } = params;
		if (startedAccountRevision !== currentAccountRevision) return false;
		const startedMemberName = normalizeMemberName(startedState.memberName);
		return startedMemberName ? isCheckInStateForMember(latestState, startedMemberName) : !normalizeMemberName(latestState?.memberName);
	}
	function createScheduledState(memberName, now, jitterMs) {
		const targetAt = createTargetAt(now, jitterMs);
		return {
			schemaVersion: 3,
			...memberName ? { memberName } : {},
			rewardDay: getUtcDayKey(now),
			phase: "scheduled",
			targetAt,
			nextActionAt: targetAt,
			attemptCount: 0,
			failureCount: 0
		};
	}
	function isReusableCurrentDayState(state, now, rewardDay, checkedInDay) {
		if (state.rewardDay !== rewardDay) return false;
		const dayStart = getUtcDayStart(now);
		const dayEnd = dayStart + DAY_MS;
		function isWithinDay(value) {
			return value >= dayStart && value <= dayEnd;
		}
		if (state.nudgeEligibleAt !== void 0 && !isWithinDay(state.nudgeEligibleAt)) return false;
		switch (state.phase) {
			case "scheduled": {
				const { targetAt, nextActionAt } = state;
				if (targetAt === void 0 || nextActionAt === void 0) return false;
				return targetAt >= dayStart + CHECK_IN_TARGET_GRACE_MS && isWithinDay(targetAt) && isWithinDay(nextActionAt);
			}
			case "needs-action": return true;
			case "succeeded": return checkedInDay === rewardDay;
			default: return false;
		}
	}
	function getCheckedInDay(state) {
		if (state.lastCheckInDay) return state.lastCheckInDay;
		return state.lastCheckInTime ? getUtcDayKey(state.lastCheckInTime) : void 0;
	}
	/** 为账号切换创建一个不带旧账号历史的全新状态。 */
	function createCheckInStateForMember(memberName, now, jitterMs = Math.random() * CHECK_IN_TARGET_JITTER_MAX_MS) {
		const normalizedMemberName = normalizeMemberName(memberName);
		if (!normalizedMemberName) throw new Error("无法创建缺少用户名的签到状态");
		return createScheduledState(normalizedMemberName, now, jitterMs);
	}
	/**
	* 将旧版 DailyInfo 或新状态归一化为当前 UTC 奖励日的状态。
	*/
	function normalizeCheckInState(previous, now, jitterMs = Math.random() * CHECK_IN_TARGET_JITTER_MAX_MS) {
		const rewardDay = getUtcDayKey(now);
		if (previous?.schemaVersion !== 3) return createScheduledState(void 0, now, jitterMs);
		const sanitized = sanitizeDailyInfo(previous);
		const memberName = normalizeMemberName(sanitized.memberName);
		const checkedInDay = getCheckedInDay(sanitized);
		const reusableCurrentState = isReusableCurrentDayState(sanitized, now, rewardDay, checkedInDay);
		if (!memberName) return reusableCurrentState ? sanitized : createScheduledState(void 0, now, jitterMs);
		if (checkedInDay === rewardDay) {
			if (sanitized.rewardDay === rewardDay && sanitized.phase === "succeeded") return sanitized;
			return {
				...sanitized,
				schemaVersion: 3,
				rewardDay,
				phase: "succeeded",
				failureCount: 0,
				nextActionAt: void 0,
				nudgeEligibleAt: void 0,
				retryCause: void 0,
				userMessage: void 0
			};
		}
		if (reusableCurrentState) return sanitized;
		const targetAt = createTargetAt(now, jitterMs);
		const state = {
			...sanitized,
			schemaVersion: 3,
			rewardDay,
			phase: "scheduled",
			targetAt,
			nextActionAt: targetAt,
			nudgeEligibleAt: void 0,
			attemptCount: 0,
			failureCount: 0,
			retryCause: void 0,
			userMessage: void 0
		};
		if (sanitized.lastResult === "failed" && sanitized.lastAttemptTime && getUtcDayKey(sanitized.lastAttemptTime) === rewardDay) {
			const failureCount = Math.max(sanitized.failureCount ?? 1, 1);
			const plan = getFailurePlan(sanitized.lastErrorCode ?? "unknown", sanitized.lastHttpStatus, failureCount, void 0);
			const dayEnd = getUtcDayStart(now) + DAY_MS;
			state.failureCount = failureCount;
			state.retryCause = plan.cause;
			state.userMessage = plan.userMessage;
			if (plan.needsAction) {
				state.phase = "needs-action";
				state.nextActionAt = void 0;
			} else state.nextActionAt = Math.min(sanitized.lastAttemptTime + (plan.delayMs ?? 3e5), dayEnd);
			if (plan.cause !== "challenge" && (plan.cause === "transient" || plan.needsAction)) state.nudgeEligibleAt = Math.min(sanitized.lastAttemptTime + CHECK_IN_NUDGE_INTERVAL_MS, dayEnd);
		}
		return state;
	}
	/**
	* 由唯一调度入口判断当前触发是否应该执行签到。
	*/
	function getCheckInScheduleDecision(params) {
		const { now, state, autoCheckInEnabled, trigger, force = false } = params;
		if (state.phase === "succeeded" && state.schemaVersion === 3 && normalizeMemberName(state.memberName)) return {
			action: "skip",
			reason: "今日已签到",
			state
		};
		if (!autoCheckInEnabled && !force) return {
			action: "skip",
			reason: "自动签到已关闭",
			state
		};
		if (force) return {
			action: "run",
			force: true,
			state
		};
		if (!normalizeMemberName(state.memberName)) return {
			action: "skip",
			reason: "账号签到状态待确认",
			state
		};
		if (state.phase === "needs-action") return NUDGE_TRIGGERS.has(trigger) && state.nudgeEligibleAt !== void 0 && now >= state.nudgeEligibleAt ? {
			action: "run",
			force: false,
			state
		} : {
			action: "skip",
			reason: state.userMessage ?? "需要先处理签到异常",
			state
		};
		if (state.nextActionAt !== void 0 && now >= state.nextActionAt) return {
			action: "run",
			force: false,
			state
		};
		if (NUDGE_TRIGGERS.has(trigger) && state.nudgeEligibleAt !== void 0 && now >= state.nudgeEligibleAt && state.retryCause === "transient") return {
			action: "run",
			force: false,
			state
		};
		return {
			action: "skip",
			reason: "尚未到下次签到时间",
			state
		};
	}
	function getFailurePlan(code, httpStatus, failureCount, retryAfterMs) {
		if (code === "network" || code === "timeout") return {
			cause: "transient",
			delayMs: getDelay(NETWORK_RETRY_DELAYS, failureCount)
		};
		if (code === "unauthenticated") return {
			cause: "authentication",
			needsAction: true,
			userMessage: "登录状态已失效，请登录 V2EX 后重试"
		};
		if (code === "challenge") return {
			cause: "challenge",
			needsAction: true,
			userMessage: CHECK_IN_CHALLENGE_COPY.message
		};
		if (httpStatus === 429) return {
			cause: "rate-limited",
			delayMs: retryAfterMs ?? 36e5
		};
		if (httpStatus === 403) {
			if (failureCount >= 2) return {
				cause: "forbidden",
				needsAction: true,
				userMessage: "V2EX 拒绝了请求，请检查风控状态后重试"
			};
			return {
				cause: "forbidden",
				delayMs: 36e5
			};
		}
		if (httpStatus === 408 || httpStatus !== void 0 && httpStatus >= 500) return {
			cause: "server",
			delayMs: getDelay(SERVER_RETRY_DELAYS, failureCount)
		};
		if (code === "unexpected-page") {
			if (failureCount >= 2) return {
				cause: "unexpected-page",
				needsAction: true,
				userMessage: "签到页面连续无法识别，请打开签到页核对"
			};
			return {
				cause: "unexpected-page",
				delayMs: getDelay(UNEXPECTED_PAGE_RETRY_DELAYS, failureCount)
			};
		}
		if (code === "redeem-failed") {
			if (failureCount >= 2) return {
				cause: "ambiguous",
				needsAction: true,
				userMessage: "无法确认领取结果，请打开签到页核对"
			};
			return {
				cause: "ambiguous",
				delayMs: getDelay(AMBIGUOUS_RETRY_DELAYS, failureCount)
			};
		}
		return {
			cause: code === "http" ? "server" : "unknown",
			delayMs: code === "http" ? getDelay(SERVER_RETRY_DELAYS, failureCount) : getDelay(UNKNOWN_RETRY_DELAYS, failureCount)
		};
	}
	/**
	* 根据一次真实请求的结果生成下一份持久化签到状态。
	*/
	function buildDailyInfoAfterAttempt({ previous, result, attemptTime, finishedAt, trigger, jitterMs }) {
		const state = { ...normalizeCheckInState(previous, attemptTime, jitterMs) };
		state.lastAttemptTime = attemptTime;
		state.lastFinishedAt = finishedAt;
		state.lastResult = result.status === "skipped" ? state.lastResult : result.status;
		state.lastTrigger = trigger;
		state.attemptCount = (state.attemptCount ?? 0) + 1;
		state.lastHttpStatus = result.httpStatus;
		state.lastFinalUrlPath = result.finalUrlPath;
		state.lastDurationMs = result.durationMs ?? Math.max(0, finishedAt - attemptTime);
		if (result.status === "success" || result.status === "already") {
			const checkInTime = Math.max(state.lastCheckInTime ?? 0, attemptTime);
			state.lastCheckInTime = checkInTime;
			state.lastCheckInDay = getUtcDayKey(checkInTime);
			state.checkInDays = result.checkInDays ?? state.checkInDays;
			state.phase = "succeeded";
			state.failureCount = 0;
			state.lastError = void 0;
			state.lastErrorCode = void 0;
			state.lastErrorStage = void 0;
			state.nextActionAt = void 0;
			state.nudgeEligibleAt = void 0;
			state.retryCause = void 0;
			state.userMessage = void 0;
			return state;
		}
		if (!isFailureResult(result)) return state;
		const failureCount = (state.failureCount ?? 0) + 1;
		const plan = getFailurePlan(result.code, result.httpStatus, failureCount, result.retryAfterMs);
		const dayEnd = getUtcDayStart(finishedAt) + DAY_MS;
		state.failureCount = failureCount;
		state.lastError = result.reason;
		state.lastErrorCode = result.code;
		state.lastErrorStage = result.stage;
		state.retryCause = plan.cause;
		state.userMessage = plan.userMessage;
		if (plan.needsAction) {
			state.phase = "needs-action";
			state.nextActionAt = void 0;
		} else {
			state.phase = "scheduled";
			state.nextActionAt = Math.min(finishedAt + (plan.delayMs ?? 3e5), dayEnd);
		}
		state.nudgeEligibleAt = plan.cause !== "challenge" && (plan.cause === "transient" || plan.needsAction) ? Math.min(finishedAt + CHECK_IN_NUDGE_INTERVAL_MS, dayEnd) : void 0;
		return state;
	}
	var DAY_MS, MAX_JAVASCRIPT_TIMESTAMP, CHECK_IN_TARGET_GRACE_MS, CHECK_IN_TARGET_JITTER_MAX_MS, CHECK_IN_NUDGE_INTERVAL_MS, CHECK_IN_STATE_SCHEMA_VERSION, NETWORK_RETRY_DELAYS, SERVER_RETRY_DELAYS, UNEXPECTED_PAGE_RETRY_DELAYS, AMBIGUOUS_RETRY_DELAYS, UNKNOWN_RETRY_DELAYS, NUDGE_TRIGGERS, TIMESTAMP_FIELDS;
	var init_check_in_scheduler = __esmMin((() => {
		init_check_in_utils();
		DAY_MS = 864e5;
		MAX_JAVASCRIPT_TIMESTAMP = 864e13;
		CHECK_IN_TARGET_GRACE_MS = REWARD_RESET_GRACE_MS;
		CHECK_IN_TARGET_JITTER_MAX_MS = 18e4;
		CHECK_IN_NUDGE_INTERVAL_MS = 6e4;
		CHECK_IN_STATE_SCHEMA_VERSION = 3;
		NETWORK_RETRY_DELAYS = [
			6e4,
			3e5,
			9e5,
			18e5
		];
		SERVER_RETRY_DELAYS = [
			3e5,
			9e5,
			18e5,
			36e5
		];
		UNEXPECTED_PAGE_RETRY_DELAYS = [3e5, 9e5];
		AMBIGUOUS_RETRY_DELAYS = [12e4, 6e5];
		UNKNOWN_RETRY_DELAYS = [
			3e5,
			9e5,
			18e5
		];
		NUDGE_TRIGGERS = /* @__PURE__ */ new Set([
			"refresh",
			"online",
			"popup"
		]);
		TIMESTAMP_FIELDS = [
			"targetAt",
			"nextActionAt",
			"nudgeEligibleAt",
			"lastFinishedAt",
			"lastCheckInTime",
			"lastAttemptTime"
		];
	}));

//#endregion
//#region src/background/daily-check-in.ts
/** 后台直接请求签到接口，没有可用的页面上下文时使用。 */
	async function fetchCheckInDirect(path) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), checkInTimeout);
		try {
			const res = await fetch(`${"https://www.v2ex.com"}${path}`, {
				headers: { Referer: `${"https://www.v2ex.com"}/mission/daily` },
				credentials: "include",
				cache: "no-store",
				signal: controller.signal
			});
			return {
				status: res.status,
				finalUrl: res.url,
				text: await res.text(),
				retryAfter: res.headers.get("retry-after"),
				challenge: res.headers.get("cf-mitigated")?.toLowerCase() === "challenge"
			};
		} finally {
			clearTimeout(timeoutId);
		}
	}
	/**
	* 请求签到接口。
	*
	* 浏览器扩展优先通过页面会话通道发送请求，让领取凭证与页面会话保持一致；
	* 页面通道不可用时回退到后台请求。
	*/
	async function requestCheckInResource(path, session) {
		if (session) {
			const pageResult = await session.fetch(path);
			if (pageResult) return pageResult;
		}
		try {
			return {
				ok: true,
				response: await fetchCheckInDirect(path)
			};
		} catch (error) {
			const { code, message } = getErrorInfo(error);
			return {
				ok: false,
				code: code === "timeout" ? "timeout" : "network",
				message
			};
		}
	}
	function getErrorInfo(error) {
		if (error instanceof Error) return error.name === "AbortError" ? {
			code: "timeout",
			message: "请求超时"
		} : {
			code: "network",
			message: error.message
		};
		return {
			code: "unknown",
			message: "未知错误"
		};
	}
	function createUnknownCheckInFailure(error) {
		const { message } = getErrorInfo(error);
		return {
			status: "failed",
			code: "unknown",
			reason: `签到失败：${message}`
		};
	}
	/** 提取响应最终地址的路径，避免把查询串（可能含 once 凭证）写入存储。 */
	function getUrlPath(url) {
		try {
			return new URL(url).pathname;
		} catch {
			return;
		}
	}
	/** 根据 HTTP 状态码补充失败说明。 */
	function describeHttpFailure(status) {
		if (status === 429) return "请求过于频繁，已被 V2EX 限流";
		if (status === 403) return "请求被拒绝，可能触发了风控";
		if (status >= 500) return "V2EX 服务器异常";
		return "请求失败";
	}
	/** 从响应中提取可写入状态机的元数据。 */
	function createResponseMeta(response) {
		return {
			httpStatus: response.status,
			finalUrlPath: getUrlPath(response.finalUrl),
			retryAfterMs: response.status === 429 ? parseRetryAfter(response.retryAfter) : void 0
		};
	}
	/** 判断响应是否成功。 */
	function isSuccessfulStatus(status) {
		return status >= 200 && status < 300;
	}
	/** 构造结构一致的失败结果，避免各分支重复拼装字段。 */
	function fail(code, stage, reason, meta) {
		return {
			status: "failed",
			code,
			stage,
			reason,
			...meta
		};
	}
	/**
	* 解析 Retry-After，并将不可用或过大的值交给后续策略回退到默认等待时间。
	*/
	function parseRetryAfter(value, now = Date.now()) {
		if (!value) return;
		const seconds = Number(value);
		const delayMs = Number.isFinite(seconds) ? seconds * 1e3 : Date.parse(value) - now;
		if (!Number.isFinite(delayMs) || delayMs < 6e4 || delayMs > 864e5) return;
		return delayMs;
	}
	/** 请求签到页并读取 HTML。 */
	async function fetchDailyPage(session) {
		const fetched = await requestCheckInResource("/mission/daily", session);
		if (!fetched.ok) return {
			ok: false,
			result: fail(fetched.code, "request-page", `无法访问 V2EX：${fetched.message}`)
		};
		const { response } = fetched;
		const meta = createResponseMeta(response);
		if (response.challenge) return {
			ok: false,
			result: fail("challenge", "request-page", CHECK_IN_CHALLENGE_COPY.failureReason, meta)
		};
		if (!isSuccessfulStatus(response.status)) return {
			ok: false,
			result: fail("http", "request-page", `获取签到页面失败：${describeHttpFailure(response.status)}（HTTP ${response.status}）`, meta)
		};
		return {
			ok: true,
			text: response.text,
			meta
		};
	}
	/** 发起一次领取请求，并根据结果页判断是否真正到账。 */
	async function redeemReward(path, session) {
		const fetched = await requestCheckInResource(path, session);
		if (!fetched.ok) return {
			result: fail(fetched.code, "redeem", `领取请求失败：${fetched.message}`),
			needsReclick: false
		};
		const { response } = fetched;
		const meta = createResponseMeta(response);
		if (!isSuccessfulStatus(response.status)) return {
			result: fail("http", "redeem", `领取请求失败：${describeHttpFailure(response.status)}（HTTP ${response.status}）`, meta),
			needsReclick: false
		};
		if (hasClaimedReward(response.text)) return {
			result: {
				status: "success",
				checkInDays: parseCheckInDays(response.text),
				...meta
			},
			needsReclick: false
		};
		return {
			result: fail("redeem-failed", "parse-redeem", "领取接口未返回成功提示", meta),
			needsReclick: response.text.includes(RECLICK_TEXT)
		};
	}
	/**
	* 请求签到页面并完成领取。
	*/
	async function requestCheckInInner(session) {
		const page = await fetchDailyPage(session);
		if (!page.ok) return page.result;
		const parsed = parseCheckInPage(page.text, page.meta.finalUrlPath);
		if (parsed.type === "already") return {
			status: "already",
			checkInDays: parsed.checkInDays,
			...page.meta
		};
		if (parsed.type === "unauthenticated") return fail("unauthenticated", "parse-page", "未登录或登录状态已失效", page.meta);
		if (parsed.type === "challenge") return fail("challenge", "parse-page", CHECK_IN_CHALLENGE_COPY.failureReason, page.meta);
		if (parsed.type === "unknown") return fail("unexpected-page", "parse-page", "签到页面无法识别，V2EX 可能已改版", page.meta);
		let outcome = await redeemReward(parsed.path, session);
		if (outcome.needsReclick) {
			const refreshed = await fetchDailyPage(session);
			if (refreshed.ok) {
				const next = parseCheckInPage(refreshed.text, refreshed.meta.finalUrlPath);
				if (next.type === "redeem") outcome = await redeemReward(next.path, session);
			}
		}
		if (outcome.result.status === "success") return outcome.result;
		if (!(outcome.result.code === "redeem-failed" || outcome.result.code === "network" || outcome.result.code === "timeout")) return outcome.result;
		const verify = await fetchDailyPage(session);
		if (verify.ok) {
			const verified = parseCheckInPage(verify.text, verify.meta.finalUrlPath);
			if (verified.type === "already") return {
				status: "success",
				checkInDays: verified.checkInDays,
				httpStatus: outcome.result.httpStatus,
				finalUrlPath: outcome.result.finalUrlPath
			};
		}
		return outcome.result;
	}
	/**
	* 后台请求无法确认领取结果时，才值得再用临时标签页重试一次。
	*
	* 网络类错误、限流、人机验证换到页面上下文也不会改善，反而会多开一个标签页。
	*/
	function shouldRetryInTemporaryTab(result) {
		return result.status === "failed" && (result.code === "redeem-failed" || result.code === "unexpected-page");
	}
	/** 在页面通道上执行一次完整签到，并确保释放标签页资源。 */
	async function runWithPageSession(session) {
		try {
			return await requestCheckInInner(session);
		} finally {
			await session?.close();
		}
	}
	/** 在失败结果上补充本次请求耗时，便于区分超时与快速失败。 */
	async function requestCheckIn() {
		const startedAt = Date.now();
		const isExtension = getRuntime().isBrowserExtension;
		const pageSession = isExtension ? await openCheckInPageSession() : void 0;
		let result = await runWithPageSession(pageSession);
		if (isExtension && !pageSession && shouldRetryInTemporaryTab(result)) {
			const temporarySession = await openCheckInTemporaryTabSession();
			if (temporarySession) result = await runWithPageSession(temporarySession);
		}
		return {
			...result,
			durationMs: Date.now() - startedAt
		};
	}
	/**
	* 记录当前页面确认的 V2EX 用户名。
	*
	* 本项目只保留当前账号的签到状态。用户名变化时清除旧账号状态，
	* 避免把旧账号的成功、失败和重试时间带到新账号。
	*/
	async function observeCheckInMemberNow(memberName, now = Date.now()) {
		const storage = await getStorage(false);
		if (isCheckInStateForMember(storage["daily"], memberName)) return false;
		await setStorage("daily", createCheckInStateForMember(memberName, now));
		accountRevision += 1;
		return true;
	}
	function enqueueMemberObservation(memberName, now = Date.now()) {
		return enqueueStateTransition(() => observeCheckInMemberNow(memberName, now));
	}
	/**
	* 读取配置后执行签到，并将任何未预期的异常统一转换为失败结果。
	*/
	async function runCheckIn(options) {
		const trigger = options.trigger ?? "manual";
		const memberName = normalizeMemberName(options.memberName);
		const { startedAccountRevision, normalizedState, decision } = await enqueueStateTransition(async () => {
			if (memberName) await observeCheckInMemberNow(memberName, Date.now());
			const startedAt = Date.now();
			const startedAccountRevision = accountRevision;
			const storage = await getStorage(false);
			const normalizedState = normalizeCheckInState(storage["daily"], startedAt);
			if (!isSameCheckInState(normalizedState, storage["daily"])) await setStorage("daily", normalizedState);
			return {
				startedAccountRevision,
				normalizedState,
				decision: getCheckInScheduleDecision({
					now: startedAt,
					state: normalizedState,
					autoCheckInEnabled: storage["options"].autoCheckIn.enabled,
					trigger,
					force: options.force
				})
			};
		});
		if (decision.action === "skip") return {
			status: "skipped",
			reason: decision.reason
		};
		const attemptTime = Date.now();
		let result;
		try {
			result = await requestCheckIn();
		} catch (error) {
			const { code, message } = getErrorInfo(error);
			result = fail(code, "request-page", `签到失败：${message}`);
		}
		if (!await enqueueStateTransition(async () => {
			const latestState = (await getStorage(false))["daily"];
			if (!isCheckInAttemptStillCurrent({
				startedAccountRevision,
				currentAccountRevision: accountRevision,
				startedState: normalizedState,
				latestState
			})) return false;
			const nextState = buildDailyInfoAfterAttempt({
				previous: normalizedState,
				result,
				attemptTime,
				finishedAt: Date.now(),
				trigger
			});
			try {
				await setStorage("daily", nextState);
			} catch (error) {
				console.warn("[V2EX Polish] 保存签到状态失败：", error);
			}
			return true;
		})) return {
			status: "skipped",
			reason: "账号已切换，等待重新签到"
		};
		return result;
	}
	/**
	* 领取 V2EX 每日登录奖励。
	*
	* 奖励日按 UTC 计算（重置点 UTC 00:00，北京时间 08:00），
	* 因此不再限制「本地时间 8 点后」才执行。
	*/
	async function checkIn(options = {}) {
		if (inFlight) {
			const memberName = normalizeMemberName(options.memberName);
			if (memberName) try {
				await enqueueMemberObservation(memberName);
			} catch (error) {
				return createUnknownCheckInFailure(error);
			}
			return {
				status: "skipped",
				reason: "已有签到任务进行中"
			};
		}
		inFlight = true;
		try {
			return await runCheckIn(options);
		} catch (error) {
			return createUnknownCheckInFailure(error);
		} finally {
			inFlight = false;
		}
	}
	var checkInTimeout, inFlight, accountRevision, enqueueStateTransition;
	var init_daily_check_in = __esmMin((() => {
		init_runtime();
		init_utils();
		init_async();
		init_check_in_page_fetch$1();
		init_check_in_scheduler();
		init_check_in_utils();
		checkInTimeout = 15e3;
		inFlight = false;
		accountRevision = 0;
		enqueueStateTransition = createSerialQueue();
	}));

//#endregion
//#region src/user-scripts/scheduler.ts
	var scheduler_exports = /* @__PURE__ */ __exportAll({
		runPageCheckIn: () => runPageCheckIn,
		startUserscriptScheduler: () => startUserscriptScheduler,
		stopUserscriptScheduler: () => stopUserscriptScheduler
	});
	function isAuthPage() {
		return [
			"/signin",
			"/signup",
			"/forgot",
			"/2fa"
		].some((path) => window.location.pathname.startsWith(path));
	}
	function readLease() {
		try {
			return JSON.parse(localStorage.getItem(LEASE_KEY) ?? "null") ?? void 0;
		} catch {
			return;
		}
	}
	function acquireLease(owner, now) {
		const current = readLease();
		if (current?.expiresAt && current.expiresAt > now) return false;
		localStorage.setItem(LEASE_KEY, JSON.stringify({
			owner,
			expiresAt: now + LEASE_MS
		}));
		return true;
	}
	function releaseLease(owner) {
		if (readLease()?.owner === owner) localStorage.removeItem(LEASE_KEY);
	}
	async function withLeaseLock(callback) {
		const owner = crypto.randomUUID();
		if (!acquireLease(owner, Date.now())) return;
		try {
			return await callback();
		} finally {
			releaseLease(owner);
		}
	}
	async function withCrossTabLock(callback) {
		const locks = navigator.locks;
		if (!locks?.request) return withLeaseLock(callback);
		let result;
		await locks.request(LOCK_NAME, { ifAvailable: true }, async (lock) => {
			if (!lock) return;
			result = await callback();
		});
		return result;
	}
	async function runPageCheckIn(options = {}) {
		if (running) return {
			status: "skipped",
			reason: "已有页面签到任务进行中"
		};
		running = true;
		try {
			return await withCrossTabLock(async () => {
				const memberName = options.memberName ?? getCurrentMemberName();
				return checkIn({
					force: options.force,
					trigger: options.trigger ?? "manual",
					memberName
				});
			});
		} finally {
			running = false;
		}
	}
	function handleOnline() {
		runPageCheckIn({
			trigger: "online",
			memberName: getCurrentMemberName()
		});
	}
	async function runScheduledCheckIn(trigger) {
		if (isAuthPage()) return;
		if (!(await getStorage(false))["options"].autoCheckIn.enabled) return;
		await runPageCheckIn({
			trigger,
			memberName: getCurrentMemberName()
		});
	}
	function startUserscriptScheduler() {
		if (getRuntime().kind !== "userscript" || window.top !== window || intervalId !== void 0 || isAuthPage()) return;
		const tick = (trigger = "refresh") => {
			runScheduledCheckIn(trigger).catch((error) => {
				console.warn("[V2EX Polish] 油猴签到调度失败：", error);
			});
		};
		tick("tab");
		intervalId = setInterval(tick, CHECK_INTERVAL_MS);
		window.addEventListener("online", handleOnline);
	}
	function stopUserscriptScheduler() {
		if (intervalId !== void 0) {
			clearInterval(intervalId);
			intervalId = void 0;
		}
		window.removeEventListener("online", handleOnline);
	}
	var CHECK_INTERVAL_MS, LOCK_NAME, LEASE_KEY, LEASE_MS, intervalId, running;
	var init_scheduler = __esmMin((() => {
		init_daily_check_in();
		init_member_name();
		init_runtime();
		init_utils();
		CHECK_INTERVAL_MS = 6e4;
		LOCK_NAME = "v2p-userscript-check-in";
		LEASE_KEY = "__v2p_userscript_check_in_lease";
		LEASE_MS = 12e4;
		;
		running = false;
	}));

//#endregion
//#region src/contents/mission/view.ts
	function getRetryDetail(retryAt, now) {
		if (!retryAt) return "";
		return retryAt > now ? `下次自动重试 ${formatTimestamp(retryAt, { format: "YMDHM" })}` : "下一次自动重试即将开始";
	}
	/**
	* 将签到状态转换为签到页面板需要展示的内容。
	*/
	function getMissionPanelView(state, now = Date.now()) {
		if (state.type === "checked-in") return {
			tone: "success",
			title: "今日已自动签到",
			description: `V2EX Polish 已完成今日领取${state.checkInDays ? `，已连续登录 ${state.checkInDays} 天` : ""}`,
			showDiagnostics: false
		};
		if (state.type === "auto-disabled") return {
			tone: "muted",
			title: "自动签到已关闭",
			description: "仍可使用上方按钮手动领取每日奖励。",
			showDiagnostics: false
		};
		if (state.type === "not-attempted") return {
			tone: "waiting",
			title: "等待自动签到",
			description: state.nextActionAt && state.nextActionAt > now ? `计划于 ${formatTimestamp(state.nextActionAt, { format: "YMDHM" })} 自动领取。` : "正在检查今天的签到状态。",
			retryLabel: "立即尝试",
			showDiagnostics: true
		};
		const { title, hint } = describeCheckInErrorCode(state.code);
		const detail = [
			formatTimestamp(state.attemptTime, { format: "YMDHM" }),
			state.httpStatus ? `HTTP ${state.httpStatus}` : "",
			getRetryDetail(state.retryAt, now)
		].filter(Boolean).join(" · ");
		if (state.code === "unauthenticated") return {
			tone: "error",
			title,
			description: state.userMessage ?? hint,
			detail,
			primaryLink: {
				label: "去登录",
				href: "/signin?next=/mission/daily"
			},
			showDiagnostics: true
		};
		return {
			tone: "error",
			title,
			description: state.userMessage ?? hint,
			detail,
			...state.needsAction ? {} : { retryLabel: "立即重试" },
			showDiagnostics: true
		};
	}
	function createButton(action, label) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "v2p-checkin-mission-panel__button";
		button.dataset.action = action;
		button.textContent = label;
		return button;
	}
	/**
	* 渲染签到页状态面板。容器由调用方创建，便于后续绑定事件代理。
	*/
	function renderMissionPanel(panel, state, now = Date.now()) {
		const view = getMissionPanelView(state, now);
		panel.className = `v2p-checkin-mission-panel v2p-checkin-mission-panel--${view.tone}`;
		panel.replaceChildren();
		const content = document.createElement("div");
		content.className = "v2p-checkin-mission-panel__content";
		const mark = document.createElement("span");
		mark.className = "v2p-checkin-mission-panel__mark";
		mark.setAttribute("aria-hidden", "true");
		mark.textContent = panelMarks[view.tone];
		const copy = document.createElement("div");
		copy.className = "v2p-checkin-mission-panel__copy";
		const title = document.createElement("strong");
		title.className = "v2p-checkin-mission-panel__title";
		title.textContent = view.title;
		const description = document.createElement("p");
		description.className = "v2p-checkin-mission-panel__description";
		description.textContent = view.description;
		copy.append(title, description);
		if (view.detail) {
			const detail = document.createElement("span");
			detail.className = "v2p-checkin-mission-panel__detail";
			detail.textContent = view.detail;
			copy.append(detail);
		}
		content.append(mark, copy);
		panel.append(content);
		if (!view.retryLabel && !view.primaryLink && !view.showDiagnostics) return;
		const actions = document.createElement("div");
		actions.className = "v2p-checkin-mission-panel__actions";
		if (view.retryLabel) actions.append(createButton("retry", view.retryLabel));
		if (view.primaryLink) {
			const link = document.createElement("a");
			link.className = "v2p-checkin-mission-panel__button v2p-checkin-mission-panel__button--primary";
			link.href = view.primaryLink.href;
			link.textContent = view.primaryLink.label;
			actions.append(link);
		}
		if (view.showDiagnostics) actions.append(createButton("copy-diagnostic", "复制签到诊断信息"), createButton("report-issue", "反馈问题"));
		panel.append(actions);
	}
	/** 成功后禁用页面中仍显示的原生领取按钮，避免重复领取提示。 */
	function syncNativeClaimButton(checkedIn) {
		const button = document.querySelector("#Main .box input.button[value^=\"领取\"]");
		if (!button) return;
		if (button.dataset.v2pOriginalValue === void 0) {
			button.dataset.v2pOriginalValue = button.value;
			button.dataset.v2pOriginalOnclick = button.getAttribute("onclick") ?? "";
			button.dataset.v2pOriginalDisabled = String(button.disabled);
		}
		if (checkedIn) {
			button.value = "今日已领取";
			button.disabled = true;
			button.classList.add("v2p-checkin-claimed");
			button.removeAttribute("onclick");
			return;
		}
		button.value = button.dataset.v2pOriginalValue ?? "领取";
		button.disabled = button.dataset.v2pOriginalDisabled === "true";
		button.classList.remove("v2p-checkin-claimed");
		const originalOnclick = button.dataset.v2pOriginalOnclick;
		if (originalOnclick) button.setAttribute("onclick", originalOnclick);
	}
	var panelMarks;
	var init_view = __esmMin((() => {
		init_check_in_utils();
		init_date();
		panelMarks = {
			success: "✓",
			waiting: "•",
			error: "!",
			muted: "•"
		};
	}));

//#endregion
//#region src/contents/mission/index.ts
	var mission_exports = /* @__PURE__ */ __exportAll({});
	function findMissionBox() {
		const headings = document.querySelectorAll("#Main .box h1");
		for (const heading of headings) if (heading.textContent?.trim().startsWith("每日登录奖励")) return heading.closest(".box") ?? void 0;
	}
	function renderFromStorage(storage) {
		const missionBox = findMissionBox();
		if (!missionBox) return;
		let panel = missionBox.querySelector(".v2p-checkin-mission-panel");
		if (!panel) {
			panel = document.createElement("section");
			panel.className = "v2p-checkin-mission-panel";
			panel.setAttribute("aria-live", "polite");
			missionBox.append(panel);
		}
		const state = resolveCheckInDisplayState({
			now: Date.now(),
			dailyInfo: storage["daily"],
			autoCheckInEnabled: storage["options"].autoCheckIn.enabled,
			currentMemberName: currentMemberName$1
		});
		renderMissionPanel(panel, state);
		syncNativeClaimButton(state.type === "checked-in");
		return panel;
	}
	async function handleRetry(button) {
		if (retryInFlight) return;
		retryInFlight = true;
		button.disabled = true;
		button.setAttribute("aria-busy", "true");
		button.textContent = "重试中...";
		try {
			if (getRuntime().isBrowserExtension) await chrome.runtime.sendMessage({ ["checkInRetry"]: { memberName: currentMemberName$1 } });
			else await runPageCheckIn({
				force: true,
				trigger: "manual",
				memberName: currentMemberName$1
			});
			renderFromStorage(await getStorage(false));
		} catch (error) {
			console.warn("[V2EX Polish] 签到页重试失败：", error);
			button.textContent = "重试失败，请稍后再试";
		} finally {
			retryInFlight = false;
		}
	}
	async function handleDiagnostic(button, openIssue) {
		const idleText = button.textContent ?? "";
		let copied = false;
		button.disabled = true;
		try {
			copied = await copyCheckInDiagnostic();
		} catch (error) {
			console.warn("[V2EX Polish] 生成签到诊断信息失败：", error);
		}
		button.textContent = copied ? "已复制诊断信息" : "复制失败，请打开扩展面板";
		if (copied && openIssue) window.open("https://github.com/coolpace/V2EX_Polish/issues/new?template=bug_report.yml", "_blank", "noopener,noreferrer");
		setTimeout(() => {
			button.disabled = false;
			button.textContent = idleText;
		}, 2e3);
	}
	function handlePanelClick(event) {
		const button = event.target?.closest("button[data-action]");
		if (!button) return;
		if (button.dataset.action === "retry") {
			handleRetry(button);
			return;
		}
		if (button.dataset.action === "copy-diagnostic" || button.dataset.action === "report-issue") handleDiagnostic(button, button.dataset.action === "report-issue");
	}
	var currentMemberName$1, retryInFlight;
	var init_mission = __esmMin((() => {
		init_check_in_utils();
		init_runtime();
		init_scheduler();
		init_utils();
		init_member_name();
		init_view();
		currentMemberName$1 = getCurrentMemberName();
		retryInFlight = false;
		(async () => {
			if (window.top !== window) return;
			const panel = renderFromStorage(await getStorage(false));
			if (!panel) return;
			panel.addEventListener("click", handlePanelClick);
			getRuntime().storage.subscribe((areaName, changes) => {
				const dailyChanged = areaName === "local" && Object.hasOwn(changes, "daily");
				const optionsChanged = areaName === "sync" && Object.hasOwn(changes, "options");
				if (dailyChanged || optionsChanged) getStorage(false).then(renderFromStorage).catch((error) => {
					console.warn("[V2EX Polish] 刷新签到页面板失败：", error);
				});
			});
		})().catch((error) => {
			console.warn("[V2EX Polish] 初始化签到页面板失败：", error);
		});
	}));

//#endregion
//#region src/contents/go/index.ts
	var go_exports = /* @__PURE__ */ __exportAll({});
	var init_go = __esmMin((() => {
		init_apply_topic_list_filter();
		if (window.location.pathname.endsWith("/go/flamewar")) $("#node_sidebar").addClass("v2p-node-sidebar-flamewar");
		applyTopicListFilter("node");
	}));

//#endregion
//#region src/contents/polyfill.ts
	var init_polyfill = __esmMin((() => {
		if (!window.requestIdleCallback) window.requestIdleCallback = function(callback) {
			const start = Date.now();
			return setTimeout(function() {
				callback({
					didTimeout: false,
					timeRemaining: function() {
						return Math.max(0, 50 - (Date.now() - start));
					}
				});
			}, 1);
		};
		if (!window.cancelIdleCallback) window.cancelIdleCallback = function(id) {
			clearTimeout(id);
		};
	}));

//#endregion
//#region src/contents/check-in-page-fetch.ts
/**
	* 允许 background 借用本页面代发签到请求。
	*
	* 领取凭证与页面会话绑定，由页面发起请求才能和手动点击保持一致；
	* background 仍负责调度与状态写入。
	*/
	function registerCheckInPageFetch() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (sender.id !== chrome.runtime.id) return;
			const path = getCheckInPath(message);
			if (!path) {
				sendResponse({
					ok: false,
					code: "network",
					message: "无效的签到请求"
				});
				return;
			}
			fetchCheckInResponse(path).then(sendResponse);
			return true;
		});
	}
	/** 从消息中读取并校验签到路径。 */
	function getCheckInPath(message) {
		const payload = message?.["checkInPageFetch"];
		if (!payload || typeof payload !== "object") return;
		const path = payload.path;
		return typeof path === "string" && checkInFetchPathPattern.test(path) ? path : void 0;
	}
	/** 在页面上下文请求签到接口，返回可直接回传给 background 的结果。 */
	async function fetchCheckInResponse(path) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), checkInFetchTimeout);
		try {
			const res = await fetch(path, {
				credentials: "include",
				cache: "no-store",
				signal: controller.signal
			});
			return {
				ok: true,
				response: {
					status: res.status,
					finalUrl: res.url,
					text: await res.text(),
					retryAfter: res.headers.get("retry-after"),
					challenge: res.headers.get("cf-mitigated")?.toLowerCase() === "challenge"
				}
			};
		} catch (error) {
			const timedOut = error instanceof Error && error.name === "AbortError";
			return {
				ok: false,
				code: timedOut ? "timeout" : "network",
				message: timedOut ? "请求超时" : String(error)
			};
		} finally {
			clearTimeout(timeoutId);
		}
	}
	var checkInFetchTimeout, checkInFetchPathPattern;
	var init_check_in_page_fetch = __esmMin((() => {
		checkInFetchTimeout = 15e3;
		checkInFetchPathPattern = /^\/mission\/daily(?:\/redeem\?once=[A-Za-z0-9_%.-]+)?$/;
	}));

//#endregion
//#region src/contents/common.ts
	var common_exports = /* @__PURE__ */ __exportAll({});
	var currentMemberName;
	var init_common = __esmMin((() => {
		init_polyfill();
		init_toast();
		init_icons();
		init_post_task();
		init_runtime();
		init_theme_state();
		init_utils();
		init_check_in_page_fetch();
		init_globals();
		init_helpers();
		init_member_name();
		currentMemberName = getCurrentMemberName();
		syncViewportMode();
		if (getRuntime().isBrowserExtension && window.top === window) registerCheckInPageFetch();
		(async () => {
			const runtime = getRuntime();
			const isBrowserExt = runtime.isBrowserExtension;
			const storage = await getStorage();
			const options = storage["options"];
			writeThemeBootSnapshotFromOptions(options);
			calibrateNestedDisplay(options.nestedReply.display);
			setMode(options.theme.mode ?? "default");
			setFont(options.font?.type ?? "system");
			const $toggle = $("#Rightbar .light-toggle").addClass("v2p-color-mode-toggle");
			const colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
			const handleColorSchemeChange = ({ matches }) => {
				getStorage(false).then((storage) => {
					const themeType = storage["options"].theme.type || "light-default";
					toggleTheme({
						$toggle,
						prefersDark: matches,
						themeType: matches ? "dark-default" : themeType
					});
				});
			};
			const themeType = options.theme.type || "light-default";
			if (options.theme.autoSwitch) {
				const prefersDark = colorMedia.matches;
				toggleTheme({
					$toggle,
					prefersDark,
					themeType: prefersDark ? "dark-default" : themeType
				});
				colorMedia.addEventListener("change", handleColorSchemeChange);
			} else {
				/**
				* 如果没有开启自动切换主题，则根据当前主题类型判断是否为暗色主题。
				*
				* - 在浏览器扩展中，使用 `themeType` 判断是否为暗色主题。
				* - 在油猴脚本中，使用 `$wrapper.hasClass('Night')` 判断是否为暗色主题。
				*/
				const prefersDark = isBrowserExt ? themeType === "dark-default" : $wrapper.hasClass("Night");
				toggleTheme({
					$toggle,
					prefersDark,
					themeType
				});
			}
			$toggle.on("click", () => {
				const newTheme = {
					type: $wrapper.hasClass("Night") ? "light-default" : "dark-default",
					autoSwitch: false
				};
				setStorage("options", deepMerge(options, { theme: newTheme }));
			});
			/** 用户从浏览器扩展中同步的配置信息（不是远程备份）。 */
			const syncInfo = storage["settings-sync"];
			const isAuthPage = [
				"/signin",
				"/signup",
				"/forgot",
				"/2fa"
			].some((path) => window.location.pathname.startsWith(path));
			if (isBrowserExt && window.top === window && !isAuthPage) chrome.runtime.sendMessage({ ["checkInNudge"]: { memberName: currentMemberName } }).catch(() => {});
			if (isBrowserExt && syncInfo) {
				const lastCheckTime = syncInfo.lastCheckTime;
				const tenMinutes = 6e5;
				const neverChecked = !lastCheckTime;
				const elapsedTime = Date.now() - (lastCheckTime ?? 0);
				if ((neverChecked || lastCheckTime !== void 0 && elapsedTime >= tenMinutes) && !isAuthPage) {
					const updatedSyncInfo = {
						...syncInfo,
						lastCheckTime: Date.now()
					};
					runtime.storage.set("sync", { ["settings-sync"]: updatedSyncInfo });
					getV2P_Settings().then(async (res) => {
						/** 远程备份的配置信息。 */
						const settings = res?.config;
						const remoteSyncInfo = settings?.["settings-sync"];
						if (remoteSyncInfo && syncInfo.version < remoteSyncInfo.version) await applyRemoteSettings(settings, { lastCheckTime: Date.now() });
					}).catch((err) => {
						console.warn("[V2EX Polish] 检查远程配置更新失败：", err);
					});
				}
			} else if (isBrowserExt && !isAuthPage) getV2P_Settings().then(async (res) => {
				const remoteSettings = res?.config;
				const remoteSyncInfo = remoteSettings?.["settings-sync"];
				if (remoteSettings && remoteSyncInfo) {
					const shouldSync = await showRemoteSyncDialog(remoteSettings);
					const initialSyncInfo = {
						version: remoteSyncInfo.version,
						lastSyncTime: remoteSyncInfo.lastSyncTime,
						lastCheckTime: Date.now()
					};
					runtime.storage.set("sync", { ["settings-sync"]: initialSyncInfo });
					if (shouldSync) {
						await applyRemoteSettings(remoteSettings, { lastCheckTime: Date.now() });
						const toast = createToast({
							html: "远程配置已同步，<a class=\"v2p-toast-action\" href=\"javascript:void(0)\" style=\"text-decoration:underline;cursor:pointer;\">刷新页面</a>以应用更改",
							duration: 0
						});
						$(".v2p-toast-action").on("click", () => {
							toast.clear();
							window.location.reload();
						});
					} else createToast({
						message: "你可以随时在插件设置中同步远程配置",
						duration: 5e3
					});
				}
			}).catch(() => {});
			{
				const $toggleImg = $toggle.find("> img");
				const alt = $toggleImg.prop("alt");
				if (alt === "Light") {
					$toggle.prop("title", "使用深色主题");
					$toggleImg.replaceWith("<i data-v2p-icon=\"moon\"></i>");
				} else if (alt === "Dark") {
					$toggle.prop("title", "使用浅色主题");
					$toggleImg.replaceWith("<i data-v2p-icon=\"sun\"></i>");
				}
			}
			$("#Top .site-nav .tools > .top").addClass("v2p-hover-btn");
			if (options.hideAccount) {
				$("link[rel~='icon']").prop("href", `${"https://v2p.leoku.dev"}/favicon.svg`);
				$("#Logo").append("<i data-v2p-icon=\"house\"></i>").addClass("v2p-logo");
				$("#Top").find("a[href^=\"/member/\"]").remove();
				$infoCard.find("a[href^=\"/member/\"], table:nth-of-type(1) td:nth-of-type(3) .fade").addClass("v2p-hide-account");
				$infoCard.find(".balance_area").addClass("v2p-hide-balance");
			}
			if (isBrowserExt) {
				injectScript(chrome.runtime.getURL("scripts/web_accessible_resources.min.js"));
				window.addEventListener("message", (ev) => {
					if (ev.data.from === 1) {
						const payload = ev.data.payload;
						const task = payload?.task;
						if (payload?.status === "ready") postTask("if (typeof window.once === \"string\") { return window.once; }", (result) => {
							if (typeof result === "string") window.once = result;
						});
						if (task) window.__V2P_Tasks?.get(task.id)?.(task.result);
					}
				});
			}
			{
				const $extraFooter = $(`
    <div class="v2p-footer">
      <div class="v2p-footer-text">扩展自 V2EX Polish </div>

      <div class="v2p-footer-links">
        <a class="v2p-footer-link v2p-hover-btn" href="${"https://leoku.dev"}#contact" target="_blank">商务联系</a>
        <a class="v2p-footer-link v2p-hover-btn" href="${"https://github.com/coolpace/V2EX_Polish/issues"}" target="_blank">问题反馈</a>
        <a class="v2p-footer-link v2p-hover-btn" href="${"https://v2p.leoku.dev/support"}" target="_blank">赞赏支持</a>
        <a class="v2p-footer-link v2p-hover-btn v2p-optbtn" href="javascript:void(0);">选项设置</a>
      </div>

      <div class="v2p-footer-brand">
        <a
          href="https://github.com/coolpace/V2EX_Polish"
          target="_blank"
          title="GitHub 仓库"
          class="v2p-hover-btn v2p-github-ref"
        >
          ${iconGitHub}
        </a>
      </div>
    </div>
    `);
				$extraFooter.find(".v2p-optbtn").on("click", () => {
					openV2PSettings();
				});
				$(`<div class="v2p-footer-logo">${iconLogo}</div>`).prependTo($extraFooter);
				$("#Bottom .content").append($extraFooter);
			}
			runtime.storage.subscribe((storageType, changes) => {
				if (storageType === "sync") {
					const options = changes["options"];
					if (options) {
						const { newValue, oldValue } = options;
						const newOptions = newValue;
						const oldOptions = oldValue;
						writeThemeBootSnapshotFromOptions(newOptions);
						const newTheme = newOptions?.theme;
						const oldTheme = oldOptions?.theme;
						if (newTheme && oldTheme) {
							const prefersDark = newTheme.autoSwitch ? window.matchMedia("(prefers-color-scheme: dark)").matches : isBrowserExt ? newTheme.type === "dark-default" : $wrapper.hasClass("Night");
							if (newTheme.type !== oldTheme.type) toggleTheme({
								$toggle,
								prefersDark,
								themeType: newTheme.type
							});
							else if (newTheme.autoSwitch !== oldTheme.autoSwitch) {
								if (newTheme.autoSwitch) colorMedia.addEventListener("change", handleColorSchemeChange);
								else colorMedia.removeEventListener("change", handleColorSchemeChange);
								toggleTheme({
									$toggle,
									prefersDark,
									themeType: prefersDark ? "dark-default" : newTheme.type
								});
							}
							if (newTheme.mode !== oldTheme.mode) setMode(newTheme.mode ?? "default");
						}
						const newFontType = newOptions?.font?.type;
						if (newFontType !== oldOptions?.font?.type) setFont(newFontType ?? "system");
					}
				}
			});
		})();
	}));

//#endregion
//#region src/user-scripts/control-center.ts
	function normalizeTab(tab) {
		if (VALID_TABS.has(tab)) return tab;
		return "reading";
	}
	function renderTopics(topics) {
		if (topics.length === 0) return "<div class=\"v2p-empty\">暂无主题</div>";
		return `
    <div class="v2p-topic-list">
      ${topics.map((topic) => `
        <a class="v2p-topic-item" href="${escapeHTML(topic.url)}" target="_blank">
          <span class="v2p-item-title">${escapeHTML(topic.title)}</span>
          ${topic.content ? `<span class="v2p-item-summary">${escapeHTML(topic.content)}</span>` : ""}
        </a>
      `).join("")}
    </div>
  `;
	}
	function renderReading(items) {
		if (items.length === 0) return "<div class=\"v2p-empty\">暂未添加稍后阅读的主题</div>";
		return `
    <div class="v2p-toolbar-row" style="margin-bottom:12px">
      <button type="button" data-action="open-all-reading">打开全部</button>
    </div>
    <div class="v2p-reading-list">
      ${items.map((item) => `
        <div class="v2p-reading-item">
          <a href="${escapeHTML(item.url)}" target="_blank">
            <span class="v2p-item-title">${escapeHTML(item.title)}</span>
            <span class="v2p-item-summary">${escapeHTML(item.content)}</span>
          </a>
          <div class="v2p-item-actions">
            <button type="button" data-action="remove-reading" data-url="${escapeHTML(item.url)}">移除</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
	}
	function renderMessages(items, unread) {
		if (items.length === 0) return `<div class="v2p-empty">暂无新消息${unread > 0 ? `，未读 ${unread} 条` : ""}</div>`;
		return `
    <div class="v2p-toolbar-row" style="margin-bottom:12px">
      <strong>未读 ${unread} 条</strong>
    </div>
    <div class="v2p-message-list">
      ${items.map((item) => `
        <div class="v2p-message-item">
          <span class="v2p-item-title">${escapeHTML(item.member?.username ?? "V2EX")}</span>
          <span class="v2p-item-summary">${item.text ?? ""}</span>
          ${item.payload ? `<span class="v2p-item-summary">${escapeHTML(item.payload)}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `;
	}
	function describePendingCheckIn(state) {
		if (state.skipReason) return escapeHTML(state.skipReason);
		if (state.nextActionAt) return `计划于 ${formatTimestamp(state.nextActionAt, { format: "YMDHMS" })} 自动尝试`;
		return "页面存活期间会自动检查签到状态。";
	}
	function renderCheckIn(daily, autoEnabled) {
		const memberName = getCurrentMemberName();
		const state = resolveCheckInDisplayState({
			now: Date.now(),
			dailyInfo: daily,
			autoCheckInEnabled: autoEnabled,
			currentMemberName: memberName
		});
		if (state.type === "checked-in") return `
      <div class="v2p-feature-card">
        <h2>今日已签到</h2>
        <p>${formatTimestamp(state.checkInTime, { format: "YMDHMS" })}${state.checkInDays ? `，连续 ${state.checkInDays} 天` : ""}</p>
      </div>
    `;
		if (state.type === "auto-disabled") return `
      <div class="v2p-feature-card">
        <h2>自动签到已关闭</h2>
        <p>可在设置中重新开启，也可以手动签到。</p>
        <button type="button" class="v2p-primary" data-action="check-in">立即签到</button>
      </div>
    `;
		if (state.type === "failed") {
			const description = describeCheckInErrorCode(state.code);
			return `
      <div class="v2p-feature-card">
        <h2>${escapeHTML(description.title)}</h2>
        <p>${escapeHTML(state.userMessage ?? state.reason ?? description.hint)}</p>
        <button type="button" class="v2p-primary" data-action="check-in">重试签到</button>
      </div>
    `;
		}
		return `
    <div class="v2p-feature-card">
      <h2>每日签到</h2>
      <p>${describePendingCheckIn(state)}</p>
      <button type="button" class="v2p-primary" data-action="check-in">立即签到</button>
    </div>
  `;
	}
	function mountControlCenter(params) {
		const { container, close, openSettings } = params;
		let activeTab = normalizeTab(params.initialTab);
		let disposed = false;
		container.innerHTML = `
    <div class="v2p-panel">
      <header class="v2p-panel-header">
        <div class="v2p-panel-title">V2EX Polish</div>
        <button type="button" class="v2p-icon-button" data-action="close" aria-label="关闭">×</button>
      </header>
      <nav class="v2p-panel-tabs">
        ${Object.entries(TAB_LABELS).map(([tab, label]) => `<button type="button" data-tab="${tab}">${label}</button>`).join("")}
      </nav>
      <div class="v2p-panel-content" role="region" aria-live="polite"></div>
    </div>
  `;
		const content = container.querySelector(".v2p-panel-content");
		if (!content) return () => void 0;
		const setActiveTab = (tab) => {
			activeTab = tab;
			container.querySelectorAll("[data-tab]").forEach((button) => {
				button.classList.toggle("active", button.dataset.tab === tab);
			});
		};
		const render = async () => {
			if (disposed || !content) return;
			setActiveTab(activeTab);
			content.innerHTML = "<div class=\"v2p-loading\">加载中...</div>";
			try {
				switch (activeTab) {
					case "reading": {
						const items = (await getStorage(false))["reading-list"]?.data ?? [];
						content.innerHTML = `<section class="v2p-panel-section">${renderReading(items)}</section>`;
						break;
					}
					case "hot": {
						const { result } = await getHotTopics({
							range: "3d",
							limits: 20
						});
						content.innerHTML = `<section class="v2p-panel-section">${renderTopics(result)}</section>`;
						break;
					}
					case "latest": {
						const topics = await fetchLatestTopics();
						content.innerHTML = `<section class="v2p-panel-section">${renderTopics(topics)}</section>`;
						break;
					}
					case "messages": {
						if (!(await getStorage(false))["api"]?.pat) {
							content.innerHTML = `
              <section class="v2p-panel-section">
                <div class="v2p-empty">需要先设置个人访问令牌（PAT）</div>
                <div class="v2p-action-row">
                  <button type="button" class="v2p-primary" data-action="open-settings-token">去设置</button>
                </div>
              </section>
            `;
							break;
						}
						const notifications = (await fetchNotifications()).result ?? [];
						content.innerHTML = `
            <section class="v2p-panel-section">
              ${renderMessages(notifications, notifications.length)}
            </section>
          `;
						content.querySelectorAll(".v2p-message-item a").forEach((link) => {
							link.target = "_blank";
							link.rel = "noopener noreferrer";
						});
						break;
					}
					case "features": {
						const storage = await getStorage(false);
						content.innerHTML = `
            <section class="v2p-panel-section">
              ${renderCheckIn(storage["daily"], storage["options"].autoCheckIn.enabled)}
              <div class="v2p-action-row">
                <button type="button" data-action="copy-diagnostic">复制签到诊断信息</button>
              </div>
            </section>
          `;
						break;
					}
					case "settings": content.innerHTML = `
            <section class="v2p-panel-section">
              <div class="v2p-feature-card">
                <h2>V2EX Polish 设置</h2>
                <p>配置主题、回复、主题屏蔽、用户标签、PAT 与备份。</p>
                <button type="button" class="v2p-primary" data-action="open-settings">打开设置中心</button>
              </div>
            </section>
          `;
				}
			} catch (error) {
				content.innerHTML = `
        <section class="v2p-panel-section">
          <div class="v2p-error">${escapeHTML(error instanceof Error ? error.message : "加载失败，请稍后重试")}</div>
          <div class="v2p-action-row">
            <button type="button" data-action="retry">重试</button>
          </div>
        </section>
      `;
			}
		};
		const handleClick = (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const tabButton = target.closest("[data-tab]");
			if (tabButton) {
				activeTab = normalizeTab(tabButton.dataset.tab);
				render();
				return;
			}
			const actionButton = target.closest("[data-action]");
			if (!actionButton) return;
			switch (actionButton.dataset.action) {
				case "close":
					close();
					break;
				case "retry":
					render();
					break;
				case "open-settings":
					openSettings();
					break;
				case "open-settings-token":
					openSettings("token");
					break;
				case "remove-reading":
					(async () => {
						const url = actionButton.dataset.url;
						if (!url) return;
						const data = (await getStorage(false))["reading-list"]?.data ?? [];
						await setStorage("reading-list", { data: data.filter((item) => item.url !== url) });
						await render();
					})();
					break;
				case "open-all-reading":
					(async () => {
						const data = (await getStorage(false))["reading-list"]?.data ?? [];
						for (const item of data) window.open(item.url, "_blank", "noopener,noreferrer");
					})();
					break;
				case "check-in":
					actionButton.disabled = true;
					actionButton.textContent = "签到中...";
					runPageCheckIn({
						force: true,
						trigger: "manual",
						memberName: getCurrentMemberName()
					}).finally(() => {
						render();
					});
					break;
				case "copy-diagnostic": (async () => {
					const copied = await copyCheckInDiagnostic();
					actionButton.textContent = copied ? "已复制诊断信息" : "复制失败";
					setTimeout(() => {
						actionButton.textContent = "复制签到诊断信息";
					}, 2e3);
				})();
			}
		};
		container.addEventListener("click", handleClick);
		render();
		return () => {
			disposed = true;
			container.removeEventListener("click", handleClick);
		};
	}
	var VALID_TABS, TAB_LABELS;
	var init_control_center = __esmMin((() => {
		init_check_in_utils();
		init_member_name();
		init_services();
		init_utils();
		init_scheduler();
		VALID_TABS = /* @__PURE__ */ new Set([
			"reading",
			"hot",
			"latest",
			"messages",
			"features",
			"settings"
		]);
		TAB_LABELS = {
			reading: "稍后阅读",
			hot: "最热",
			latest: "最新",
			messages: "消息",
			features: "签到",
			settings: "设置"
		};
	}));

//#endregion
//#region src/user-scripts/options-panel.ts
	function normalizeSection(section) {
		if (VALID_SECTIONS.has(section)) return section;
		return "settings";
	}
	function formValue(root, name) {
		return root.querySelector(`[name="${name}"]`)?.value ?? "";
	}
	function checked(root, name) {
		return root.querySelector(`[name="${name}"]`)?.checked === true;
	}
	function splitValues(value) {
		return value.split(/[\n,，]/).map((item) => item.trim()).filter(Boolean);
	}
	function cloneOptions(options) {
		return JSON.parse(JSON.stringify(options));
	}
	async function saveGeneralOptions(panel, onStatus) {
		const current = cloneOptions((await getStorage(false))["options"]);
		const themeType = formValue(panel, "theme.type");
		const fontType = formValue(panel, "font.type");
		const next = {
			...current,
			topic: { openMode: formValue(panel, "topic.openMode") },
			autoCheckIn: { enabled: checked(panel, "autoCheckIn.enabled") },
			theme: {
				type: themeType,
				autoSwitch: checked(panel, "theme.autoSwitch"),
				mode: formValue(panel, "theme.mode")
			},
			reply: {
				preload: formValue(panel, "reply.preload"),
				layout: formValue(panel, "reply.layout")
			},
			replyContent: {
				autoFold: checked(panel, "replyContent.autoFold"),
				hideReplyTime: checked(panel, "replyContent.hideReplyTime"),
				hideRefName: checked(panel, "replyContent.hideRefName"),
				showImgInPage: checked(panel, "replyContent.showImgInPage")
			},
			nestedReply: {
				display: formValue(panel, "nestedReply.display"),
				multipleInsideOne: checked(panel, "nestedReply.multipleInsideOne") ? "nested" : "off"
			},
			userTag: { display: formValue(panel, "userTag.display") },
			contextMenu: { enabled: checked(panel, "contextMenu.enabled") },
			hideAccount: checked(panel, "hideAccount"),
			font: { type: fontType }
		};
		await setStorage("options", next);
		setTheme(themeType);
		setFont(fontType);
		onStatus("设置已保存，刷新页面可应用全部布局变化");
	}
	async function renderTags(container) {
		const tags = (await getStorage(false))["member-tag"] ?? {};
		const entries = Object.entries(tags).filter(([, value]) => value.tags?.length);
		container.innerHTML = `
    <div class="v2p-settings-heading">
      <div>
        <h2>用户标签</h2>
        <p>标签保存在当前脚本管理器中，可用于主题页和用户页的快速识别。</p>
      </div>
      <button type="button" class="v2p-primary" data-action="add-tag">添加标签</button>
    </div>
    <div class="v2p-tag-list">
      ${entries.length > 0 ? entries.map(([memberName, value]) => `
          <div class="v2p-tag-row">
            <a href="/member/${encodeURIComponent(memberName)}" target="_blank">
              ${value.avatar ? `<img src="${escapeHTML(value.avatar)}" alt="">` : ""}
              <strong>${escapeHTML(memberName)}</strong>
            </a>
            <span>${escapeHTML(value.tags?.join("，") ?? "")}</span>
            <button type="button" data-action="remove-tag" data-member="${escapeHTML(memberName)}">删除</button>
          </div>
        `).join("") : "<div class=\"v2p-empty\">尚未设置用户标签</div>"}
    </div>
  `;
		container.querySelector("[data-action=\"add-tag\"]")?.addEventListener("click", () => {
			(async () => {
				const memberName = window.prompt("请输入 V2EX 用户名");
				if (!memberName?.trim()) return;
				const value = window.prompt("请输入标签，多个标签用逗号分隔");
				if (!value?.trim()) return;
				const nextTags = {
					...tags,
					[memberName.trim()]: {
						...tags[memberName.trim()],
						tags: splitValues(value)
					}
				};
				await setStorage("member-tag", nextTags);
				await renderTags(container);
			})();
		});
		container.querySelectorAll("[data-action=\"remove-tag\"]").forEach((button) => {
			button.addEventListener("click", () => {
				(async () => {
					const memberName = button.dataset.member;
					if (!memberName || !window.confirm(`删除 ${memberName} 的全部标签？`)) return;
					const nextTags = { ...tags };
					delete nextTags[memberName];
					await setStorage("member-tag", nextTags);
					await renderTags(container);
				})();
			});
		});
	}
	function downloadBackup(data) {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		link.href = url;
		link.download = `v2ex-polish-backup-${date}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	async function restoreBackup(file) {
		const text = await file.text();
		const data = JSON.parse(text);
		if (!isValidSettings(data)) throw new Error("无效的 V2EX Polish 配置文件");
		await applyRemoteSettings(data);
		window.__V2P_StorageCache = void 0;
	}
	async function mountOptionsPanel(params) {
		const { container, close } = params;
		const storage = await getStorage(false);
		const options = storage["options"];
		const filter = options.topicFilter;
		let activeSection = normalizeSection(params.initialSection);
		container.innerHTML = `
    <div class="v2p-settings-layout">
      <aside class="v2p-settings-nav">
        <div class="v2p-settings-brand">V2EX Polish</div>
        <button type="button" data-section="settings">控制选项</button>
        <button type="button" data-section="tags">用户标签</button>
        <button type="button" data-section="filter">主题屏蔽</button>
        <button type="button" data-section="token">API Token</button>
        <button type="button" data-section="backup">配置备份与恢复</button>
      </aside>
      <main class="v2p-settings-main">
        <header class="v2p-settings-topbar">
          <div>
            <strong>设置</strong>
            <span class="v2p-settings-status" role="status"></span>
          </div>
          <button type="button" class="v2p-icon-button" data-action="close" aria-label="关闭设置">×</button>
        </header>

        <section class="v2p-settings-section" data-panel="settings">
          <h2>控制选项</h2>
          <div class="v2p-form-grid">
            <label>颜色主题
              <select name="theme.type">
                <option value="light-default">浅色默认</option>
                <option value="dark-default">深色默认</option>
                <option value="dawn">Rose Pine Dawn</option>
                <option value="minimalist">极简</option>
              </select>
            </label>
            <label class="v2p-check"><input type="checkbox" name="theme.autoSwitch"> 自动跟随系统</label>
            <label>间距模式
              <select name="theme.mode">
                <option value="default">自然</option>
                <option value="compact">紧凑</option>
              </select>
            </label>
            <label>界面字体
              <select name="font.type">
                <option value="system">系统默认</option>
                <option value="vivoSans">Vivo Sans</option>
                <option value="notoSans">Noto Sans SC</option>
                <option value="lxgwWenKai">霞鹜文楷</option>
              </select>
            </label>
            <label>主题打开方式
              <select name="topic.openMode">
                <option value="default">当前标签页</option>
                <option value="newTab">新标签页</option>
                <option value="preview">页内预览</option>
              </select>
            </label>
            <label>回复预加载
              <select name="reply.preload">
                <option value="auto">自动</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>回复布局
              <select name="reply.layout">
                <option value="vertical">垂直</option>
                <option value="horizontal">水平</option>
                <option value="auto">自动</option>
              </select>
            </label>
            <label>嵌套回复
              <select name="nestedReply.display">
                <option value="indent">缩进</option>
                <option value="align">对齐</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>用户标签显示
              <select name="userTag.display">
                <option value="inline">行内</option>
                <option value="block">块级</option>
              </select>
            </label>
          </div>

          <div class="v2p-check-grid">
            <label class="v2p-check"><input type="checkbox" name="autoCheckIn.enabled"> 自动签到</label>
            <label class="v2p-check"><input type="checkbox" name="nestedReply.multipleInsideOne"> 多重 @ 保持嵌套</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.autoFold"> 自动折叠长回复</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.hideReplyTime"> 隐藏回复时间</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.hideRefName"> 隐藏回复中的 @ 用户名</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.showImgInPage"> 图片页内预览</label>
            <label class="v2p-check"><input type="checkbox" name="contextMenu.enabled"> 启用油猴菜单快捷操作</label>
            <label class="v2p-check"><input type="checkbox" name="hideAccount"> 隐藏账号信息</label>
          </div>

          <button type="button" class="v2p-primary" data-action="save-settings">保存设置</button>
        </section>

        <section class="v2p-settings-section" data-panel="tags"></section>

        <section class="v2p-settings-section" data-panel="filter">
          <h2>主题屏蔽</h2>
          <label class="v2p-check"><input type="checkbox" name="filter.enabled"> 启用主题屏蔽</label>
          <label>标题关键词（每行一个）
            <textarea name="filter.quickTitles" rows="4"></textarea>
          </label>
          <label>节点名称（每行一个）
            <textarea name="filter.quickNodes" rows="4"></textarea>
          </label>
          <label class="v2p-check"><input type="checkbox" name="filter.advancedEnabled"> 启用高级规则</label>
          <label>高级规则 JSON
            <textarea name="filter.advanced" rows="10" spellcheck="false"></textarea>
          </label>
          <p class="v2p-help">高级规则采用与扩展设置相同的 TopicFilterRule[] 结构；格式错误时不会保存。</p>
          <button type="button" class="v2p-primary" data-action="save-filter">保存主题屏蔽</button>
        </section>

        <section class="v2p-settings-section" data-panel="token">
          <h2>API Token</h2>
          <p class="v2p-help">PAT 只保存在当前脚本管理器的本地存储中，不会进入配置备份。</p>
          <label>个人访问令牌
            <input type="password" name="api.pat" autocomplete="off" placeholder="填写 V2EX PAT">
          </label>
          <button type="button" class="v2p-primary" data-action="save-token">保存令牌</button>
        </section>

        <section class="v2p-settings-section" data-panel="backup">
          <h2>配置备份与恢复</h2>
          <p class="v2p-help">配置、用户标签和稍后阅读可导出为 JSON。PAT 与签到状态不会写入备份。</p>
          <div class="v2p-action-row">
            <button type="button" data-action="export">导出 JSON</button>
            <button type="button" data-action="import">导入 JSON</button>
            <button type="button" data-action="backup-note">备份到 V2EX 记事本</button>
            <button type="button" data-action="restore-note">从记事本恢复</button>
          </div>
          <input type="file" accept=".json,application/json" name="backup-file" hidden>
        </section>
      </main>
    </div>
  `;
		const status = container.querySelector(".v2p-settings-status");
		const setStatus = (message) => {
			if (status) status.textContent = message;
		};
		const setValue = (name, value) => {
			const input = container.querySelector(`[name="${name}"]`);
			if (!input) return;
			if (input instanceof HTMLInputElement && input.type === "checkbox") input.checked = Boolean(value);
			else input.value = String(value ?? "");
		};
		setValue("theme.type", options.theme.type ?? "light-default");
		setValue("theme.autoSwitch", options.theme.autoSwitch);
		setValue("theme.mode", options.theme.mode ?? "default");
		setValue("font.type", options.font?.type ?? "system");
		setValue("topic.openMode", options.topic.openMode);
		setValue("autoCheckIn.enabled", options.autoCheckIn.enabled);
		setValue("reply.preload", options.reply.preload ?? "auto");
		setValue("reply.layout", options.reply.layout ?? "vertical");
		setValue("replyContent.autoFold", options.replyContent.autoFold !== false);
		setValue("replyContent.hideReplyTime", options.replyContent.hideReplyTime !== false);
		setValue("replyContent.hideRefName", options.replyContent.hideRefName !== false);
		setValue("replyContent.showImgInPage", options.replyContent.showImgInPage !== false);
		setValue("nestedReply.display", options.nestedReply.display);
		setValue("nestedReply.multipleInsideOne", options.nestedReply.multipleInsideOne !== "off");
		setValue("userTag.display", options.userTag.display);
		setValue("contextMenu.enabled", options.contextMenu?.enabled !== false);
		setValue("hideAccount", options.hideAccount === true);
		setValue("filter.enabled", filter?.enabled === true);
		setValue("filter.quickTitles", (filter?.quick.titleKeywords ?? []).join("\n"));
		setValue("filter.quickNodes", (filter?.quick.nodes ?? []).join("\n"));
		setValue("filter.advancedEnabled", filter?.advanced.enabled === true);
		setValue("filter.advanced", JSON.stringify(filter?.advanced.rules ?? [], null, 2));
		setValue("api.pat", storage["api"]?.pat ?? "");
		const selectSection = (section) => {
			activeSection = section;
			container.querySelectorAll("[data-section]").forEach((button) => {
				button.classList.toggle("active", button.dataset.section === section);
			});
			container.querySelectorAll("[data-panel]").forEach((panel) => {
				panel.hidden = panel.dataset.panel !== section;
			});
		};
		selectSection(activeSection);
		container.querySelectorAll("[data-section]").forEach((button) => {
			button.addEventListener("click", () => {
				selectSection(normalizeSection(button.dataset.section));
			});
		});
		container.querySelector("[data-action=\"close\"]")?.addEventListener("click", close);
		container.querySelector("[data-action=\"save-settings\"]")?.addEventListener("click", () => {
			saveGeneralOptions(container, setStatus).catch((error) => {
				setStatus(error instanceof Error ? error.message : "保存设置失败");
			});
		});
		container.querySelector("[data-action=\"save-filter\"]")?.addEventListener("click", () => {
			(async () => {
				try {
					const rules = JSON.parse(formValue(container, "filter.advanced"));
					if (!Array.isArray(rules)) throw new Error("高级规则必须是数组");
					const next = cloneOptions((await getStorage(false))["options"]);
					next.topicFilter = {
						version: 1,
						enabled: checked(container, "filter.enabled"),
						quick: {
							titleKeywords: splitValues(formValue(container, "filter.quickTitles")),
							nodes: splitValues(formValue(container, "filter.quickNodes"))
						},
						advanced: {
							enabled: checked(container, "filter.advancedEnabled"),
							rules
						}
					};
					await setStorage("options", next);
					setStatus("主题屏蔽设置已保存");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "主题屏蔽设置格式错误");
				}
			})();
		});
		container.querySelector("[data-action=\"save-token\"]")?.addEventListener("click", () => {
			(async () => {
				try {
					const current = await getStorage(false);
					await setStorage("api", {
						...current["api"],
						pat: formValue(container, "api.pat").trim() || void 0
					});
					setStatus("API Token 已保存");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "API Token 保存失败");
				}
			})();
		});
		container.querySelector("[data-action=\"export\"]")?.addEventListener("click", () => {
			(async () => {
				const current = await getStorage(false);
				downloadBackup(prepareBackupData(current));
				setStatus("配置已导出");
			})();
		});
		const fileInput = container.querySelector("[name=\"backup-file\"]");
		container.querySelector("[data-action=\"import\"]")?.addEventListener("click", () => {
			fileInput?.click();
		});
		fileInput?.addEventListener("change", () => {
			(async () => {
				const file = fileInput.files?.[0];
				if (!file || !window.confirm("导入将覆盖当前配置、用户标签和稍后阅读，是否继续？")) return;
				try {
					await restoreBackup(file);
					setStatus("配置已导入，刷新页面后全部生效");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "配置导入失败");
				} finally {
					fileInput.value = "";
				}
			})();
		});
		container.querySelector("[data-action=\"backup-note\"]")?.addEventListener("click", () => {
			(async () => {
				try {
					setStatus("正在备份到 V2EX 记事本...");
					await setV2P_Settings(await getStorage(false));
					setStatus("备份到 V2EX 记事本成功");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "备份失败");
				}
			})();
		});
		container.querySelector("[data-action=\"restore-note\"]")?.addEventListener("click", () => {
			(async () => {
				try {
					const remote = await getV2P_Settings();
					if (!remote || !window.confirm("从 V2EX 记事本恢复会合并远端配置，是否继续？")) return;
					await applyRemoteSettings(remote.config);
					window.__V2P_StorageCache = void 0;
					setStatus("已从 V2EX 记事本恢复配置");
				} catch (error) {
					setStatus(error instanceof Error ? error.message : "恢复失败");
				}
			})();
		});
		const tagsContainer = container.querySelector("[data-panel=\"tags\"]");
		if (tagsContainer) await renderTags(tagsContainer);
	}
	var VALID_SECTIONS;
	var init_options_panel = __esmMin((() => {
		init_helpers();
		init_utils();
		VALID_SECTIONS = /* @__PURE__ */ new Set([
			"settings",
			"tags",
			"filter",
			"token",
			"backup"
		]);
	}));

//#endregion
//#region src/user-scripts/ui-styles.ts
	var userscriptUiStyles;
	var init_ui_styles = __esmMin((() => {
		userscriptUiStyles = `
:host {
  all: initial;
  --v2p-ui-bg: #f4f6f8;
  --v2p-ui-surface: #ffffff;
  --v2p-ui-surface-muted: #f1f5f9;
  --v2p-ui-text: #1e293b;
  --v2p-ui-muted: #64748b;
  --v2p-ui-border: #dbe3ec;
  --v2p-ui-accent: #0f766e;
  --v2p-ui-accent-soft: #ccfbf1;
  --v2p-ui-danger: #b91c1c;
  --v2p-ui-radius: 10px;
  --v2p-ui-shadow: 0 24px 70px rgb(15 23 42 / 24%);
  color: var(--v2p-ui-text);
  font: 14px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:host(.v2p-dark) {
  --v2p-ui-bg: #0f172a;
  --v2p-ui-surface: #172033;
  --v2p-ui-surface-muted: #202b40;
  --v2p-ui-text: #e2e8f0;
  --v2p-ui-muted: #94a3b8;
  --v2p-ui-border: #334155;
  --v2p-ui-accent: #5eead4;
  --v2p-ui-accent-soft: #134e4a;
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}

button,
input,
select,
textarea {
  color: inherit;
  font: inherit;
}

button {
  cursor: pointer;
  border: 1px solid var(--v2p-ui-border);
  border-radius: 7px;
  padding: 7px 11px;
  background: var(--v2p-ui-surface-muted);
}

button:hover {
  border-color: var(--v2p-ui-muted);
}

button:disabled {
  cursor: default;
  opacity: 0.6;
}

input[type="text"],
input[type="password"],
select,
textarea {
  width: 100%;
  border: 1px solid var(--v2p-ui-border);
  border-radius: 7px;
  padding: 8px 10px;
  background: var(--v2p-ui-surface);
}

textarea {
  resize: vertical;
}

a {
  color: inherit;
}

.v2p-launcher {
  position: fixed;
  z-index: 2147483645;
  right: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: #0f766e;
  box-shadow: 0 10px 28px rgb(15 118 110 / 35%);
}

.v2p-overlay {
  position: fixed;
  z-index: 2147483646;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--v2p-ui-text);
  background: rgb(15 23 42 / 52%);
  backdrop-filter: blur(3px);
}

.v2p-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: min(500px, calc(100vw - 32px));
  height: min(650px, calc(100vh - 48px));
  border: 1px solid var(--v2p-ui-border);
  border-radius: 14px;
  color: var(--v2p-ui-text);
  background: var(--v2p-ui-surface);
  box-shadow: var(--v2p-ui-shadow);
}

.v2p-panel-header,
.v2p-settings-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--v2p-ui-border);
}

.v2p-panel-title {
  font-size: 16px;
  font-weight: 750;
}

.v2p-icon-button {
  width: 34px;
  height: 34px;
  padding: 0;
  font-size: 22px;
  line-height: 1;
}

.v2p-panel-tabs {
  overflow-x: auto;
  display: flex;
  gap: 5px;
  padding: 8px 10px;
  background: var(--v2p-ui-surface-muted);
  border-bottom: 1px solid var(--v2p-ui-border);
}

.v2p-panel-tabs button {
  flex: none;
  border-color: transparent;
  background: transparent;
}

.v2p-panel-tabs button.active {
  color: var(--v2p-ui-accent);
  background: var(--v2p-ui-surface);
  border-color: var(--v2p-ui-border);
}

.v2p-panel-content {
  overflow: auto;
  flex: 1;
  min-height: 0;
  padding: 0;
}

.v2p-panel-section {
  min-height: 100%;
  padding: 16px;
}

.v2p-topic-list,
.v2p-reading-list,
.v2p-message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v2p-topic-item,
.v2p-reading-item,
.v2p-message-item {
  position: relative;
  display: block;
  padding: 12px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  color: inherit;
  text-decoration: none;
  background: var(--v2p-ui-surface);
}

.v2p-topic-item:hover,
.v2p-reading-item:hover,
.v2p-message-item:hover {
  background: var(--v2p-ui-surface-muted);
  text-decoration: none;
}

.v2p-item-title {
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 5px;
  font-weight: 650;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.v2p-item-summary {
  display: -webkit-box;
  overflow: hidden;
  color: var(--v2p-ui-muted);
  font-size: 13px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.v2p-item-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.v2p-item-actions button {
  font-size: 12px;
  padding: 4px 8px;
}

.v2p-empty,
.v2p-loading,
.v2p-error {
  padding: 36px 16px;
  text-align: center;
  color: var(--v2p-ui-muted);
}

.v2p-error {
  color: var(--v2p-ui-danger);
}

.v2p-toolbar-row,
.v2p-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.v2p-action-row {
  margin-top: 14px;
}

.v2p-feature-card {
  padding: 18px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  background: var(--v2p-ui-surface);
}

.v2p-feature-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.v2p-feature-card p {
  margin: 0 0 14px;
  color: var(--v2p-ui-muted);
}

.v2p-primary {
  color: #fff;
  background: var(--v2p-ui-accent);
  border-color: var(--v2p-ui-accent);
}

:host(.v2p-dark) .v2p-primary {
  color: #06201c;
}

.v2p-settings-panel {
  overflow: hidden;
  display: flex;
  width: min(1120px, calc(100vw - 32px));
  height: min(820px, calc(100vh - 40px));
  border: 1px solid var(--v2p-ui-border);
  border-radius: 14px;
  color: var(--v2p-ui-text);
  background: var(--v2p-ui-bg);
  box-shadow: var(--v2p-ui-shadow);
}

.v2p-settings-layout {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 100%;
}

.v2p-settings-nav {
  flex: none;
  width: 230px;
  padding: 18px 12px;
  background: var(--v2p-ui-surface-muted);
}

.v2p-settings-brand {
  margin: 2px 10px 18px;
  font-size: 20px;
  font-weight: 800;
}

.v2p-settings-nav button {
  display: block;
  width: 100%;
  margin-bottom: 5px;
  padding: 9px 12px;
  border-color: transparent;
  text-align: left;
  background: transparent;
}

.v2p-settings-nav button.active {
  color: var(--v2p-ui-accent);
  background: var(--v2p-ui-surface);
  border-color: var(--v2p-ui-border);
}

.v2p-settings-main {
  overflow: hidden;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.v2p-settings-topbar {
  flex: none;
  background: var(--v2p-ui-surface);
}

.v2p-settings-status {
  margin-left: 10px;
  color: var(--v2p-ui-muted);
  font-size: 12px;
}

.v2p-settings-section {
  overflow: auto;
  flex: 1;
  padding: 24px 30px 40px;
}

.v2p-settings-section h2,
.v2p-settings-heading h2 {
  margin: 0 0 16px;
  font-size: 21px;
}

.v2p-settings-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.v2p-settings-heading h2 {
  margin-bottom: 4px;
}

.v2p-settings-heading p,
.v2p-help {
  margin: 0 0 14px;
  color: var(--v2p-ui-muted);
  font-size: 13px;
}

.v2p-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 18px;
  margin-bottom: 20px;
}

.v2p-form-grid label,
.v2p-settings-section > label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.v2p-check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin-bottom: 20px;
}

.v2p-check {
  flex-direction: row !important;
  align-items: center;
  gap: 8px !important;
  margin: 0 !important;
}

.v2p-tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v2p-tag-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, 1.5fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  background: var(--v2p-ui-surface);
}

.v2p-tag-row a {
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
}

.v2p-tag-row img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.v2p-toast {
  position: fixed;
  z-index: 2147483647;
  right: 18px;
  bottom: 76px;
  max-width: min(360px, calc(100vw - 36px));
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  background: rgb(15 23 42 / 92%);
  box-shadow: 0 8px 28px rgb(15 23 42 / 28%);
}

@media (max-width: 720px) {
  .v2p-overlay {
    padding: 8px;
  }

  .v2p-panel {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
  }

  .v2p-settings-panel {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
  }

  .v2p-settings-layout {
    flex-direction: column;
  }

  .v2p-settings-nav {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    width: 100%;
    padding: 8px;
  }

  .v2p-settings-brand {
    display: none;
  }

  .v2p-settings-nav button {
    flex: none;
    width: auto;
    margin: 0;
  }

  .v2p-form-grid,
  .v2p-check-grid {
    grid-template-columns: 1fr;
  }

  .v2p-settings-section {
    padding: 18px 16px 30px;
  }

  .v2p-tag-row {
    grid-template-columns: 1fr auto;
  }

  .v2p-tag-row span {
    grid-column: 1 / -1;
  }
}
`;
	}));

//#endregion
//#region src/user-scripts/shell.ts
	var shell_exports = /* @__PURE__ */ __exportAll({
		initializeUserScriptShell: () => initializeUserScriptShell,
		openControlCenter: () => openControlCenter,
		openOptions: () => openOptions,
		showUserScriptToast: () => showUserScriptToast
	});
	function closeActivePanel() {
		disposeActivePanel?.();
		disposeActivePanel = void 0;
		overlay?.remove();
		overlay = void 0;
		if (launcher) launcher.hidden = false;
		previousFocus?.focus();
		previousFocus = null;
	}
	function getThemeClass() {
		return document.body.classList.contains("Night") || document.documentElement.classList.contains("Night") || document.body.classList.contains("v2p-theme-dark-default") ? "v2p-dark" : "";
	}
	function ensureShell() {
		if (shadowRoot && launcher) return {
			shadow: shadowRoot,
			launcher
		};
		if (window.top !== window || !document.documentElement) return;
		const host = document.createElement("div");
		host.id = HOST_ID;
		host.className = getThemeClass();
		document.documentElement.append(host);
		new MutationObserver(() => {
			host.className = getThemeClass();
		}).observe(document.body, {
			attributes: true,
			attributeFilter: ["class"]
		});
		shadowRoot = host.attachShadow({ mode: "open" });
		const style = document.createElement("style");
		style.textContent = userscriptUiStyles;
		shadowRoot.append(style);
		launcher = document.createElement("button");
		launcher.type = "button";
		launcher.className = "v2p-launcher";
		launcher.title = "打开 V2EX Polish";
		launcher.setAttribute("aria-label", "打开 V2EX Polish");
		launcher.textContent = "V2P";
		launcher.addEventListener("click", () => {
			openControlCenter();
		});
		shadowRoot.append(launcher);
		return {
			shadow: shadowRoot,
			launcher
		};
	}
	function createOverlay(kind) {
		const shell = ensureShell();
		if (!shell) return;
		closeActivePanel();
		previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		shell.launcher.hidden = true;
		shell.shadow.host.className = getThemeClass();
		const isSettings = kind === "settings";
		const nextOverlay = document.createElement("div");
		nextOverlay.className = isSettings ? "v2p-overlay v2p-settings-overlay" : "v2p-overlay v2p-control-center-overlay";
		nextOverlay.setAttribute("role", "dialog");
		nextOverlay.setAttribute("aria-modal", "true");
		nextOverlay.setAttribute("aria-label", isSettings ? "V2EX Polish 设置" : "V2EX Polish 用户面板");
		const panel = document.createElement("div");
		panel.className = isSettings ? "v2p-settings-panel" : "";
		nextOverlay.append(panel);
		nextOverlay.addEventListener("click", (event) => {
			if (event.target === nextOverlay) closeActivePanel();
		});
		shell.shadow.append(nextOverlay);
		overlay = nextOverlay;
		return panel;
	}
	function openOptions(section) {
		const panel = createOverlay("settings");
		if (!panel) return;
		panel.innerHTML = "<div class=\"v2p-loading\">正在加载设置...</div>";
		mountOptionsPanel({
			container: panel,
			initialSection: section,
			close: closeActivePanel
		}).catch((error) => {
			panel.innerHTML = `
      <div class="v2p-settings-section">
        <div class="v2p-error">${error instanceof Error ? error.message : "设置加载失败"}</div>
      </div>
    `;
		}).finally(() => {
			panel.querySelector("button")?.focus();
		});
	}
	function openControlCenter(tab) {
		const panel = createOverlay("control");
		if (!panel) return;
		disposeActivePanel = mountControlCenter({
			container: panel,
			initialTab: tab,
			close: closeActivePanel,
			openSettings: (section) => {
				openOptions(section);
			}
		});
		queueMicrotask(() => {
			panel.querySelector("button")?.focus();
		});
	}
	function showUserScriptToast(message) {
		const shell = ensureShell();
		if (!shell) return;
		shell.shadow.querySelector(".v2p-toast")?.remove();
		const toast = document.createElement("div");
		toast.className = "v2p-toast";
		toast.textContent = message;
		shell.shadow.append(toast);
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toast.remove();
			toastTimer = void 0;
		}, 4e3);
	}
	function getCurrentTopicReadingItem() {
		const topicId = window.location.pathname.match(/\/t\/(\d+)/)?.[1];
		if (!topicId) return;
		return {
			url: `${window.location.origin}/t/${topicId}`,
			title: document.title.replace(" - V2EX", ""),
			content: document.querySelector("head meta[property=\"og:description\"]")?.content ?? ""
		};
	}
	function registerMenuCommands() {
		const runtime = getRuntime();
		getStorage(false).then((storage) => {
			if (storage["options"].contextMenu?.enabled === false) return;
			runtime.registerMenuCommand("V2EX Polish 用户面板", () => openControlCenter());
			runtime.registerMenuCommand("V2EX Polish 设置", () => openOptions());
			const topic = getCurrentTopicReadingItem();
			if (topic) {
				runtime.registerMenuCommand("添加当前主题到稍后阅读", () => {
					addToReadingList(topic);
				});
				runtime.registerMenuCommand("解析当前主题中的 Base64", () => {
					decodeBase64TopicPage();
					showUserScriptToast("已执行 Base64 解析");
				});
			}
		});
	}
	function initializeUserScriptShell() {
		if (initialized || window.top !== window) return;
		initialized = true;
		ensureShell();
		window.addEventListener("v2p:open-options", (event) => {
			const detail = event.detail;
			openOptions(detail?.section);
		});
		window.addEventListener("v2p:open-control-center", (event) => {
			const detail = event.detail;
			openControlCenter(detail?.tab);
		});
		window.addEventListener("v2p:toast", (event) => {
			const detail = event.detail;
			if (detail?.message) showUserScriptToast(detail.message);
		});
		window.addEventListener("keydown", (event) => {
			if (!overlay) return;
			if (event.key === "Escape") {
				closeActivePanel();
				return;
			}
			if (event.key !== "Tab" || !shadowRoot) return;
			const focusable = Array.from(overlay.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex=\"-1\"])")).filter((element) => !element.hidden);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable.at(-1);
			const active = shadowRoot.activeElement;
			if (!first || !last) return;
			if (event.shiftKey && active === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		});
		registerMenuCommands();
	}
	var HOST_ID, shadowRoot, launcher, overlay, disposeActivePanel, toastTimer, initialized, previousFocus;
	var init_shell = __esmMin((() => {
		init_helpers();
		init_runtime();
		init_utils();
		init_control_center();
		init_options_panel();
		init_ui_styles();
		HOST_ID = "v2p-userscript-host";
		;
		;
		;
		;
		;
		initialized = false;
		previousFocus = null;
	}));

//#endregion
//#region src/user-scripts/index.ts
	init_constants();
	init_runtime();
	init_userscript();
	init_theme_state();
	Object.assign(globalThis, {
		$: import_jquery.default,
		jQuery: import_jquery.default
	});
	setRuntime(userscriptRuntime);
	markBootState();
	initializeThemeBoot();
	function runAfterLoaded(fn) {
		if (document.readyState !== "loading") fn();
		else document.addEventListener("DOMContentLoaded", () => {
			fn();
		});
	}
	if (typeof GM_addStyle === "function") GM_addStyle(style);
	else runAfterLoaded(() => {
		$(`<style type='text/css'>${style}</style>`).appendTo("head");
	});
	const allowedHosts = V2EX_DOMAINS.map((domain) => `https://${domain}`);
	const commonRegex = patternToRegex(...allowedHosts.map((host) => `${host}/*`));
	const topicRegex = patternToRegex(...allowedHosts.map((host) => `${host}/t/*`));
	const writeRegex = patternToRegex(...allowedHosts.map((host) => `${host}/write*`));
	const memberRegex = patternToRegex(...allowedHosts.map((host) => `${host}/member/*`));
	const settingsRegex = patternToRegex(...allowedHosts.map((host) => `${host}/settings*`));
	const notificationsRegex = patternToRegex(...allowedHosts.map((host) => `${host}/notifications*`));
	const missionRegex = patternToRegex(...allowedHosts.map((host) => `${host}/mission/daily*`));
	const goRegex = patternToRegex(...allowedHosts.map((host) => `${host}/go/*`));
	function isHomePage(url) {
		const path = new URL(url).pathname;
		return !(path.startsWith("/t/") || path.startsWith("/notes/") || path.startsWith("/settings") || path.startsWith("/write") || path.startsWith("/member/") || path.startsWith("/mission/daily") || path.startsWith("/notifications") || path.startsWith("/go/"));
	}
	const pageModules = [
		{
			name: "home",
			matches: (url) => commonRegex.test(url) && isHomePage(url),
			load: () => Promise.resolve().then(() => (init_home(), home_exports))
		},
		{
			name: "topic",
			matches: (url) => topicRegex.test(url),
			load: () => Promise.resolve().then(() => (init_topic(), topic_exports))
		},
		{
			name: "write",
			matches: (url) => writeRegex.test(url),
			load: () => Promise.resolve().then(() => (init_write(), write_exports))
		},
		{
			name: "member",
			matches: (url) => memberRegex.test(url),
			load: () => Promise.resolve().then(() => (init_member(), member_exports))
		},
		{
			name: "settings",
			matches: (url) => settingsRegex.test(url),
			load: () => Promise.resolve().then(() => (init_settings(), settings_exports))
		},
		{
			name: "notifications",
			matches: (url) => notificationsRegex.test(url),
			load: () => Promise.resolve().then(() => (init_notifications(), notifications_exports))
		},
		{
			name: "mission",
			matches: (url) => missionRegex.test(url),
			load: () => Promise.resolve().then(() => (init_mission(), mission_exports))
		},
		{
			name: "go",
			matches: (url) => goRegex.test(url),
			load: () => Promise.resolve().then(() => (init_go(), go_exports))
		}
	];
	async function loadModule(name, loader) {
		try {
			await loader();
		} catch (error) {
			console.error(`[V2EX Polish] 页面模块加载失败：${name}`, error);
		}
	}
	runAfterLoaded(() => {
		const url = window.location.href;
		(async () => {
			if (commonRegex.test(url)) await loadModule("common", () => Promise.resolve().then(() => (init_common(), common_exports)));
			if (window.top === window) {
				const [{ initializeUserScriptShell }, { startUserscriptScheduler }] = await Promise.all([Promise.resolve().then(() => (init_shell(), shell_exports)), Promise.resolve().then(() => (init_scheduler(), scheduler_exports))]);
				initializeUserScriptShell();
				startUserscriptScheduler();
			}
			for (const pageModule of pageModules) if (pageModule.matches(url)) await loadModule(pageModule.name, pageModule.load);
		})();
	});

//#endregion
})();