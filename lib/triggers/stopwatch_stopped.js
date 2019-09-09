const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStopped extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			var id = Stopwatch.generateId(args.name);
			return Promise.resolve(id == state.stopwatchId);
		});
	}
}

module.exports = StopwatchStopped;
