'use strict';

const Homey = require('homey');
const { ChronographType } = require('../../lib/utils.js');
const Driver = require('../../lib/driver.js');

class TransitionDriver extends Driver {
	getStartCards() {
		return Homey.ManagerSettings.get('transition_start_cards') || [];
	}

	getResumeCards() {
		return Homey.ManagerSettings.get('transition_resume_cards') || [];
	}

	getChronographType() {
		return ChronographType.TRANSITION;
	}
}

module.exports = TransitionDriver;
