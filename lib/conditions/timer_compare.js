const Homey = require('homey');
const Timer = require('../timer.js');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let duration = parseFloat(args.seconds);
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

			var timer = Timer.get(id);
			if (!!timer) {
				return Promise.resolve(timer.getDuration() > (duration * 1e3));
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": name })));
		});
	}
}

module.exports = TimerCompare;