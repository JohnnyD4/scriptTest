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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

    "use strict";
    
    
    var rng = __webpack_require__(6);
    var bytesToUuid = __webpack_require__(8);
    
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
    
      if (typeof options == 'string') {
        buf = options == 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};
    
      var rnds = options.random || (options.rng || rng)();
    
      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80;
    
      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
    
      return buf || bytesToUuid(rnds);
    }
    
    module.exports = v4;
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var HeirialAjaxInterface = function () {
      function HeirialAjaxInterface(dependencies) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
        _classCallCheck(this, HeirialAjaxInterface);
    
        this.navigator = options.navigator || window.navigator;
        this._allowBeacons = options.allowBeacons || false;
      }
    
      HeirialAjaxInterface.prototype.post = function post(url, fields) {
        if (this._allowBeacons && this.navigator.sendBeacon) {
          this._sendBeacon(url, fields);
        } else if ('withCredentials' in new XMLHttpRequest()) {
          this._sendXHR(url, fields);
        } else if (typeof XDomainRequest !== 'undefined') {
          this._sendXDR(url, fields);
        }
    
        // failed
      };
    
      HeirialAjaxInterface.prototype._sendBeacon = function _sendBeacon(url, fields) {
        navigator.sendBeacon(url, JSON.stringify(fields));
      };
    
      HeirialAjaxInterface.prototype._sendXHR = function _sendXHR(url, fields) {
        var xhr = new XMLHttpRequest();
    
        xhr.open('POST', url, true);
        xhr.send(JSON.stringify(fields));
      };
    
      HeirialAjaxInterface.prototype._sendXDR = function _sendXDR(url, fields) {
        var xdr = new XDomainRequest();
    
        xdr.open('POST', url);
        xdr.onload = function () {};
        xdr.send(JSON.stringify(fields));
      };
    
      return HeirialAjaxInterface;
    }();
    
    module.exports = HeirialAjaxInterface;
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var DEFAULT_COOKIE_EXPIRES = 'Tue, 19 Jan 2038 03:14:07 UTC';
    
    var HeirialCookieManager = function () {
      function HeirialCookieManager(dependencies) {
        _classCallCheck(this, HeirialCookieManager);
    
        this._document = dependencies.document || document;
      }
    
      HeirialCookieManager.prototype.get = function get(key) {
        var match = this._document.cookie.match(new RegExp(key + '=([^\\s;]*)'));
    
        return key && match ? unescape(match[1]) : '';
      };
    
      HeirialCookieManager.prototype.set = function set(key, value) {
        var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_COOKIE_EXPIRES;
    
        this._document.cookie = key + '=' + value + '; expires=' + expires + '; path=/';
      };
    
      HeirialCookieManager.prototype.session = function session(key, value) {
        this.set(key, value, '');
      };
    
      return HeirialCookieManager;
    }();
    
    module.exports = HeirialCookieManager;
    
    /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var uuid = __webpack_require__(0);
    
    var DEFAULT_TRACKER = [{
      selectors: ['a', 'button'],
      name: 'click',
      tag: 'ClickEvent'
    }];
    
    var HeirialEventManager = function () {
      function HeirialEventManager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    
        _classCallCheck(this, HeirialEventManager);
    
        this._document = options.document || document;
        this._AJAX = options._AJAX;
    
        this._intake = options.intake || 'https://api.heirial.com/' + this.apiVersion;
        this._loadEventFired = false;
        this._queue = [];
      }
    
      HeirialEventManager.prototype.bind = function bind(element, eventName, callback) {
        if (this._document.addEventListener) {
          element.addEventListener(eventName, callback);
        } else if (this._document.attachEvent) {
          element.attachEvent('on' + eventName, callback);
        }
      };
    
      HeirialEventManager.prototype.track = function track() {
        var trackers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_TRACKER;
    
        for (var i = 0, l = trackers.length; i < l; i += 1) {
          var targets = this._document.querySelectorAll(trackers[i].selectors.join(','));
    
          for (var j = 0, m = targets.length; j < m; j += 1) {
            var callback = this.fire.bind(this, trackers[i].tag);
    
            this.bind(targets[j], trackers[i].name, callback);
          }
        }
      };
    
      HeirialEventManager.prototype.fire = function fire(tag) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
        var endpoint = this._getEndpoint(tag);
        var tagFields = this._getTagFields(tag);
        var fields = this._buildFields(tag, data, tagFields);
    
        if (!this._loadEventFired) {
          if (tag !== 'LoadEvent') {
            this._queue.push({ endpoint: endpoint, fields: fields });
    
            return;
          }
    
          while (this.queue.length) {
            var event = this.queue.shift();
    
            this._send(event.endpoint, event.fields);
          }
    
          this._send(endpoint, fields);
          this._loadEventFired = true;
        } else if (tag !== 'LoadEvent') {
          this._send(endpoint, fields);
        }
      };
    
      HeirialEventManager.prototype.map = function map(uid1, uid2, reason) {
        this._send('map', {
          data: {
            current_url: this.currentUrl
          },
          reason: reason,
          uid_1: uid1,
          uid_2: uid2
        });
      };
    
      HeirialEventManager.prototype._getEndpoint = function _getEndpoint(tag) {
        return tag === 'LoadEvent' ? 'intake/load' : 'intake/page';
      };
    
      HeirialEventManager.prototype._getTagFields = function _getTagFields(tag) {
        var uid = void 0;
        var loadUid = void 0;
    
        if (tag === 'LoadEvent') {
          uid = this.LoadUid;
          loadUid = '0';
        } else {
          loadUid = this.loadUid;
    
          if (tag === 'UnloadEvent') {
            uid = this.VisitUid;
          } else {
            uid = uuid();
          }
        }
    
        return { uid: uid, load_uid: loadUid };
      };
    
      HeirialEventManager.prototype._buildFields = function _buildFields(tag, data, tagFields) {
        return Object.assign({
          state: this.State,
          data: Object.assign(data, this._location),
          timestamp: new Date().toISOString(),
          event_tag: tag
        }, tagFields);
      };
    
      HeirialEventManager.prototype._send = function _send(endpoint, fields) {};
    
      return HeirialEventManager;
    }();
    
    module.exports = HeirialEventManager;
    
    /***/ }),
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var HeirialCore = __webpack_require__(5);
    var AjaxInterface = __webpack_require__(1);
    var CookieManager = __webpack_require__(2);
    var EventManager = __webpack_require__(3);
    
    if (!window.heirial2 && navigator.cookieEnabled) {
      window.heirial2 = new HeirialCore(Object.assign({
        AjaxInterface: new AjaxInterface(),
        CookieManager: new CookieManager(document),
        EventManager: new EventManager()
      }, window.heirialConfig || {}));
    }
    
    /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var uuid = __webpack_require__(0);
    
    var AjaxInterface = __webpack_require__(1);
    var CookieManager = __webpack_require__(2);
    var EventManager = __webpack_require__(3);
    
    var STATE_SEPARATOR = '::';
    
    var HeirialCore = function () {
      function HeirialCore(dependencies) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
        _classCallCheck(this, HeirialCore);
    
        this._Ajax = dependencies.AjaxInterface;
        this._Cookie = dependencies.CookieManager;
        this._Event = dependencies.EventManager;
        this._options = options;
    
        this.version = '2.0.0-dev';
        this.apiVersion = '2';
        this.visitorUid = this._getVisitorUid();
        this.visitUid = this._getVisitUid();
        this.loadUid = this._getLoadUid();
        this.state = this._buildState();
    
        this._setCookies();
        this._bindEvents();
    
        this.fire = this._Event.fire;
      }
    
      HeirialCore.prototype._getVisitorUid = function _getVisitorUid() {
        var visitorUid = this._Cookie.get('heirial2.uid');
    
        if (!visitorUid) {
          // Check if they have a v1 uid
          var oldUid = this._Cookie.get('heirial.uid');
          visitorUid = uuid();
    
          // If they do, migrate it and send it back to be mapped
          if (oldUid) {
            this._Event.map(oldUid, visitorUid, 'Automatic migration from 1.0.0 to ' + this.version);
          }
        }
    
        return visitorUid;
      };
    
      HeirialCore.prototype._getVisitUid = function _getVisitUid() {
        return this._Cookie.get('heirial2.vid') || uuid();
      };
    
      HeirialCore.prototype._getLoadUid = function _getLoadUid() {
        return uuid();
      };
    
      HeirialCore.prototype._buildState = function _buildState() {
        return '' + this.visitorUid + STATE_SEPARATOR + this.visitUid + STATE_SEPARATOR + this.loadUid;
      };
    
      HeirialCore.prototype._setCookies = function _setCookies() {
        this._Cookie.set('heirial2', this.state);
        this._Cookie.set('heirial2.uid', this.visitorUid);
        this._Cookie.session('heirial2.vid', this.visitUid);
        this._Cookie.set('heirial2.lid', this.loadUid);
      };
    
      HeirialCore.prototype._bindEvents = function _bindEvents() {
        this._Events.bind(window, 'load', this.fire.bind(this, 'LoadEvent'));
        this._Events.bind(window, 'beforeunload', this.fire.bind(this, 'UnloadEvent'));
        this._Events.track(this._options.tracker);
      };
    
      return HeirialCore;
    }();
    
    module.exports = HeirialCore;
    
    /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(global) {
    
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection
    var rng;
    
    var crypto = global.crypto || global.msCrypto; // for IE 11
    if (crypto && crypto.getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
      rng = function whatwgRNG() {
        crypto.getRandomValues(rnds8);
        return rnds8;
      };
    }
    
    if (!rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);
      rng = function rng() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
    
        return rnds;
      };
    }
    
    module.exports = rng;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))
    
    /***/ }),
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var g;
    
    // This works in non-strict mode
    g = function () {
        return this;
    }();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1, eval)("this");
    } catch (e) {
        // This works if the window reference is available
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    /***/ }),
    /* 8 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    
    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
    }
    
    module.exports = bytesToUuid;
    
    /***/ })
    /******/ ]);