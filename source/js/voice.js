/**
 * A thin wrapper around Howler with a specified voice
 * and EventEmitter API
 */

var Emitter = require('component/emitter');
var object  = require('component/object');
var howler  = require('goldfire/howler.js@2.0:/howler.core.min.js');


function Voice(settings) {
	settings = settings || {};
	settings = object.merge(settings, {
		src: ['tone.mp3']
	});
	this.sound = new Howl(settings);
}

Emitter(Voice.prototype);

Voice.prototype.play = function(data) {
	this.emit('play');
	this.sound._rate = data.rate;
	this.sound.play();
};

Voice.prototype.mute = function() {
	this.emit('mute');
	this.sound.mute();
};

Voice.prototype.pause = function() {
	this.emit('pause');
	this.sound.pause();
};

module.exports = Voice;