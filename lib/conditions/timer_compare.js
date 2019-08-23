const Homey = require('homey');
const Timer = require('../timer.js');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let duration = parseInt(args.seconds);
			if (isNaN(duration)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id;
			if (args.device) {
				id = args.device.getData().id;
			} else {
				id = Timer.generateId(args.name);
			}

			var timer = Timer.timers[id];
			if (!!timer) {
				return Promise.resolve(timer.getDuration() > duration);
			}

			return Promise.resolve(false);
		});
	}
}

module.exports = TimerCompare;