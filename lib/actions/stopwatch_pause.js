const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchPause extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let stopwatch = Stopwatch.get(args.name);
			if (!!stopwatch) {
				stopwatch.pause();
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": args.name })));
		});
	}
}

module.exports = StopwatchPause;
