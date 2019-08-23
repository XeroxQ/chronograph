const Homey = require('homey');
const Timer = require('../timer.js');

class TimerAdjust extends Homey.FlowCardAction {
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
				id = Timer.generateId(args.name);
				name = args.name;
			}
			
			var timer = Timer.timers[id];
			if (
				!!timer &&
				timer.update(duration)
			) {
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerAdjust;