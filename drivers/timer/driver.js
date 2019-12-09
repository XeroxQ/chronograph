'use strict';

const Homey = require('homey');
const { ChronographType } = require('../../lib/utils.js');
const Driver = require('../../lib/driver.js');

class TimerDriver extends Driver {
	getStartCards() {
		return Homey.ManagerSettings.get('timer_start_cards') || [];
	}

	getResumeCards() {
		return Homey.ManagerSettings.get('timer_resume_cards') || [];
	}

	getChronographType() {
		return ChronographType.TIMER;
	}
}

module.exports = TimerDriver;
