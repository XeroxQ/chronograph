const Homey = require('homey');
const Stopwatch = require('../stopwatch.js');

class StopwatchStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			if (args.device) {
				let id = args.device.getData().id;
				args.device.setCapabilityValue('running', true);
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