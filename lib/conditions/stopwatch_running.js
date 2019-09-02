const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Stopwatch.generateId(args.name);
			let stopwatch = Stopwatch.get(id);
			return Promise.resolve(!!stopwatch);
		});
	}
}

module.exports = StopwatchRunning;
