const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let duration = parseFloat(args.seconds);
			if (
				isNaN(duration) ||
				duration <= 0
			) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Timer.generateId(args.name);
			new Timer(id, args.name, duration * 1e3);

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
