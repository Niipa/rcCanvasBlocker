var actualCode = '(' + function() {
	'use strict';

	const toBlobOrig = HTMLCanvasElement.prototype.toBlob;
	const toDataURLOrig = HTMLCanvasElement.prototype.toDataURL;

	var scramble = function() {
		console.log("Scramble called()");
		const {width, height} = this;
		const context = this.getContext('2d');
		const shift = {
			'r': Math.floor(Math.random() * 10) - 5,
			'g': Math.floor(Math.random() * 10) - 5,
			'b': Math.floor(Math.random() * 10) - 5
		};
		const matt = context.getImageData(0, 0, width, height);
		for (let i = 0; i < height; i += 3) {
			for (let j = 0; j < width; j += 3) {
				const n = ((i * (width * 4)) + (j * 4));
				matt.data[n + 0] = matt.data[n + 0] + shift.r;
				matt.data[n + 1] = matt.data[n + 1] + shift.g;
				matt.data[n + 2] = matt.data[n + 2] + shift.b;
			}
		}
		context.putImageData(matt, 0, 0);
		var x = toDataURLOrig.apply(this, arguments);
		console.log(x);
		return x;
	};

	const handler = {
		apply: function(target, thisArg, argumentsList) {
			return scramble.apply(thisArg, argumentsList);
		}
	};

	var proxy = new Proxy(toDataURLOrig, handler);
	HTMLCanvasElement.prototype.toDataURL = proxy;
} + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.remove();