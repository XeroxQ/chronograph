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

			if (args.device) {
				let id = args.device.getData().id;
				new Timer(id, args.device.getName(), duration * 1e3, args.device);
			} else {
				let id = Timer.generateId(args.name);
				new Timer(id, args.name, duration * 1e3, null);
			}

			return Promise.resolve(true);
		});
	}
}

module.exports = TimerStart;
