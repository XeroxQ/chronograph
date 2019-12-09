'use strict';

const Homey = require('homey');
const { ChronographType } = require('../../lib/utils.js');
const Device = require('../../lib/device.js');

class TimerDevice extends Device {
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

module.exports = TimerDevice;
