const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			if (args.device) {
				let id = args.device.getData().id;
				new Stopwatch(id, args.device.getName(), args.device);
			} else {
				let id = Stopwatch.generateId(args.name);
				new Stopwatch(id, args.name, null);
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = StopwatchStart;