const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let id = Stopwatch.generateId(args.name);
			let name = args.name;
			let stopwatch = Stopwatch.get(id);
			if (!!stopwatch) {
				stopwatch.stop(false);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchStop;
