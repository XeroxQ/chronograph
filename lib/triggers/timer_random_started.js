const Homey = require('homey');
const Timer = require('../timer.js');

class TimerRandomStarted extends Homey.FlowCardTrigger {
	constructor(triggerId) {
		super(triggerId);

		this.register();
		this.registerRunListener((args, state) => {
			var id = Timer.generateId(args.name);
			return Promise.resolve(id == state.timerId);
		});
	}
}

module.exports = TimerRandomStarted;