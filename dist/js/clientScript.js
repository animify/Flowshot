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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/clientScript.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/EventBus.ts":
/*!*************************!*\
  !*** ./src/EventBus.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.functionMap = {};
    }
    EventBus.prototype.add = function (event, func) {
        this.functionMap[event] = func;
        document.addEventListener(event.split('.')[0], this.functionMap[event]);
    };
    EventBus.prototype.remove = function (event) {
        document.removeEventListener(event.split('.')[0], this.functionMap[event]);
        delete this.functionMap[event];
    };
    return EventBus;
}());
exports.default = EventBus;


/***/ }),

/***/ "./src/clientScript.ts":
/*!*****************************!*\
  !*** ./src/clientScript.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventBus_1 = __webpack_require__(/*! ./EventBus */ "./src/EventBus.ts");
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
var FlowshotClient = /** @class */ (function () {
    function FlowshotClient() {
        if (!window.FlowshotEvents) {
            console.debug = console.debug.bind(null, '%c Flowshot Client:', 'font-weight: bold; color: #ffcc00');
            window.FlowshotEvents = new EventBus_1.default();
            console.debug('Set EventBus');
        }
        console.debug('Script injected');
        this.attachMessageListeners();
        this.runStatus();
    }
    FlowshotClient.prototype.runStatus = function () {
        var _this = this;
        chrome.storage.local.get(['recordingState'], function (result) {
            var state = result.recordingState;
            if (state === types_1.RecordingStatus.started) {
                _this.handleMessage({ startRecording: true });
            }
        });
    };
    FlowshotClient.prototype.attachMessageListeners = function () {
        var _this = this;
        window.FlowshotEvents.remove('fs-request.flowshot');
        window.FlowshotEvents.add('fs-request.flowshot', function (event) { return _this.handleMessage(event.detail); });
    };
    FlowshotClient.prototype.handleMessage = function (payload) {
        console.log('Got payload', payload);
        switch (true) {
            case payload.startRecording:
                console.debug('Started recording');
                this.attachClickListener();
                break;
            case payload.stopRecording:
                console.debug('Stopped recording');
                this.detachClickListener();
                break;
        }
    };
    FlowshotClient.prototype.detachClickListener = function () {
        window.FlowshotEvents.remove('click.flowshot');
    };
    FlowshotClient.prototype.attachClickListener = function () {
        this.detachClickListener();
        window.FlowshotEvents.add('click.flowshot', this.onClick);
    };
    FlowshotClient.prototype.onClick = function (e) {
        console.debug('Click event - ', e);
        var srcElement = e.srcElement;
        var path = e.path;
        if (path) {
            srcElement = path.find(function (e) { return ['button', 'a'].includes(e.type); }) || srcElement;
        }
        var style = srcElement.getBoundingClientRect();
        console.debug('style', style);
        document.dispatchEvent(new CustomEvent('fs-request', {
            detail: {
                click: true,
                payload: {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    boundingRect: {
                        x: style.left,
                        y: style.top,
                        h: style.height,
                        w: style.width,
                    }
                }
            }
        }));
    };
    return FlowshotClient;
}());
new FlowshotClient();


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RecordingStatus;
(function (RecordingStatus) {
    RecordingStatus[RecordingStatus["stopped"] = 0] = "stopped";
    RecordingStatus[RecordingStatus["started"] = 1] = "started";
    RecordingStatus[RecordingStatus["discarded"] = 2] = "discarded";
})(RecordingStatus = exports.RecordingStatus || (exports.RecordingStatus = {}));
var ChromeTabStatus;
(function (ChromeTabStatus) {
    ChromeTabStatus["loading"] = "loading";
    ChromeTabStatus["complete"] = "complete";
})(ChromeTabStatus = exports.ChromeTabStatus || (exports.ChromeTabStatus = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0V2ZW50QnVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnRTY3JpcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO1FBQ1ksZ0JBQVcsR0FBRyxFQUFFLENBQUM7SUFXN0IsQ0FBQztJQVRHLHNCQUFHLEdBQUgsVUFBSSxLQUFLLEVBQUUsSUFBSTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FB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O0lBQ2IsMkRBQWE7SUFDYiwrREFBZTtBQUNuQixDQUFDLEVBSlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFJMUI7QUFFRCxJQUFZLGVBR1g7QUFIRCxXQUFZLGVBQWU7SUFDdkIsc0NBQXFCO0lBQ3JCLHdDQUF1QjtBQUMzQixDQUFDLEVBSFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFHMUIiLCJmaWxlIjoiY2xpZW50U2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50U2NyaXB0LnRzXCIpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXMge1xuICAgIHByaXZhdGUgZnVuY3Rpb25NYXAgPSB7fTtcblxuICAgIGFkZChldmVudCwgZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmN0aW9uTWFwW2V2ZW50XSA9IGZ1bmM7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQuc3BsaXQoJy4nKVswXSwgdGhpcy5mdW5jdGlvbk1hcFtldmVudF0pO1xuICAgIH1cblxuICAgIHJlbW92ZShldmVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LnNwbGl0KCcuJylbMF0sIHRoaXMuZnVuY3Rpb25NYXBbZXZlbnRdKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZnVuY3Rpb25NYXBbZXZlbnRdO1xuICAgIH1cbn0iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cyc7XG5pbXBvcnQgeyBSZWNvcmRpbmdTdGF0dXMgfSBmcm9tICcuL3R5cGVzJztcblxuY2xhc3MgRmxvd3Nob3RDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5GbG93c2hvdEV2ZW50cykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyA9IGNvbnNvbGUuZGVidWcuYmluZChudWxsLCAnJWMgRmxvd3Nob3QgQ2xpZW50OicsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmNjMDAnKTtcbiAgICAgICAgICAgIHdpbmRvdy5GbG93c2hvdEV2ZW50cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0IEV2ZW50QnVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmRlYnVnKCdTY3JpcHQgaW5qZWN0ZWQnKTtcblxuICAgICAgICB0aGlzLmF0dGFjaE1lc3NhZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5ydW5TdGF0dXMoKTtcbiAgICB9XG5cblxuICAgIHJ1blN0YXR1cygpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsncmVjb3JkaW5nU3RhdGUnXSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSByZXN1bHQucmVjb3JkaW5nU3RhdGUgYXMgUmVjb3JkaW5nU3RhdHVzO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09IFJlY29yZGluZ1N0YXR1cy5zdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKHsgc3RhcnRSZWNvcmRpbmc6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGF0dGFjaE1lc3NhZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHdpbmRvdy5GbG93c2hvdEV2ZW50cy5yZW1vdmUoJ2ZzLXJlcXVlc3QuZmxvd3Nob3QnKTtcbiAgICAgICAgd2luZG93LkZsb3dzaG90RXZlbnRzLmFkZCgnZnMtcmVxdWVzdC5mbG93c2hvdCcsIChldmVudDogQ3VzdG9tRXZlbnQpID0+IHRoaXMuaGFuZGxlTWVzc2FnZShldmVudC5kZXRhaWwpKTtcbiAgICB9XG5cbiAgICBoYW5kbGVNZXNzYWdlKHBheWxvYWQ6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZygnR290IHBheWxvYWQnLCBwYXlsb2FkKTtcblxuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgcGF5bG9hZC5zdGFydFJlY29yZGluZzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTdGFydGVkIHJlY29yZGluZycpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwYXlsb2FkLnN0b3BSZWNvcmRpbmc6XG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU3RvcHBlZCByZWNvcmRpbmcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRldGFjaENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGFjaENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIHdpbmRvdy5GbG93c2hvdEV2ZW50cy5yZW1vdmUoJ2NsaWNrLmZsb3dzaG90Jyk7XG4gICAgfVxuXG4gICAgYXR0YWNoQ2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5kZXRhY2hDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHdpbmRvdy5GbG93c2hvdEV2ZW50cy5hZGQoJ2NsaWNrLmZsb3dzaG90JywgdGhpcy5vbkNsaWNrKTtcbiAgICB9XG5cbiAgICBvbkNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnQ2xpY2sgZXZlbnQgLSAnLCBlKTtcbiAgICAgICAgbGV0IHNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBhdGggPSAoZSBhcyBhbnkpLnBhdGg7XG5cbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHNyY0VsZW1lbnQgPSBwYXRoLmZpbmQoZSA9PiBbJ2J1dHRvbicsICdhJ10uaW5jbHVkZXMoZS50eXBlKSkgfHwgc3JjRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0eWxlID0gc3JjRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzdHlsZScsIHN0eWxlKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZnMtcmVxdWVzdCcsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZVg6IGUucGFnZVgsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VZOiBlLnBhZ2VZLFxuICAgICAgICAgICAgICAgICAgICBzY3JlZW5YOiBlLnNjcmVlblgsXG4gICAgICAgICAgICAgICAgICAgIHNjcmVlblk6IGUuc2NyZWVuWSxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50WDogZS5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlLmNsaWVudFksXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nUmVjdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogc3R5bGUubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0eWxlLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6IHN0eWxlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHc6IHN0eWxlLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuXG5uZXcgRmxvd3Nob3RDbGllbnQoKTsiLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgZGF0ZTogbnVtYmVyO1xuICAgIGRhdGE6IFNlc3Npb25EYXRhW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbkRhdGEge1xuICAgIGRhdGU6IG51bWJlcjtcbiAgICBzY3JlZW46IHtcbiAgICAgICAgdGFiOiBzdHJpbmc7XG4gICAgICAgIGRhdGFVUkk6IHN0cmluZztcbiAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgdzogbnVtYmVyO1xuICAgICAgICAgICAgaDogbnVtYmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsaWNrOiB7XG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgICAgIHBhZ2VZOiBudW1iZXI7XG4gICAgICAgIHNjcmVlblg6IG51bWJlcjtcbiAgICAgICAgc2NyZWVuWTogbnVtYmVyO1xuICAgICAgICBjbGllbnRYOiBudW1iZXI7XG4gICAgICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICAgICAgYm91bmRpbmdSZWN0OiB7XG4gICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICBoOiBudW1iZXI7XG4gICAgICAgICAgICB3OiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nIHtcbiAgICBzdGF0dXM6IFJlY29yZGluZ1N0YXR1cztcbiAgICBldmVudHM6IFJlY29yZGluZ0V2ZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nRXZlbnQge1xuICAgIHRhYjogc3RyaW5nO1xuICAgIGltYWdlOiBzdHJpbmc7XG4gICAgYm91bmRzOiB7XG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgICAgIHBhZ2VZOiBudW1iZXI7XG4gICAgICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICAgICAgY2xpZW50WTogbnVtYmVyO1xuICAgIH07XG59XG5cbmV4cG9ydCBlbnVtIFJlY29yZGluZ1N0YXR1cyB7XG4gICAgJ3N0b3BwZWQnID0gMCxcbiAgICAnc3RhcnRlZCcgPSAxLFxuICAgICdkaXNjYXJkZWQnID0gMixcbn1cblxuZXhwb3J0IGVudW0gQ2hyb21lVGFiU3RhdHVzIHtcbiAgICAnbG9hZGluZycgPSAnbG9hZGluZycsXG4gICAgJ2NvbXBsZXRlJyA9ICdjb21wbGV0ZScsXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgICAgRmxvd3Nob3RFdmVudHM6IEV2ZW50QnVzO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=