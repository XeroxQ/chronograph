'use strict';

const Homey = require('homey');
const { Utils, ChronographType } = require('../../lib/utils.js');

class TimerDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		let timerStartCards = Homey.ManagerSettings.get('timer_start_cards') || [];
		let timerResumeCards = Homey.ManagerSettings.get('timer_resume_cards') || [];
		let names =
			[].concat(timerStartCards, timerResumeCards)
			.map(timer => timer.name)
			.filter((name, index, self) => self.indexOf(name) === index)
			.sort();

		callback(null, names.map(name => ({
			name: Utils.beautifyName(name),
			data: {
				id: Utils.generateId(ChronographType.TIMER, name)
			}
		})));
	}
}

module.exports = TimerDriver;
