const Homey = require('homey');
const Timer = require('../timer.js');

class TimerStart extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (
				isNaN(time) ||
				time <= 0
			) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Timer.generateId(args.name);
			new Timer(id, args.name, time, args.unit);

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
