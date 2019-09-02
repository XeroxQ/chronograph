'use strict';

const Homey = require('homey');

class Chronograph {
	static setApplication(application) {
		Chronograph.application = application;
	}

	static initializeCards(cards) {
		Chronograph.cards = cards;
	}

	static log(message) {
		Chronograph.application.log(message);
	}

	static calculateDuration(time, unit) {
		let parsedTime = parseFloat(time);
		if (isNaN(parsedTime)) {
			throw "invalid time";
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
				throw "invalid unit";
		}
	}
}

Chronograph.application = undefined;
Chronograph.cards = {};

module.exports = Chronograph;