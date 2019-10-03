const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');
const { Utils } = require('../../utils.js');

class StopwatchCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let stopwatch = Stopwatch.get(args.name);
			if (!!stopwatch) {
				return Promise.resolve(stopwatch.getDuration() > Utils.calculateDuration(time, args.unit));
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": args.name })));
		});
	}
}

module.exports = StopwatchCompare;
