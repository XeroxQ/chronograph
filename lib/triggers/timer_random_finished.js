const Homey = require('homey');
const Timer = require('../timer.js');

class TimerRandomFinished extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		var self = this;

		self.register();
		self.registerRunListener((args, state) => {
			var id = Timer.generateId(args.name);
			return Promise.resolve(id == state.timerId);
		});
	}
}

module.exports = TimerRandomFinished;