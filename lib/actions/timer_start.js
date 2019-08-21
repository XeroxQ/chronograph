const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let duration = parseInt(args.seconds);
			if (duration <= 0) {
				return Promise.reject('invalid duration');
			}

			if (args.device) {
				let id = args.device.getData().id;
				args.device.setCapabilityValue('running', true);
				new Timer(id, args.device, duration);
			} else {
				let id = Timer.GenerateId(args.name);
				new Timer(id, null, duration);
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
