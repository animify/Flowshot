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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/eventPage.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Utils.ts":
/*!**********************!*\
  !*** ./src/Utils.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getCurrentTab = function () {
        return new Promise(function (resolve) {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
            }, function (tabs) {
                return resolve(tabs[0]);
            });
        });
    };
    Utils.sendMessage = function (tabId, message, callback) {
        chrome.tabs.sendMessage(tabId, message, callback);
    };
    Utils.executeScript = function (tabId, details) {
        chrome.tabs.executeScript(tabId, details);
    };
    Utils.executeOnCurrentTab = function (message, callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, callback);
        });
    };
    return Utils;
}());
exports.Utils = Utils;


/***/ }),

/***/ "./src/eventPage.ts":
/*!**************************!*\
  !*** ./src/eventPage.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
console.log = console.log.bind(null, '%c Flowshot Background:', 'font-weight: bold; color: #000');
var FlowshotMain = /** @class */ (function () {
    function FlowshotMain() {
    }
    Object.defineProperty(FlowshotMain, "baseSession", {
        get: function () {
            return {
                date: Date.now(),
                data: []
            };
        },
        enumerable: true,
        configurable: true
    });
    FlowshotMain.newSession = function () {
        console.log('Session created');
        FlowshotMain.currentSession = FlowshotMain.baseSession;
    };
    FlowshotMain.endSession = function () {
        console.log('Session ended');
        console.log(FlowshotMain.currentSession);
    };
    FlowshotMain.handleSessionChange = function (state) {
        console.log('Handling session change');
        switch (true) {
            case state === types_1.RecordingStatus.started:
                FlowshotMain.newSession();
                break;
            case state === types_1.RecordingStatus.stopped:
                FlowshotMain.endSession();
                break;
        }
    };
    FlowshotMain.saveEvent = function (clickEvent) {
        FlowshotMain.captureCurrentTab().then(function (payload) {
            var sessionData = {
                date: Date.now(),
                screen: payload,
                click: clickEvent
            };
            FlowshotMain.currentSession.data.push(sessionData);
            FlowshotMain.sendToPopup('newImage', payload);
        });
    };
    FlowshotMain.sendToPopup = function (type, payload) {
        chrome.runtime.sendMessage({ type: type, payload: payload });
    };
    FlowshotMain.captureCurrentTab = function () {
        return new Promise((function (resolve) {
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, function (dataURI) {
                if (!dataURI)
                    return;
                var fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = function () {
                    Utils_1.Utils.getCurrentTab().then(function (tab) {
                        resolve({
                            tab: tab.title,
                            dataURI: dataURI,
                            dimensions: {
                                h: fauxImage.height,
                                w: fauxImage.width,
                            }
                        });
                    });
                };
            });
        }));
    };
    return FlowshotMain;
}());
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Handling request - ', request);
    switch (true) {
        case request.popupMounted:
            console.log('Extension mounted');
            break;
        case request.capture:
            console.log('Capturing page');
            break;
        case request.click:
            FlowshotMain.saveEvent(request.payload);
            break;
        case request.recordingState !== undefined:
            FlowshotMain.handleSessionChange(request.recordingState);
            break;
    }
    return true;
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log('Tabs updating', tabId, changeInfo);
    if (changeInfo.status === types_1.ChromeTabStatus.complete) {
        console.log('Injecting script into', tab.title);
        Utils_1.Utils.executeScript(tabId, { file: 'js/clientScript.js' });
    }
});


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ldmVudFBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO0lBb0NBLENBQUM7SUFuQ1UsbUJBQWEsR0FBcEI7UUFDSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixhQUFhLEVBQUUsSUFBSTthQUN0QixFQUFFLFVBQUMsSUFBSTtnQkFDSixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMs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aGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2V2ZW50UGFnZS50c1wiKTtcbiIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICBzdGF0aWMgZ2V0Q3VycmVudFRhYigpOiBQcm9taXNlPGNocm9tZS50YWJzLlRhYj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlLFxyXG4gICAgICAgICAgICB9LCAodGFicykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGFic1swXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZW5kTWVzc2FnZSh0YWJJZDogbnVtYmVyLCBtZXNzYWdlOiBhbnksIGNhbGxiYWNrOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgICAgICB0YWJJZCxcclxuICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleGVjdXRlU2NyaXB0KHRhYklkOiBudW1iZXIsIGRldGFpbHM6IGNocm9tZS50YWJzLkluamVjdERldGFpbHMpIHtcclxuICAgICAgICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KHRhYklkLCBkZXRhaWxzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXhlY3V0ZU9uQ3VycmVudFRhYihtZXNzYWdlOiBhbnksIGNhbGxiYWNrOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcclxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlLFxyXG4gICAgICAgIH0sICh0YWJzKSA9PiB7XHJcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAgdGFic1swXS5pZCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiLi9VdGlsc1wiO1xuaW1wb3J0IHsgQ2hyb21lVGFiU3RhdHVzLCBSZWNvcmRpbmdTdGF0dXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zb2xlLmxvZyA9IGNvbnNvbGUubG9nLmJpbmQobnVsbCwgJyVjIEZsb3dzaG90IEJhY2tncm91bmQ6JywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogIzAwMCcpO1xuXG5pbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgZGF0ZTogbnVtYmVyO1xuICAgIGRhdGE6IFNlc3Npb25EYXRhW107XG59XG5cbmludGVyZmFjZSBTZXNzaW9uRGF0YSB7XG4gICAgZGF0ZTogbnVtYmVyO1xuICAgIHNjcmVlbjoge1xuICAgICAgICB0YWI6IHN0cmluZztcbiAgICAgICAgZGF0YVVSSTogc3RyaW5nO1xuICAgICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgICAgICB3OiBudW1iZXI7XG4gICAgICAgICAgICBoOiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xpY2s6IHtcbiAgICAgICAgcGFnZVg6IG51bWJlcjtcbiAgICAgICAgcGFnZVk6IG51bWJlcjtcbiAgICAgICAgc2NyZWVuWDogbnVtYmVyO1xuICAgICAgICBzY3JlZW5ZOiBudW1iZXI7XG4gICAgICAgIGJvdW5kaW5nUmVjdDoge1xuICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgICAgaDogbnVtYmVyO1xuICAgICAgICAgICAgdzogbnVtYmVyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBGbG93c2hvdE1haW4ge1xuICAgIHB1YmxpYyBzdGF0aWMgY3VycmVudFNlc3Npb246IFNlc3Npb247XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgYmFzZVNlc3Npb24oKTogU2Vzc2lvbiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIG5ld1Nlc3Npb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXNzaW9uIGNyZWF0ZWQnKTtcbiAgICAgICAgRmxvd3Nob3RNYWluLmN1cnJlbnRTZXNzaW9uID0gRmxvd3Nob3RNYWluLmJhc2VTZXNzaW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGVuZFNlc3Npb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXNzaW9uIGVuZGVkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKEZsb3dzaG90TWFpbi5jdXJyZW50U2Vzc2lvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBoYW5kbGVTZXNzaW9uQ2hhbmdlKHN0YXRlOiBSZWNvcmRpbmdTdGF0dXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0hhbmRsaW5nIHNlc3Npb24gY2hhbmdlJylcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHN0YXRlID09PSBSZWNvcmRpbmdTdGF0dXMuc3RhcnRlZDpcbiAgICAgICAgICAgICAgICBGbG93c2hvdE1haW4ubmV3U2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBzdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdHVzLnN0b3BwZWQ6XG4gICAgICAgICAgICAgICAgRmxvd3Nob3RNYWluLmVuZFNlc3Npb24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlRXZlbnQoY2xpY2tFdmVudDogU2Vzc2lvbkRhdGFbJ2NsaWNrJ10pIHtcbiAgICAgICAgRmxvd3Nob3RNYWluLmNhcHR1cmVDdXJyZW50VGFiKCkudGhlbigocGF5bG9hZCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbkRhdGE6IFNlc3Npb25EYXRhID0ge1xuICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgc2NyZWVuOiBwYXlsb2FkLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBjbGlja0V2ZW50XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBGbG93c2hvdE1haW4uY3VycmVudFNlc3Npb24uZGF0YS5wdXNoKHNlc3Npb25EYXRhKTtcbiAgICAgICAgICAgIEZsb3dzaG90TWFpbi5zZW5kVG9Qb3B1cCgnbmV3SW1hZ2UnLCBwYXlsb2FkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNlbmRUb1BvcHVwKHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55KSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZSwgcGF5bG9hZCB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYXB0dXJlQ3VycmVudFRhYigpOiBQcm9taXNlPFNlc3Npb25EYXRhWydzY3JlZW4nXT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIobnVsbCwgeyBmb3JtYXQ6ICdwbmcnLCBxdWFsaXR5OiAxMDAgfSwgKGRhdGFVUkkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGFVUkkpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZhdXhJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIGZhdXhJbWFnZS5zcmMgPSBkYXRhVVJJO1xuICAgICAgICAgICAgICAgIGZhdXhJbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFV0aWxzLmdldEN1cnJlbnRUYWIoKS50aGVuKCh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYjogdGFiLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVUkksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOiBmYXV4SW1hZ2UuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3OiBmYXV4SW1hZ2Uud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSlcbiAgICB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBjb25zb2xlLmxvZygnSGFuZGxpbmcgcmVxdWVzdCAtICcsIHJlcXVlc3QpO1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2UgcmVxdWVzdC5wb3B1cE1vdW50ZWQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXh0ZW5zaW9uIG1vdW50ZWQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJlcXVlc3QuY2FwdHVyZTpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXB0dXJpbmcgcGFnZScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgcmVxdWVzdC5jbGljazpcbiAgICAgICAgICAgIEZsb3dzaG90TWFpbi5zYXZlRXZlbnQocmVxdWVzdC5wYXlsb2FkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJlcXVlc3QucmVjb3JkaW5nU3RhdGUgIT09IHVuZGVmaW5lZDpcbiAgICAgICAgICAgIEZsb3dzaG90TWFpbi5oYW5kbGVTZXNzaW9uQ2hhbmdlKHJlcXVlc3QucmVjb3JkaW5nU3RhdGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59KTtcblxuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgY2hhbmdlSW5mbywgdGFiKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1RhYnMgdXBkYXRpbmcnLCB0YWJJZCwgY2hhbmdlSW5mbyk7XG5cbiAgICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09IENocm9tZVRhYlN0YXR1cy5jb21wbGV0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnSW5qZWN0aW5nIHNjcmlwdCBpbnRvJywgdGFiLnRpdGxlKTtcbiAgICAgICAgVXRpbHMuZXhlY3V0ZVNjcmlwdCh0YWJJZCwgeyBmaWxlOiAnanMvY2xpZW50U2NyaXB0LmpzJyB9KTtcbiAgICB9XG59KTtcbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nIHtcclxuICAgIHN0YXR1czogUmVjb3JkaW5nU3RhdHVzO1xyXG4gICAgZXZlbnRzOiBSZWNvcmRpbmdFdmVudFtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZGluZ0V2ZW50IHtcclxuICAgIHRhYjogc3RyaW5nO1xyXG4gICAgaW1hZ2U6IHN0cmluZztcclxuICAgIGJvdW5kczoge1xyXG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XHJcbiAgICAgICAgcGFnZVk6IG51bWJlcjtcclxuICAgICAgICBjbGllbnRYOiBudW1iZXI7XHJcbiAgICAgICAgY2xpZW50WTogbnVtYmVyO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVjb3JkaW5nU3RhdHVzIHtcclxuICAgICdzdG9wcGVkJyA9IDAsXHJcbiAgICAnc3RhcnRlZCcgPSAxLFxyXG4gICAgJ2Rpc2NhcmRlZCcgPSAyLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDaHJvbWVUYWJTdGF0dXMge1xyXG4gICAgJ2xvYWRpbmcnID0gJ2xvYWRpbmcnLFxyXG4gICAgJ2NvbXBsZXRlJyA9ICdjb21wbGV0ZScsXHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgICAgIEZsb3dzaG90RXZlbnRzOiBFdmVudEJ1cztcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9