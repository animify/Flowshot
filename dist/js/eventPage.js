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
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, function (dataURI) {
                if (!dataURI)
                    return;
                var fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = function () {
                    console.log('Built image');
                    Utils_1.Utils.getCurrentTab().then(function (tab) {
                        chrome.runtime.sendMessage({
                            type: 'newImage', payload: {
                                title: 'any',
                                tab: tab.title,
                                date: Date.now(),
                                dataURI: dataURI,
                                bounds: {
                                    h: fauxImage.height,
                                    w: fauxImage.width,
                                }
                            }
                        });
                    });
                };
            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ldmVudFBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO0lBb0NBLENBQUM7SUFuQ1UsbUJBQWEsR0FBcEI7UUFDSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixhQUFhLEVBQUUsSUFBSTthQUN0QixFQUFFLFVBQUMsSUFBSTtnQkFDSixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMs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U0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRztJQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFaEQsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLHVCQUFlLENBQUMsUUFBUSxFQUFFO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELGFBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztLQUM5RDtBQUNMLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNqQ0gsSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3ZCLDJEQUFhO0lBQ2IsMkRBQWE7SUFDYiwrREFBZTtBQUNuQixDQUFDLEVBSlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFJMUI7QUFFRCxJQUFZLGVBR1g7QUFIRCxXQUFZLGVBQWU7SUFDdkIsc0NBQXFCO0lBQ3JCLHdDQUF1QjtBQUMzQixDQUFDLEVBSFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFHMUIiLCJmaWxlIjoiZXZlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvZXZlbnRQYWdlLnRzXCIpO1xuIiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIHN0YXRpYyBnZXRDdXJyZW50VGFiKCk6IFByb21pc2U8Y2hyb21lLnRhYnMuVGFiPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXHJcbiAgICAgICAgICAgIH0sICh0YWJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0YWJzWzBdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNlbmRNZXNzYWdlKHRhYklkOiBudW1iZXIsIG1lc3NhZ2U6IGFueSwgY2FsbGJhY2s6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHRhYklkLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjYWxsYmFja1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4ZWN1dGVTY3JpcHQodGFiSWQ6IG51bWJlciwgZGV0YWlsczogY2hyb21lLnRhYnMuSW5qZWN0RGV0YWlscykge1xyXG4gICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIGRldGFpbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleGVjdXRlT25DdXJyZW50VGFiKG1lc3NhZ2U6IGFueSwgY2FsbGJhY2s6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXHJcbiAgICAgICAgfSwgKHRhYnMpID0+IHtcclxuICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICB0YWJzWzBdLmlkLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBDaHJvbWVUYWJTdGF0dXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zb2xlLmxvZyA9IGNvbnNvbGUubG9nLmJpbmQobnVsbCwgJyVjIEZsb3dzaG90IEJhY2tncm91bmQ6JywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogIzAwMCcpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0hhbmRsaW5nIHJlcXVlc3QgLSAnLCByZXF1ZXN0KTtcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICBjYXNlIHJlcXVlc3QucG9wdXBNb3VudGVkOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0V4dGVuc2lvbiBtb3VudGVkJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSByZXF1ZXN0LmNhcHR1cmU6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FwdHVyaW5nIHBhZ2UnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJlcXVlc3QuY2xpY2s6XG4gICAgICAgICAgICBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYihudWxsLCB7IGZvcm1hdDogJ3BuZycsIHF1YWxpdHk6IDEwMCB9LCAoZGF0YVVSSSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YVVSSSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZhdXhJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIGZhdXhJbWFnZS5zcmMgPSBkYXRhVVJJO1xuICAgICAgICAgICAgICAgIGZhdXhJbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCdWlsdCBpbWFnZScpO1xuICAgICAgICAgICAgICAgICAgICBVdGlscy5nZXRDdXJyZW50VGFiKCkudGhlbigodGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ25ld0ltYWdlJywgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ2FueScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYjogdGFiLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJJLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGg6IGZhdXhJbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3OiBmYXV4SW1hZ2Uud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59KTtcblxuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgY2hhbmdlSW5mbywgdGFiKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1RhYnMgdXBkYXRpbmcnLCB0YWJJZCwgY2hhbmdlSW5mbyk7XG5cbiAgICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09IENocm9tZVRhYlN0YXR1cy5jb21wbGV0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnSW5qZWN0aW5nIHNjcmlwdCBpbnRvJywgdGFiLnRpdGxlKTtcbiAgICAgICAgVXRpbHMuZXhlY3V0ZVNjcmlwdCh0YWJJZCwgeyBmaWxlOiAnanMvY2xpZW50U2NyaXB0LmpzJyB9KTtcbiAgICB9XG59KTtcbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nIHtcclxuICAgIHN0YXR1czogUmVjb3JkaW5nU3RhdHVzO1xyXG4gICAgZXZlbnRzOiBSZWNvcmRpbmdFdmVudFtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZGluZ0V2ZW50IHtcclxuICAgIHRhYjogc3RyaW5nO1xyXG4gICAgaW1hZ2U6IHN0cmluZztcclxuICAgIGJvdW5kczoge1xyXG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XHJcbiAgICAgICAgcGFnZVk6IG51bWJlcjtcclxuICAgICAgICBjbGllbnRYOiBudW1iZXI7XHJcbiAgICAgICAgY2xpZW50WTogbnVtYmVyO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVjb3JkaW5nU3RhdHVzIHtcclxuICAgICdzdG9wcGVkJyA9IDAsXHJcbiAgICAnc3RhcnRlZCcgPSAxLFxyXG4gICAgJ2Rpc2NhcmRlZCcgPSAyLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDaHJvbWVUYWJTdGF0dXMge1xyXG4gICAgJ2xvYWRpbmcnID0gJ2xvYWRpbmcnLFxyXG4gICAgJ2NvbXBsZXRlJyA9ICdjb21wbGV0ZScsXHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgICAgIEZsb3dzaG90RXZlbnRzOiBFdmVudEJ1cztcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9