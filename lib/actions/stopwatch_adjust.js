const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let duration = parseInt(args.seconds);
			if (isNaN(duration)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

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
				stopwatch.update(duration)
			) {
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchAdjust;