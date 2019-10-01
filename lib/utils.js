'use strict';

const EventEmitter = require('events');
const { create, all } = require('./math.js');

const math = create(all);

class Utils {
	static generateId(prefix, name) {
		name = name.trim();
		let hash = 0, i, chr;
		if (name.length === 0) {
			throw new Error('invalid name');
		}
		for (i = 0; i < name.length; i++) {
			chr = name.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return prefix + Math.abs(hash).toString() + '_' + name.toLowerCase().replace(/[^a-z]/g, '');
	}

	static calculateDuration(time, unit) {
		let parsedTime = parseFloat(time);
		if (isNaN(parsedTime)) {
				throw new Error('invalid time');
		}

		switch(unit) {
			case 'seconds':
					return 1e3 * parsedTime;
			case 'minutes':
					return 1e3 * parsedTime * 60;
			case 'hours':
					return 1e3 * parsedTime * 60 * 60;
			case 'days':
					return 1e3 * parsedTime * 60 * 60 * 24;
			default:
			throw new Error('invalid unit');
		}
	}

	static evalTime(time) {
		try {
			// Make sure time is a string.
			time = "" + time;

			// If there are no alphanumeric characters in the time string, all comma's are
			// replaced with dots to support old cards.
			time = time.replace(/^\s*([0-9]+),([0-9]+)\s*$/, '$1.$2');

			// Remove redundant spaces. This also removes any non-standard whitespace characters
			// that are sometimes inserted when using tokens.
			time = time.replace(/\s{1,}/g, ' ');

			// We allow upper-, lower- or mixed case functions and spaces on either side of the
			// expression.
			time = time.toLowerCase().trim();

			// Only a subset of mathjs' functions are supported.
			if (!time.match(/^[0-9\*\/\+\-\%\^\,\.\(\)\s(abs|ceil|floor|round|random|min|max|pick)]+$/)) {
				return false;
			}

			// The random pick method of mathjs is simplified for our use case.
			time = time.replace(/pick\s*\((\s*([0-9]+\s*(\,?\s*)){1,}\s*)\)/g, 'pickRandom([$1])');

			return parseFloat(math.evaluate(time));
		} catch(error) {
			return false;
		}
	}
}

class ExtendedEventEmitter extends EventEmitter {
	mon(eventName, listener) {
		eventName.forEach((name) => {
			this.on(name, (... args) => {
				args.unshift(name);
				listener.apply(null, args);
			});
		});
	}
}

var LogLevel = {
	DEBUG: 1,
	INFO: 2,
	WARNING: 3,
	ERROR: 4
}

module.exports = { Utils, ExtendedEventEmitter, LogLevel };
