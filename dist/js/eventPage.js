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
})(RecordingStatus = exports.RecordingStatus || (exports.RecordingStatus = {}));
var ChromeTabStatus;
(function (ChromeTabStatus) {
    ChromeTabStatus["loading"] = "loading";
    ChromeTabStatus["complete"] = "complete";
})(ChromeTabStatus = exports.ChromeTabStatus || (exports.ChromeTabStatus = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ldmVudFBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO0lBb0NBLENBQUM7SUFuQ1UsbUJBQWEsR0FBcEI7UUFDSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixhQUFhLEVBQUUsSUFBSTthQUN0QixFQUFFLFVBQUMsSUFBSTtnQkFDSixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMs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V0FBVyxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxHQUFHO0lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUVoRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssdUJBQWUsQ0FBQyxRQUFRLEVBQUU7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsYUFBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO0tBQzlEO0FBQ0wsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ25DSCxJQUFZLGVBR1g7QUFIRCxXQUFZLGVBQWU7SUFDdkIsMkRBQWE7SUFDYiwyREFBYTtBQUNqQixDQUFDLEVBSFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFHMUI7QUFFRCxJQUFZLGVBR1g7QUFIRCxXQUFZLGVBQWU7SUFDdkIsc0NBQXFCO0lBQ3JCLHdDQUF1QjtBQUMzQixDQUFDLEVBSFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFHMUIiLCJmaWxlIjoiZXZlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvZXZlbnRQYWdlLnRzXCIpO1xuIiwiZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuICAgIHN0YXRpYyBnZXRDdXJyZW50VGFiKCk6IFByb21pc2U8Y2hyb21lLnRhYnMuVGFiPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXHJcbiAgICAgICAgICAgIH0sICh0YWJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0YWJzWzBdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2VuZE1lc3NhZ2UodGFiSWQ6IG51bWJlciwgbWVzc2FnZTogYW55LCBjYWxsYmFjazogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAgdGFiSWQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXhlY3V0ZVNjcmlwdCh0YWJJZDogbnVtYmVyLCBkZXRhaWxzOiBjaHJvbWUudGFicy5JbmplY3REZXRhaWxzKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJJZCwgZGV0YWlscyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4ZWN1dGVPbkN1cnJlbnRUYWIobWVzc2FnZTogYW55LCBjYWxsYmFjazogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcclxuICAgICAgICB9LCAodGFicykgPT4ge1xyXG4gICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHRhYnNbMF0uaWQsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IENocm9tZVRhYlN0YXR1cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmNvbnNvbGUubG9nID0gY29uc29sZS5sb2cuYmluZChudWxsLCAnJWMgRmxvd3Nob3QgQmFja2dyb3VuZDonLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjMDAwJyk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBjb25zb2xlLmxvZygnSGFuZGxpbmcgcmVxdWVzdCAtICcsIHJlcXVlc3QpO1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2UgcmVxdWVzdC5wb3B1cE1vdW50ZWQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXh0ZW5zaW9uIG1vdW50ZWQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJlcXVlc3QuY2FwdHVyZTpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXB0dXJpbmcgcGFnZScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgcmVxdWVzdC5jbGljazpcbiAgICAgICAgICAgIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKG51bGwsIHsgZm9ybWF0OiAncG5nJywgcXVhbGl0eTogMTAwIH0sIChkYXRhVVJJKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhVVJJKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgZmF1eEltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgZmF1eEltYWdlLnNyYyA9IGRhdGFVUkk7XG4gICAgICAgICAgICAgICAgZmF1eEltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0J1aWx0IGltYWdlJyk7XG4gICAgICAgICAgICAgICAgICAgIFV0aWxzLmdldEN1cnJlbnRUYWIoKS50aGVuKCh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbmV3SW1hZ2UnLCBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnYW55JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiOiB0YWIudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVUkksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDogZmF1eEltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHc6IGZhdXhJbWFnZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufSk7XG5cbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdUYWJzIHVwZGF0aW5nJywgdGFiSWQsIGNoYW5nZUluZm8pO1xuXG4gICAgaWYgKGNoYW5nZUluZm8uc3RhdHVzID09PSBDaHJvbWVUYWJTdGF0dXMuY29tcGxldGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0luamVjdGluZyBzY3JpcHQgaW50bycsIHRhYi50aXRsZSk7XG4gICAgICAgIFV0aWxzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIHsgZmlsZTogJ2pzL2NsaWVudFNjcmlwdC5qcycgfSk7XG4gICAgfVxufSk7IiwiZXhwb3J0IGludGVyZmFjZSBSZWNvcmRpbmcge1xyXG4gICAgc3RhdHVzOiBSZWNvcmRpbmdTdGF0dXM7XHJcbiAgICBldmVudHM6IFJlY29yZGluZ0V2ZW50W107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nRXZlbnQge1xyXG4gICAgdGFiOiBzdHJpbmc7XHJcbiAgICBpbWFnZTogc3RyaW5nO1xyXG4gICAgYm91bmRzOiB7XHJcbiAgICAgICAgcGFnZVg6IG51bWJlcjtcclxuICAgICAgICBwYWdlWTogbnVtYmVyO1xyXG4gICAgICAgIGNsaWVudFg6IG51bWJlcjtcclxuICAgICAgICBjbGllbnRZOiBudW1iZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFJlY29yZGluZ1N0YXR1cyB7XHJcbiAgICAnc3RvcHBlZCcgPSAwLFxyXG4gICAgJ3N0YXJ0ZWQnID0gMSxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQ2hyb21lVGFiU3RhdHVzIHtcclxuICAgICdsb2FkaW5nJyA9ICdsb2FkaW5nJyxcclxuICAgICdjb21wbGV0ZScgPSAnY29tcGxldGUnLFxyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcclxuICAgICAgICBGbG93c2hvdEV2ZW50OiBhbnk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==