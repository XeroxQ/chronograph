'use strict';

const Homey = require('homey');
const { Utils, ChronographType } = require('../../lib/utils.js');

class StopwatchDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		let stopwatchStartCards = Homey.ManagerSettings.get('stopwatch_start_cards') || [];
		let stopwatchResumeCards = Homey.ManagerSettings.get('stopwatch_resume_cards') || [];
		let names =
			[].concat(stopwatchStartCards, stopwatchResumeCards)
			.map(stopwatch => stopwatch.name)
			.filter((name, index, self) => self.indexOf(name) === index) // unique
			.sort();

		callback(null, names.map(name => ({
			name: Utils.beautifyName(name),
			data: {
				id: Utils.generateId(ChronographType.STOPWATCH, name)
			}
		})));
	}
}

module.exports = StopwatchDriver;
