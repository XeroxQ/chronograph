const Homey = require('homey');
const { Utils } = require('../utils.js');
const Timer = require('../timer.js');

class TimerCompare extends Homey.FlowCardCondition {
	constructor(conditionId) {
		super(conditionId);

		this.register();
		this.registerRunListener((args) => {
			let time = parseFloat(args.time);
			if (isNaN(time)) {
				return Promise.reject(new Error(Homey.__("invalid_duration")));
			}

			let timer = Timer.get(args.name);
			if (!!timer) {
				return Promise.resolve(timer.getDuration() > Utils.calculateDuration(time, args.unit));
			}

			return Promise.reject(new Error(Homey.__("timer_not_running", { "name": args.name })));
		});
	}
}

module.exports = TimerCompare;
