const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let duration = parseFloat(args.seconds);
			if (isNaN(duration)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Stopwatch.generateId(args.name);
			let name = args.name;
			let stopwatch = Stopwatch.get(id);
			if (!!stopwatch) {
				return Promise.resolve(stopwatch.getDuration() > (duration * 1e3));
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchCompare;
