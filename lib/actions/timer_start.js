const Homey = require('homey');
const Chronograph = require('../chronograph.js');
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
				args.device.setCapabilityValue('onoff.0', true);
				let timer = new Timer(id, args.device, duration, (timer) => {
					args.device.setCapabilityValue('onoff.0', false);
					delete Chronograph.timers[timer.id];
				});
				Chronograph.timers[id] = timer;
			} else {
				let id = Timer.GenerateId(args.name);
				let timer = new Timer(id, null, duration, (timer) => {
					delete Chronograph.timers[timer.id];
				});
				Chronograph.timers[id] = timer;
			}
		});
	}
}

module.exports = TimerStart;
