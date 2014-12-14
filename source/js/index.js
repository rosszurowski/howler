var Voice = require('./voice');
var prototypes = require('rosszurowski/prototypes:/prototypes.js');

var v = window.v = new Voice({ volume: 0.3 });
var canvas = document.find('.canvas');
var letters = [];
var distance = 20;

function add() {
	var value = random(0,9);
	var el = construct(Math.floor(value));
	letters.push(el);
	el.style.opacity = 1.0;
	canvas.appendChild(el);
	if (canvas.scrollHeight > window.innerHeight) {
		setTimeout(clear, 400);
		v.play({ rate: 0.01 });
	} else {
		letters.forEach(function(el, index) {
			el.style.opacity = nerp(3, 0, 1, distance / (letters.length - index));
		});
		v.play({ rate: (value / 4.5) });
	}
	setTimeout(add, random(400, 2100));
}

function clear() {
	letters.forEach(function(el) {
		el.remove();
	});
	letters = [];
}

setTimeout(add, random(1000, 1500));

function random(min, max) {
	return (Math.random() * (max - min) + min).toFixed(2);
}

function construct(text) {
	var el = document.createElement('span');
	el.textContent = text;
	return el;
}

/**
 * N-th degree polynomial interpolation
 * @param {Number} degree
 * @param {Number} min
 * @param {Number} max
 * @param {Number} amount
 * @returns {Number}
 */
function nerp(degree, min, max, amount) {
	return min + Math.pow(amount, degree) * (max - min);
}