const toBlobOrig = HTMLCanvasElement.prototype.toBlob;
const toDataURLOrig = HTMLCanvasElement.prototype.toDataURL;

var getCanvas = function() {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", 300);
	canvas.setAttribute("height", 300);
	document.documentElement.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	// Draw a house
	// Set line width
	ctx.lineWidth = 10;
	// Wall
	ctx.strokeRect(75, 140, 150, 110);
	// Door
	ctx.fillRect(130, 190, 40, 60);
	// Roof
	ctx.moveTo(50, 140);
	ctx.lineTo(150, 60);
	ctx.lineTo(250, 140);
	ctx.closePath();
	ctx.stroke();
	return canvas;
}

// the actual scramble() method called from within scramble.js is in an anoymous function
// if we put it in the global scope, then it will be visible to our opponents
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


function setupProxy() {
	const handler = {
		apply: function(target, thisArg, argumentsList) {
		  return scramble.apply(thisArg, argumentsList);
		}
	};

  var proxy = new Proxy(toDataURLOrig, handler);
  HTMLCanvasElement.prototype.toDataURL = proxy;
}

describe('Scramble() changes canvas', function() {	
	it('should scramble toDataURL', function() {
		var canvas = getCanvas();
		var orig = canvas.toDataURL();
		setupProxy();

		if(orig === canvas.toDataURL()) {
			throw "The two calls should be different"; 
		}
	});
});