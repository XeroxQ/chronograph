const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let id, name;
			if (args.device) {
				id = args.device.getData().id;
				name = args.device.getName();
			} else {
				id = Stopwatch.generateId(args.name);
				name = args.name;
			}

			var stopwatch = Stopwatch.stopwatches[id];
			if (
				!!stopwatch &&
				stopwatch.stop()
			) {
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchStop;