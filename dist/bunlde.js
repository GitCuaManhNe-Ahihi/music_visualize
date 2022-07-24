/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./style/index.scss ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./source/index.ts ***!
  \*************************/

/* eslint-disable require-jsdoc */
window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var dino = document.getElementById('dino');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    var Bar = /** @class */ (function () {
        function Bar(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        Bar.prototype.update = function (micInput) {
            var sound = micInput * 2000;
            if (sound > this.height) {
                this.height = sound;
            }
            else {
                this.height -= this.height * 0.03;
            }
        };
        Bar.prototype.draw = function (context) {
            if (context) {
                context.strokeStyle = this.color;
                context.lineWidth = this.width;
                context.save();
                context.translate(canvas.width / 2 - 30, canvas.height / 2);
                context.rotate(this.index * 0.03 + 180);
                context.beginPath();
                context.bezierCurveTo(this.x / 2, this.y / 2, this.height * -0.5 - 150, this.height + 50, this.x, this.y);
                context.stroke();
                if (this.index > 100) {
                    context.beginPath();
                    context.arc(this.x, this.y + 10 + this.height / 2 + this.height * 0.1, this.height * 0.1, 0, Math.PI * 2);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(this.x, this.y + 10);
                    context.lineTo(this.x, this.y + 10 + this.height / 2);
                    context.stroke();
                }
                context.restore();
            }
        };
        return Bar;
    }());
    var Microphone = /** @class */ (function () {
        function Microphone(fftSize) {
            var _this = this;
            this.initilalized = false;
            this.initilalized = false;
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                _this.audioContext = new AudioContext();
                _this.microphone = _this.audioContext.createMediaStreamSource(stream);
                _this.analyser = _this.audioContext.createAnalyser();
                _this.analyser.fftSize = fftSize;
                var bufferLenght = _this.analyser.frequencyBinCount;
                _this.dataArray = new Uint8Array(bufferLenght);
                _this.microphone.connect(_this.analyser);
                _this.initilalized = true;
            })
                .catch(function (error) {
                alert(error.message);
            });
        }
        Microphone.prototype.getSamples = function () {
            if (this.analyser !== undefined && this.dataArray !== undefined) {
                this.analyser.getByteTimeDomainData(this.dataArray);
                var normalSamples = Array.from(this.dataArray).map(function (e) { return e / 128 - 1; });
                return normalSamples;
            }
        };
        Microphone.prototype.getVolume = function () {
            if (this.analyser !== undefined && this.dataArray !== undefined) {
                this.analyser.getByteTimeDomainData(this.dataArray);
                var normalSamples = Array.from(this.dataArray).map(function (e) { return e / 128 - 1; });
                var sum_1 = 0;
                normalSamples.forEach(function (number) {
                    sum_1 += Math.pow(number, 2);
                });
                var volume = Math.sqrt(sum_1 / normalSamples.length);
                return volume;
            }
        };
        return Microphone;
    }());
    var fftSize = 512;
    var microphone = new Microphone(fftSize);
    var bars = [];
    var barWidth = canvas.width / (fftSize / 2);
    function createBars() {
        for (var i = 1; i < fftSize / 2; i++) {
            bars.push(new Bar(0, i, 1, 50, "hsl(".concat(i, ",121%,31%)"), i));
        }
    }
    createBars();
    var softVolume = 0;
    function animate() {
        if (microphone.initilalized === true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var samples_1 = microphone.getSamples();
            var volume = microphone.getVolume();
            if (samples_1 !== undefined && bars && bars.length > 0) {
                bars.forEach(function (bar, index) {
                    bar.update(samples_1[index]);
                    bar.draw(ctx);
                });
            }
            ctx.restore();
            if (volume) {
                softVolume = softVolume * 0.9 + volume * 0.1;
                if (dino) {
                    dino.style.transform = "translate(-45%, -50%) scale(".concat(2.5 + softVolume, ",").concat(2.5 + softVolume, ")");
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
});

})();

/******/ })()
;
//# sourceMappingURL=bunlde.js.map