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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0V2ZW50QnVzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnRTY3JpcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO1FBQ1ksZ0JBQVcsR0FBRyxFQUFFLENBQUM7SUFXN0IsQ0FBQztJQVRHLHNCQUFHLEdBQUgsVUFBSSxLQUFLLEVBQUUsSUFBSTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FB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ZSxRQUkxQjtBQUVELElBQVksZUFHWDtBQUhELFdBQVksZUFBZTtJQUN2QixzQ0FBcUI7SUFDckIsd0NBQXVCO0FBQzNCLENBQUMsRUFIVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUcxQiIsImZpbGUiOiJjbGllbnRTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jbGllbnRTY3JpcHQudHNcIik7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEJ1cyB7XG4gICAgcHJpdmF0ZSBmdW5jdGlvbk1hcCA9IHt9O1xuXG4gICAgYWRkKGV2ZW50LCBmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY3Rpb25NYXBbZXZlbnRdID0gZnVuYztcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudC5zcGxpdCgnLicpWzBdLCB0aGlzLmZ1bmN0aW9uTWFwW2V2ZW50XSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGV2ZW50KSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQuc3BsaXQoJy4nKVswXSwgdGhpcy5mdW5jdGlvbk1hcFtldmVudF0pO1xuICAgICAgICBkZWxldGUgdGhpcy5mdW5jdGlvbk1hcFtldmVudF07XG4gICAgfVxufSIsImltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJztcbmltcG9ydCB7IFJlY29yZGluZ1N0YXR1cyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jbGFzcyBGbG93c2hvdENsaWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmICghd2luZG93LkZsb3dzaG90RXZlbnRzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnID0gY29uc29sZS5kZWJ1Zy5iaW5kKG51bGwsICclYyBGbG93c2hvdCBDbGllbnQ6JywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmY2MwMCcpO1xuICAgICAgICAgICAgd2luZG93LkZsb3dzaG90RXZlbnRzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXQgRXZlbnRCdXMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ1NjcmlwdCBpbmplY3RlZCcpO1xuXG4gICAgICAgIHRoaXMuYXR0YWNoTWVzc2FnZUxpc3RlbmVycygpO1xuICAgICAgICB0aGlzLnJ1blN0YXR1cygpO1xuICAgIH1cblxuXG4gICAgcnVuU3RhdHVzKCkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydyZWNvcmRpbmdTdGF0ZSddLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHJlc3VsdC5yZWNvcmRpbmdTdGF0ZSBhcyBSZWNvcmRpbmdTdGF0dXM7XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdHVzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZU1lc3NhZ2UoeyBzdGFydFJlY29yZGluZzogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXR0YWNoTWVzc2FnZUxpc3RlbmVycygpIHtcbiAgICAgICAgd2luZG93LkZsb3dzaG90RXZlbnRzLnJlbW92ZSgnZnMtcmVxdWVzdC5mbG93c2hvdCcpO1xuICAgICAgICB3aW5kb3cuRmxvd3Nob3RFdmVudHMuYWRkKCdmcy1yZXF1ZXN0LmZsb3dzaG90JywgKGV2ZW50OiBDdXN0b21FdmVudCkgPT4gdGhpcy5oYW5kbGVNZXNzYWdlKGV2ZW50LmRldGFpbCkpO1xuICAgIH1cblxuICAgIGhhbmRsZU1lc3NhZ2UocGF5bG9hZDogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdHb3QgcGF5bG9hZCcsIHBheWxvYWQpO1xuXG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSBwYXlsb2FkLnN0YXJ0UmVjb3JkaW5nOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1N0YXJ0ZWQgcmVjb3JkaW5nJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBheWxvYWQuc3RvcFJlY29yZGluZzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTdG9wcGVkIHJlY29yZGluZycpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGV0YWNoQ2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgd2luZG93LkZsb3dzaG90RXZlbnRzLnJlbW92ZSgnY2xpY2suZmxvd3Nob3QnKTtcbiAgICB9XG5cbiAgICBhdHRhY2hDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmRldGFjaENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgd2luZG93LkZsb3dzaG90RXZlbnRzLmFkZCgnY2xpY2suZmxvd3Nob3QnLCB0aGlzLm9uQ2xpY2spO1xuICAgIH1cblxuICAgIG9uQ2xpY2soZTogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDbGljayBldmVudCAtICcsIGUpO1xuICAgICAgICBsZXQgc3JjRWxlbWVudCA9IGUuc3JjRWxlbWVudDtcbiAgICAgICAgY29uc3QgcGF0aCA9IChlIGFzIGFueSkucGF0aDtcblxuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgc3JjRWxlbWVudCA9IHBhdGguZmluZChlID0+IFsnYnV0dG9uJywgJ2EnXS5pbmNsdWRlcyhlLnR5cGUpKSB8fCBzcmNFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3R5bGUgPSBzcmNFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3N0eWxlJywgc3R5bGUpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmcy1yZXF1ZXN0Jywge1xuICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgY2xpY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICBwYWdlWDogZS5wYWdlWCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVk6IGUucGFnZVksXG4gICAgICAgICAgICAgICAgICAgIHNjcmVlblg6IGUuc2NyZWVuWCxcbiAgICAgICAgICAgICAgICAgICAgc2NyZWVuWTogZS5zY3JlZW5ZLFxuICAgICAgICAgICAgICAgICAgICBib3VuZGluZ1JlY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHN0eWxlLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBzdHlsZS50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBoOiBzdHlsZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3OiBzdHlsZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cbn1cblxubmV3IEZsb3dzaG90Q2xpZW50KCk7IiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIGRhdGU6IG51bWJlcjtcbiAgICBkYXRhOiBTZXNzaW9uRGF0YVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25EYXRhIHtcbiAgICBkYXRlOiBudW1iZXI7XG4gICAgc2NyZWVuOiB7XG4gICAgICAgIHRhYjogc3RyaW5nO1xuICAgICAgICBkYXRhVVJJOiBzdHJpbmc7XG4gICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgIHc6IG51bWJlcjtcbiAgICAgICAgICAgIGg6IG51bWJlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGljazoge1xuICAgICAgICBwYWdlWDogbnVtYmVyO1xuICAgICAgICBwYWdlWTogbnVtYmVyO1xuICAgICAgICBzY3JlZW5YOiBudW1iZXI7XG4gICAgICAgIHNjcmVlblk6IG51bWJlcjtcbiAgICAgICAgYm91bmRpbmdSZWN0OiB7XG4gICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICBoOiBudW1iZXI7XG4gICAgICAgICAgICB3OiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nIHtcbiAgICBzdGF0dXM6IFJlY29yZGluZ1N0YXR1cztcbiAgICBldmVudHM6IFJlY29yZGluZ0V2ZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nRXZlbnQge1xuICAgIHRhYjogc3RyaW5nO1xuICAgIGltYWdlOiBzdHJpbmc7XG4gICAgYm91bmRzOiB7XG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgICAgIHBhZ2VZOiBudW1iZXI7XG4gICAgICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICAgICAgY2xpZW50WTogbnVtYmVyO1xuICAgIH07XG59XG5cbmV4cG9ydCBlbnVtIFJlY29yZGluZ1N0YXR1cyB7XG4gICAgJ3N0b3BwZWQnID0gMCxcbiAgICAnc3RhcnRlZCcgPSAxLFxuICAgICdkaXNjYXJkZWQnID0gMixcbn1cblxuZXhwb3J0IGVudW0gQ2hyb21lVGFiU3RhdHVzIHtcbiAgICAnbG9hZGluZycgPSAnbG9hZGluZycsXG4gICAgJ2NvbXBsZXRlJyA9ICdjb21wbGV0ZScsXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgICAgRmxvd3Nob3RFdmVudHM6IEV2ZW50QnVzO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=