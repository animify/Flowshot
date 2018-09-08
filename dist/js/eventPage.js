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
                return resolve(tabs[0].id);
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
console.log = console.log.bind(null, '%c Flowshot:', 'font-weight: bold; color: #000');
// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // onMessage must return "true" if response is async.
    var isResponseAsync = true;
    switch (true) {
        case request.popupMounted:
            console.log('Extension mounted');
            break;
        case request.capture:
            console.log('Capturing page');
            break;
        case request.click:
            var payload = request.payload;
            console.log('Got payload', payload);
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, function (dataURI) {
                if (dataURI) {
                    var fauxImage_1 = new Image();
                    fauxImage_1.src = dataURI;
                    fauxImage_1.onload = function () {
                        console.log('Built image', fauxImage_1);
                        chrome.runtime.sendMessage({
                            type: 'newImage', payload: {
                                title: 'any',
                                date: Date.now(),
                                dataURI: dataURI,
                                bounds: {
                                    h: fauxImage_1.height,
                                    w: fauxImage_1.width,
                                }
                            }
                        });
                    };
                }
            });
            break;
        default:
            console.log('Background Request - ', request);
            break;
    }
    return isResponseAsync;
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    window.console.log('updated from background', changeInfo);
    if (changeInfo.status === types_1.ChromeTabStatus.complete) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9ldmVudFBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTtJQUFBO0lBb0NBLENBQUM7SUFuQ1UsbUJBQWEsR0FBcEI7UUFDSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixhQUFhLEVBQUUsSUFBSTthQUN0QixFQUFFLFVBQUMsSUFBSTtnQkFDSixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0Is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TyxlQUFlLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQUc7SUFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUQsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLHVCQUFlLENBQUMsUUFBUSxFQUFFO1FBQ2hELGFBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztLQUM5RDtBQUNMLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN6Q0gsSUFBWSxlQUdYO0FBSEQsV0FBWSxlQUFlO0lBQ3ZCLDJEQUFhO0lBQ2IsMkRBQWE7QUFDakIsQ0FBQyxFQUhXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBRzFCO0FBRUQsSUFBWSxlQUdYO0FBSEQsV0FBWSxlQUFlO0lBQ3ZCLHNDQUFxQjtJQUNyQix3Q0FBdUI7QUFDM0IsQ0FBQyxFQUhXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBRzFCIiwiZmlsZSI6ImV2ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2V2ZW50UGFnZS50c1wiKTtcbiIsImV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICBzdGF0aWMgZ2V0Q3VycmVudFRhYigpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlLFxyXG4gICAgICAgICAgICB9LCAodGFicykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGFic1swXS5pZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNlbmRNZXNzYWdlKHRhYklkOiBudW1iZXIsIG1lc3NhZ2U6IGFueSwgY2FsbGJhY2s6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHRhYklkLFxyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBjYWxsYmFja1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4ZWN1dGVTY3JpcHQodGFiSWQ6IG51bWJlciwgZGV0YWlsczogY2hyb21lLnRhYnMuSW5qZWN0RGV0YWlscykge1xyXG4gICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIGRldGFpbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleGVjdXRlT25DdXJyZW50VGFiKG1lc3NhZ2U6IGFueSwgY2FsbGJhY2s6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXHJcbiAgICAgICAgfSwgKHRhYnMpID0+IHtcclxuICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICB0YWJzWzBdLmlkLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL1V0aWxzXCI7XG5pbXBvcnQgeyBDaHJvbWVUYWJTdGF0dXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zb2xlLmxvZyA9IGNvbnNvbGUubG9nLmJpbmQobnVsbCwgJyVjIEZsb3dzaG90OicsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICMwMDAnKTtcblxuLy8gTGlzdGVuIHRvIG1lc3NhZ2VzIHNlbnQgZnJvbSBvdGhlciBwYXJ0cyBvZiB0aGUgZXh0ZW5zaW9uLlxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIC8vIG9uTWVzc2FnZSBtdXN0IHJldHVybiBcInRydWVcIiBpZiByZXNwb25zZSBpcyBhc3luYy5cbiAgICBsZXQgaXNSZXNwb25zZUFzeW5jID0gdHJ1ZTtcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICBjYXNlIHJlcXVlc3QucG9wdXBNb3VudGVkOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0V4dGVuc2lvbiBtb3VudGVkJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSByZXF1ZXN0LmNhcHR1cmU6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FwdHVyaW5nIHBhZ2UnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJlcXVlc3QuY2xpY2s6XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gcmVxdWVzdC5wYXlsb2FkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dvdCBwYXlsb2FkJywgcGF5bG9hZClcbiAgICAgICAgICAgIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKG51bGwsXG4gICAgICAgICAgICAgICAgeyBmb3JtYXQ6ICdwbmcnLCBxdWFsaXR5OiAxMDAgfSwgKGRhdGFVUkkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFVUkkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhdXhJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmF1eEltYWdlLnNyYyA9IGRhdGFVUkk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYXV4SW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCdWlsdCBpbWFnZScsIGZhdXhJbWFnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICduZXdJbWFnZScsIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnYW55JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVVJJLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDogZmF1eEltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3OiBmYXV4SW1hZ2Uud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQmFja2dyb3VuZCBSZXF1ZXN0IC0gJywgcmVxdWVzdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gaXNSZXNwb25zZUFzeW5jO1xufSk7XG5cbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZygndXBkYXRlZCBmcm9tIGJhY2tncm91bmQnLCBjaGFuZ2VJbmZvKTtcbiAgICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09IENocm9tZVRhYlN0YXR1cy5jb21wbGV0ZSkge1xuICAgICAgICBVdGlscy5leGVjdXRlU2NyaXB0KHRhYklkLCB7IGZpbGU6ICdqcy9jbGllbnRTY3JpcHQuanMnIH0pO1xuICAgIH1cbn0pOyIsImV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nIHtcclxuICAgIHN0YXR1czogUmVjb3JkaW5nU3RhdHVzO1xyXG4gICAgZXZlbnRzOiBSZWNvcmRpbmdFdmVudFtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZGluZ0V2ZW50IHtcclxuICAgIGJvdW5kczoge1xyXG4gICAgICAgIHBhZ2VYOiBudW1iZXI7XHJcbiAgICAgICAgcGFnZVk6IG51bWJlcjtcclxuICAgICAgICBjbGllbnRYOiBudW1iZXI7XHJcbiAgICAgICAgY2xpZW50WTogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgaW1hZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVjb3JkaW5nU3RhdHVzIHtcclxuICAgICdzdG9wcGVkJyA9IDAsXHJcbiAgICAnc3RhcnRlZCcgPSAxLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDaHJvbWVUYWJTdGF0dXMge1xyXG4gICAgJ2xvYWRpbmcnID0gJ2xvYWRpbmcnLFxyXG4gICAgJ2NvbXBsZXRlJyA9ICdjb21wbGV0ZScsXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9