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
}

Chronograph.application = undefined;
Chronograph.cards = {};
Chronograph.timers = {};
Chronograph.stopwatches = {};

module.exports = Chronograph;