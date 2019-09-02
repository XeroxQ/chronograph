const Homey = require('homey');
const Timer = require('../timer.js');

class TimerAdjust extends Homey.FlowCardAction {
	constructor(actionId) {
		super(actionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let id = Timer.generateId(args.name);
			let name = args.name;
			let timer = Timer.get(id);
			if (!!timer) {
				timer.setDuration(time, args.unit, false);
				return Promise.resolve(true);
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerAdjust;
