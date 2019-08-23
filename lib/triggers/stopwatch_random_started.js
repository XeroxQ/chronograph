const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchRandomStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		var self = this;

		self.register();
		self.registerRunListener((args, state) => {
			var id = Stopwatch.generateId(args.name);
			return Promise.resolve(id == state.stopwatchId);
		});
	}
}

module.exports = StopwatchRandomStarted;