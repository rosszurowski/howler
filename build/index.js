(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
var Voice = require('./lib/voice');
var prototypes = require('rosszurowski/prototypes:/prototypes.js')

var v = new Voice();

window.bind('keydown', function(e) {
	if (e.ctrlKey || e.metaKey || e.shiftKey) return;
	v.play({rate:e.which/120});
});
}, {"./lib/voice":2,"rosszurowski/prototypes:/prototypes.js":3}],
2: [function(require, module, exports) {
/**
 * A thin wrapper around Howler with a specified voice
 * and EventEmitter API
 */

var Emitter = require('component/emitter');
var object  = require('component/object');
var howler  = require('goldfire/howler.js@2.0:/howler.core.min.js');


function Voice(settings) {
	settings = settings || {}
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
}

Voice.prototype.mute = function() {
	this.emit('mute');
	this.sound.mute();
}

Voice.prototype.pause = function() {
	this.emit('pause');
	this.sound.pause();
}

module.exports = Voice;
}, {"component/emitter":4,"component/object":5,"goldfire/howler.js@2.0:/howler.core.min.js":6}],
4: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {}],
5: [function(require, module, exports) {

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
}, {}],
6: [function(require, module, exports) {
/*! howler.js v2.0.0-beta | (c) 2013-2014, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";function e(){try{"undefined"!=typeof AudioContext?n=new AudioContext:"undefined"!=typeof webkitAudioContext?n=new webkitAudioContext:o=!1}catch(e){o=!1}if(!o)if("undefined"!=typeof Audio)try{new Audio}catch(e){t=!0}else t=!0}var n=null,o=!0,t=!1;if(e(),o){var r="undefined"==typeof n.createGain?n.createGainNode():n.createGain();r.gain.value=1,r.connect(n.destination)}var d=function(){this.init()};d.prototype={init:function(){var e=this||u;return e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e.iOSAutoEnable=!0,e.noAudio=t,e.usingWebAudio=o,e.ctx=n,t||e._setupCodecs(),e},volume:function(e){var n=this||u;if(e=parseFloat(e),"undefined"!=typeof e&&e>=0&&1>=e){n._volume=e,o&&(r.gain.value=e);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.volume=i._volume*e)}return n}return n._volume},mute:function(e){var n=this||u;n._muted=e,o&&(r.gain.value=e?0:n._volume);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.muted=e?!0:i._muted)}return n},codecs:function(e){return(this||u)._codecs[e]},_setupCodecs:function(){var e=this||u,n=new Audio,o=n.canPlayType("audio/mpeg;").replace(/^no$/,"");return e._codecs={mp3:!(!o&&!n.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!o,opus:!!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!n.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!n.canPlayType("audio/aac;").replace(/^no$/,""),m4a:!!(n.canPlayType("audio/x-m4a;")||n.canPlayType("audio/m4a;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(n.canPlayType("audio/x-mp4;")||n.canPlayType("audio/mp4;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")},e},_enableiOSAudio:function(){var e=this||u;if(!n||!e._iOSEnabled&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){e._iOSEnabled=!1;var o=function(){var t=n.createBuffer(1,1,22050),r=n.createBufferSource();r.buffer=t,r.connect(n.destination),"undefined"==typeof r.start?r.noteOn(0):r.start(0),setTimeout(function(){(r.playbackState===r.PLAYING_STATE||r.playbackState===r.FINISHED_STATE)&&(e._iOSEnabled=!0,e.iOSAutoEnable=!1,window.removeEventListener("touchstart",o,!1))},0)};return window.addEventListener("touchstart",o,!1),e}}};var u=new d,a=function(e){var n=this;return e.src?void n.init(e):void console.error("An array of source files must be passed with any new Howl.")};a.prototype={init:function(e){var t=this;return t._autoplay=e.autoplay||!1,t._ext=e.ext||null,t._html5=e.html5||!1,t._muted=e.mute||!1,t._loop=e.loop||!1,t._pool=e.pool||5,t._preload="boolean"==typeof e.preload?e.preload:!0,t._rate=e.rate||1,t._sprite=e.sprite||{},t._src="string"!=typeof e.src?e.src:[e.src],t._volume=void 0!==e.volume?e.volume:1,t._duration=0,t._loaded=!1,t._sounds=[],t._endTimers={},t._onend=e.onend?[{fn:e.onend}]:[],t._onfaded=e.onfaded?[{fn:e.onfaded}]:[],t._onload=e.onload?[{fn:e.onload}]:[],t._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],t._onpause=e.onpause?[{fn:e.onpause}]:[],t._onplay=e.onplay?[{fn:e.onplay}]:[],t._webAudio=o&&!t._html5,"undefined"!=typeof n&&n&&u.iOSAutoEnable&&u._enableiOSAudio(),u._howls.push(t),t._preload&&t.load(),t},load:function(){var e=this,n=null;if(t)return void e._emit("loaderror");"string"==typeof e._src&&(e._src=[e._src]);for(var o=0;o<e._src.length;o++){var r,d;if(e._ext&&e._ext[o]?r=e._ext[o]:(d=e._src[o],r=/^data:audio\/([^;,]+);/i.exec(d),r||(r=/\.([^.]+)$/.exec(d.split("?",1)[0])),r&&(r=r[1].toLowerCase())),u.codecs(r)){n=e._src[o];break}}return n?(e._src=n,new i(e),e._webAudio&&s(e),e):void e._emit("loaderror")},play:function(e){var o=this,t=null;if("number"==typeof e)t=e,e=null;else if("undefined"==typeof e){e="__default";for(var r=0,d=0;d<o._sounds.length;d++)o._sounds[d]._paused&&!o._sounds[d]._ended&&(r++,t=o._sounds[d]._id);1===r?e=null:t=null}var a=t?o._soundById(t):o._inactiveSound();if(t&&!e&&(e=a._sprite||"__default"),!a)return null;if(!o._loaded&&!o._sprite[e])return o.once("load",function(){o.play(o._soundById(a._id)?a._id:void 0)}),a._id;if(t&&!a._paused)return a._id;var i=a._seek>0?a._seek:o._sprite[e][0]/1e3,_=(o._sprite[e][0]+o._sprite[e][1])/1e3-i,s=!(!a._loop&&!o._sprite[e][2]),l=function(){o._emit("end",a._id),!o._webAudio&&s&&o.stop(a._id).play(a._id),o._webAudio&&s&&(o._emit("play",a._id),a._seek=a._start||0,a._playStart=n.currentTime,o._endTimers[a._id]=setTimeout(l,1e3*(a._stop-a._start)/Math.abs(o._rate))),o._webAudio&&!s&&(a._paused=!0,a._ended=!0,a._seek=a._start||0,o._clearTimer(a._id),a._node.bufferSource=null),o._webAudio||s||o.stop(a._id)};o._endTimers[a._id]=setTimeout(l,1e3*_/Math.abs(o._rate)),a._paused=!1,a._ended=!1,a._sprite=e,a._seek=i,a._start=o._sprite[e][0]/1e3,a._stop=(o._sprite[e][0]+o._sprite[e][1])/1e3,a._loop=s;var f=a._node;if(o._webAudio){var c=function(){o._refreshBuffer(a);var e=a._muted||o._muted?0:a._volume*u.volume();f.gain.setValueAtTime(e,n.currentTime),a._playStart=n.currentTime,"undefined"==typeof f.bufferSource.start?f.bufferSource.noteGrainOn(0,i,_):f.bufferSource.start(0,i,_),o._endTimers[a._id]||(o._endTimers[a._id]=setTimeout(l,1e3*_/Math.abs(o._rate))),setTimeout(function(){o._emit("play",a._id)},0)};o._loaded?c():(o.once("load",c),o._clearTimer(a._id))}else{var p=function(){f.currentTime=i,f.muted=a._muted||o._muted||u._muted||f.muted,f.volume=a._volume*u.volume(),f.playbackRate=o._rate,setTimeout(function(){f.play(),o._emit("play",a._id)},0)};if(4===f.readyState||!f.readyState&&navigator.isCocoonJS)p();else{var m=function(){o._endTimers[a._id]=setTimeout(l,1e3*_/Math.abs(o._rate)),p(),f.removeEventListener("canplaythrough",m,!1)};f.addEventListener("canplaythrough",m,!1),o._clearTimer(a._id)}}return a._id},pause:function(e){var n=this;if(!n._loaded)return n.once("play",function(){n.pause(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused){if(r._seek=n.seek(o[t]),r._paused=!0,n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else isNaN(r._node.duration)||r._node.pause();arguments[1]||n._emit("pause",r._id)}}return n},stop:function(e){var n=this;if(!n._loaded)return"undefined"!=typeof n._sounds[0]._sprite&&n.once("play",function(){n.stop(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused)if(r._seek=r._start||0,r._paused=!0,r._ended=!0,n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else isNaN(r._node.duration)||(r._node.pause(),r._node.currentTime=r._start||0)}return n},mute:function(e,o){var t=this;if(!t._loaded)return t.once("play",function(){t.mute(e,o)}),t;if("undefined"==typeof o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),d=0;d<r.length;d++){var a=t._soundById(r[d]);a&&(a._muted=e,t._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume*u.volume(),n.currentTime):a._node&&(a._node.muted=u._muted?!0:e))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length){var d=t._getSoundIds(),a=d.indexOf(r[0]);a>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if(!("undefined"!=typeof e&&e>=0&&1>=e))return i=o?t._soundById(o):t._sounds[0],i?i._volume:0;if(!t._loaded)return t.once("play",function(){t.volume.apply(t,r)}),t;"undefined"==typeof o&&(t._volume=e),o=t._getSoundIds(o);for(var _=0;_<o.length;_++)i=t._soundById(o[_]),i&&(i._volume=e,t._webAudio&&i._node?i._node.gain.setValueAtTime(e*u.volume(),n.currentTime):i._node&&(i._node.volume=e*u.volume()));return t},fade:function(e,o,t,r){var d=this;if(!d._loaded)return d.once("play",function(){d.fade(e,o,t,r)}),d;d.volume(e,r);for(var u=d._getSoundIds(r),a=0;a<u.length;a++){var i=d._soundById(u[a]);if(i)if(d._webAudio){var _=n.currentTime,s=_+t/1e3;i._volume=e,i._node.gain.setValueAtTime(e,_),i._node.gain.linearRampToValueAtTime(o,s),setTimeout(function(e,t){setTimeout(function(){t._volume=o,d._emit("faded",e)},s-n.currentTime>0?Math.ceil(1e3*(s-n.currentTime)):0)}.bind(d,u[a],i),t)}else{var l=Math.abs(e-o),f=e>o?"out":"in",c=l/.01,p=t/c;!function(){var n=e,t=setInterval(function(e){n+="in"===f?.01:-.01,n=Math.max(0,n),n=Math.min(1,n),n=Math.round(100*n)/100,d.volume(n,e),n===o&&(clearInterval(t),d._emit("faded",e))}.bind(d,u[a]),p)}()}}return d},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return o=t._soundById(parseInt(r[0],10)),o?o._loop:!1;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var d=t._getSoundIds(n),u=0;u<d.length;u++)o=t._soundById(d[u]),o&&(o._loop=e);return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var d=t._getSoundIds(),u=d.indexOf(r[0]);u>=0?o=parseInt(r[0],10):(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if("undefined"==typeof o)return t;if(!t._loaded)return t.once("load",function(){t.seek.apply(t,r)}),t;var a=t._soundById(o);if(a){if(!(e>=0))return t._webAudio?a._seek+(n.currentTime-a._playStart):a._node.currentTime;var i=t.playing(o);i&&t.pause(o,!0),a._seek=e,t._clearTimer(o),i&&t.play(o)}return t},playing:function(e){var n=this,o=n._soundById(e)||n._sounds[0];return o?!o._paused:!1},duration:function(){return this._duration},unload:function(){for(var e=this,n=e._sounds,o=0;o<n.length;o++){n[o]._paused||(e.stop(n[o]._id),e._emit("end",n[o]._id)),e._webAudio||(n[o]._node.src="",n[o]._node.removeEventListener("error",n[o]._errorFn,!1),n[o]._node.removeEventListener("canplaythrough",n[o]._loadFn,!1)),delete n[o]._node,e._clearTimer(n[o]._id);var t=u._howls.indexOf(e);t>=0&&u._howls.splice(t,1)}return _&&delete _[e._src],e=null,null},on:function(e,n,o){var t=this,r=t["_on"+e];return"function"==typeof n&&r.push({id:o,fn:n}),t},off:function(e,n,o){var t=this,r=t["_on"+e];if(n){for(var d=0;d<r.length;d++)if(n===r[d].fn&&o===r[d].id){r.splice(d,1);break}}else r=[];return t},once:function(e,n,o){var t=this,r=function(){n.apply(t,arguments),t.off(e,r,o)};return t.on(e,r,o),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],d=0;d<r.length;d++)r[d].id&&r[d].id!==n||setTimeout(function(e){e.call(this,n,o)}.bind(t,r[d].fn),0);return t},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new i(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(n>=o)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if("undefined"==typeof e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.createBufferSource(),e._node.bufferSource.buffer=_[o._src],e._node.bufferSource.connect(e._panner?e._panner:e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=o._rate,o}};var i=function(e){this._parent=e,this.init()};if(i.prototype={init:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._id=Math.round(Date.now()*Math.random()),n._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=u._muted||e._muted||e._parent._muted?0:e._volume*u.volume();return o._webAudio?(e._node="undefined"==typeof n.createGain?n.createGainNode():n.createGain(),e._node.gain.setValueAtTime(t,n.currentTime),e._node.paused=!0,e._node.connect(r)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener("canplaythrough",e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t,e._node.load()),e},reset:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._sprite=null,e._id=Math.round(Date.now()*Math.random()),e},_errorListener:function(){var e=this;e._node.error&&4===e._node.error.code&&(u.noAudio=!0),e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorListener,!1)},_loadListener:function(){var e=this,n=e._parent;n._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(n._sprite).length&&(n._sprite={__default:[0,1e3*n._duration]}),n._loaded||(n._loaded=!0,n._emit("load")),n._autoplay&&n.play(),e._node.removeEventListener("canplaythrough",e._loadListener,!1)}},o)var _={},s=function(e){var n=e._src;if(_[n])return e._duration=_[n].duration,void c(e);if(/^data:[^;]+;base64,/.test(n)){window.atob=window.atob||function(e){for(var n,o,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=String(e).replace(/=+$/,""),d=0,u=0,a="";o=r.charAt(u++);~o&&(n=d%4?64*n+o:o,d++%4)?a+=String.fromCharCode(255&n>>(-2*d&6)):0)o=t.indexOf(o);return a};for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),r=0;r<o.length;++r)t[r]=o.charCodeAt(r);f(t.buffer,e)}else{var d=new XMLHttpRequest;d.open("GET",n,!0),d.responseType="arraybuffer",d.onload=function(){f(d.response,e)},d.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete _[n],e.load())},l(d)}},l=function(e){try{e.send()}catch(n){e.onerror()}},f=function(e,o){n.decodeAudioData(e,function(e){e&&(_[o._src]=e,c(o,e))},function(){o._emit("loaderror")})},c=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e._emit("load")),e._autoplay&&e.play()};"function"==typeof define&&define.amd&&define("howler",function(){return{Howler:u,Howl:a}}),"undefined"!=typeof exports&&(exports.Howler=u,exports.Howl=a),"undefined"!=typeof window&&(window.HowlerGlobal=d,window.Howler=u,window.Howl=a,window.Sound=i)}();
}, {}],
3: [function(require, module, exports) {
;(function(exports) {

	/**
	 * Find first child element that matches `selector`
	 *
	 * @param	{String}			selector
	 * @return	{HTMLElement}
	 */
	DocumentFragment.prototype.find =
	HTMLDocument.prototype.find =
	HTMLElement.prototype.find = function(selector) {
		return this.querySelector(selector);
	}

	/**
	 * Find all children elements matching `selector`
	 *
	 * @param	{String}			selector
	 * @return	{NodeList}
	 */
	DocumentFragment.prototype.findAll =
	HTMLDocument.prototype.findAll =
	HTMLElement.prototype.findAll = function(selector) {
		return this.querySelectorAll(selector);
	}

	/**
	 * Search parent elements to find one that matches `selector`
	 *
	 * @param	{String}			selector
	 * @return	{HTMLElement|Boolean}
	 */
	DocumentFragment.prototype.findParent =
	HTMLElement.prototype.findParent =
	HTMLDocument.prototype.findParent = function(selector) {

		var el = this.parentNode;
		while (el) {
			if (el.matches && el.matches(selector)) return el;
			el = el.parentNode;
		}

		return false;

	}

	NodeList.prototype.forEach = Array.prototype.slice.call(this).forEach;
	NodeList.prototype.first = function() { return this[0]; }
	NodeList.prototype.last = function() { return this[this.length - 1]; }

	/**
	 * Removes this element or all the nodes in the nodelist
	 *
	 * @return	{HTMLElement|NodeList}
	 */
	var remove = function() {

		var self = this;

		// defer to browser standard if it exists
		if (this.parentNode)
			this.parentNode.removeChild(this);
		else
			[].forEach.call(this, function(el) {
				el.remove();
			});

		return self;
	}

	// get the prefixed .matches
	HTMLElement.prototype.matches =
		(HTMLElement.prototype.matches ||
		HTMLElement.prototype.webkitMatchesSelector ||
		HTMLElement.prototype.mozMatchesSelector ||
		HTMLElement.prototype.msMatchesSelector ||
		HTMLElement.prototype.oMatchesSelector);

	// if their browser already supports it, don't polyfill	
	if (!HTMLElement.prototype.remove) HTMLElement.prototype.remove = remove;
	NodeList.prototype.remove = remove;


	/**
	 * Add an event listener
	 *
	 * @param	{String}		type
	 * @param	{Function}	fn
	 * @param	{Boolean}	useCapture (optional)
	 * @return	{HTMLElement|NodeList}
	 */
	Window.prototype.bind = 
	HTMLDocument.prototype.bind =
	HTMLElement.prototype.bind =
	NodeList.prototype.bind = function(type, fn, useCapture) {

		useCapture = useCapture || false;

		// split into whitespace delimited events
		var events = type.match(/\S+/g);

		var self = this;

		if (self.addEventListener) {
			events.forEach(function(evt) {
				self.addEventListener(evt, fn, useCapture);
			});
		} else {
			[].forEach.call(self, function(el) {
				events.forEach(function(evt) {
					el.addEventListener(evt, fn, useCapture);
				});
			});
		}

		return this;

	}

	/**
	 * Remove an event listener
	 *
	 * @param	{String}		type
	 * @param	{Function}	fn
	 * @param	{Boolean}	useCapture (optional)
	 * @return	{HTMLElement|NodeList}
	 */
	HTMLElement.prototype.unbind =
	NodeList.prototype.unbind = function(type, fn, useCapture) {

		useCapture = useCapture || false;

		// split into whitespace delimited events
		var events = type.match(/\S+/g);
		var self = this;

		if (self.removeEventListener) {
			events.forEach(function(evt) {
				self.removeEventListener(evt, fn, useCapture);
			});
		} else {
			[].forEach.call(self, function(el) {
				events.forEach(function(evt) {
					el.removeEventListener(evt, fn, useCapture);
				});
			});
		}

		return this;

	}

	/**
	 * Bind an event listener that will only be called once.
	 *
	 * @param	{String}		type
	 * @param	{Function}	fn
	 * @param	{Boolean}	useCapture (optional)
	 * @return	{HTMLElement|NodeList}
	 */
	HTMLElement.prototype.once =
	NodeList.prototype.once = function(type, fn, useCapture) {

		useCapture = useCapture || false;
		var self = this;

		self.bind(type, function() {
			fn.apply(this, arguments);
			self.unbind(type, arguments.callee, useCapture);
		}, useCapture);

		return self;

	}

	Window.prototype.delegate = 
	HTMLDocument.prototype.delegate =
	HTMLElement.prototype.delegate = function(event, selector, fn, useCapture) {

		useCapture = useCapture || false;

		this.bind(event, function(e) {

			var el = e.target || e.srcElement;

			while(el && el.matches && !el.matches(selector)) el = el.parentNode;
			if (!el || (el.matches && !el.matches(selector)) || el === document) return;

			fn.call(el, e);

		}, useCapture);

		return this;

	}

	NodeList.prototype.toArray =
	HTMLCollection.prototype.toArray = function() {
		return Array.prototype.slice.call(this);
	}

	// Helper functions


})(window);
}, {}]}, {}, {"1":""})