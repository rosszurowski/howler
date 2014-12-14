/**
 * Random number within range
 * @param {Number} min
 * @param {Number} max
 * @param {Number} precision
 * @returns {Number}
 */

module.exports = function(min, max, precision) {
	return (Math.random() * (max - min) + min).toFixed(precision || 2);
}