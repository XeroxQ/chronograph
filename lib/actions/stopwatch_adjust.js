const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let duration = parseFloat(args.seconds);
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
			
			var stopwatch = Stopwatch.get(id);
			if (!!stopwatch) {
				stopwatch.setDuration(duration * 1e3, false);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("stopwatch_not_running", { "name": name })));
		});
	}
}

module.exports = StopwatchAdjust;