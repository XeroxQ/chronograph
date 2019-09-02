const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Stopwatch.generateId(args.name);
			let name = args.name;
			let stopwatch = Stopwatch.get(id);
			if (!!stopwatch) {
				stopwatch.setDuration(time, args.unit, false);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchAdjust;
