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
  
  
  exports.__esModule = true;
  
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
      var isFF = navigator.userAgent.indexOf('Firefox/55');
      console.log(navigator.userAgent);
      xhr.open('POST', url, true);

        

      //
      // If issues with old version of ios (ios 7)
      // it builds default field to send
      //  
      try {
        
          if (fields.event_tag === 'ClickEvent') {
              xhr.send(JSON.stringify(fields));
              alert('click');
          }

        xhr.send(JSON.stringify(fields));
      } catch (err) {
        var data = void 0;
  
        if (fields.event_tag === 'ClickEvent') {
          data = {
            current_url: fields.data.current_url,
            referrer: fields.data.referrer,
            isTrusted: fields.data.isTrusted,
            element: {
              attributes: {},
              html: fields.data.element.html,
              text: fields.data.element.text
            }
          };
        } else {
          data = {
            current_url: fields.data.current_url,
            referrer: fields.data.referrer,
            isTrusted: fields.data.isTrusted
          };
        }
        var defaultFields = {
          data: data,
          event_tag: fields.event_tag,
          load_uid: fields.load_uid,
          state: fields.state,
          timestamp: fields.timestamp,
          uid: fields.uid,
          config: window.heirialConfig
        };
        xhr.send(JSON.stringify(defaultFields));
      }
    };
  
    HeirialAjaxInterface.prototype._sendXDR = function _sendXDR(url, fields) {
      var xdr = new XDomainRequest();
  
      xdr.open('POST', url);
      xdr.onload = function () {};
      xdr.send(JSON.stringify(fields));
    };
  
    return HeirialAjaxInterface;
  }();
  
  exports.default = HeirialAjaxInterface;
  
  /***/ }),
  /* 2 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  exports.__esModule = true;
  
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
  
      var isIE = navigator.appName.indexOf('Internet Explorer');
  
      // 
      // Sets the cookie differently if browser
      // is Internet Explorer
      // 
      if (isIE) {
        this._document.cookie = key + '=' + value + '; path=/';
      } else {
        this._document.cookie = key + '=' + value + '; expires=' + expires + '; path=/';
      }
    };
  
    HeirialCookieManager.prototype.session = function session(key, value) {
      this.set(key, value, '');
    };
  
    return HeirialCookieManager;
  }();
  
  exports.default = HeirialCookieManager;
  
  /***/ }),
  /* 3 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  exports.__esModule = true;
  
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
  
      this.apiVersion = 'staging';
      this._location = {
        current_url: window.location.href,
        referrer: document.referrer
      };
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
  
  
      //
      // Wait for window to finish loading 
      // to access the trackers
      //  
      window.onload = function () {
        for (var i = 0, l = trackers.length; i < l; i += 1) {
          var targets = window.document.querySelectorAll(trackers[i].selectors.join(','));
  
          for (var j = 0, m = targets.length; j < m; j += 1) {
            var callback = heirial2._Event.fire.bind(this, trackers[i].tag);
  
            heirial2._Event.bind(targets[j], trackers[i].name, callback);
          }
        }
      };
    };
  
    HeirialEventManager.prototype.fire = function fire(tag) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
      var endpoint = heirial2._Event._getEndpoint(tag);
      var tagFields = heirial2._Event._getTagFields(tag);
      var fields = heirial2._Event._buildFields(tag, data, tagFields);
  
      if (!heirial2._Event._loadEventFired) {
        if (tag !== 'LoadEvent') {
          heirial2._Event._queue.push({ endpoint: endpoint, fields: fields });
        };
  
        while (heirial2._Event._queue.length) {
          var event = heirial2._Event._queue.shift();
  
          heirial2._Event._send(event.endpoint, event.fields);
        }
  
        heirial2._Event._send(endpoint, fields);
        heirial2._Event._loadEventFired = true;
      } else if (tag !== 'LoadEvent') {
        heirial2._Event._send(endpoint, fields);
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
        uid = heirial2.loadUid;
        loadUid = '0';
      } else {
        loadUid = heirial2.loadUid;
  
        if (tag === 'UnloadEvent') {
          uid = heirial2.visitUid;
        } else {
          uid = uuid();
        }
      }
  
      return { uid: uid, load_uid: loadUid };
    };
  
    HeirialEventManager.prototype._buildFields = function _buildFields(tag, data, tagFields) {
      var attr = data.target;
      var attributes = {};
      var clickData = {
        element: {
          attributes: attributes
        }
      };
  
      // 
      // Building tagFields object if it is a 
      // click event. Adding element and attributes
      // fields to object
      // 
      if (tag === 'ClickEvent') {
        Object.keys(attr.attributes).map(function (key, index) {
          if (attr.attributes[key]) {
            clickData.element.attributes[attr.attributes[key].name] = attr.attributes[key].value;
          }
        });
        clickData.element['text'] = attr.innerHTML;
        clickData.element['html'] = attr.outerHTML;
  
        tagFields.state = heirial2.state;
        tagFields.data = this._location;
        var dataKeys = Object.keys(clickData);
  
        for (var i = 0; i < dataKeys.length; i += 1) {
          tagFields.data[dataKeys[i]] = clickData[dataKeys[i]];
        }
        tagFields.timestamp = new Date().toISOString();
        tagFields.event_tag = tag;
  
        return tagFields;
      } else {
        tagFields.state = heirial2.state;
        tagFields.data = this._location;
        var _dataKeys = Object.keys(data);
  
        for (var _i = 0; _i < _dataKeys.length; _i += 1) {
          tagFields.data[_dataKeys[_i]] = data[_dataKeys[_i]];
        }
        tagFields.timestamp = new Date().toISOString();
        tagFields.event_tag = tag;
  
        return tagFields;
      }
    };
  
    HeirialEventManager.prototype._send = function _send(endpoint, fields) {
      if (document.querySelector('script[api-key]') && !window.heirialConfig) {
        var api_key = document.querySelector('script[api-key]').getAttribute('api-key');
        window.heirialConfig = { api_key: api_key };
      }
  
      fields.config = window.heirialConfig;
      heirial2._Ajax.post(this._intake + '/' + endpoint, fields);
    };
  
    return HeirialEventManager;
  }();
  
  exports.default = HeirialEventManager;
  
  /***/ }),
  /* 4 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  var _HeirialCore = __webpack_require__(5);
  
  var _HeirialCore2 = _interopRequireDefault(_HeirialCore);
  
  var _HeirialAjaxInterface = __webpack_require__(1);
  
  var _HeirialAjaxInterface2 = _interopRequireDefault(_HeirialAjaxInterface);
  
  var _HeirialCookieManager = __webpack_require__(2);
  
  var _HeirialCookieManager2 = _interopRequireDefault(_HeirialCookieManager);
  
  var _HeirialEventManager = __webpack_require__(3);
  
  var _HeirialEventManager2 = _interopRequireDefault(_HeirialEventManager);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  if (!window.heirial2 && navigator.cookieEnabled) {
    window.heirial2 = new _HeirialCore2.default({
      AjaxInterface: new _HeirialAjaxInterface2.default(),
      CookieManager: new _HeirialCookieManager2.default(document),
      EventManager: new _HeirialEventManager2.default()
    }, window.heirialConfig || {});
  }
  
  /***/ }),
  /* 5 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  exports.__esModule = true;
  
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
      this._Event.bind(window, 'load', this._Event.fire.bind(this, 'LoadEvent'));
      this._Event.bind(window, 'beforeunload', this._Event.fire.bind(this, 'UnloadEvent'));
      this._Event.track();
    };
  
    return HeirialCore;
  }();
  
  exports.default = HeirialCore;
  
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