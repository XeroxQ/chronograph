'use strict';

const Homey = require('homey');
const { ChronographType } = require('../../lib/utils.js');
const Driver = require('../../lib/driver.js');

class StopwatchDriver extends Driver {
	getStartCards() {
		return Homey.ManagerSettings.get('stopwatch_start_cards') || [];
	}

	getResumeCards() {
		return Homey.ManagerSettings.get('stopwatch_resume_cards') || [];
	}

	getChronographType() {
		return ChronographType.STOPWATCH;
	}
}

module.exports = StopwatchDriver;
