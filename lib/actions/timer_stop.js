const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStop extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		var self = this;

		self.register();
		self.registerRunListener((args) => {
			let id;
			if (args.device) {
				id = args.device.getData().id;
			} else {
				id = Timer.GenerateId(args.name);
			}
			var timer = Timer.timers[id];
			if (!!timer) {
				timer.Stop();
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStop;