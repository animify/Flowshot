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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentScript.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/contentScript.ts":
/*!******************************!*\
  !*** ./src/contentScript.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
console.log = console.log.bind(null, '%c Flowshot Content:', 'font-weight: bold; color: #000');
var FlowshotContent = /** @class */ (function () {
    function FlowshotContent() {
    }
    FlowshotContent.listenToRequest = function () {
        console.log('Listening to runtime');
        chrome.runtime.onMessage.removeListener(FlowshotContent.handleRequest);
        chrome.runtime.onMessage.addListener(FlowshotContent.handleRequest);
    };
    FlowshotContent.handleRequest = function (request, sender, respond) {
        console.log('Handling request', request);
        switch (true) {
            case request.changeRecordingState && request.recordingState === types_1.RecordingStatus.started:
                FlowshotContent.startRecording();
                break;
            case request.changeRecordingState && request.recordingState === types_1.RecordingStatus.stopped:
                FlowshotContent.stopRecording();
                break;
        }
    };
    FlowshotContent.startRecording = function () {
        console.log('Starting recording');
        document.dispatchEvent(new CustomEvent('fs-request', {
            detail: { startRecording: true }
        }));
        document.removeEventListener('fs-request', FlowshotContent.handleMessage);
        document.addEventListener('fs-request', FlowshotContent.handleMessage);
    };
    FlowshotContent.handleMessage = function (event) {
        console.log('Handling message', event);
        switch (true) {
            case event.detail.click:
                FlowshotContent.sendToBackground(event.detail);
                break;
        }
    };
    FlowshotContent.sendToBackground = function (payload) {
        chrome.runtime.sendMessage(payload);
    };
    FlowshotContent.stopRecording = function () {
        console.log('Stopping recording');
        document.dispatchEvent(new CustomEvent('fs-request', {
            detail: { stopRecording: true }
        }));
    };
    return FlowshotContent;
}());
FlowshotContent.listenToRequest();


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRTY3JpcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxtRUFBMEM7QUFFMUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUUvRjtJQUFBO0lBb0RBLENBQUM7SUFuRFUsK0JBQWUsR0FBdEI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTSw2QkFBYSxHQUFwQixVQUFxQixPQUFZLEVBQUUsTUFBb0MsRUFBRSxPQUFZO1FBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFekMsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSSxPQUFPLENBQUMsY0FBYyxLQUFLLHVCQUFlLENBQUMsT0FBTztnQkFDbkYsZUFBZSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNqQyxNQUFNO1lBQ1YsS0FBSyxPQUFPLENBQUMsb0JBQW9CLElBQUksT0FBTyxDQUFDLGNBQWMsS0FBSyx1QkFBZSxDQUFDLE9BQU87Z0JBQ25GLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDaEMsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVNLDhCQUFjLEdBQXJCO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWxDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFO1lBQ2pELE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUU7U0FDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSixRQUFRLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRU0sNkJBQWEsR0FBcEIsVUFBcUIsS0FBa0I7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUM7UUFFdEMsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDbkIsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVNLGdDQUFnQixHQUF2QixVQUF3QixPQUFZO1FBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSw2QkFBYSxHQUFwQjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRTtZQUNqRCxNQUFNLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO1NBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FBQztBQUVELGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDeENsQyxJQUFZLGVBSVg7QUFKRCxXQUFZLGVBQWU7SUFDdkIsMkRBQWE7SUFDYiwyREFBYTtJQUNiLCtEQUFlO0FBQ25CLENBQUMsRUFKVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUkxQjtBQUVELElBQVksZUFHWDtBQUhELFdBQVksZUFBZTtJQUN2QixzQ0FBcUI7SUFDckIsd0NBQXVCO0FBQzNCLENBQUMsRUFIVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUcxQiIsImZpbGUiOiJjb250ZW50U2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29udGVudFNjcmlwdC50c1wiKTtcbiIsImltcG9ydCB7IFJlY29yZGluZ1N0YXR1cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmNvbnNvbGUubG9nID0gY29uc29sZS5sb2cuYmluZChudWxsLCAnJWMgRmxvd3Nob3QgQ29udGVudDonLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjMDAwJyk7XG5cbmNsYXNzIEZsb3dzaG90Q29udGVudCB7XG4gICAgc3RhdGljIGxpc3RlblRvUmVxdWVzdCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xpc3RlbmluZyB0byBydW50aW1lJyk7XG5cbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKEZsb3dzaG90Q29udGVudC5oYW5kbGVSZXF1ZXN0KTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKEZsb3dzaG90Q29udGVudC5oYW5kbGVSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaGFuZGxlUmVxdWVzdChyZXF1ZXN0OiBhbnksIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlciwgcmVzcG9uZDogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdIYW5kbGluZyByZXF1ZXN0JywgcmVxdWVzdCk7XG5cbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHJlcXVlc3QuY2hhbmdlUmVjb3JkaW5nU3RhdGUgJiYgcmVxdWVzdC5yZWNvcmRpbmdTdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdHVzLnN0YXJ0ZWQ6XG4gICAgICAgICAgICAgICAgRmxvd3Nob3RDb250ZW50LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHJlcXVlc3QuY2hhbmdlUmVjb3JkaW5nU3RhdGUgJiYgcmVxdWVzdC5yZWNvcmRpbmdTdGF0ZSA9PT0gUmVjb3JkaW5nU3RhdHVzLnN0b3BwZWQ6XG4gICAgICAgICAgICAgICAgRmxvd3Nob3RDb250ZW50LnN0b3BSZWNvcmRpbmcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzdGFydFJlY29yZGluZygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIHJlY29yZGluZycpO1xuXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmcy1yZXF1ZXN0Jywge1xuICAgICAgICAgICAgZGV0YWlsOiB7IHN0YXJ0UmVjb3JkaW5nOiB0cnVlIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZzLXJlcXVlc3QnLCBGbG93c2hvdENvbnRlbnQuaGFuZGxlTWVzc2FnZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZzLXJlcXVlc3QnLCBGbG93c2hvdENvbnRlbnQuaGFuZGxlTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhbmRsZU1lc3NhZ2UoZXZlbnQ6IEN1c3RvbUV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdIYW5kbGluZyBtZXNzYWdlJywgZXZlbnQpXG5cbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIGV2ZW50LmRldGFpbC5jbGljazpcbiAgICAgICAgICAgICAgICBGbG93c2hvdENvbnRlbnQuc2VuZFRvQmFja2dyb3VuZChldmVudC5kZXRhaWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNlbmRUb0JhY2tncm91bmQocGF5bG9hZDogYW55KSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBheWxvYWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wUmVjb3JkaW5nKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnU3RvcHBpbmcgcmVjb3JkaW5nJyk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmcy1yZXF1ZXN0Jywge1xuICAgICAgICAgICAgZGV0YWlsOiB7IHN0b3BSZWNvcmRpbmc6IHRydWUgfVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuXG5GbG93c2hvdENvbnRlbnQubGlzdGVuVG9SZXF1ZXN0KCk7IiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRpbmcge1xyXG4gICAgc3RhdHVzOiBSZWNvcmRpbmdTdGF0dXM7XHJcbiAgICBldmVudHM6IFJlY29yZGluZ0V2ZW50W107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkaW5nRXZlbnQge1xyXG4gICAgdGFiOiBzdHJpbmc7XHJcbiAgICBpbWFnZTogc3RyaW5nO1xyXG4gICAgYm91bmRzOiB7XHJcbiAgICAgICAgcGFnZVg6IG51bWJlcjtcclxuICAgICAgICBwYWdlWTogbnVtYmVyO1xyXG4gICAgICAgIGNsaWVudFg6IG51bWJlcjtcclxuICAgICAgICBjbGllbnRZOiBudW1iZXI7XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBSZWNvcmRpbmdTdGF0dXMge1xyXG4gICAgJ3N0b3BwZWQnID0gMCxcclxuICAgICdzdGFydGVkJyA9IDEsXHJcbiAgICAnZGlzY2FyZGVkJyA9IDIsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIENocm9tZVRhYlN0YXR1cyB7XHJcbiAgICAnbG9hZGluZycgPSAnbG9hZGluZycsXHJcbiAgICAnY29tcGxldGUnID0gJ2NvbXBsZXRlJyxcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICAgICAgRmxvd3Nob3RFdmVudHM6IEV2ZW50QnVzO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=