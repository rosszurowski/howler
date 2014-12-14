var Voice = require('./voice');
var random = require('./random');
var prototypes = require('rosszurowski/prototypes:/prototypes.js');

var voice = new Voice({ volume: 0.4 });
var canvas = document.find('.canvas');
var delay = setTimeout;
var letters = [];
var distance = 25;
var next;

window.bind('keydown', type);

loop();

function loop() {
	next = delay(
		add.bind(window,
			Math.floor(random(0, 9))),
		random(400, 2100));
}

function type(e) {
	// only number keys
	if (e.which < 47 || e.which > 59) return;
	clearTimeout(next);
	add(String.fromCharCode(e.which));
}

function add(int) {
	var letter = construct(int);
	letters.push(letter);
	canvas.appendChild(letter);
	if (canvas.scrollHeight > window.innerHeight) {
		delay(clear, 400);
		voice.play({ rate: 0.01 });
	} else {
		letters.forEach(function(el, index) {
			el.style.opacity = nerp(3, 0, 1, distance / (letters.length - index));
		});
		voice.play({ rate: (int / 4.5) });
	}
	loop();
}

function clear() {
	letters.forEach(function(el) { el.remove(); });
	letters = [];
}

/**
 * Construct letterforms
 * @param {String} text
 * @returns {HTMLElement}
 */
function construct(text) {
	var el = document.createElement('span');
	el.textContent = text;
	el.style.opacity = 1.0;
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