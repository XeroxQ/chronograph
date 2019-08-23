const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let duration = parseInt(args.seconds);
			if (
				isNaN(duration) ||
				duration <= 0
			) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			if (args.device) {
				let id = args.device.getData().id;
				args.device.setCapabilityValue('running', true);
				new Timer(id, args.device.getName(), duration, args.device);
			} else {
				let id = Timer.generateId(args.name);
				new Timer(id, args.name, duration, null);
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
