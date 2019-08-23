const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchCompare extends Homey.FlowCardCondition {
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
				id = Stopwatch.generateId(args.name);
			}

			var stopwatch = Stopwatch.stopwatches[id];
			if (!!stopwatch) {
				return Promise.resolve(stopwatch.getDuration() > duration);
			}

			return Promise.resolve(false);
		});
	}
}

module.exports = StopwatchCompare;