const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchRunning extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let id;
			if (args.device) {
				id = args.device.getData().id;
			} else {
				id = Stopwatch.generateId(args.name);
			}

			var stopwatch = Stopwatch.get(id);
			return Promise.resolve(!!stopwatch);
		});
	}
}

module.exports = StopwatchRunning;