const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let id;
			if (args.device) {
				id = args.device.getData().id;
			} else {
				id = Stopwatch.generateId(args.name);
			}

			var stopwatch = Stopwatch.stopwatches[id];
			Promise.resolve(!!stopwatch);
		});
	}
}

module.exports = StopwatchRunning;