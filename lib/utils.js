'use strict';

const EventEmitter = require('events');

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

module.exports = { Utils, ExtendedEventEmitter };
