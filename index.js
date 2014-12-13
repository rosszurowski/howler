var Voice = require('./lib/voice');
var prototypes = require('rosszurowski/prototypes:/prototypes.js')

var v = new Voice();

window.bind('keydown', function(e) {
	if (e.ctrlKey || e.metaKey || e.shiftKey) return;
	v.play({rate:e.which/120});
});